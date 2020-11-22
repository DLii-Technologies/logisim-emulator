import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { threeValuedNot } from "../../../util/logic";
import { Port } from "../../core/Port";
import { BuiltinLibrary } from "../../enums";
import Component from "../Component";

export class NotGate extends Component
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "NOT Gate";

	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB = BuiltinLibrary.Gates;

	/**
	 * Input connectors
	 */
	protected input: Port;

	/**
	 * Output connectors
	 */
	protected output: Port;

	/**
	 * The size of the gate
	 */
	protected size: number;

	/**
	 * The bitwidth of the gate
	 */
	protected bitWidth: number;

	/**
	 * Create a logic gate
	 */
	public constructor(schematic: IComponent) {
		super(schematic);
		this.bitWidth = parseInt(getAttribute("width", schematic.attributes, "1"));
		this.size = parseInt(getAttribute("size", schematic.attributes, "30"));
		this.input = this.addPort(-this.size, 0, this.bitWidth);
		this.output = this.addPort(0, 0, this.bitWidth, true);
	}

	/**
	 * Perform the gate operation and output
	 */
	public onUpdate() {
		let signal = threeValuedNot(this.input.probe());
		this.output.emitSignal(signal);
	}
}
