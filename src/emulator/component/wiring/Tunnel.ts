import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Port } from "../../core";
import { BuiltinLibrary } from "../../enums";
import Component from "../Component";


export class Tunnel extends Component
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "Tunnel";

	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB = BuiltinLibrary.Wiring;

	/**
	 * The number of bits this tunnel supports
	 */
	public readonly bitWidth: number;

	/**
	 * The port of this tunnel
	 */
	public readonly port: Port;

	/**
	 * Create a new tunnel
	 */
	public constructor(schematic: IComponent) {
		super(schematic);
		this.bitWidth = parseInt(getAttribute("width", schematic, "1"));
		this.port = this.addPort(0, 0, this.bitWidth, true);
	}

	/**
	 * Invoked by the update handler
	 */
	public onUpdate() {
		// NO-OP
	}
}
