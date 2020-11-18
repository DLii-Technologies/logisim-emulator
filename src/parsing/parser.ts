import { readFile } from "fs";
import xml2js from "xml2js";
import { Line, Point } from "../util/coordinates";
import { IAttributeMap, ICircuit, IComponent, IProject } from "../schematic";
import { IAttributeXml, ICircuitXml, IComponentXml, ILibraryXml, ILogisimXml } from "./xmldom";
import { basename } from "path";

/**
 * Parse the given XML string
 */
export function parse(xmlString: xml2js.convertableToString) {
	return new Promise<IProject>(async (resolve) => {
		let parser = new xml2js.Parser();
		let xml = await parser.parseStringPromise(xmlString);
		resolve(constructProjectSchematic(xml));
	});
}

/**
 * Parse a Logisim circuit file
 */
export function parseFile(file: string) {
	return new Promise<IProject>((resolve, reject) => {
		readFile(file, (err, data) => {
			if (err) {
				reject(err);
			} else {
				parse(data).then(resolve).catch(reject);
			}
		});
	});
}

// -------------------------------------------------------------------------------------------------

/**
 * Parse the attributes for a section of the circuit XML
 */
function parseAttributes(xml: IAttributeXml[]) {
	let attributes: IAttributeMap = {};
	for (let attribute of xml) {
		attributes[attribute.$.name] = attribute.$.val;
	}
	return attributes;
}

/**
 * Construct the project schematic
 */
function constructProjectSchematic(xml: ILogisimXml) {
	let project: IProject = {
		source: xml.project.$.source,
		version: xml.project.$.version,
		libraries: [],
		circuits: []
	};
	for (let lib of xml.project.lib) {
		project.libraries.push(constructLibrary(lib));
	}
	for (let circuit of xml.project.circuit) {
		project.circuits.push(constructCircuit(circuit));
	}
	return project;
}

/**
 * Construct a library schematic
 */
function constructLibrary(xml: ILibraryXml) {
	let [isExternal, desc] = xml.$.desc.split('#');
	return {
		id: xml.$.name,
		path: desc,
		isExternal: Boolean(isExternal)
	};
}

/**
 * Construct a ciruit schematic
 */
function constructCircuit(xml: ICircuitXml) {
	let circuit: ICircuit = {
		name: xml.$.name,
		label: "",
		wires: [],
		components: []
	};
	let attributes = parseAttributes(xml.a || []);
	if ("clabel" in attributes) {
		circuit.label = attributes["clabel"];
	}
	for (let wire of (xml.wire || [])) {
		let line = new Line(Point.fromString(wire.$.to), Point.fromString(wire.$.from));
		circuit.wires.push(line);
	}
	for (let component of (xml.comp || [])) {
		circuit.components.push(constructComponent(component));
	}
	return circuit;
}

/**
 * Construct a component schematic
 */
function constructComponent(xml: IComponentXml) {
	let component: IComponent = {
		attributes: parseAttributes(xml.a || []),
		lib: xml.$.lib,
		name: xml.$.name,
		key: [xml.$.lib, xml.$.name].toString(),
		location: Point.fromString(xml.$.loc)
	};
	return component;
}
