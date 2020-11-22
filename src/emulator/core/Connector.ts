import { Bit, threeValuedMerge } from "../../util/logic";
import { Port } from "./Port";
import { Wire } from "./Wire";

/**
 * The connector manages a single bit channel of a port
 */
export class Connector
{
	/**
	 * The port that this connector belongs to
	 */
	public readonly port: Port;

	/**
	 * The index of the signal this connector is responsible for
	 */
	public readonly index: number;

	/**
	 * The wire this connector is connected to
	 */
	protected wire: Wire | null = null;

	/**
	 * Create a new connector
	 */
	public constructor(port: Port, index: number) {
		this.port = port;
		this.index = index;
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Connect a wire to this connector
	 */
	public connect(wire: Wire) {
		this.wire = wire;
	}

	/**
	 * Update the connector and schedule an update for the wire if connected
	 */
	public update() {
		if (this.wire) {
			this.wire.scheduleUpdate();
		}
	}

	/**
	 * Schedule an update for this connector
	 */
	public scheduleUpdate() {
		this.port.scheduleUpdate();
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Probe the network for the current value
	 */
	public probe() {
		if (this.wire === null) {
			return this.signal;
		}
		return threeValuedMerge([this.signal], [this.wire.signal])[0];
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the signal from the port
	 */
	public get signal() {
		return this.port.signal[this.index];
	}
}
