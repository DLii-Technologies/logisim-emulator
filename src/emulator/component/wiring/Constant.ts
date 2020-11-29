import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Bit, numberToBits } from "../../../util/logic";
import { Pin } from "./Pin";

export class Constant extends Pin {

	/**
	 * The name of the component
	 */
	public static readonly NAME: string = "Constant";

	/**
	 * The signal this constant is emitting
	 */
	private __signal: Bit[];

	/**
	 * Create the component
	 */
	public constructor(schematic: IComponent) {
		super(schematic);
		let value = parseInt(getAttribute("value", schematic, "0x1"), 16);
		this.__signal = numberToBits(value);
		this.connector.emitSignal(this.__signal);
	}
}
