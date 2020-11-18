import assert from "assert";
import { Point } from "../../util/coordinates";
import { Network } from "./Network";

/**
 * A connector can probe the connected network or emit signals onto the network.
 * Events triggered via emit trigger network updates.
 */
export class Connector {

	/**
	 * Store the network that this connector is connected to
	 */
	private __network: Network | null = null;

	/**
	 * The value currently being emitted onto the network by this connector
	 */
	private __emitting: number[] | null = null;

	/**
	 * The number of bits this connector is compatible with
	 */
	private __bitWidth: number;

	/**
	 * Create a connector
	 */
	public constructor(bitWidth: number = 1) {
		this.__bitWidth = bitWidth;
	}

	/**
	 * Connect this connector to a wire network
	 */
	public connect(network: Network) {
		this.__network = network;
	}

	/**
	 * Emit a value into the connected network
	 */
	public emitSignal(value: number[] | null) {
		assert(value === null || value.length == this.__bitWidth, "Emitted signal width invalid");
		this.__emitting = value;
		if (this.__network) {
			this.__network.scheduleUpdate(this);
		}
	}

	/**
	 * Probe the network for the current value
	 */
	public probe() {
		if (this.__emitting != null) {
			return this.emitting;
		}
		if (this.__network === null) {
			return null;
		}
		return this.__network.probe();
	}

	/**
	 * Get the bit width of the connector
	 */
	public get bitWidth() {
		return this.__bitWidth;
	}

	/**
	 * Get the value currently being emitted by this connector
	 */
	public get emitting() {
		return this.__emitting;
	}
}
