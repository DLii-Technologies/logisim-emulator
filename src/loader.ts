import { existsSync } from "fs";
import { basename, dirname, join, normalize } from "path";
import { loadBuiltinLibraries } from "./emulator/libraries";
import Project, { ILibraryMap } from "./emulator/Project";
import { parseFile } from "./parsing";


/**
 * Load a Logisim project
 */
export async function loadProject(file: string, findDepend?: (file: string) => Promise<string>) {
	let allLibraries = loadBuiltinLibraries();
	let libraries: ILibraryMap = {};
	let subProjects: Project[] = [];
	let schematic = await parseFile(file);
	for (let lib of schematic.libraries) {
		if (lib.isExternal) {
			let path = normalize(join(dirname(file), lib.path));
			if (!existsSync(path)) {
				if (findDepend) {
					path = await findDepend(lib.path);
				} else {
					path = basename(path);
				}
			}
			let project = await loadProject(path, findDepend);
			libraries[`${Object.keys(libraries).length}`] = project.libraries[""];
			subProjects.push(project);
		} else {
			libraries[`${Object.keys(libraries).length}`] = allLibraries[lib.path];
		}
	}
	let project = new Project(schematic, libraries, subProjects);
	await project.compileCircuits();
	return project;

}
