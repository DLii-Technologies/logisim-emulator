import { expect } from "chai";
import "mocha";
import { step } from "mocha-steps";
import Project from "../../src/emulator/Project";
import { loadProject } from "../../src/loader";
import { Bit, binaryBitCombinations, signalCombinations,
	threeValuedNot } from "../../src/util/logic";

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
	it("Register: Rising/Falling Edge", async () => {
		let circuit = project.circuits["register"];
		let clock = circuit.inputPinsLabeled["Edge_Clock"][0];
		let input = circuit.inputPinsLabeled["Edge_In"][0];
		let load = circuit.inputPinsLabeled["Edge_Load"][0];
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
		await binaryBitCombinations(3, async (comb) => {
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
	});
	it("Register: High/Low Level", async () => {
		let circuit = project.circuits["register"];
		let clock = circuit.inputPinsLabeled["Level_Clock"][0];
		let input = circuit.inputPinsLabeled["Level_In"][0];
		let load = circuit.inputPinsLabeled["Level_Load"][0];
		let outputHigh = circuit.outputPinsLabeled["H_Level_Out"][0];
		let outputLow = circuit.outputPinsLabeled["L_Level_Out"][0];

		// Try all possible combinations of input/load/clock
		let results = [
			Bit.Zero, Bit.Zero, Bit.Zero, Bit.One,  Bit.One,  Bit.One,  Bit.Zero, Bit.One, // Clock: 1; load: X
			Bit.One,  Bit.One,  Bit.Zero, Bit.One,  Bit.One,  Bit.One,  Bit.Zero, Bit.One, // Clock: 1; load: E
			Bit.One,  Bit.One,  Bit.One,  Bit.One,  Bit.One,  Bit.One,  Bit.One,  Bit.One, // Clock: 1; load: 0
			Bit.One,  Bit.One,  Bit.Zero, Bit.One,  Bit.One,  Bit.One,  Bit.Zero, Bit.One, // Clock: 1; load: E
		];
		let highIndex = 0;
		let lowIndex = 0;
		await signalCombinations(2, async (comb) => {
			// Since the register starts at 0, negate some of the combinations to do 1 then 0 again
			clock.connector.emitSignal([comb[0]]);
			load.connector.emitSignal([comb[1]]);
			for (let i = 0; i < 2; i++) {
				for (let data of [Bit.Unknown, Bit.Error, Bit.Zero, Bit.One]) {
					input.connector.emitSignal([data]);
					await circuit.evaluate();

					// Evaluate high-level register
					if (comb[0] == Bit.One) {
						expect(outputHigh.probe()[0]).to.equal(results[highIndex],
							"Unexpected output from high-level register: " + highIndex.toString());
						highIndex++;
					} else {
						expect(outputHigh.probe()[0]).to.equal(Bit.Zero,
							"Unexpected output from high-level register: " + (highIndex - 1).toString());
					}

					// Evaluate low-level register
					if (comb[0] == Bit.Zero) {
						expect(outputLow.probe()[0]).to.equal(results[lowIndex],
							"Unexpected output from high-level register: " + lowIndex.toString());
						lowIndex++;
					} else {
						expect(outputLow.probe()[0]).to.equal(comb[0] == Bit.One? Bit.One: Bit.Zero,
							"Unexpected output from high-level register: " + highIndex.toString());
					}
				}
			}
		});
	});
	it("Register: Asynchronous clearing", async () => {
		let circuit = project.circuits["register"];
		let clock = circuit.inputPinsLabeled["Edge_Clock"][0];
		let input = circuit.inputPinsLabeled["Edge_In"][0];
		let load = circuit.inputPinsLabeled["Edge_Load"][0];
		let clear = circuit.inputPinsLabeled["Edge_Clear"][0];
		let outputRisingEdge = circuit.outputPinsLabeled["R_Edge_Out"][0];
		let outputFallingEdge = circuit.outputPinsLabeled["F_Edge_Out"][0];

		// Clear prevents loading
		clear.connector.emitSignal([Bit.One]);
		await binaryBitCombinations(3, async (comb) => {
			// Since the register starts at 0, negate some of the combinations to do 1 then 0 again
			input.connector.emitSignal([threeValuedNot(comb[0])]);
			load.connector.emitSignal([comb[1]]);
			clock.connector.emitSignal([threeValuedNot(comb[2])]);
			await circuit.evaluate();
			expect(outputRisingEdge.probe()[0]).to.equal(Bit.Zero);
			expect(outputFallingEdge.probe()[0]).to.equal(Bit.Zero);
		});

		// Load a 1 into both registors
		clear.connector.emitSignal([Bit.Zero]);
		input.connector.emitSignal([Bit.One]);
		load.connector.emitSignal([Bit.One]);
		clock.connector.emitSignal([Bit.One]);
		await circuit.evaluate();
		clock.connector.emitSignal([Bit.Zero]);
		await circuit.evaluate();
		expect(outputRisingEdge.probe()[0]).to.equal(Bit.One);
		expect(outputFallingEdge.probe()[0]).to.equal(Bit.One);

		// Clear the register using the clear pin
		clear.connector.emitSignal([Bit.One]);
		await circuit.evaluate();
		expect(outputRisingEdge.probe()[0]).to.equal(Bit.Zero);
		expect(outputFallingEdge.probe()[0]).to.equal(Bit.Zero);
	});
});
