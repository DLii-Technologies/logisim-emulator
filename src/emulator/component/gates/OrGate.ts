import { IComponent } from "../../../schematic";
import { Bit, threeValuedOr } from "../../../util/logic";
import { LogicGate } from "./LogicGate";

export class OrGate extends LogicGate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "OR Gate";

	public constructor(schematic: IComponent) {
		super(schematic, false);
	}

	/**
	 * Perform an AND operation on the input and output the result
	 */
	protected evaluate(bits: Bit[]) {
		return threeValuedOr(bits);
	}
}
