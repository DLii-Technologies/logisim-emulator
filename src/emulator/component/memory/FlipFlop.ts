import { assert } from "console";
import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Point } from "../../../util/coordinates";
import { Bit, threeValuedNot } from "../../../util/logic";
import { Port } from "../../core";
import { MemoryComponent, MemoryTrigger } from "./MemoryComponent";

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
	 * The port to enable the register (enabled as long as it is not set to 0)
	 */
	protected readonly enablePort: Port;

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
	public constructor(schematic: IComponent, clockPos: Point) {
		super(schematic, 1, clockPos);

		this.outputHighPort = this.addPort(0, 0, 1, true);
		this.outputLowPort = this.addPort(0, 20, 1, true);
		this.presetPort = this.addPort(-30, 30, 1, true);
		this.enablePort = this.addPort(-20, 30, 1, true);
		this.clearPort = this.addPort(-10, 30, 1, true);

		this.output();
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Load the input into the contents of memory
	 */
	protected abstract load(): void;

	/**
	 * Output the contents of memory to the appropriate ports
	 */
	protected output() {
		this.outputHighPort.emitSignal(this.contents);
		this.outputLowPort.emitSignal(threeValuedNot(this.contents));
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Update the contents of the flip-flop
	 */
	protected updateMemoryContents() {
		if (this.clearPort.probe()[0] == Bit.One) {
			this.contents.fill(Bit.Zero);
			return true;
		}
		if (this.presetPort.probe()[0] == Bit.One) {
			this.contents.fill(Bit.One);
			return true;
		}
		if (this.enablePort.probe()[0] == Bit.Zero) {
			return false;
		}
		this.load();
		return true;
	}

	/**
	 * Get the bit-width of the register
	 */
	public get bitWidth() {
		return this.contents.length;
	}
}
