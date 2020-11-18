import { IComponent } from "../../schematic";
import { Circuit } from "../Circuit";
import Component from "./Component";


export class CircuitComponent extends Component
{
	/**
	 * Store a reference to the circuit
	 */
	public static readonly CIRCUIT: Circuit;

	/**
	 * The component constructor
	 */
	public constructor(schematic: IComponent) {
		super(schematic);

	}
}
