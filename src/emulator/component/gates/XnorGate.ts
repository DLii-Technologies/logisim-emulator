import { IComponent } from "../../../schematic";
import { Bit, threeValuedXnor } from "../../../util/logic";
import { LogicGate } from "./LogicGate";

export class XnorGate extends LogicGate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "XNOR Gate";

	public constructor(schematic: IComponent) {
		super(schematic, true, 10);
	}

	/**
	 * Perform an AND operation on the input and output the result
	 */
	protected evaluate(bits: Bit[]) {
		return threeValuedXnor(bits);
	}
}
