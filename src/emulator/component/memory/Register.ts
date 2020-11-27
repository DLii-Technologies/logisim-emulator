import { assert } from "console";
import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Point } from "../../../util/coordinates";
import { Bit } from "../../../util/logic";
import { Port } from "../../core";
import { MemoryComponent, MemoryTrigger } from "./MemoryComponent";

export class Register extends MemoryComponent
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "Register";

	/**
	 * The port for data input
	 */
	protected readonly inputPort: Port;

	/**
	 * The port for data output
	 */
	protected readonly outputPort: Port;

	/**
	 * The port to enable loading into the register
	 */
	protected readonly loadPort: Port;

	/**
	 * The port for clearing the register
	 */
	protected readonly clearPort: Port;

	/**
	 * The contents of the register
	 */
	protected contents: Bit[];

	/**
	 * Create a new register
	 */
	public constructor(schematic: IComponent) {
		super(schematic, new Point(-20, 20));

		let bitWidth = parseInt(getAttribute("width", schematic, "8"));
		this.contents = new Array(bitWidth).fill(Bit.Zero);

		let muteInput = this.trigger >= MemoryTrigger.FallingEdge;
		this.inputPort = this.addPort(-30, 0, this.bitWidth, muteInput);
		this.outputPort = this.addPort(0, 0, this.bitWidth, true);
		this.loadPort = this.addPort(-30, 10, 1, true);
		this.clearPort = this.addPort(-10, 20, 1);

		this.outputPort.emitSignal(this.contents);
	}

	/**
	 * Update the contents of the register
	 */
	protected updateMemory() {
		if (this.clearPort.probe()[0] == Bit.One) {
			this.contents.fill(Bit.Zero);
			return;
		}
		if (this.loadPort.probe()[0] != Bit.One) {
			return;
		}
		let data = this.inputPort.probe();
		assert(data.length == this.bitWidth, "Invalid bit-width provided to memory update");
		if (data.includes(Bit.Unknown) || data.includes(Bit.Error)) {
			return;
		}
		this.contents = data;
		this.outputPort.emitSignal(this.contents);
	}

	/**
	 * Get the bit-width of the register
	 */
	public get bitWidth() {
		return this.contents.length;
	}
}
