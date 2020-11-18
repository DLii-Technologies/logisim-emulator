import { IComponent } from "../schematic";



export function getAttribute(attribute: string, schematic: IComponent, defaultValue: string) {
	if (attribute in schematic.attributes) {
		return schematic.attributes[attribute];
	}
	return defaultValue;
}
