import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { threeValuedNot } from "../../../util/logic";
import { Connector } from "../../core/Connector";
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
	protected input: Connector;

	/**
	 * Output connectors
	 */
	protected output: Connector;

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
		this.input = this.addConnector(-this.size, this.bitWidth);
		this.output = this.addConnector(0, 0, this.bitWidth, true);
	}

	/**
	 * Perform the gate operation and output
	 */
	public onUpdate() {
		this.output.emitSignal(threeValuedNot(this.input.probe()));
	}
}
