import assert from "assert";
import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Point } from "../../../util/coordinates";
import { Bit } from "../../../util/logic";
import { Port } from "../../core/Port";
import { BuiltinLibrary } from "../../enums";
import Component from "../Component";

/**
 * The types of memory triggers
 */
export enum MemoryTrigger {
	LowLevel,
	HighLevel,
	FallingEdge,
	RisingEdge
}

export abstract class MemoryComponent extends Component
{
	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB = BuiltinLibrary.Memory;

	/**
	 * The trigger event for updating the memory contents
	 */
	protected trigger: MemoryTrigger = MemoryTrigger.RisingEdge;

	/**
	 * The port for the clock
	 */
	protected clockPort: Port;

	/**
	 * Store the previous clock bit to control updating for rising/falling edge cases
	 */
	protected prevClockBit: Bit = Bit.Zero;

	/**
	 * The contents of memory
	 */
	protected contents: Bit[] = [];

	/**
	 * Create a new memory component
	 */
	public constructor(schematic: IComponent, bitWidth: number, clockPos: Point) {
		super(schematic);
		this.setTrigger(getAttribute("trigger", schematic, "rising"));
		this.clockPort = this.addPort(clockPos.x, clockPos.y, 1);
		this.contents = new Array(bitWidth).fill(Bit.Zero);
	}

	/**
	 * Set the trigger event type for memory updating
	 */
	protected setTrigger(trigger: MemoryTrigger | string) {
		if (typeof(trigger) == "string") {
			switch(trigger) {
				case "falling":
					this.trigger = MemoryTrigger.FallingEdge;
					break;
				case "high":
					this.trigger = MemoryTrigger.HighLevel;
					break;
				case "low":
					this.trigger = MemoryTrigger.LowLevel;
					break;
				default:
					this.trigger = MemoryTrigger.RisingEdge;
			}
		} else {
			this.trigger = trigger;
		}
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Update the memory contents
	 */
	protected abstract updateMemoryContents(): boolean;

	/**
	 * Output the contents of memory to the appropriate ports
	 */
	protected abstract output(): void;

	// ---------------------------------------------------------------------------------------------

	/**
	 * Update memory if the clock is on the correct level
	 */
	protected tryUpdateMemory(clock: Bit) {
		// Check if the memory component should update for the given clock signal
		if (clock == Bit.One && (this.trigger & MemoryTrigger.HighLevel)) {
			if (this.updateMemoryContents()) {
				this.output();
			}
		} else if (clock == Bit.Zero && (~this.trigger & MemoryTrigger.LowLevel)) {
			if (this.updateMemoryContents()) {
				this.output();
			}
		}
	}

	/**
	 * Invoked when the component is updated
	 */
	protected onUpdate() {
		let clockBit = this.clockPort.probe()[0];
		if (clockBit >= Bit.Zero) {
			if ((this.trigger & MemoryTrigger.RisingEdge) >= MemoryTrigger.FallingEdge) {
				if (clockBit != this.prevClockBit && this.prevClockBit >= Bit.Zero) {
					this.tryUpdateMemory(clockBit);
				}
			} else {
				this.tryUpdateMemory(clockBit);
			}
		}
		this.prevClockBit = clockBit;
	}
}
