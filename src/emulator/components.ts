import { IComponentMap } from "./component/Component";

import * as components from "./component";

/**
 * Load all available components
 */
function loadComponents() {
	let componentMap: IComponentMap = {};
	for (let component of Object.values(components)) {
		componentMap[component.NAME] = component;
	}
	return componentMap;
}
