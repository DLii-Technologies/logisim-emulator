import { IAttributeMap, IComponent } from "../../../schematic";
import { getAttribute } from "../../../util";
import { Point } from "../../../util/coordinates";
import { Bit, threeValuedNot, transpose } from "../../../util/logic";
import { Axis, Facing } from "../../../util/transform";
import { Port } from "../../core/Port";
import { BuiltinLibrary } from "../../enums";
import Component, { IConnector } from "../Component";

export abstract class LogicGate extends Component
{
	/**
	 * Indicate the library the circuit component resides
	 */
	public static readonly LIB = BuiltinLibrary.Gates;

	/**
	 * Add additional width for certain gates
	 */
	protected bonusWidth = 0;

	/**
	 * Indicate the negated inputs
	 */
	protected negated: Boolean[] = [];

	/**
	 * Indicate if the gate negates the output
	 */
	protected negateOutput = false;

	/**
	 * Input connectors
	 */
	protected inputs: Port[] = [];

	/**
	 * Output connectors
	 */
	protected output: Port;

	/**
	 * The size of the gate
	 */
	protected size: number;

	/**
	 * The number of inputs to the agte
	 */
	protected numInputs: number;

	/**
	 * The bitwidth of the gate
	 */
	protected bitWidth: number;

	/**
	 * Create a logic gate
	 */
	public constructor(schematic: IComponent, negateOutput: boolean, bonusWidth: number = 0) {
		super(schematic);
		this.negateOutput = negateOutput;
		this.bonusWidth = bonusWidth;
		this.bitWidth = parseInt(getAttribute("width", schematic, "1"));
		this.size = parseInt(getAttribute("size", schematic, "50"));
		this.numInputs = parseInt(getAttribute("inputs", schematic, "5"));
		for (let i = 0; i < this.numInputs; i++) {
			this.negated.push(getAttribute(`negate${i}`, schematic, "false") == "true");
		}
		this.output = this.addPort(0, 0, this.bitWidth, true);
		this.createInputConnectors(schematic.attributes);
	}

	/**
	 * Create the input connectors for the gate
	 */
	protected createInputConnectors(attributes: IAttributeMap) {
		for (let i = 0; i < this.numInputs; i++) {
			let offs = this.getInputOffset(attributes, i);
			this.inputs.push(this.addPort(offs.x, offs.y, this.bitWidth));
		}
	}

	/**
	 * Calculate the offset for the connectors
	 *
	 * This is borrowed from Logisim source code
	 * https://github.com/lawrancej/logisim/blob/98cd449d405d09bc8b80cbc353e4038b53cf455a/src/main/java/com/cburch/logisim/std/gates/AbstractGate.java
	 */
	protected getInputOffset(attrs: IAttributeMap, index: number) {
		let axisLength = this.size + this.bonusWidth + (this.negateOutput ? 10 : 0);

		let skipStart: number;
		let skipDist: number;
		let skipLowerEven = 10;
		if (this.numInputs <= 3) {
            if (this.size < 40) {
                skipStart = -5;
                skipDist = 10;
                skipLowerEven = 10;
            } else if (this.size < 60 || this.numInputs <= 2) {
                skipStart = -10;
                skipDist = 20;
                skipLowerEven = 20;
            } else {
                skipStart = -15;
                skipDist = 30;
                skipLowerEven = 30;
            }
        } else if (this.numInputs == 4 && this.size >= 60) {
            skipStart = -5;
            skipDist = 20;
            skipLowerEven = 0;
        } else {
            skipStart = -5;
            skipDist = 10;
            skipLowerEven = 10;
        }

        let dy: number;
        if ((this.numInputs & 1) == 1) {
            dy = skipStart * (this.numInputs - 1) + skipDist * index;
        } else {
            dy = skipStart * this.numInputs + skipDist * index;
            if (index >= this.numInputs / 2) {
                dy += skipLowerEven;
            }
        }

        let dx = axisLength;
        if (this.negated[index]) {
            dx += 10;
		}

		return new Point(-dx, dy);
	}

	/**
	 * Get the input signals
	 *
	 * @return The transpose of all the array of input signals
	 */
	protected inputSignals() {
		let result: Bit[][] = [];
		for (let i = 0; i < this.inputs.length; i++) {
			if (this.inputs[i].isConnected) {
				let signal = this.inputs[i].probe();
				if (this.negated[i]) {
					signal = threeValuedNot(signal);
				}
				result.push(signal);
			}
		}
		return transpose(result);
	}

	/**
	 * Perform the gate operation and output
	 */
	public onUpdate() {
		let result: Bit[] = [];
		for (let col of this.inputSignals()) {
			result.push(this.evaluate(col));
		}
		this.output.emitSignal(result);
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Evaluate the column of bits
	 */
	protected abstract evaluate(bits: Bit[]): Bit;

	// ---------------------------------------------------------------------------------------------

	/**
	 * Due to Logisim bug in pin placement with gates, custom transform is required...
	 */
	public get portsTransformed() {
		let result: IConnector[] = [];
		for (let connector of this.ports) {
			let pos = connector.position.rotate(this.facing);
			if (this.facing == Facing.South) {
				pos = pos.flip(Axis.X);
			} else if (this.facing == Facing.West) {
				pos = pos.flip(Axis.Y);
			}
			result.push({
				port: connector.port,
				position: pos.add(this.position)
			});
		}
		return result;
	}
}
