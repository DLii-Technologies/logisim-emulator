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
 * Three-valued AND operation
 */
export function threeValuedAnd(...bits: Bit[]) {
	assert(bits.length >= 2, "Attempted AND of 1 or fewer inputs");
	let result = bits[0];
	for (let i = 1; result >= Bit.Zero && i < bits.length; i++) {
		result &= bits[i];
	}
	return result || Bit.Error;
}

/**
 * Three-valued OR operation
 */
export function threeValuedOr(...bits: Bit[]): Bit {
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
export function threeValuedXor(...bits: Bit[]) {
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
export function threeValuedNot(a: Bit): Bit {
	return (a & 2) ? (2 | (~a & 1)) : Bit.Error;
}

/**
 * Three-valued NAND operation
 */
export function threeValuedNand(...bits: Bit[]) {
	assert(bits.length >= 2, "Attempted NAND of 1 or fewer inputs");
	return threeValuedNot(threeValuedAnd(...bits));
}

/**
 * Three-valued NOR operation
 */
export function threeValuedNor(...bits: Bit[]) {
	assert(bits.length >= 2, "Attempted NOR of 1 or fewer inputs");
	return threeValuedNot(threeValuedOr(...bits));
}

/**
 * Three-valued XNOR operation
 */
export function threeValuedXnor(...bits: Bit[]) {
	assert(bits.length >= 2, "Attempted XNOR of 1 or fewer inputs");
	return threeValuedNot(threeValuedXor(...bits));
}
