import { Line, Point } from "./util/coordinates";

/**
 * A mapping of attributes
 */
export interface IAttributeMap {
	[name: string]: string
}

/**
 * Store a parsed component
 */
export interface IComponent {
	attributes: IAttributeMap;
	lib      ?: string;
	name      : string;
	location  : Point;
}

/**
 * A parsed library
 */
export interface ILibrary {
	id        : string;
	path      : string;
	isExternal: boolean;
}

/**
 * A parsed circuit schematic
 */
export interface ICircuit {
	name      : string;
	label     : string;
	wires     : Line[];
	components: IComponent[];
}

/**
 * Store a parsed project
 */
export interface IProject {
	source   : string;
	version  : string;
	libraries: ILibrary[];
	circuits : ICircuit[];
}
