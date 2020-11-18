import assert from "assert";
import { ICircuit } from "../schematic";
import { Line, Point } from "../util/coordinates";
import Component, { IComponentMap } from "./component/Component";
import { Network } from "./wiring/Network";

export class Circuit
{
	/**
	 * The name of the circuit
	 */
	public readonly name: string;

	/**
	 * Store the component instances
	 */
	protected components: Component[] = [];

	/**
	 * The schematic for the circuit
	 */
	protected schematic: ICircuit;

	/**
	 * Indicate if the circuit has been compiled
	 */
	private __isCompiled: boolean = false;

	/**
	 * The list of networks
	 */
	private __networks: Network[] = [];

	/**
	 * Create a new circuit
	 */
	public constructor(circuit: ICircuit) {
		this.name = circuit.name;
		this.schematic = circuit;
	}

	/**
	 * Compile the circuit
	 */
	public compile(componentMap: IComponentMap, circuitMap: Circuit[]) {
		if (this.__isCompiled) {
			return;
		}
		this.components = this.createComponents(this.schematic, componentMap);
		let wireNetworks = this.createWireNetworks(this.schematic);
		this.wireUp(wireNetworks);
		this.__isCompiled = true;
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Create the all of the component instances to be added to the circuit
	 */
	protected createComponents(schematic: ICircuit, componentMap: IComponentMap) {
		let components: Component[] = [];
		for (let component of schematic.components) {
			if (component.key in componentMap) {
				components.push(new componentMap[component.key](component));
			} else {
				console.log("Component not found:", component.lib, component.name);
			}
		}
		return components;
	}

	/**
	 * Create the wire networks
	 */
	protected createWireNetworks(schematic: ICircuit) {
		let networks: Line[][] = [];
		for (let wire of schematic.wires) {
			let network: Line[] = [wire];
			for (let connector of [wire.a, wire.b]) {
				let index = this.findConnectedNetwork(connector, networks);
				if (index >= 0) {
					network = network.concat(networks.splice(index, 1)[0]);
				}
			}
			networks.push(network);
		}
		return networks;
	}

	/**
	 * Determine if the given point should connect to a wire network.
	 * Returns the index of the network
	 */
	protected findConnectedNetwork(point: Point, networks: Line[][]) {
		for (let i = 0; i < networks.length; i++) {
			for (let wire of networks[i]) {
				if (wire.intersects(point)) {
					return i;
				}
			}
		}
		return -1;
	}

	/**
	 * Wire up the circuit and construct the compiled networks
	 */
	protected wireUp(wireNetworks: Line[][]) {
		for (let component of this.components) {
			for (let connector of component.connectorsTransformed) {
				let findConnectedNetwork(connector.position, wireNetworks);
			}
		}
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Check if the circuit has been compiled
	 */
	public isCompiled() {
		return this.__isCompiled;
	}
}
