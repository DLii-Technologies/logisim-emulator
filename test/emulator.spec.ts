import { expect } from "chai";
import "mocha";
import Project from "../src/emulator/Project";
import { loadProject } from "../src/loader";
import { Bit, bitCombinations, threeValuedAnd, threeValuedNand, threeValuedNor, threeValuedNot, threeValuedOr, threeValuedXnor, threeValuedXor } from "../src/util/logic";

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
		expect(project.circuits["main"].outputPinsLabeled["test"][0].probe()).to.eql([Bit.One, Bit.One]);
	});
	it("Evaluate gates circuit", async () => {
		let circuit = project.circuits["gates"];
		let gates = [
			threeValuedAnd,
			threeValuedNand,
			threeValuedOr,
			threeValuedNor,
			threeValuedXor,
			threeValuedXnor,
		];

		// Logic gates (AND, NAND, OR, NOR, XOR, XNOR)
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

		// Buffer/NOT Gate
		await bitCombinations(1, async (comb) => {
			circuit.inputPinsLabeled["6"][0].connector.emitSignal([comb[0]]);
			await circuit.evaluate();
			expect(circuit.outputPinsLabeled["6_A"][0].probe()).to.eql([comb[0]]);
			expect(circuit.outputPinsLabeled["6_B"][0].probe()).to.eql([threeValuedNot(comb[0])]);
		});

		// Controlled Buffer/NOT Gate
		for (let bit = 0; bit <= Bit.One; bit++) {
			circuit.inputPinsLabeled["7_B"][0].connector.emitSignal([bit]);
			await bitCombinations(1, async (comb) => {
				circuit.inputPinsLabeled["7_A"][0].connector.emitSignal([comb[0]]);
				await circuit.evaluate();
				if (bit == Bit.One) {
					expect(circuit.outputPinsLabeled["7_A"][0].probe()).to.eql([comb[0]]);
					expect(circuit.outputPinsLabeled["7_B"][0].probe()).to.eql([threeValuedNot(comb[0])]);
				} else if (bit == Bit.Zero) {
					expect(circuit.outputPinsLabeled["7_A"][0].probe()).to.eql([Bit.Unknown], "7_A should be unknown");
					expect(circuit.outputPinsLabeled["7_B"][0].probe()).to.eql([Bit.Unknown], "7_B should be unknown");
				} else {
					expect(circuit.outputPinsLabeled["7_A"][0].probe()).to.eql([Bit.Error], "7_A should be error");
					expect(circuit.outputPinsLabeled["7_B"][0].probe()).to.eql([Bit.Error], "7_B should be error");
				}
			});
		}
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
	it("Evaluate splitter circuit", async () => {
		let circuit = project.circuits["splitters"];
		let input = circuit.inputPinsLabeled["Input"][0];
		let outA = circuit.outputPinsLabeled["A"][0];
		let outB = circuit.outputPinsLabeled["B"][0];
		await bitCombinations(2, async (comb) => {
			input.connector.emitSignal(comb);
			await circuit.evaluate();
			expect(outA.connector.probe()).to.eql([comb[0]], "A; Inputs Provided: " + comb.toString());
			expect(outB.connector.probe()).to.eql([comb[1]], "B; Inputs Provided: " + comb.toString());
		});
	});
});
