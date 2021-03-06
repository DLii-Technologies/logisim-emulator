import { IComponent } from "../../../schematic";
import { BuiltinLibrary } from "../../enums";
import { Gate } from "./Gate";

export class NotGate extends Gate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "NOT Gate";

	/**
	 * Create a logic gate
	 */
	public constructor(schematic: IComponent) {
		super(schematic, true, false);
	}
}
