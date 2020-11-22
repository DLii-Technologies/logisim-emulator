import { IComponent } from "../../../schematic";
import { Bit, threeValuedXnor } from "../../../util/logic";
import { BuiltinLibrary } from "../../enums";
import { Gate } from "./Gate";

export class XnorGate extends Gate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "XNOR Gate";

	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB = BuiltinLibrary.Gates;

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
