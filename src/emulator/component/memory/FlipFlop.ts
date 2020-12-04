import { IComponent } from "../../../schematic";
import { Point } from "../../../util/coordinates";
import { Bit, threeValuedNot } from "../../../util/logic";
import { Port } from "../../core";
import { MemoryComponent, MemoryTriggerType } from "./MemoryComponent";

export abstract class FlipFlop extends MemoryComponent
{
	/**
	 * The port for output when the bit is 1
	 */
	protected readonly outputHighPort: Port;

	/**
	 * The port for output when the bit is 0
	 */
	protected readonly outputLowPort: Port;

	/**
	 * The port to asynchronously set the flip-flop to 1
	 */
	protected readonly presetPort: Port;

	/**
	 * The port to asynchronously set the flip-flop to 0
	 */
	protected readonly clearPort: Port;

	/**
	 * Create a new register
	 */
	public constructor(schematic: IComponent, triggerType: MemoryTriggerType, clockPos: Point)
	{
		super(schematic, 1, triggerType, clockPos, new Point(-20, 30));

		this.outputHighPort = this.addPort(0, 0, 1, true);
		this.outputLowPort = this.addPort(0, 20, 1, true);
		this.presetPort = this.addPort(-30, 30, 1, true);
		this.clearPort = this.addPort(-10, 30, 1, true);

		this.outputMemoryContents();
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Load the input into the contents of memory
	 */
	protected abstract updateMemoryContents(): boolean;

	// ---------------------------------------------------------------------------------------------

	/**
	 * Asynchronously set the memory contents
	 */
	protected asyncSet() {
		if (this.clearPort.probe()[0] == Bit.One) {
			this.contents.fill(Bit.Zero);
			return true;
		}
		if (this.presetPort.probe()[0] == Bit.One) {
			this.contents.fill(Bit.One);
			return true;
		}
		return false;
	}

	/**
	 * Output the contents of memory to the appropriate ports
	 */
	protected outputMemoryContents() {
		this.outputHighPort.emitSignal(this.contents);
		this.outputLowPort.emitSignal(threeValuedNot(this.contents));
	}
}
