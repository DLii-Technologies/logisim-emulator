import { IComponent } from "../../../schematic";
import { Bit, threeValuedNand } from "../../../util/logic";
import { Gate } from "./Gate";

export class NandGate extends Gate
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
