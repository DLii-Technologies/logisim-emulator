import assert from "assert";
import { EventEmitter } from "events";
import { arraysAreEqual } from "../../util";
import { Bit, threeValuedMerge } from "../../util/logic";
import { Updatable } from "../mixins/Updatable";
import { Connector } from "./Connector";

/**
 * The network maintains connections to directly-connected components
 */
export class Network extends Updatable
{
	/**
	 * The signal currently on the network
	 */
	private __signal: Bit[] = [];

	/**
	 * Maintain a set of the connectors in the network
	 */
	protected connectors: Set<Connector> = new Set();

	/**
	 * Update the network
	 */
	public onUpdate() {
		let signal = this.probe();
		if (!arraysAreEqual(signal, this.__signal)) {
			return;
		}
		this.__signal = signal;
		for (let connector of this.connectors) {
			connector.scheduleUpdate();
		}
	}

	/**
	 * Connect a connector to the network
	 */
	public connect(connector: Connector) {
		assert(this.signal.length in [0, connector.bitWidth], "Network contains mismatched widths");
		this.connectors.add(connector);
		connector.connect(this);
	}

	/**
	 * Probe all connected connectors to determine the merged signal
	 */
	public probe() {
		let signal: Bit[] = [];
		for (let connector of this.connectors) {
			threeValuedMerge(signal, connector.signal);
		}
		return signal;
	}

	/**
	 * Get the current signal on the network
	 */
	public get signal() {
		return this.__signal;
	}
}
