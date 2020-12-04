/**
 * This library provides various functions for three-valued logic
 */
import assert from "assert";

/**
 * Types of bits that can occur in a signal
 */
export enum Bit {
	Unknown = 0,
	Error   = 1,
	Zero    = 2,
	One     = 3
}

/**
 * The number of possible bit types
 */
export const NUM_BIT_VALUES = Object.values(Bit).length / 2;

/**
 * Encode the given number into binary bits
 */
export function numberToBits(value: number) {
	let result: Bit[] = [];
	for (let bit of value.toString(2)) {
		result.push(parseInt(bit) + 2);
	}
	return result;
}

/**
 * Three-valued AND operation
 */
export function threeValuedAnd(bits: Bit[]) {
	assert(bits.length >= 2, "Attempted AND of 1 or fewer inputs");
	let result = Bit.One;
	for (let i = 0; i < bits.length; i++) {
		if (bits[i] == Bit.Zero) {
			return Bit.Zero;
		}
		result &= bits[i];
	}
	return result || Bit.Error;
}

/**
 * Three-valued OR operation
 */
export function threeValuedOr(bits: Bit[]): Bit {
	assert(bits.length >= 2, "Attempted OR of 1 or fewer inputs");
	let result = Bit.Zero;
	for (let i = 0; i < bits.length; i++) {
		if (bits[i] == Bit.One) {
			return Bit.One;
		}
		result &= bits[i];
	}
	return result || Bit.Error;
}

/**
 * Three-valued XOR operation
 */
export function threeValuedXor(bits: Bit[]) {
	assert(bits.length >= 2, "Attempted XOR of 1 or fewer inputs");
	let ones = 0;
	for (let i = 0; ones < 2 && i < bits.length; i++) {
		if (bits[i] < Bit.Zero) {
			return Bit.Error;
		}
		if (bits[i] == Bit.One) {
			ones += 1;
		}
	}
	return (ones == 1) ? Bit.One : Bit.Zero;
}

/**
 * Three-valued NOT operation
 */
export function threeValuedNot(bit: Bit): Bit;
export function threeValuedNot(bits: Bit[]): Bit[];
export function threeValuedNot(bit: Bit|Bit[]) {
	if (Array.isArray(bit)) {
		let result: Bit[] = [];
		for (let b of bit) {
			result.push(threeValuedNot(b));
		}
		return result;
	} else {
		return (bit >= Bit.Zero) ? (Bit.Zero | (~bit & 1)) : Bit.Error;
	}
}

/**
 * Three-valued NAND operation
 */
export function threeValuedNand(bits: Bit[]) {
	assert(bits.length >= 2, "Attempted NAND of 1 or fewer inputs");
	return threeValuedNot(threeValuedAnd(bits));
}

/**
 * Three-valued NOR operation
 */
export function threeValuedNor(bits: Bit[]) {
	assert(bits.length >= 2, "Attempted NOR of 1 or fewer inputs");
	return threeValuedNot(threeValuedOr(bits));
}

/**
 * Three-valued XNOR operation
 */
export function threeValuedXnor(bits: Bit[]) {
	assert(bits.length >= 2, "Attempted XNOR of 1 or fewer inputs");
	return threeValuedNot(threeValuedXor(bits));
}

/**
 * Increment a three-valued bit array
 */
export function threeValuedIncrement(a: Bit[]) {
	let i: number;
	let carry = Bit.One;
	let result = a.concat();
	for (i = a.length - 1; carry == Bit.One && i >= 0; i--) {
		result[i] = threeValuedXor([a[i], carry]);
		carry = (a[i] >= Bit.Zero) ? a[i] : Bit.Error;
	}
	if (carry == Bit.Error) {
		result.fill(Bit.Error, 0, i + 1);
	}
	return result;
}

/**
 * Merge two signals together if possible. Conflicting bits result in errors
 */
