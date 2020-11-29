import { expect } from "chai";
import "mocha";
import { loadProject } from "../../src/loader";

describe("Loader", async () => {
	it("Loading a project", async () => {
		let error: Error|undefined = undefined;
		try {
			let project = await loadProject(`${__dirname}/../circuits/gates.circ`, async (file: string) => {
				console.log("Searching for external dependency...", file);
				return file;
			});
		} catch (e) {
			error = e;
		}
		expect(error).to.equal(undefined, "Failed to load test project");
	});
});
