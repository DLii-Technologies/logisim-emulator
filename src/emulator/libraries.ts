import * as components from "./component";
import Component, { IComponentType } from "./component/Component";
import { BuiltinLibrary } from "./enums";

export interface ILibrary {
	[libraryName: string]: {
		[componentName: string]: IComponentType;
	};
}

export interface ILibraryMap {
	[id: string]: {
		[componentName: string]: IComponentType;
	}
}

/**
 * Load the list of builtin libraries
 */
export function loadBuiltinLibraries() {
	let libraries: ILibrary = {};
	for (let key of Object.values(BuiltinLibrary)) {
		libraries[key] = {}
	}
	for (let component of Object.values(components)) {
		if (component.LIB in libraries) {
			libraries[component.LIB][component.NAME] = component;
		} else {
			console.warn("Builtin library not found:", component.LIB);
		}
	}
	return libraries;
}