export function threeValuedMerge(a: Bit[], b: Bit[]) {
	if (b.length < a.length) {
		let tmp = a;
		a = b;
		b = tmp;
	}
	let result = a.concat();
	if (result.length == 0) {
		result = b;
	} else {
		assert(a.length == b.length, "Signals must have the same bit width!");
		for (let i = 0; i < result.length; i++) {
			if (result[i] == Bit.Unknown || b[i] == Bit.Unknown) {
				result[i] |= b[i];
			} else if (result[i] != b[i]) {
				result[i] = Bit.Error;
			}
		}
	}
	return result;
}

/**
 * Transpose a 2D array
 */
export function transpose<T>(a: T[][]) {
	if (a.length == 0) {
		return [];
	}
	let result: T[][] = [];
	for (let i = 0; i < a[0].length; i++) {
		result.push([]);
	}
	for (let i = 0; i < a.length; i++) {
		for (let j = 0; j < a[i].length; j++) {
			result[j][i] = a[i][j];
		}
	}
	return result;
}

/**
 * Generate all combinations of 0's and 1's
 */
export class BitCombinations
{
	/**
	 * The allowed bits to use in the combination set
	 */
	protected bitSet: boolean[]; // unknown, error, zero, one

	/**
	 * The current bit combination
	 */
	protected bits?: Bit[];

	public constructor(numBits: number, unknownBit: boolean = false, errorBit: boolean = false) {
		this.bitSet = new Array<boolean>(NUM_BIT_VALUES);
		this.bitSet[Bit.Unknown] = unknownBit;
		this.bitSet[Bit.Error] = errorBit;
		this.bitSet[Bit.Zero] = true;
		this.bitSet[Bit.One] = true;
		let fillBit = <Bit>this.bitSet.indexOf(true);
		this.bits = new Array<Bit>(numBits).fill(fillBit);
	}

	/**
	 * Increment the current combination
	 */
	protected increment() {
		assert(this.bits != undefined, "Attempted to additional increment after all combinations");
		let carry: boolean;
		let i = this.bits.length - 1;

		do {
			let bit = this.bits[i];
			do {
				this.bits[i] = (this.bits[i] + 1) % NUM_BIT_VALUES;
			} while (this.bitSet[this.bits[i]] == false && this.bits[i] != bit);
			carry = this.bits[i] <= bit;
		} while(--i >= 0 && carry);

		// Overflow
		if (carry) {
			this.bits = undefined;
		}
	}

	/**
	 * Get the next bit combination
	 */
	public next() {
		if (this.bits === undefined) {
			return undefined;
		}
		let result = this.bits.concat();
		this.increment();
		return result;
	}
}

/**
 * Evaluate a function with all possible binary-bit combinations
 */
export async function binaryBitCombinations(numBits: number,
											evaluate: (comb: Bit[]) => Promise<void>)
{
	let generator = new BitCombinations(numBits);
	for (let comb = generator.next(); comb; comb = generator.next()) {
		await evaluate(comb);
	}
}

/**
 * Evaluate a function with all possible binary-bit combinations synchronously
 */
export function binaryBitCombinationsSync(numBits: number, evaluate: (comb: Bit[]) => void) {
	let generator = new BitCombinations(numBits);
	for (let comb = generator.next(); comb; comb = generator.next()) {
		evaluate(comb);
	}
}

/**
 * Evaluate a function with all possible three-value bit combinations
 */
export async function threeBitCombinations(numBits: number,
										   evaluate: (comb: Bit[]) => Promise<void>)
{
	let generator = new BitCombinations(numBits, true, false);
	for (let comb = generator.next(); comb; comb = generator.next()) {
		await evaluate(comb);
	}
}

/**
 * Evaluate a function with all possible signal bit combinations
 */
export async function signalCombinations(numBits: number, evaluate: (comb: Bit[]) => Promise<void>)
{
	let generator = new BitCombinations(numBits, true, true);
	for (let comb = generator.next(); comb; comb = generator.next()) {
		await evaluate(comb);
	}
}
