import { expect } from "chai";
import "mocha";
import { parseFile } from "../src";
import { Circuit } from "../src/emulator/Circuit";
import Emulator from "../src/emulator/Emulator";

describe("Circuits", () => {
	it("Circuit compilation", async () => {
		let schematic = await parseFile(`${__dirname}/circuits/a.circ`);
		let emulator = new Emulator(schematic);
	});
});
