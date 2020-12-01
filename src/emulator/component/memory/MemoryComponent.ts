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
export enum MemoryTriggerType {
	Edge  = 0x1,
	Level = 0x2
}

/**
 * The types of clock signals for updates
 */
export enum ClockUpdateSignal {
	Low,
	High
}

export abstract class MemoryComponent extends Component
{
	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB = BuiltinLibrary.Memory;

	/**
	 * The trigger event types this memory component supports
	 */
	protected supportedTriggers: MemoryTriggerType = MemoryTriggerType.Edge;

	/**
	 * The trigger event type for updating memory contents
	 */
	protected trigger: MemoryTriggerType = MemoryTriggerType.Edge;

	/**
	 * Determine if the clock should be a low signal for memory updates
	 */
	protected clockUpdateSignal: ClockUpdateSignal = ClockUpdateSignal.High;

	/**
	 * The port for the clock
	 */
	protected clockPort: Port;

	/**
	 * The port for enabling loading of the memory component
	 */
	protected loadPort: Port;

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
	public constructor(schematic: IComponent, bitWidth: number, clockTriggers: MemoryTriggerType,
					   clockPos: Point, loadPos: Point)
	{
		super(schematic);
		this.supportedTriggers = clockTriggers;
		this.setTrigger(schematic);

		let muteLoadPort = this.trigger == MemoryTriggerType.Edge;
		this.clockPort = this.addPort(clockPos.x, clockPos.y, 1);
		this.loadPort = this.addPort(loadPos.x, loadPos.y, 1, muteLoadPort);
		this.contents = new Array(bitWidth).fill(Bit.Zero);
	}

	/**
	 * Set the trigger event type for memory updating
	 */
	protected setTrigger(schematic: IComponent) {
		let trigger = getAttribute("trigger", schematic, "rising");
		switch(trigger) {
			case "falling":
				this.trigger = MemoryTriggerType.Edge;
				this.clockUpdateSignal = ClockUpdateSignal.Low;
				break;
			case "high":
				this.trigger = MemoryTriggerType.Level;
				this.clockUpdateSignal = ClockUpdateSignal.High;
				break;
			case "low":
				this.trigger = MemoryTriggerType.Level;
				this.clockUpdateSignal = ClockUpdateSignal.Low;
				break;
			default:
				this.trigger = MemoryTriggerType.Edge;
				this.clockUpdateSignal = ClockUpdateSignal.High;
		}
		assert(this.trigger & this.supportedTriggers, "Unsupported trigger type provided");
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Asynchronously set the memory contents if necessary
	 */
	protected asyncSet(): boolean {
		return false;
	}

	/**
	 * Update the memory contents
	 */
	protected abstract updateMemoryContents(): boolean;

	/**
	 * Output the contents of memory
	 */
	protected abstract outputMemoryContents(): void;

	// ---------------------------------------------------------------------------------------------

	/**
	 * Determine if the clock signal is appropriate for memory updates
	 */
	protected isValidClockSignal() {
		let clockBit = this.clockPort.probe()[0];
		if (clockBit < Bit.Zero) { // clock is unknown or error bit
			return false;
		}
		if (this.trigger == MemoryTriggerType.Edge) {
			if (clockBit == this.prevClockBit || this.prevClockBit < Bit.Zero) {
				return false;
			}
		}
		if (clockBit != (this.clockUpdateSignal + Bit.Zero)) {
			return false;
		}
		return true;
	}

	/**
	 * Update the memory component
	 */
	protected onUpdate() {
		if (this.asyncSet()) {
			this.outputMemoryContents();
		} else if (this.loadPort.probe()[0] == Bit.One && this.isValidClockSignal()) {
			if (this.updateMemoryContents()) {
				this.outputMemoryContents();
			}
		}
		this.prevClockBit = this.clockPort.probe()[0];
	}
}
