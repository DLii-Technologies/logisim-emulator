import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Port } from "../../core/Port";
import { BuiltinLibrary } from "../../enums";
import Component from "../Component";


export class Pin extends Component {

	/**
	 * The name of the component
	 */
	public static readonly NAME: string = "Pin";

	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB: string = BuiltinLibrary.Wiring;

	/**
	 * Indicate if this pin is an output pin
	 */
	public readonly isOutput: boolean;

	/**
	 * Store a direct reference to the pin's connector
	 */
	private __connector: Port

	/**
	 * Create the component
	 */
	public constructor(schematic: IComponent) {
		super(schematic);
		this.isOutput = getAttribute("output", schematic.attributes, "false") == "true";
		let bitWidth = parseInt(getAttribute("width", schematic.attributes, "1"));
		this.__connector = this.addPort(0, 0, bitWidth);
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Invoked when the connected networks has updated
	 */
	public onUpdate() {
		// NO-OP
	}

	/**
	 * Probe the network for the output
	 */
	public probe() {
		if (this.isOutput) {
			return this.connector.probe();
		}
		return this.connector.signal;
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the pin's connector
	 */
	public get connector() {
		return this.__connector;
	}
}
