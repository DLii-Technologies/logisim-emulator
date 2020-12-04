import { IComponent } from "../schematic";

/**
 * Get the attribute from an attribute map and provide a default value
 */
export function getAttribute(attribute: string, schematic: IComponent, defaultValue: string) {
	if (attribute in schematic.attributes) {
		return schematic.attributes[attribute];
	}
	return defaultValue;
}


