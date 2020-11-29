import { expect } from "chai";
import "mocha";
import { step } from "mocha-steps";
import Project from "../../src/emulator/Project";
import { loadProject } from "../../src/loader";
import { Bit, bitCombinations, threeValuedMerge } from "../../src/util/logic";

/**
 * The Logisim circuit file to load
 */
const CIRCUIT_FILE = `${__dirname}/../circuits/wiring.circ`;

/**
 * The project to work with and evaluate
 */
let project: Project;

describe("Emulation: Wiring and Networking", () => {
	step("Load the wiring circuit project", async () => {
		project = await loadProject(CIRCUIT_FILE, async (file: string) => {
			return file;
		});
		expect(project.circuits).to.have.property("splitters");
		expect(project.circuits).to.have.property("tunnels");
		expect(project.circuits).to.have.property("wiring");
	});
	step("Input/output pins", async () => {
		let circuit = project.circuits["wiring"];
		for (let i = 0; i < 3; i++) {
			expect(circuit.inputPinsLabeled[`${i}`]).to.have.lengthOf(1);
			expect(circuit.outputPinsLabeled[`${i}`]).to.have.lengthOf(1);
			for (let bit of [Bit.Unknown, Bit.Error, Bit.Zero, Bit.One]) {
				circuit.inputPinsLabeled[`${i}`][0].connector.emitSignal([bit]);
				await circuit.evaluate();
				expect(circuit.outputPinsLabeled[`${i}`][0].probe()).to.eql([bit], `Pins failed: ${i}`);
			}
		}
	});
	step("Conflicting wires", async () => {
		let circuit = project.circuits["wiring"];
		let bits = [Bit.Unknown, Bit.Error, Bit.Zero, Bit.One];
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				circuit.inputPinsLabeled["3"][0].connector.emitSignal([bits[i]]);
				circuit.inputPinsLabeled["3"][1].connector.emitSignal([bits[j]]);
				await circuit.evaluate();
				expect(circuit.outputPinsLabeled["3"][0].probe()).to.eql(threeValuedMerge([bits[i]], [bits[j]]));
			}
		}
	});
	step("Constant pins", async () => {
		let circuit = project.circuits["wiring"];
		expect(circuit.outputPinsLabeled["4"][0].probe()).to.eql([Bit.One, Bit.One]);
	});
	step("Tunnels", async () => {
		let circuit = project.circuits["tunnels"];
		for (let bit of [Bit.Unknown, Bit.Error, Bit.Zero, Bit.One]) {
			circuit.inputPinsLabeled["0"][0].connector.emitSignal([bit]);
			await circuit.evaluate();
			expect(circuit.outputPinsLabeled["0"][0].probe()).to.eql([bit]);
		}
	});
	step("Multiple tunnels", async () => {
		let circuit = project.circuits["tunnels"];
		let bits = [Bit.Unknown, Bit.Error, Bit.Zero, Bit.One];
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				circuit.inputPinsLabeled["1"][0].connector.emitSignal([bits[i]]);
				circuit.inputPinsLabeled["1"][1].connector.emitSignal([bits[j]]);
				await circuit.evaluate();
				expect(circuit.outputPinsLabeled["0"][0].probe()).to.eql([Bit.One]); // ensure tunnels match
				expect(circuit.outputPinsLabeled["1"][0].probe()).to.eql(threeValuedMerge([bits[i]], [bits[j]]));
				expect(circuit.outputPinsLabeled["1"][1].probe()).to.eql(threeValuedMerge([bits[i]], [bits[j]]));
			}
		}
	});
	step("Splitters", async () => {
		let circuit = project.circuits["splitters"];
		let types = ["LH", "RH", "C", "L"]; // left-handed, right-handed, center, legacy
		await bitCombinations(2, async (comb) => {
			for (let type of types) {
				for (let i = 0; i < 4; i++) {
					circuit.inputPinsLabeled[`${type}_${i}`][0].connector.emitSignal(comb);
				}
			}
			circuit.evaluate();
			for (let type of types) {
				for (let i = 0; i < 4; i++) {
					expect(circuit.outputPinsLabeled[`${type}_${i}_A`][0].probe()).to.eql([comb[0]]);
					expect(circuit.outputPinsLabeled[`${type}_${i}_B`][0].probe()).to.eql([comb[1]]);
				}
			}
		});
	});
});
