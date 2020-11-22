import { expect } from "chai";
import "mocha";
import { parseFile } from "../src";
import { Circuit } from "../src/emulator/Circuit";
import Project from "../src/emulator/Project";
import { loadProject } from "../src/loader";

/**
 * The project to work with and evaluate
 */
let project: Project;

describe("Emulation", () => {
	it("Load a project and compile circuits", async () => {
		project = await loadProject(`${__dirname}/circuits/a.circ`, async (file: string) => {
			return file;
		});
		// console.log(project);
	});
	// it("");
});
