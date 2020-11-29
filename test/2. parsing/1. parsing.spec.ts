import { expect } from "chai";
import "mocha";
import { parseFile } from "../../src";

describe("Parsing", () => {
	it("File error handling", async () => {
		let error: Error|undefined = undefined;
		try {
			await parseFile("../circuits/thisdoesnotexist.circ");
		} catch (err) {
			error = err;
		}
		expect(error).to.not.equal(undefined, "There was no error");
	});
	it("Parse a circuit file", async () => {
		let schematic = await parseFile(`${__dirname}/../circuits/misc.circ`);
		expect(schematic.source).to.equal("2.7.1");
		expect(schematic.version).to.equal("1.0");
		// expect(schematic.circuits.length).to.equal(5);
	});
});
