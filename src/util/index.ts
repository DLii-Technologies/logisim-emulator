import { IAttributeMap } from "../schematic";

/**
 * Get the attribute from an attribute map and provide a default value
 */
export function getAttribute(attribute: string, attributes: IAttributeMap, defaultValue: string) {
	if (attribute in attributes) {
		return attributes[attribute];
	}
	return defaultValue;
}

/**
 * Determine if two arrays are equivalent
 */
export function arraysAreEqual(a: any[], b: any[]) {
	if (a.length != b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i++) {
		if (a[i] != b[i]) {
			return false;
		}
	}
	return true;
}
