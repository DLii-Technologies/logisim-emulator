import { assert } from "console";
import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Point } from "../../../util/coordinates";
import { Bit } from "../../../util/logic";
import { Port } from "../../core";
import { MemoryComponent, MemoryTriggerType } from "./MemoryComponent";

export class Register extends MemoryComponent
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "Register";

	/**
	 * The supported trigger event types for this register
	 */
	// protected readonly supportedTriggers = MemoryTriggerType.Edge | MemoryTriggerType.Level;

	/**
	 * The port for data input
	 */
	protected readonly inputPort: Port;

	/**
	 * The port for data output
	 */
	protected readonly outputPort: Port;

	/**
	 * The port for clearing the register
	 */
	protected readonly clearPort: Port;

	/**
	 * Create a new register
	 */
	public constructor(schematic: IComponent) {
		let bitWidth = parseInt(getAttribute("width", schematic, "8"));
		super(schematic,  bitWidth, MemoryTriggerType.Edge | MemoryTriggerType.Level,
			  new Point(-20, 20), new Point(-30, 10));

		let muteInput = this.trigger == MemoryTriggerType.Edge;
		this.inputPort = this.addPort(-30, 0, this.bitWidth, muteInput);
		this.outputPort = this.addPort(0, 0, this.bitWidth, true);
		this.clearPort = this.addPort(-10, 20, 1);

		this.outputMemoryContents();
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Asynchronously set the contents of the register
	 */
	protected asyncSet() {
		if (this.clearPort.probe()[0] == Bit.One) {
			this.contents.fill(Bit.Zero);
			return true;
		}
		return false;
	}

	/**
	 * Update the contents of the register
	 */
	protected updateMemoryContents() {
		let data = this.inputPort.probe();
		assert(data.length == this.bitWidth, "Invalid bit-width provided to memory update");
		if (data.includes(Bit.Unknown) || data.includes(Bit.Error)) {
			return false;
		}
		this.contents = data;
		return true;
	}

	/**
	 * Output the contents of memory
	 */
	protected outputMemoryContents() {
		this.outputPort.emitSignal(this.contents);
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the bit-width of the register
	 */
	public get bitWidth() {
		return this.contents.length;
	}
}
