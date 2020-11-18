import assert from "assert";
import { IComponent } from "../../schematic";
import { Point } from "../../util/coordinates";
import { transform } from "../../util/transform";
import { Facing } from "../enums";
import { Connector } from "../wiring/Connector";

/**
 * Allow component class definitions to be passed as arguments
 */
export interface IComponentType {
	new (component: IComponent): Component;
};

/**
 * Store a mapping of all components
 */
export interface IComponentMap {
	[name: string]: IComponentType;
};

/**
 * Store a single connector in the component
 */
export interface IConnector {
	connector: Connector;
	position : Point;
}

/**
 * Store a mapping of all connectors
 */
export interface IConnectorMap {
	input : Connector[];
	output: Connector[];
};

export default class Component
{
	/**
	 * The name of the component
	 */
	public static readonly NAME: string = "";

	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB?: string;

	/**
	 * Generate the key for the component
	 */
	public static get key() {
		return [this.LIB, this.NAME].toString();
	}

	/**
	 * The position of the component
	 */
	public position: Point;

	/**
	 * The orientation of the component
	 */
	public facing: Facing = Facing.East;

	/**
	 * The list of connectors for this component
	 */
	private __connectors: IConnector[] = [];

	/**
	 * The component constructor
	 */
	public constructor(schematic: IComponent) {
		this.position = schematic.location;
		if ("facing" in schematic.attributes) {
			this.setFacing(schematic.attributes["facing"]);
		}
	}

	/**
	 * Add a connector to the component
	 */
	protected addConnector(x: number, y: number) {
		let connector = new Connector();
		this.connectors.push({ connector, x, y });
		return connector;
	}

	/**
	 * Set the direction the component is facing
	 */
	protected setFacing(facing: Facing | string) {
		if (typeof(facing) == "string") {
			assert(Object.values(Facing).includes(facing), "Invalid facing property given");
			this.facing = <Facing>(<any>Facing)[facing]; // TS can't figure this out... really????
		} else {
			this.facing = facing;
		}
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the list of connectors for this component
	 */
	public get connectors() {
		return this.__connectors;
	}

	/**
	 * Get the list of connectors for this component transformed with the component orientation
	 */
	public get connectorsTransformed() {
		let result: IConnector[] = [];
		for (let connector of this.__connectors) {
			result.push({
				connector: connector.connector,
				position: transform(connector.position, this.position, this.facing)
			});
		}
		return result;
	}
}
