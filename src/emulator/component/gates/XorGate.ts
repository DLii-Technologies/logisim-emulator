import { IComponent } from "../../../schematic";
import { Bit, threeValuedXor } from "../../../util/logic";
import { LogicGate } from "./LogicGate";

export class XorGate extends LogicGate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "XOR Gate";

	public constructor(schematic: IComponent) {
		super(schematic, false, 10);
	}

	/**
	 * Perform an AND operation on the input and output the result
	 */
	protected evaluate(bits: Bit[]) {
		return threeValuedXor(bits);
	}
}
