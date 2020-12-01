import assert from "assert";
import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Bit } from "../../../util/logic";
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
		this.isOutput = getAttribute("output", schematic, "false") == "true";
		let bitWidth = parseInt(getAttribute("width", schematic, "1"));
		this.__connector = this.addPort(0, 0, bitWidth, !this.isOutput);
		this.initializeSignal();
	}

	/**
	 * Initialize the input pin's signal if necessary
	 */
	protected initializeSignal() {
		if (this.isOutput) {
			return;
		}
		let signal = new Array<Bit>(this.__connector.bitWidth).fill(Bit.Zero);
		this.__connector.emitSignal(signal);
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
		assert(this.isOutput, "Probing is only compatible with output pins");
		return this.connector.probe();
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the pin's connector
	 */
	public get connector() {
		return this.__connector;
	}
}
