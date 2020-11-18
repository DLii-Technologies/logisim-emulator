import assert from "assert";
import { ICircuit } from "../schematic";
import { Line, Point } from "../util/coordinates";
import Component, { IComponentMap } from "./component/Component";
import { ILibraryMap } from "./Project";
import { Connector } from "./wiring/Connector";
import { Network } from "./wiring/Network";

/**
 * Map sets of isolated connectors by position
 */
interface IIsolatedConnectors {
	[point: string]: Connector[]
}

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
	public compile(libraries: ILibraryMap) {
		if (this.__isCompiled) {
			return;
		}
		this.components = this.createComponents(this.schematic, libraries);
		this.__networks = this.wireUp(this.schematic, this.components);
		this.__isCompiled = true;
	}

	// Compilation and Wire-up ---------------------------------------------------------------------

	/**
	 * Create the all of the component instances to be added to the circuit
	 */
	protected createComponents(schematic: ICircuit, libraries: ILibraryMap) {
		let components: Component[] = [];
		for (let component of schematic.components) {
			assert((component.lib || "") in libraries, "Missing library in circuit!");
			let library = libraries[component.lib || ""]
			if (component.name in library) {
				components.push(new library[component.name](component));
			} else {
				console.warn("Component not found:", component.lib, component.name);
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
	 *
	 * @return The index of the network
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
	protected wireUp(schematic: ICircuit, components: Component[]) {
		let networks: Network[] = [];
		let wireNetworks = this.createWireNetworks(this.schematic);
		let isolatedConnectors = this.solderToWires(wireNetworks, networks);
		this.solderToConnectors(isolatedConnectors, networks);
		return networks;
	}

	/**
	 * Connect component connectors to wire networks if possible
	 *
	 * @return Isolated connectors mapped by position
	 */
	protected solderToWires(wireNetworks: Line[][], networks: Network[]) {
		let isolatedConnectors: IIsolatedConnectors = {};
		for (let i = 0; i < wireNetworks.length; i++) {
			this.__networks.push(new Network());
		}
		for (let component of this.components) {
			for (let connector of component.connectorsTransformed) {
				let index = this.findConnectedNetwork(connector.position, wireNetworks);
				if (index >= 0)  {
					this.__networks[index].connect(connector.connector);
				} else {
					let key = connector.position.toString();
					let connectors = isolatedConnectors[key] || [];
					isolatedConnectors[key] = connectors.concat([connector.connector]);
				}
			}
		}
		return isolatedConnectors;
	}

	/**
	 * Connect component connectors that are directly connected
	 */
	protected solderToConnectors(isolatedConnectors: IIsolatedConnectors, networks: Network[]) {
		for (let point in isolatedConnectors) {
			if (isolatedConnectors[point].length > 1) {
				let network = new Network();
				for (let connector of isolatedConnectors[point]) {
					network.connect(connector);
				}
				this.__networks.push(network);
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
