import assert from "assert";
import { Axis, Facing, MIRROR, ROTATION, Transform } from "./transform";

export interface IPoint {
	x: number;
	y: number;
}

export interface ILine {
	a: IPoint;
	b: IPoint;
}

export class Point
{
	/**
	 * Create a new point object from a string
	 */
	public static fromString(point: string) {
		let matched = point.match(/\((-?\d+),\s*(-?\d+)\)/);
		assert(matched !== null, "Invalid point string provided");
		return new Point(parseInt(matched[1]), parseInt(matched[2]));
	}

	/**
	 * Unserialize a point
	 */
	public static unserialize(point: IPoint) {
		return new Point(point.x, point.y);
	}

	/**
	 * The coordinates for the point
	 */
	private __x: number;
	private __y: number;

	/**
	 * Create a point from two integers
	 */
	public constructor(x: number, y: number);

	/**
	 * Create a point from a serialized point object
	 */
	public constructor(p: IPoint);

	/**
	 * Create a new point
	 */
	public constructor(x: IPoint|number, y?: number) {
		if (y === undefined && typeof(x) !== "number") {
			// a is an ILine
			this.__x = x.x;
			this.__y = x.y;
		} else {
			// x and y are numbers
			assert(typeof(x) === "number" && typeof(y) === "number",
				"Invalid point constructor invoked");
			this.__x = x;
			this.__y = y;
		}
	}

	/**
	 * Create a copy of the point
	 */
	public copy() {
		return new Point(this.__x, this.__y);
	}

	/**
	 * Check if two points are equivalent
	 */
	public equals(other: Point) {
		return this.__x == other.x && this.__y == other.y;
	}

	/**
	 * Serialize the point into a JSON object
	 */
	public serialize(): IPoint {
		return {
			x: this.__x,
			y: this.__y
		};
	}

	/**
	 * Convert the point to a string
	 */
	public toString() {
		return `(${this.__x},${this.__y})`;
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Add two points together. returns a new point instance
	 */
	public add(x: number, y: number): Point;
	public add(other: Point): Point;
	public add(x: Point | number, y?: number) {
		if (typeof x == "number" && typeof y == "number") {
			return new Point(this.__x + x, this.__y + y);
		}
		let other = x;
		assert(other instanceof Point, "Add invoked improperly");
		return this.add(other.x, other.y);
	}

	/**
	 * Mirror the point across an axis
	 */
	public flip(axis: Axis) {
		return this.transform(MIRROR[axis]);
	}

	/**
	 * Apply a 90-degree increment rotation
	 */
	public rotate(facing: Facing) {
		return this.transform(ROTATION[facing]);
	}

	/**
	 * Apply a transform to the point
	 */
	public transform(transformation: Transform) {
		let x = transformation[0][0]*this.x + transformation[0][1]*this.y;
		let y = transformation[1][0]*this.x + transformation[1][1]*this.y;
		return new Point(x, y);
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Get the x coordinate
	 */
	public get x() {
		return this.__x;
	}

	/**
	 * Get the y coordinate
	 */
	public get y() {
		return this.__y;
	}
}

export class Line
{
	/**
	 * The points that define the line
	 */
	private __a: Point;
	private __b: Point;

	/**
	 * Create a line segment from two points
	 */
	public constructor(a: Point, b: Point);

	/**
	 * Create a line segment from from a serialized line object
	 */
	public constructor(line: ILine);

	/**
	 * Create a line segment
	 */
	public constructor(a: Point|ILine, b?: Point) {
		if (b === undefined && !(a instanceof Point)) {
			// a is an ILine
			this.__a = new Point(a.a);
			this.__b = new Point(a.b);
		} else {
			// a and b are points
			assert(a instanceof Point && b instanceof Point, "Invalid line constructor invoked");
			this.__a = new Point(a);
			this.__b = new Point(b);
		}
		assert(this.isHorizontal() || this.isVertical(), "Line must be horizontal or vertical");
		this.sortPoints();
	}

	/**
	 * Ensure point a is the smaller of the points
	 */
	protected sortPoints() {
		if (this.__b.x < this.__a.x || this.__b.y < this.__a.y) {
			let tmp = this.__a;
			this.__a = this.__b;
			this.__b = tmp;
		}
	}

	/**
	 * Determine if a point is on a line. This function only considers
	 * lines that follow a manhattan grid
	 */
	public intersects(p: Point) {
		return p.x >= this.__a.x && p.x <= this.__b.x
		    && p.y >= this.__a.y && p.y <= this.__b.y;
	}

	/**
	 * Copy the line segment
	 */
	public copy() {
		return new Line(this.__a.copy(), this.__b.copy());
	}

	/**
	 * Serialize the line into a JSON object
	 */
	public serialize(): ILine {
		return {
			a: this.__a.serialize(),
			b: this.__b.serialize()
		};
	}

	// ---------------------------------------------------------------------------------------------

	/**
	 * Determine if the line is vertical
	 */
	public isHorizontal() {
		return this.__a.y == this.__b.y;
	}

	/**
	 * Determine if the line is vertical
	 */
	public isVertical() {
		return this.__a.x == this.__b.x;
	}

	/**
	 * Fetch point a of the line
	 */
	public get a() {
		return this.__a;
	}

	/**
	 * Fetch point b of the line
	 */
	public get b() {
		return this.__b;
	}
}
