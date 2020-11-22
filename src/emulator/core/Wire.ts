import { Bit, threeValuedMerge } from "../../util/logic";
import { Updatable } from "../mixins/Updatable";
import { Connector } from "./Connector";

/**
 * A wire carries a single bit between connectors
 */
export class Wire extends Updatable
{
	/**
	 * The signal currently on the network
	 */
	private __signal: Bit = Bit.Unknown;

	/**
	 * Maintain a set of the connectors in the network
	 */
	protected connectors: Set<Connector> = new Set();

	/**
	 * Create a new wire for the given bit index
	 */
	public constructor() {
		super();
	}

	/**
	 * Connect a connector to the network
	 */
	public connect(connector: Connector) {
		this.connectors.add(connector);
		connector.connect(this);
	}

	/**
	 * Probe all connected connectors to determine the merged signal
	 */
	public probe() {
		let signal = Bit.Unknown;
		for (let connector of this.connectors) {
			signal = threeValuedMerge([signal], [connector.signal])[0];
		}
		return signal;
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Invoked when a connector has changed the signal on this wire
	 */
	public onUpdate() {
		let signal = this.probe();
		if (signal == this.__signal) {
			return;
		}
		this.__signal = signal;
		for (let connector of this.connectors) {
			connector.scheduleUpdate();
		}
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the signal currently stored on the wire
	 */
	public get signal() {
		return this.__signal;
	}
}
