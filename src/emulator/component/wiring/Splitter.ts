import { IAttributeMap, IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { MIRROR_ROTATION, transform } from "../../../util/transform";
import { Port } from "../../core/Port";
import { BuiltinLibrary } from "../../enums";
import Component, { IConnector } from "../Component";

enum SplitterAppearance {
	LeftHanded  = "left",
	RightHanded = "right",
	Center      = "center",
	Legacy      = "legacy"
}

interface BitMap {
	portIndex: number;
	bitIndex: number;
}

export class Splitter extends Component
{
	/**
	 * The name of the component
	 */
	public static readonly NAME = "Splitter";

	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB = BuiltinLibrary.Wiring;

	/**
	 * The appearance of the splitter
	 */
	public readonly appearance: SplitterAppearance;

	/**
	 * The bit-width of the root connector
	 */
	public readonly bitWidth: number;

	/**
	 * The number of fans
	 */
	public fanOut: number;

	/**
	 * The root connector
	 */
	public rootConnector: Port;

	/**
	 * The fanned connectors
	 */
	public fannedConnectors: Port[] = [];

	/**
	 * Map bits from the main wire bundle to the fanned wires
	 */
	public fanMapping: (BitMap | null)[] = [];

	/**
	 * The bit-width for each of the fanned wires
	 */
	public fanBitWidths: number[] = [];

	/**
	 * Create a new splitter
	 */
	public constructor(schematic: IComponent) {
		super(schematic);
		this.bitWidth = parseInt(getAttribute("incoming", schematic.attributes, "2"));
		this.fanOut = parseInt(getAttribute("fanout", schematic.attributes, "2"));
		this.appearance = <SplitterAppearance>getAttribute("appear", schematic.attributes,
			SplitterAppearance.LeftHanded);
		this.rootConnector = this.addPort(0, 0, this.bitWidth);
		this.createFanMapping(schematic.attributes);
		this.createFanConnectors(schematic.attributes);
	}

	/**
	 * Map each bit in the splitter
	 */
	protected createFanMapping(attrs: IAttributeMap) {
		this.fanBitWidths = new Array<number>(this.fanOut).fill(0);
		for (let i = 0; i < this.bitWidth; i++) {
			let fanIndex = getAttribute(`bit${i}`, attrs, `${i}`);
			if (fanIndex != "none") {
				let index = parseInt(fanIndex);
				this.fanMapping.push({
					portIndex: index,
					bitIndex: this.fanBitWidths[index]++
				});
			} else {
				this.fanMapping.push(null);
			}
		}
	}

	/**
	 * Create the fann-out connectors
	 */
	protected createFanConnectors(attrs: IAttributeMap) {
		let dy: number;
		switch(this.appearance) {
			// left-handed/right-handed are just mirrors and can be done through transforms...
			case SplitterAppearance.LeftHanded:
				dy = -10*this.fanOut;
				break;
			case SplitterAppearance.RightHanded:
				dy = 10*this.fanOut;
				break;
			default:
				dy = -10 * Math.floor(this.fanOut / 2);
		}
		for (let i = 0; i < this.fanOut; i++) {
			this.addPort(20, 10*i + dy, this.fanBitWidths[i]);
		}
	}

	/**
	 * Splitters transform connectors based on the splitter type
	 */
	public get portsTransformed() {
		if (this.appearance in [SplitterAppearance.LeftHanded, SplitterAppearance.RightHanded]) {
			return super.portsTransformed;
		}
		let result: IConnector[] = [];
		for (let connector of this.ports) {
			let pos = transform(connector.position, this.position, MIRROR_ROTATION[this.facing]);
			result.push({
				port: connector.port,
				position: pos
			});
		}
		return result;
	}

	/**
	 * Invoked by the update handler
	 */
	public onUpdate() {
		// NO-OP
	}
}
