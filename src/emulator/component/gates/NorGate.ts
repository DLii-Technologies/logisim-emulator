import { IComponent } from "../../../schematic";
import { Bit, threeValuedNor } from "../../../util/logic";
import { BuiltinLibrary } from "../../enums";
import { Gate } from "./Gate";

export class NorGate extends Gate
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "NOR Gate";

	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB = BuiltinLibrary.Gates;

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
