import { expect } from "chai";
import "mocha";
import Project from "../src/emulator/Project";
import { loadProject } from "../src/loader";
import { bitCombinations, threeValuedAnd, threeValuedOr } from "../src/util/logic";

/**
 * The project to work with and evaluate
 */
let project: Project;

describe.only("Emulation", () => {
	it("Load a project and compile circuits", async () => {
		project = await loadProject(`${__dirname}/circuits/a.circ`, async (file: string) => {
			return file;
		});
		expect(project.circuits).to.have.property("main");
	});
	it("Evaluate main circuit", async () => {
		let circuit = project.circuits["main"];
		let inputA = circuit.inputsPinsLabeled["A"][0];
		let inputB = circuit.inputsPinsLabeled["B"][0];
		let output = circuit.outputPins[0];
		bitCombinations(2, async (comb) => {
			inputA.connector.emitSignal([comb[0]]);
			inputB.connector.emitSignal([comb[1]]);
			await circuit.evaluate();
			expect(output.connector.probe()).to.eql([threeValuedAnd(...comb)]);
		});
	});
	it("Evaluate comb circuit", async () => {
		let circuit = project.circuits["comb"];
		let inputA = circuit.inputsPinsLabeled["A"][0];
		let inputB = circuit.inputsPinsLabeled["B"][0];
		let inputC = circuit.inputsPinsLabeled["C"][0];
		let output = circuit.outputPins[0];
		await bitCombinations(3, async (comb) => {
			inputA.connector.emitSignal([comb[0]]);
			inputB.connector.emitSignal([comb[1]]);
			inputC.connector.emitSignal([comb[2]]);
			await circuit.evaluate();
			expect(output.connector.probe()).to.eql([
				threeValuedOr(...[comb[2], threeValuedAnd(comb[0], comb[1])])
			], "Inputs Provided: " + comb.toString());
		});
	});
});
