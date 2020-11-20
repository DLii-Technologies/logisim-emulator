import assert from "assert";
import { EventEmitter } from "events";
import { Bit } from "../../util/logic";
import { Network } from "./Network";

/**
 * A connector can probe the connected network or emit signals onto the network.
 * Events triggered via emit trigger network updates.
 */
export class Connector extends EventEmitter {

	/**
	 * Store the network that this connector is connected to
	 */
	private __network: Network | null = null;

	/**
	 * The value currently being emitted onto the network by this connector
	 */
	private __signal: Bit[] = [];

	/**
	 * The number of bits this connector is compatible with
	 */
	private __bitWidth: number;

	/**
	 * Create a connector
	 */
	public constructor(bitWidth: number = 1) {
		super();
		this.__bitWidth = bitWidth;
		for (let i = 0; i < bitWidth; i++) {
			this.__signal.push(Bit.Unknown);
		}
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
	public emitSignal(signal: Bit[]) {
		assert(signal.length == this.__bitWidth, "Emitted signal width invalid");
		this.__signal = signal;
		if (this.__network) {
			this.emit("update", this.__network);
		}
	}

	/**
	 * Clear the outputting signal
	 */
	public clearSignal() {
		let signal = [];
		for (let i = 0; i < this.bitWidth; i++) {
			signal.push(Bit.Unknown);
		}
		this.emitSignal(signal);
	}

	/**
	 * Probe the network for the current value
	 */
	public probe() {
		if (this.network === null) {
			return this.signal;
		}
		return this.network.probe();
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
	public get signal() {
		return this.__signal;
	}

	/**
	 * Get the network this connector is attached to
	 */
	public get network() {
		return this.__network;
	}
}
