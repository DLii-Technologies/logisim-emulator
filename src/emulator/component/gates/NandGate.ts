import { IComponent } from "../../../schematic";
import { Bit, threeValuedNand } from "../../../util/logic";
import { LogicGate } from "./LogicGate";

export class NandGate extends LogicGate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "NAND Gate";

	public constructor(schematic: IComponent) {
		super(schematic, true);
	}

	/**
	 * Perform an AND operation on the input and output the result
	 */
	protected evaluate(bits: Bit[]) {
		return threeValuedNand(bits);
	}
}
