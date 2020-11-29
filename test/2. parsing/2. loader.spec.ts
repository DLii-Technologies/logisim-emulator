import { expect } from "chai";
import { assert } from "console";
import "mocha";
import Project from "../../src/emulator/Project";
import { loadProject } from "../../src/loader";

describe("Loader", async () => {
	it("Loading a project", async () => {
		let error: Error|undefined = undefined;
		let project: Project;
		try {
			project = await loadProject(`${__dirname}/../circuits/misc.circ`, async (file: string) => {
				console.log("Searching for external dependency...", file);
				return file;
			});
			for (let circuit of Object.values(project.circuits)) {
				expect(circuit.isCompiled).to.equal(true, "Circuit not compiled");
			}
		} catch (e) {
			error = e;
		}
		expect(error).to.equal(undefined, "Failed to load test project");
	});
});
