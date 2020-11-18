import { ICircuit, IProject } from "../schematic";
import { Circuit } from "./Circuit";
import { IComponentType } from "./component/Component";
import { CircuitComponent } from "./component/CircuitComponent";

/**
 * Map components to their appropriate libraries
 */
export interface ILibraryMap {
	[key: string]: {
		[name: string]: IComponentType
	}
}

/**
 * Store a mapping of the circuits
 */
interface ICircuitMap {
	[name: string]: Circuit
};

export default class Project
{
	/**
	 * References to the required libraries
	 */
	public libraries: ILibraryMap;

	/**
	 * Store the list of sub-projects
	 */
	public subProjects: Project[];

	/**
	 * Store the list of circuits available
	 */
	public circuits: ICircuitMap = {};

	/**
	 * Create a new project
	 */
	public constructor(project: IProject, libraries: ILibraryMap = {},
	                   subProjects: Project[] = [])
	{
		this.subProjects = subProjects;
		this.circuits = this.createCircuits(project.circuits);
		this.libraries = this.compileLibraries(this.circuits, libraries);
		this.compileCircuits(this.circuits, this.libraries);
	}

	/**
	 * Create all of the circuit instances
	 */
	protected createCircuits(schematics: ICircuit[]) {
		let circuits = {};
		for (let schematic of schematics) {
			this.circuits[schematic.name] = new Circuit(schematic);
		}
		return circuits;
	}

	/**
	 * Wrap the custom circuits into components and store them in the libraries
	 */
	protected compileLibraries(circuits: ICircuitMap, libraries: ILibraryMap) {
		libraries[""] = {};
		for (let name in circuits) {
			libraries[""][name] = class extends CircuitComponent {
				public static readonly NAME = name;
				public static readonly LIB  = "";
				public static readonly CIRCUIT = circuits[name];
			};
		}
		return libraries;
	}

	/**
	 * Compile all of the circuit objects
	 */
	protected compileCircuits(circuits: ICircuitMap, libraries: ILibraryMap) {
		for (let name in circuits) {
			circuits[name].compile(libraries);
		}
	}
}
