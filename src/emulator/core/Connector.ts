import assert from "assert";
import { arraysAreEqual } from "../../util";
import { Bit, threeValuedMerge } from "../../util/logic";
import Component from "../component/Component";
import { Updatable } from "../mixins/Updatable";
import { Network } from "./Network";

/**
 * A connector can probe the connected network or emit signals onto the network.
 * Events triggered via emit trigger network updates.
 */
export class Connector {

	/**
	 * Store a reference to the component that this connector belongs to
	 */
	private __component: Component;

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
	 * Determine if this connector should update the component from signal changes
	 */
	private readonly __mute;

	/**
	 * Create a connector
	 */
	public constructor(component: Component, bitWidth: number = 1, mute: boolean = false) {
		this.__component = component;
		this.__bitWidth = bitWidth;
		this.__mute = mute;
		for (let i = 0; i < bitWidth; i++) {
			this.__signal.push(Bit.Unknown);
		}
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Schedule an update for this connector's component
	 */
	public scheduleUpdate() {
		if (!this.__mute) {
			this.component.scheduleUpdate();
		}
	}

	// ---------------------------------------------------------------------------------------------

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
		if (arraysAreEqual(signal, this.__signal)) {
			return;
		}
		assert(signal.length == this.__bitWidth, "Emitted signal width invalid");
		this.__signal = signal;
		if (this.__network) {
			this.__network.scheduleUpdate();
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
		return threeValuedMerge(this.signal, this.network.signal);
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the bit width of the connector
	 */
	public get bitWidth() {
		return this.__bitWidth;
	}

	/**
	 * Get a reference to the component this connector belongs to
	 */
	public get component() {
		return this.__component;
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
