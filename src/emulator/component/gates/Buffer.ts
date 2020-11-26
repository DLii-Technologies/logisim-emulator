import { IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Port } from "../../core/Port";
import { Gate } from "./Gate";

export class Buffer extends Gate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "Buffer";

	/**
	 * Create a logic gate
	 */
	public constructor(schematic: IComponent) {
		super(schematic, false, false);
	}
}
