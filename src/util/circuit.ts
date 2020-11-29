import assert from "assert";
import { Network, Port, Wire } from "../emulator";

/**
 * Merge two wires together (B into A). Disconnects B from everything
 */
export function mergeWires(networkA: Network, wireA: number, networkB: Network, wireB: number) {
	for (let connector of networkB.wires[wireB].connectors) {
		networkB.wires[wireB].disconnect(connector);
		networkA.wires[wireA].connect(connector);
	}
	networkB.wires[wireB] = networkA.wires[wireA];
}

/**
 * Merge two networks together (B into A)
 */
export function mergeNetworks(networkA: Network, networkB: Network) {
	assert(networkA.bitWidth == networkB.bitWidth, "Can't merge networks with differing bit width");
	for (let i = 0; i < networkA.bitWidth; i++) {
		mergeWires(networkA, i, networkB, i);
		networkB.wires[i] = networkA.wires[i];
	}
}

/**
 * Merge two networks together (B into A) via two ports. The ports will be disconnected after
 */
// export function mergeNetworksByPorts(portA: Port, portB: Port) {
// 	assert(portA.network !== null && portB.network !== null, "Ports must have networks to merge");
// 	let networkA = portA.network;
// 	let networkB = portB.network;
// 	portA.disconnect();
// 	portB.disconnect();
// 	mergeNetworks(networkA, networkB);
// }
