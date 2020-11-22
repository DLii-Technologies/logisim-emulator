import { IComponent } from "../../../schematic";
import { Bit, threeValuedOr } from "../../../util/logic";
import { BuiltinLibrary } from "../../enums";
import { Gate } from "./Gate";

export class OrGate extends Gate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "OR Gate";

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
		return threeValuedOr(bits);
	}
}
