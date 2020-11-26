import { IComponent } from "../../../schematic";
import { Gate } from "./Gate";

export class ControlledBuffer extends Gate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "Controlled Buffer";

	/**
	 * Create a logic gate
	 */
	public constructor(schematic: IComponent) {
		super(schematic, false, true);
	}
}
