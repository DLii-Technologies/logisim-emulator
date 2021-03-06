import { IComponent } from "../../../schematic";
import { Point } from "../../../util/coordinates";
import { Bit, threeValuedNot } from "../../../util/logic";
import { Port } from "../../core";
import { FlipFlop } from "./FlipFlop";
import { MemoryTriggerType } from "./MemoryComponent";

export class TFlipFlop extends FlipFlop
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "T Flip-Flop";

	/**
	 * The port for data input
	 */
	protected readonly inputPort: Port;

	/**
	 * Create a new register
	 */
	public constructor(schematic: IComponent) {
		super(schematic, MemoryTriggerType.Edge | MemoryTriggerType.Level, new Point(-40, 0));
		let muteInput = this.trigger == MemoryTriggerType.Edge;
		this.inputPort = this.addPort(-40, 20, 1, muteInput);
	}

	/**
	 * Load the input into the contents of memory
	 */
	protected updateMemoryContents() {
		let bit = this.inputPort.probe()[0];
		if (bit != Bit.One) {
			return false;
		}
		this.contents[0] = threeValuedNot(bit);
		return true;
	}
}
