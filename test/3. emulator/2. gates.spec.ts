import { expect } from "chai";
import "mocha";
import { step } from "mocha-steps";
import { AndGate } from "../../src/emulator";
import Project from "../../src/emulator/Project";
import { loadProject } from "../../src/loader";
import { Point } from "../../src/util/coordinates";
import { Bit, binaryBitCombinations, threeValuedAnd, threeValuedNand, threeValuedNor,
	threeValuedNot, threeValuedOr, threeValuedXnor, threeValuedXor } from "../../src/util/logic";

/**
 * The Logisim circuit file to load
 */
const CIRCUIT_FILE = `${__dirname}/../circuits/gates.circ`;

/**
 * The project to work with and evaluate
 */
let project: Project;

describe("Emulation: Gates", () => {
	step("Load a project and compile circuits", async () => {
		project = await loadProject(CIRCUIT_FILE, async (file: string) => {
			return file;
		});
		expect(project.circuits).to.have.property("gates");
	});
	step("Logic gate port coordinates and transforms", async () => {
		let gate: AndGate;
		let options = {location: new Point(0, 0), name: "AND Gate"};

		// Narrow logic gate with 2 inputs
		gate = new AndGate(Object.assign(options, {attributes: { "size": "30", "inputs": "2" }}));
		expect(gate.ports[1].position.equals(new Point(-30, -10))).to.be.true;
		expect(gate.ports[2].position.equals(new Point(-30,  10))).to.be.true;

		// Medium logic gate with 3 inputs
		gate = new AndGate(Object.assign(options, {attributes: { "size": "50", "inputs": "3" }}));
		expect(gate.ports[1].position.equals(new Point(-50, -20))).to.be.true;
		expect(gate.ports[2].position.equals(new Point(-50,   0))).to.be.true;
		expect(gate.ports[3].position.equals(new Point(-50,  20))).to.be.true;

		// Wide logic gate with 2 inputs
		gate = new AndGate(Object.assign(options, {attributes: { "size": "70", "inputs": "2" }}));
		expect(gate.ports[1].position.equals(new Point(-70, -20))).to.be.true;
		expect(gate.ports[2].position.equals(new Point(-70,  20))).to.be.true;

		// Wide logic gate with 3 inputs
		gate = new AndGate(Object.assign(options, {attributes: { "size": "70", "inputs": "3" }}));
		expect(gate.ports[1].position.equals(new Point(-70, -30))).to.be.true;
		expect(gate.ports[2].position.equals(new Point(-70,   0))).to.be.true;
		expect(gate.ports[3].position.equals(new Point(-70,  30))).to.be.true;

		// Wide logic gate with 4 inputs
		gate = new AndGate(Object.assign(options, {attributes: { "size": "70", "inputs": "4" }}));
		expect(gate.ports[1].position.equals(new Point(-70, -20))).to.be.true;
		expect(gate.ports[2].position.equals(new Point(-70,   0))).to.be.true;
		expect(gate.ports[3].position.equals(new Point(-70,  20))).to.be.true;
		expect(gate.ports[4].position.equals(new Point(-70,  40))).to.be.true;

		// Logic gate with >= 5 inputs
		gate = new AndGate(Object.assign(options, {attributes: { "size": "50", "inputs": "5" }}));
		expect(gate.ports[1].position.equals(new Point(-50, -20))).to.be.true;
		expect(gate.ports[2].position.equals(new Point(-50, -10))).to.be.true;
		expect(gate.ports[3].position.equals(new Point(-50,   0))).to.be.true;
		expect(gate.ports[4].position.equals(new Point(-50,  10))).to.be.true;
		expect(gate.ports[5].position.equals(new Point(-50,  20))).to.be.true;

		// Wide logic gate with 4 inputs facing West
		gate = new AndGate(Object.assign(options, {attributes: { "size": "70", "inputs": "4", "facing": "west"}}));
		expect(gate.portsTransformed[1].position.equals(new Point( 70, -20))).to.be.true;
		expect(gate.portsTransformed[2].position.equals(new Point( 70,   0))).to.be.true;
		expect(gate.portsTransformed[3].position.equals(new Point( 70,  20))).to.be.true;
		expect(gate.portsTransformed[4].position.equals(new Point( 70,  40))).to.be.true;

		// Wide logic gate with 4 inputs facing North
		gate = new AndGate(Object.assign(options, {attributes: { "size": "70", "inputs": "4", "facing": "north"}}));
		expect(gate.portsTransformed[1].position.equals(new Point(-20,  70))).to.be.true;
		expect(gate.portsTransformed[2].position.equals(new Point(  0,  70))).to.be.true;
		expect(gate.portsTransformed[3].position.equals(new Point( 20,  70))).to.be.true;
		expect(gate.portsTransformed[4].position.equals(new Point( 40,  70))).to.be.true;

		// Wide logic gate with 4 inputs facing South
		gate = new AndGate(Object.assign(options, {attributes: { "size": "70", "inputs": "4", "facing": "south"}}));
		expect(gate.portsTransformed[1].position.equals(new Point(-20, -70))).to.be.true;
		expect(gate.portsTransformed[2].position.equals(new Point(  0, -70))).to.be.true;
		expect(gate.portsTransformed[3].position.equals(new Point( 20, -70))).to.be.true;
		expect(gate.portsTransformed[4].position.equals(new Point( 40, -70))).to.be.true;
	});
	step("Evaluate gates circuit", async () => {
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
		await binaryBitCombinations(3, async (comb) => {
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
		await binaryBitCombinations(1, async (comb) => {
			circuit.inputPinsLabeled["6"][0].connector.emitSignal([comb[0]]);
			await circuit.evaluate();
			expect(circuit.outputPinsLabeled["6_A"][0].probe()).to.eql([comb[0]]);
			expect(circuit.outputPinsLabeled["6_B"][0].probe()).to.eql([threeValuedNot(comb[0])]);
		});

		// Controlled Buffer/NOT Gate
		for (let bit = 0; bit <= Bit.One; bit++) {
			circuit.inputPinsLabeled["7_B"][0].connector.emitSignal([bit]);
			await binaryBitCombinations(1, async (comb) => {
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
});
