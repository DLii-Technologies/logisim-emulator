import assert from "assert";
import { ICircuit } from "../schematic";
import { Line, Point } from "../util/coordinates";
import Component, { IComponentMap } from "./component/Component";
import { ILibraryMap } from "./Project";
import { Connector } from "./core/Connector";
import { Network } from "./core/Network";
import { Updatable } from "./mixins/Updatable";
import { Bit } from "../util/logic";
import { Pin } from "./component";
import { Facing } from "./enums";

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
	private __components: Component[] = [];

	/**
	 * The schematic for the circuit
	 */
	private __schematic: ICircuit;

	/**
	 * Indicate if the circuit has been compiled
	 */
	private __isCompiled: boolean = false;

	/**
	 * The list of networks
	 */
	private __networks: Network[] = [];

	/**
	 * Maintain a queue of networks that need updating
	 */
	private __toUpdate: Updatable[] = [];

	/**
	 * Create a new circuit
	 */
	public constructor(circuit: ICircuit) {
		this.name = circuit.name;
		this.__schematic = circuit;
		this.scheduleUpdate = this.scheduleUpdate.bind(this);
	}

	/**
	 * Compile the circuit
	 */
	public compile(libraries: ILibraryMap) {
		if (this.__isCompiled) {
			return;
		}
		this.__components = this.createComponents(this.__schematic, libraries);
		this.__networks = this.wireUp(this.__schematic, this.__components);
		this.installEventListeners();
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
		let wireNetworks = this.createWireNetworks(this.__schematic);
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
			networks.push(new Network());
		}
		for (let component of this.__components) {
			for (let connector of component.connectorsTransformed) {
				let index = this.findConnectedNetwork(connector.position, wireNetworks);
				if (index >= 0)  {
					networks[index].connect(connector.connector);
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
				networks.push(network);
			}
		}
	}

	/**
	 * Setup the event listeners to evaluate the circuit
	 */
	protected installEventListeners() {
		for (let component of this.__components) {
			component.addListener(this.scheduleUpdate);
		}
		for (let network of this.__networks) {
			network.addListener(this.scheduleUpdate);
		}
	}

	// Circuit Evaluation --------------------------------------------------------------------------

	/**
	 * Get the current state of the circuit
	 */
	protected networkState() {
		let bits: Bit[] = [];
		for (let network of this.__networks) {
			bits = bits.concat(network.signal);
		}
		return bits.toString();
	}

	/**
	 * Invoked when an
	 */
	protected scheduleUpdate(updatable: Updatable) {
		if (!this.__toUpdate.includes(updatable)) {
			this.__toUpdate.push(updatable);
		}
	}

	/**
	 * Evaluate the circuit with the given input/output set
	 */
	public async evaluate() {
		let updatable: Updatable;
		let states = new Set<string>();
		while (this.__toUpdate.length) {
			let state = this.networkState();
			// if (states.has(state)) {
			// 	throw new Error("Oscillation detected!");
			// }
			updatable = this.__toUpdate.splice(0, 1)[0];
			states.add(state);
			updatable.update();
		}
		// return this.output();
	}

	/**
	 * Clear the update queue
	 */
	public clearUpdates() {
		this.__toUpdate = [];
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * @TODO
	 * Add a new network to the circuit
	 */
	// public addNetwork(network: Network) {
	// 	network.on("update", (network) => this.onUpdate(network));
	// 	this.__networks.push(network);
	// }

	// ---------------------------------------------------------------------------------------------

	/**
	 * Check if the circuit has been compiled
	 */
	public isCompiled() {
		return this.__isCompiled;
	}

	/**
	 * Get a list of all pins for this circuit
	 */
	public pins(inputs: boolean = true, outputs: boolean = true) {
		return <Pin[]>this.__components.filter(comp => comp instanceof Pin && (
			(comp.isOutput && outputs) || (!comp.isOutput && inputs)));
	}

	/**
	 * Get a list of all input pins for this circuit
	 */
	public get inputPins() {
		return this.pins(true, false);
	}

	/**
	 * Find and group all labeled input pins
	 */
	public get inputPinsLabeled() {
		let result: {[label: string]: Pin[]} = {};
		for (let pin of this.inputPins) {
			if (pin.label == "") {
				continue;
			}
			if (!(pin.label in result)) {
				result[pin.label] = [];
			}
			result[pin.label].push(pin);
		}
		return result;
	}

	/**
	 * Get a list of all output pins for this circuit
	 */
	public get outputPins() {
		return this.pins(false, true);
	}

	/**
	 * Find and group all labeled output pins
	 */
	public get outputPinsLabeled() {
		let result: {[label: string]: Pin[]} = {};
		for (let pin of this.outputPins) {
			if (pin.label == "") {
				continue;
			}
			if (!(pin.label in result)) {
				result[pin.label] = [];
			}
			result[pin.label].push(pin);
		}
		return result;
	}

	/**
	 * Get the list of components in this circuit
	 */
	public get components() {
		return this.__components;
	}

	/**
	 * Get the input pins for the
	 */
	// public inputPins(facing: Facing) {

	// }

	/**
	 * Get the current output of the circuit
	 */
	// public output() {
	// 	let labeled = {};
	// 	let unlabeled = [];
	// 	for (let connector of this.__components) {
	// 		if (connector instanceof Pin) {
	// 			if (connector.label !== "") {

	// 			} else {
	// 				unlabeled.push(connector);
	// 			}
	// 		}
	// 	}
	// }
}
