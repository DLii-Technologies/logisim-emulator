import { IAttributeMap } from "../schematic";



export function getAttribute(attribute: string, attributes: IAttributeMap, defaultValue: string) {
	if (attribute in attributes) {
		return attributes[attribute];
	}
	return defaultValue;
}
