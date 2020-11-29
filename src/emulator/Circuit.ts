import assert from "assert";
import { ICircuit } from "../schematic";
import { Line, Point } from "../util/coordinates";
import Component from "./component/Component";
import { ILibraryMap } from "./Project";
import { Port } from "./core/Port";
import { Network } from "./core/Network";
import { Updatable } from "./mixins/Updatable";
import { Pin, Splitter, Tunnel } from "./component";
import { mergeNetworks } from "../util/circuit";

/**
 * Map sets of isolated ports by position
 */
interface IIsolatedPorts {
	[point: string]: Port[]
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
	public async compile(libraries: ILibraryMap) {
		assert(this.__isCompiled == false, "Attempted to compile an already-compiled circuit");
		this.__components = this.createComponents(this.__schematic, libraries);
		this.__networks = this.wireUp(this.__schematic, this.__components);
		this.installEventListeners();
		await this.initialize();
		this.__isCompiled = true;
	}

	// Compilation and Wire-up ---------------------------------------------------------------------

	/**
	 * Create the all of the component instances to be added to the circuit
	 */
	protected createComponents(schematic: ICircuit, libraries: ILibraryMap) {
		let components: Component[] = [];
		for (let component of schematic.components) {
			let lib = component.lib || "";
			assert(lib in libraries, "Missing library in circuit!");
			let library = libraries[lib];
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
			for (let port of [wire.a, wire.b]) {
				let index = this.findConnectedNetwork(port, networks);
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
		let isolatedPorts = this.solderToWires(wireNetworks, networks);
		this.solderToPorts(isolatedPorts, networks);
		this.dissolveSplitters();
		this.dissolveTunnels();
		return networks;
	}

	/**
	 * Connect component ports to wire networks if possible
	 *
	 * @return Isolated ports mapped by position
	 */
	protected solderToWires(wireNetworks: Line[][], networks: Network[]) {
		let isolatedPorts: IIsolatedPorts = {};
		for (let i = 0; i < wireNetworks.length; i++) {
			networks.push(new Network());
		}
		for (let component of this.__components) {
			for (let port of component.portsTransformed) {
				let index = this.findConnectedNetwork(port.position, wireNetworks);
				if (index >= 0)  {
					networks[index].connect(port.port);
				} else {
					let key = port.position.toString();
					let ports = isolatedPorts[key] || [];
					isolatedPorts[key] = ports.concat([port.port]);
				}
			}
		}
		return isolatedPorts;
	}

	/**
	 * Connect component ports that are directly connected
	 */
	protected solderToPorts(isolatedPorts: IIsolatedPorts, networks: Network[]) {
		for (let point in isolatedPorts) {
			if (isolatedPorts[point].length > 1) {
				let network = new Network();
				for (let port of isolatedPorts[point]) {
					network.connect(port);
				}
				networks.push(network);
			}
		}
	}

	/**
	 * Once everything is wired up, splitters should be dissolved to merge the networks
	 */
	protected dissolveSplitters() {
		let splitters = <Splitter[]>this.__components.filter(comp => comp instanceof Splitter);
		for (let splitter of splitters) {
			splitter.dissolve();
		}
	}

	/**
	 * Tunnels should also be dissolved to merge the networks
	 */
	protected dissolveTunnels() {
		let tunnelGroups: {[label: string]: Tunnel[]} = {};
		for (let component of this.__components) {
			if (component instanceof Tunnel && component.port.network !== null) {
				if (!(component.label in tunnelGroups)) {
					tunnelGroups[component.label] = [];
				}
				tunnelGroups[component.label].push(component);
			}
		}
		for (let group of Object.values(tunnelGroups)) {
			for (let i = 1; i < group.length; i++) {
				let networkA = group[0].port.network;
				let networkB = group[i].port.network;
				assert(group[0].bitWidth == group[i].bitWidth, "network bit-widths must match");
				assert(networkA && networkB, "The tunnel should have a network to merge");
				mergeNetworks(networkA, networkB);
				group[i].port.disconnect();
			}
			group[0].port.disconnect();
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
			for (let wire of network.wires) {
				wire.addListener(this.scheduleUpdate);
			}
		}
	}

	/**
	 * initialize the circuit by updating all wire networks
	 */
	protected async initialize() {
		for (let network of this.__networks) {
			for (let wire of network.wires) {
				wire.scheduleUpdate();
			}
		}
		await this.evaluate();
	}

	// Circuit Evaluation --------------------------------------------------------------------------

	/**
	 * Get the current state of the circuit
	 */
	protected circuitState() {
		let state = "";
		for (let component of this.components) {
			state += component.state;
		}
		return state;
	}

	/**
	 * Schedule a component for updating
	 */
	protected scheduleUpdate(updatable: Updatable) {
		assert(this.__toUpdate.includes(updatable) == false,
		       "Attempted to schedule an update for an already-scheduled component");
		this.__toUpdate.push(updatable);
	}

	/**
	 * Evaluate the circuit with the given input/output set
	 */
	public async evaluate() {
		let updatable: Updatable;
		let states = new Set<string>();
		while (this.__toUpdate.length) {
			let state = this.circuitState();
			// if (states.has(state)) {
			// 	throw new Error("Oscillation detected!");
			// }
			updatable = this.__toUpdate.splice(0, 1)[0];
			states.add(state);
			updatable.update();
		}
	}

	/**
	 * Clear the update queue
	 */
	public clearUpdates() {
		this.__toUpdate = [];
	}

	// ---------------------------------------------------------------------------------------------

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
	 * Check if the circuit has been compiled
	 */
	public get isCompiled() {
		return this.__isCompiled;
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
	// 	for (let port of this.__components) {
	// 		if (port instanceof Pin) {
	// 			if (port.label !== "") {

	// 			} else {
	// 				unlabeled.push(port);
	// 			}
	// 		}
	// 	}
	// }
}
