import { IComponent } from "../../../schematic";
import { Bit, threeValuedNor } from "../../../util/logic";
import { LogicGate } from "./LogicGate";

export class NorGate extends LogicGate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "NOR Gate";

	public constructor(schematic: IComponent) {
		super(schematic, true);
	}

	/**
	 * Perform an AND operation on the input and output the result
	 */
	protected evaluate(bits: Bit[]) {
		return threeValuedNor(bits);
	}
}
