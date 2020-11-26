import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Bit, numberToBits } from "../../../util/logic";
import { Port } from "../../core/Port";
import { BuiltinLibrary } from "../../enums";
import Component from "../Component";


export class Constant extends Component {

	/**
	 * The name of the component
	 */
	public static readonly NAME: string = "Constant";

	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB: string = BuiltinLibrary.Wiring;

	/**
	 * The constant's connector
	 */
	private __port: Port;

	/**
	 * The signal this constant is emitting
	 */
	private __signal: Bit[];

	/**
	 * Create the component
	 */
	public constructor(schematic: IComponent) {
		super(schematic);
		let bitWidth = parseInt(getAttribute("width", schematic, "1"));
		let value = parseInt(getAttribute("value", schematic, "0x1"), 16);
		this.__port = this.addPort(0, 0, bitWidth);
		this.__signal = numberToBits(value);
		this.__port.emitSignal(this.__signal);
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Invoked when the connected networks has updated
	 */
	public onUpdate() {
		// NO-OP
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the port for this constant
	 */
	public get port() {
		return this.__port;
	}
}
