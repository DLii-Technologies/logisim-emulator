import assert from "assert";
import Component from "../component/Component";
import { Port } from "./Port";
import { Wire } from "./Wire";

/**
 * The network maintains connections to directly-connected components
 */
export class Network
{
	/**
	 * Maintain a set of the ports in the network
	 */
	protected ports: Set<Port> = new Set();

	/**
	 * The list of wires associated with this network
	 */
	private __wires: Wire[] = [];

	/**
	 * Connect a port to the network
	 */
	public connect(port: Port) {
		assert([0, port.bitWidth].includes(this.bitWidth), "Network contains mismatched widths");
		if (this.bitWidth == 0) {
			for (let i = 0; i < port.bitWidth; i++) {
				this.__wires.push(new Wire());
			}
		}
		this.ports.add(port);
		port.connect(this);
	}

	/**
	 * Get the bit-width of the network
	 */
	public get bitWidth() {
		return this.__wires.length;
	}

	/**
	 * Get the list of components connected to the network
	 */
	public get components() {
		let result = new Set<Component>();
		for (let port of this.ports) {
			result.add(port.component);
		}
		return result;
	}

	/**
	 * Get the list of wires within this network
	 */
	public get wires() {
		return this.__wires;
	}
}
