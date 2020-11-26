import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Bit, threeValuedNot } from "../../../util/logic";
import { Port } from "../../core/Port";
import { BuiltinLibrary } from "../../enums";
import Component from "../Component";

/**
 * A gate provides a component with a single input port and a single output port.
 * Additional flags allow for output negation and adding a control line to enable/disable the gate
 */
export abstract class Gate extends Component
{
	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB = BuiltinLibrary.Gates;

	/**
	 * Indicate if the gate should negate the output
	 */
	protected negateOutput: boolean = false;

	/**
	 * The size of the gate
	 */
	protected size: number;

	/**
	 * Input connectors
	 */
	protected input: Port;

	/**
	 * Output connectors
	 */
	protected output: Port;

	/**
	 * The control line connector
	 */
	protected control?: Port;

	/**
	 * The bitwidth of the gate
	 */
	protected bitWidth: number;

	/**
	 * The location of the control line
	 */
	protected controlSide?: string;

	/**
	 * Create a controlled gate
	 */
	public constructor(schematic: IComponent, negateOutput: boolean, hasControlLine: boolean) {
		super(schematic);
		this.negateOutput = negateOutput;
		this.bitWidth = parseInt(getAttribute("width", schematic.attributes, "1"));
		this.size = parseInt(getAttribute("size", schematic.attributes, "30"));
		this.output = this.addPort(0, 0, this.bitWidth, true);

		let dx = this.negateOutput ? -10 : 0;
		this.input = this.addPort(-this.size + dx, 0, this.bitWidth);

		if (hasControlLine) {
			this.controlSide = (getAttribute("control", schematic.attributes, "right"));
			let dy = this.controlSide == "right" ? 10 : -10;
			this.control = this.addPort((this.size == 30 ? -10 : 0) + dx, dy, 1);
		}
	}

	/**
	 * Perform the gate operation and output
	 */
	public onUpdate() {
		if (this.control) {
			let controlSignal = this.control.probe()[0];
			if (controlSignal < Bit.Zero) {
				this.output.emitErrorSignal();
				return;
			} else if (controlSignal == Bit.Zero) {
				this.output.clearSignal();
				return;
			}
		}
		let signal = this.input.probe();
		if (this.negateOutput) {
			signal = threeValuedNot(signal);
		}
		this.output.emitSignal(signal);
	}
}
