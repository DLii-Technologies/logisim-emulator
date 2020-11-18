import assert from "assert";

/**
 * This represents a signal on the network
 */
export class Signal
{
	/**
	 * The bits in the signal
	 */
	private __bits: number[];

	/**
	 * Indicate if the signal contains conflicting emissions
	 */
	private __hasConflicts = false;

	/**
	 * Create a new signal container
	 */
	public constructor(bits?: number[]) {
		this.__bits = bits || [];
	}

	/**
	 * Clear the current signal
	 */
	public clear() {
		this.__bits = [];
	}

	/**
	 * Merge two signals together
	 */
	public merge(bits: number[]) {
		if (this.width == 0) {
			this.__bits = bits;
		} else {
			assert(this.width == bits.length, "Signals must have the same bit width!");
			for (let i = 0; i < this.width; i++) {
				if (this.bits[i] != bits[i]) {
					this.__hasConflicts ||= true;
					this.bits[i] = 2;
				}
			}
		}
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Indicate if the signal has conflicting values
	 */
	get hasConflictingSignals() {
		return this.__hasConflicts;
	}

	/**
	 * Get the signal width
	 */
	get width() {
		return this.__bits.length;
	}

	/**
	 * Get the bits of the signal
	 */
	get bits() {
		return this.__bits;
	}
}
