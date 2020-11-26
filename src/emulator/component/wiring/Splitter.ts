import { IAttributeMap, IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { mergeWires } from "../../../util/circuit";
import { Point } from "../../../util/coordinates";
import { Axis, Facing } from "../../../util/transform";
import { Network } from "../../core/Network";
import { Port } from "../../core/Port";
import { Wire } from "../../core/Wire";
import { BuiltinLibrary } from "../../enums";
import Component, { IConnector } from "../Component";

enum SplitterAppearance {
	Left  = "left",
	Right = "right",
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
		this.bitWidth = parseInt(getAttribute("incoming", schematic, "2"));
		this.fanOut = parseInt(getAttribute("fanout", schematic, "2"));
		this.appearance = <SplitterAppearance>getAttribute("appear", schematic,
			SplitterAppearance.Left);
		this.rootConnector = this.addPort(0, 0, this.bitWidth);
		this.createFanMapping(schematic);
		this.createFanConnectors(schematic);
	}

	/**
	 * Map each bit in the splitter
	 */
	protected createFanMapping(schematic: IComponent) {
		this.fanBitWidths = new Array<number>(this.fanOut).fill(0);
		for (let i = 0; i < this.bitWidth; i++) {
			let fanIndex = getAttribute(`bit${i}`, schematic, `${i}`);
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
	protected createFanConnectors(schematic: IComponent) {
		let dy: number;
		switch(this.appearance) {
			// left-handed/right-handed are just mirrors and can be done through transforms...
			case SplitterAppearance.Left:
			case SplitterAppearance.Right:
				dy = -10*this.fanOut;
				break;
			default:
				dy = -10 * Math.floor(this.fanOut / 2);
		}
		for (let i = 0; i < this.fanOut; i++) {
			this.fannedConnectors.push(this.addPort(20, 10*i + dy, this.fanBitWidths[i]));
		}
	}

	/**
	 * Splitters transform connectors based on the splitter type
	 *
	 * @note This function is absolutely disgusting. Splitters in Logisim are absolutely disgusting
	 *       and I blame them for this result here. Left and Right splitters appear to rotate, but
	 *       the bits do not??? For real???
	 */
	public get portsTransformed() {
		let result: IConnector[] = [];
		let transform: (p: Point) => Point;
		if (this.appearance == SplitterAppearance.Left) {
			transform = this.transformLeft.bind(this);
		} else if (this.appearance == SplitterAppearance.Right) {
			transform = this.transformRight.bind(this);
		} else {
			transform = this.transformCenter.bind(this);
		}
		for (let connector of this.ports) {
			let pos = connector.position;
			if (connector.position.x != 0 || connector.position.y != 0) {
				pos = transform(connector.position);
			}
			result.push({
				port: connector.port,
				position: pos.add(this.position)
			});
		}
		return result;
	}

	/**
	 * Transform a coordinate for left-handed splitters
	 */
	protected transformLeft(point: Point) {
		let offset = point;
		if ([Facing.West, Facing.North].includes(this.facing)) {
			offset = offset.flip(Axis.Y).add(0, -10*this.fanOut - 10);
		}
		return offset.rotate(this.facing);
	}

	/**
	 * Transform a coordinate for right-handed splitters
	 */
	protected transformRight(point: Point) {
		let offset = point.add(0, 10*this.fanOut + 10);
		if ([Facing.West, Facing.North].includes(this.facing)) {
			offset = offset.flip(Axis.Y).add(0, 10*this.fanOut + 10);
		}
		return offset.rotate(this.facing);
	}

	/**
	 * Transform a coordinate for center/legacy splitters
	 */
	protected transformCenter(point: Point) {
		let offset = point;
		if (this.facing == Facing.South || this.facing == Facing.North) {
			offset = offset.rotate(Facing.South);
			if (this.fanOut % 2 == 0) {
				offset = offset.add(-10, 0);
			}
			if (this.facing == Facing.North) {
				offset = offset.flip(Axis.Y);
			}
		}
		if (this.facing == Facing.West) {
			offset = offset.flip(Axis.X);
		}
		return offset;
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Merge wires in the networks
	 */
	public dissolve() {
		if (!this.rootConnector.network) {
			return;
		}
		let rootWires = this.rootConnector.network.wires;
		for (let i = 0; i < rootWires.length; i++) {
			let mapping = this.fanMapping[i];
			if (mapping) {
				let network = this.fannedConnectors[mapping.portIndex].network;
				if (network) {
					mergeWires(this.rootConnector.network, i, network, mapping.bitIndex);
				}
			}
		}
	}

	/**
	 * Invoked by the update handler
	 */
	public onUpdate() {
		// NO-OP
	}
}
