import Component, { IComponentType } from "../emulator/component/Component";

/**
 * Generate the key to uniquely map a component
 */
export function componentKey(component: typeof Component) {
	return [component.LIB || "null", component.NAME].toString();
}
