import { expect } from "chai";
import "mocha";
import Project from "../src/emulator/Project";
import { loadProject } from "../src/loader";
import { bitCombinations, threeValuedAnd, threeValuedNand, threeValuedNor, threeValuedNot, threeValuedOr, threeValuedXnor, threeValuedXor } from "../src/util/logic";

/**
 * The project to work with and evaluate
 */
let project: Project;

describe("Emulation", () => {
	it("Load a project and compile circuits", async () => {
		project = await loadProject(`${__dirname}/circuits/a.circ`, async (file: string) => {
			return file;
		});
		expect(project.circuits).to.have.property("main");
	});
	it("Evaluate gates circuit", async () => {
		let circuit = project.circuits["gates"];
		let gates = [
			threeValuedAnd,
			threeValuedNand,
			threeValuedOr,
			threeValuedNor,
			threeValuedXor,
			threeValuedXnor
		];
		await bitCombinations(3, async (comb) => {
			for (let i = 0; i < gates.length; i++) {
				circuit.inputPinsLabeled[`${i}_A`][0].connector.emitSignal([comb[0]]);
				circuit.inputPinsLabeled[`${i}_B`][0].connector.emitSignal([comb[1]]);
				circuit.inputPinsLabeled[`${i}_C`][0].connector.emitSignal([comb[2]]);
			}
			await circuit.evaluate();
			for (let i = 0; i < gates.length; i++) {
				let actualSignal = circuit.outputPinsLabeled[`${i}`][0].probe();
				let expectedSignal = [gates[i]([comb[0], threeValuedNot(comb[1]), comb[2]])];
				expect(actualSignal).to.eql(expectedSignal, comb.toString());
			}
		});
		await bitCombinations(1, async (comb) => {
			circuit.inputPinsLabeled["6"][0].connector.emitSignal([comb[0]]);
			await circuit.evaluate();
			expect(circuit.outputPinsLabeled["6"][0].probe()).to.eql([threeValuedNot(comb[0])]);
		})
	});
	it("Evaluate comb circuit", async () => {
		let circuit = project.circuits["comb"];
		let inputA = circuit.inputPinsLabeled["A"][0];
		let inputB = circuit.inputPinsLabeled["B"][0];
		let inputC = circuit.inputPinsLabeled["C"][0];
		let output = circuit.outputPins[0];
		await bitCombinations(3, async (comb) => {
			inputA.connector.emitSignal([comb[0]]);
			inputB.connector.emitSignal([comb[1]]);
			inputC.connector.emitSignal([comb[2]]);
			await circuit.evaluate();
			expect(output.connector.probe()).to.eql([
				threeValuedOr([threeValuedNot(comb[2]), threeValuedAnd([comb[0], comb[1]])])
			], "Inputs Provided: " + comb.toString());
		});
	});
});
