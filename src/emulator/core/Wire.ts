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
	private __connectors: Set<Connector> = new Set();

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
		this.__connectors.add(connector);
		connector.connect(this);
	}

	/**
	 * Disconnect a wire from a connector
	 */
	public disconnect(connector: Connector) {
		this.__connectors.delete(connector);
	}

	/**
	 * Probe all connected connectors to determine the merged signal
	 */
	public probe() {
		let signal = Bit.Unknown;
		for (let connector of this.__connectors) {
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
		for (let connector of this.__connectors) {
			connector.scheduleUpdate();
		}
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the list of connectors this wire is attached to
	 */
	public get connectors() {
		return this.__connectors;
	}

	/**
	 * Get the signal currently stored on the wire
	 */
	public get signal() {
		return this.__signal;
	}
}
