import { IProject } from "../schematic";
import { Circuit } from "./Circuit";
import Component, { IComponentMap } from "./component/Component";
import * as components from "./component";
import { componentKey } from "../util/component";

/**
 * Store a mapping of the circuits
 */
interface ICircuitMap {
	[name: string]: Circuit
};

export default class Emulator
{
	/**
	 * Store the list of circuits available
	 */
	protected circuits: ICircuitMap = {};

	/**
	 * Create a new emulator
	 */
	public constructor(project: IProject) {
		for (let circuit of project.circuits) {
			this.circuits[circuit.name] = new Circuit(circuit);
		}
		let components = this.loadComponents(this.circuits);
		for (let circuit of Object.values(this.circuits)) {
			circuit.compile(components, []);
		}
	}

	/**
	 * Load all available components
	 */
	protected loadComponents(circuits: ICircuitMap) {
		let componentMap: IComponentMap = {};
		for (let component of Object.values(components)) {
			let key = componentKey(component);
			componentMap[key] = component;
		}
		// for (let key in circuits) {
		// 	componentMap[key] = class extends Component {
		// 		public static readonly NAME = circuits[key].name;
		// 	}
		// }
		return componentMap;
	}
}
