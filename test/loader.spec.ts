import { expect } from "chai";
import "mocha";
import { loadProject } from "../src/loader";

describe("Loader", async () => {
	it("Loading a project", async () => {
		let project = await loadProject(`${__dirname}/circuits/a.circ`, async (file: string) => {
			console.log("Searching for external dependency...", file);
			return file;
		});
		console.log(project);
	});
});
