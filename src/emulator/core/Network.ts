import assert from "assert";
import { Bit, threeValuedMerge } from "../../util/logic";
import { Connector } from "./Connector";

/**
 * The network maintains connections to directly-connected components
 */
export class Network
{
	protected signal: Bit[] = [];
	/**
	 * Indicate that the network has been updated
	 */
	protected isDirty: boolean = false;

	/**
	 * Maintain the list of connectors in the network
	 */
	protected connectors: Connector[] = [];

	/**
	 * Maintain a list of scheduled updates
	 */
	protected scheduledUpdates = new Set<Connector>();

	/**
	 * Connect a connector to the network
	 */
	public connect(connector: Connector) {
		assert(this.signal.length in [0, connector.bitWidth], "Network contains mismatched widths");
		this.connectors.push(connector);
		connector.connect(this);
	}

	/**
	 * Schedule a new network update
	 */
	public scheduleUpdate(connector: Connector) {
		// this.scheduledUpdates.add(connector);
		this.isDirty = true;
	}

	/**
	 * Determine the signal on this network
	 */
	public probe() {
		if (this.isDirty) {
			this.signal = [];
			for (let connector of this.connectors) {
				threeValuedMerge(this.signal, connector.signal);
			}
			this.isDirty = false;
		}
		return this.signal;
	}
}
