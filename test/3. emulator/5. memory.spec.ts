import { expect } from "chai";
import "mocha";
import { step } from "mocha-steps";
import Project from "../../src/emulator/Project";
import { loadProject } from "../../src/loader";
import { Bit, bitCombinations, threeValuedNot } from "../../src/util/logic";

/**
 * The Logisim circuit file to load
 */
const CIRCUIT_FILE = `${__dirname}/../circuits/memory.circ`;

/**
 * The project to work with and evaluate
 */
let project: Project;

describe("Emulation", () => {
	step("Load a project and compile circuits", async () => {
		project = await loadProject(CIRCUIT_FILE, async (file: string) => {
			return file;
		});
		expect(project.circuits).to.have.property("register");
		expect(project.circuits).to.have.property("flip-flops");
	});
	step("Register: Rising/Falling Edge", async () => {
		let circuit = project.circuits["register"];
		let clock = circuit.inputPinsLabeled["Edge_Clock"][0];
		let input = circuit.inputPinsLabeled["Edge_In"][0];
		let load = circuit.inputPinsLabeled["Edge_Load"][0];
		let clear = circuit.inputPinsLabeled["Edge_Clear"][0];
		let outputRisingEdge = circuit.outputPinsLabeled["R_Edge_Out"][0];
		let outputFallingEdge = circuit.outputPinsLabeled["F_Edge_Out"][0];

		// Initial evaluation
		await circuit.evaluate();
		expect(outputRisingEdge.probe()[0]).to.equal(Bit.Zero, "Initial evaluation of rising-edge register failed");
		expect(outputFallingEdge.probe()[0]).to.equal(Bit.Zero, "Initial evaluation of falling-edge register failed");

		// Try all possible combinations of input/load/clock
		let resultsRisingEdge = [
			Bit.Zero, Bit.Zero, Bit.One,  Bit.One,
			Bit.One,  Bit.One, Bit.Zero,  Bit.Zero
		];
		let resultsFallingEdge = [
			Bit.Zero, Bit.Zero, Bit.Zero, Bit.One,
			Bit.One, Bit.One, Bit.One, Bit.Zero
		];
		let index = 0;
		await bitCombinations(3, async (comb) => {
			// Since the register starts at 0, negate some of the combinations to do 1 then 0 again
			input.connector.emitSignal([threeValuedNot(comb[0])]);
			load.connector.emitSignal([comb[1]]);
			clock.connector.emitSignal([threeValuedNot(comb[2])]);
			await circuit.evaluate();
			expect(outputRisingEdge.probe()[0]).to.equal(resultsRisingEdge[index],
			       "Unexpected output from rising-edge register: " + index.toString());
			expect(outputFallingEdge.probe()[0]).to.equal(resultsFallingEdge[index],
			       "Unexpected output from falling-edge register: " + index.toString());
			index++;
		});

		// Clear prevents loading
		clear.connector.emitSignal([Bit.One]);
		await bitCombinations(3, async (comb) => {
			// Since the register starts at 0, negate some of the combinations to do 1 then 0 again
			input.connector.emitSignal([threeValuedNot(comb[0])]);
			load.connector.emitSignal([comb[1]]);
			clock.connector.emitSignal([threeValuedNot(comb[2])]);
			await circuit.evaluate();
			expect(outputRisingEdge.probe()[0]).to.equal(Bit.Zero);
			expect(outputFallingEdge.probe()[0]).to.equal(Bit.Zero);
		});

		// Clear asynchronously clears
		clear.connector.emitSignal([Bit.Zero]);
		input.connector.emitSignal([Bit.One]);
		load.connector.emitSignal([Bit.One]);
		clock.connector.emitSignal([Bit.One]);
		await circuit.evaluate();
		clock.connector.emitSignal([Bit.Zero]);
		await circuit.evaluate();
		expect(outputRisingEdge.probe()[0]).to.equal(Bit.One);
		expect(outputFallingEdge.probe()[0]).to.equal(Bit.One);
		clear.connector.emitSignal([Bit.One]);
		await circuit.evaluate();
		expect(outputRisingEdge.probe()[0]).to.equal(Bit.Zero);
		expect(outputFallingEdge.probe()[0]).to.equal(Bit.Zero);
	});
	// step("General purpose register clearing", async () => {
	// 	let circuit = project.circuits["register"];
	// 	let clock = circuit.inputPinsLabeled["Register_Clock"][0];
	// 	let input = circuit.inputPinsLabeled["Register_In"][0];
	// 	let load = circuit.inputPinsLabeled["Register_Load"][0];
	// 	let clear = circuit.inputPinsLabeled["Register_Clear"][0];
	// 	let output = circuit.outputPinsLabeled["Register_Out"][0];

	// 	// Initial evaluation
	// 	await circuit.evaluate();
	// 	expect(output.probe()[0]).to.equal(Bit.Zero, "Initial evaluation of register failed");

	// 	// Load a 1 into the register
	// 	input.connector.emitSignal([Bit.One]);
	// 	await circuit.evaluate();
	// 	expect(output.probe()[0]).to.equal(Bit.One, "Bit didn't load");

	// 	// Show that non-1 signals don't clear the register
	// 	for (let bit of [Bit.Unknown, Bit.Error, Bit.Zero]) {
	// 		clear.connector.emitSignal([Bit.One]);
	// 		await circuit.evaluate();
	// 	}
	// });
	// step("Evaluate D/T Flip-Flops", async () => {
	// 	let circuit = project.circuits["memory"];
	// 	let clock = circuit.inputPinsLabeled["DT_FlipFlop_Clock"][0];
	// 	let input = circuit.inputPinsLabeled["DT_FlipFlop_Data"][0];
	// 	let outputHighD = circuit.outputPinsLabeled["D_Q1"][0];
	// 	let outputLowD = circuit.outputPinsLabeled["D_Q0"][0];
	// 	let outputHighT = circuit.outputPinsLabeled["T_Q1"][0];
	// 	let outputLowT = circuit.outputPinsLabeled["T_Q0"][0];

	// 	// Initial evaluation
	// 	await circuit.evaluate();
	// 	expect(outputHighD.probe()[0]).to.equal(Bit.Zero, "Initial evaluation of register failed");
	// 	expect(outputLowD.probe()[0]).to.equal(Bit.One, "Initial evaluation of register failed");
	// 	expect(outputHighT.probe()[0]).to.equal(Bit.Zero, "Initial evaluation of register failed");
	// 	expect(outputLowT.probe()[0]).to.equal(Bit.One, "Initial evaluation of register failed");

	// 	// Try all possible combinations of input/load/clock
	// 	let results = [
	// 		[Bit.Zero, Bit.Zero, Bit.One,  Bit.One],
	// 		[Bit.One,  Bit.One, Bit.Zero,  Bit.Zero]
	// 	];
	// 	let index = 0;
	// 	await bitCombinations(4, async (comb) => {
	// 		// Since the register starts at 0, negate some of the combinations to do 1 then 0 again
	// 		// input.connector.emitSignal([threeValuedNot(comb[0])]);
	// 		// load.connector.emitSignal([comb[1]]);
	// 		// clock.connector.emitSignal([threeValuedNot(comb[2])]);
	// 		// await circuit.evaluate();
	// 		// expect(output.probe()[0]).to.equal(results[index], "Unexpected output from register: " + index.toString());
	// 		index++;
	// 	});
	// });
});
