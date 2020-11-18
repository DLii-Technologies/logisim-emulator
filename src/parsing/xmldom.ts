/**
 * An attribute XML element
 */
export interface IAttributeXml {
	$: {
		name : string;
		val: string;
	}
}

/**
 * A library XML element
 */
export interface ILibraryXml {
	$: {
		desc: string;
		name: string;
	}
}

/**
 * A wire XML element
 */
export interface IWireXml {
	$: {
		from: string,
		to  : string
	}
}

/**
 * A component XML element
 */
export interface IComponentXml {
	a?: IAttributeXml[];
	$ : {
		lib : string;
		loc : string;
		name: string;
		[key: string]: string;
	},
}

/**
 * A circuit XML element
 */
export interface ICircuitXml {
	$    : { name: string };
	a   ?: IAttributeXml[];
	wire?: IWireXml[];
	comp?: IComponentXml[];
};

/**
 * A Logisim XML document
 */
export interface ILogisimXml {
	project: {
		$: {
			source : string;
			version: string;
		};
		lib    : ILibraryXml[];
		circuit: ICircuitXml[];
	}
};
