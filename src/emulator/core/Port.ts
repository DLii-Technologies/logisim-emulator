import assert from "assert";
import { arraysAreEqual } from "../../util";
import { Bit, threeValuedMerge } from "../../util/logic";
import Component from "../component/Component";
import { Connector } from "./Connector";
import { Network } from "./Network";

/**
 * A connector can probe the connected network or emit signals onto the network.
 * Events triggered via emit trigger network updates.
 */
export class Port {

	/**
	 * Store a reference to the component that this connector belongs to
	 */
	public readonly component: Component;

	/**
	 * The network this port is associated with
	 */
	protected __network: Network | null = null;

	/**
	 * The list of connectors within this port
	 */
	private __connectors: Connector[] = [];

	/**
	 * The value currently being emitted onto the network by this connector
	 */
	private __signal: Bit[] = [];

	/**
	 * Determine if this connector should update the component from signal changes
	 */
	private readonly __mute: boolean;

	/**
	 * Create a connector
	 */
	public constructor(component: Component, bitWidth: number = 1, mute: boolean = false) {
		this.component = component;
		this.__mute = mute;
		for (let i = 0; i < bitWidth; i++) {
			this.__connectors.push(new Connector(this, i));
			this.__signal.push(Bit.Unknown);
		}
	}

	/**
	 * Connect this port to a network
	 */
	public connect(network: Network) {
		this.__network = network;
		for (let i = 0; i < this.bitWidth; i++) {
			this.__network.wires[i].connect(this.__connectors[i]);
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
	 * Emit a value into the connected network
	 */
	public emitSignal(signal: Bit[]) {
		if (arraysAreEqual(signal, this.signal)) {
			return;
		}
		assert(signal.length == this.signal.length, "Emitted signal width invalid");
		for (let i = 0; i < signal.length; i++) {
			if (signal[i] != this.signal[i]) {
				this.signal[i] = signal[i];
				this.__connectors[i].update();
			}
		}
	}

	/**
	 * Emit an error signal across all connectors
	 */
	public emitErrorSignal() {
		let signal = new Array(this.bitWidth).fill(Bit.Error);
		this.emitSignal(signal);
	}

	/**
	 * Clear the outputting signal
	 */
	public clearSignal() {
		let signal = new Array(this.bitWidth).fill(Bit.Unknown);
		this.emitSignal(signal);
	}

	/**
	 * Probe the network for the current value
	 */
	public probe() {
		let probedSignal: Bit[] = [];
		for (let connector of this.__connectors) {
			probedSignal.push(connector.probe());
		}
		return probedSignal;
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the connectors that belong to this port
	 */
	public get connectors() {
		return this.__connectors;
	}

	/**
	 * Determine if the port is connected to a network
	 */
	public get isConnected() {
		return this.__network !== null;
	}

	/**
	 * Get the bit width of the connector
	 */
	public get bitWidth() {
		return this.__connectors.length;
	}

	/**
	 * Get the network this port belongs to
	 */
	public get network() {
		return this.__network;
	}

	/**
	 * Get the value currently being emitted by this connector
	 */
	public get signal() {
		return this.__signal;
	}
}
