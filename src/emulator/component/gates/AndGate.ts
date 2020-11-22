import { IComponent } from "../../../schematic";
import { Bit, threeValuedAnd } from "../../../util/logic";
import { Gate } from "./Gate";

export class AndGate extends Gate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "AND Gate";

	public constructor(schematic: IComponent) {
		super(schematic, false);
	}

	/**
	 * Perform an AND operation on the input and output the result
	 */
	protected evaluate(bits: Bit[]) {
		return threeValuedAnd(bits);
	}
}
