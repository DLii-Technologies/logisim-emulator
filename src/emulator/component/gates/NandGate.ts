import { IComponent } from "../../../schematic";
import { Bit, threeValuedNand } from "../../../util/logic";
import { BuiltinLibrary } from "../../enums";
import { Gate } from "./Gate";

export class NandGate extends Gate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "NAND Gate";

	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB = BuiltinLibrary.Gates;

	public constructor(schematic: IComponent) {
		super(schematic);
	}

	/**
	 * Perform an AND operation on the input and output the result
	 */
	protected evaluate(bits: Bit[]) {
		return threeValuedNand(bits);
	}
}
