import { Connector } from "./Connector";
import { Signal } from "./Signal";

/**
 * The network maintains connections to directly-connected components
 */
export class Network
{
	/**
	 * The signal currently emitted on the network
	 */
	private signal: Signal = new Signal();

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
			this.signal.clear();
			for (let connector of this.connectors) {
				if (connector.emitting !== null) {
					this.signal.merge(connector.emitting);
				}
			}
		}
		return this.signal;
	}
}
