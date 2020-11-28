import { IComponent } from "../../../schematic";
import { Point } from "../../../util/coordinates";
import { Bit } from "../../../util/logic";
import { Port } from "../../core";
import { FlipFlop } from "./FlipFlop";
import { MemoryTrigger } from "./MemoryComponent";

export class DFlipFlop extends FlipFlop
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "D Flip-Flop";

	/**
	 * The port for data input
	 */
	protected readonly inputPort: Port;

	/**
	 * Create a new register
	 */
	public constructor(schematic: IComponent) {
		super(schematic, new Point(-40, 0));
		let muteInput = this.trigger >= MemoryTrigger.FallingEdge;
		this.inputPort = this.addPort(-40, 20, this.bitWidth, muteInput);
	}

	/**
	 * Load the input into the contents of memory
	 */
	protected load() {
		let bit = this.inputPort.probe()[0];
		if (bit < Bit.Zero) {
			return;
		}
		this.contents[0] = bit;
	}

	/**
	 * Get the bit-width of the register
	 */
	public get bitWidth() {
		return this.contents.length;
	}
}
