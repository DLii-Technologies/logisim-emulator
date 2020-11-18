import { IComponent } from "../../schematic";
import { BuiltinLibrary } from "../enums";
import { getAttribute } from "../../util";
import { Connector } from "../wiring/Connector";
import Component from "./Component";

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
	 * Store a direct reference to the pin's connector
	 */
	private __connector: Connector

	/**
	 * Create the component
	 */
	public constructor(schematic: IComponent) {
		super(schematic);
		let bitWidth = parseInt(getAttribute("width", schematic, "1"));
		this.__connector = this.addConnector(0, 0, bitWidth);
	}

	/**
	 * Get the pin's connector
	 */
	public get connector() {
		return this.__connector;
	}
}
