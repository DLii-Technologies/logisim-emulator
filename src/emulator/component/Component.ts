import assert from "assert";
import { IComponent } from "../../schematic";
import { getAttribute } from "../../util";
import { Point } from "../../util/coordinates";
import { ROTATION, transform } from "../../util/transform";
import { Facing } from "../enums";
import { Connector } from "../core/Connector";

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

export default abstract class Component
{
	/**
	 * The name of the component
	 */
	public static readonly NAME: string = "";

	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB: string = "";

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
		this.setFacing(getAttribute("facing", schematic.attributes, Facing.East));
	}

	/**
	 * Add a connector to the component
	 */
	protected addConnector(x: number, y: number, bitWidth: number = 1) {
		let connector = new Connector(bitWidth);
		this.connectors.push({ connector, position: new Point(x, y) });
		return connector;
	}

	/**
	 * Set the direction the component is facing
	 */
	protected setFacing(facing: Facing | string) {
		if (typeof(facing) == "string") {
			Object.values(Facing).includes(<Facing>facing)
			assert(Object.values(Facing).includes(<Facing>facing), "Invalid facing property given");
			this.facing = <Facing>facing;
		} else {
			this.facing = facing;
		}
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * The input has changed, update and re-evaluate
	 */
	public abstract update(): void;

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
				position: transform(connector.position, this.position, ROTATION[this.facing])
			});
		}
		return result;
	}
}
