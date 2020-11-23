import { expect } from "chai";
import "mocha";
import { Line, Point } from "../src/util/coordinates";
import { Axis, Facing } from "../src/util/transform";

describe("Coordinates: Point", () => {
	it("Create point through overloaded constructors", () => {
		let a = new Point(1, 2);
		let b = new Point({x: 5, y: 2});
		expect(a.x == 1 && a.y == 2).to.equal(true, "Number constructor failed");
		expect(b.x == 5 && b.y == 2).to.equal(true, "Point constructor failed");
	});
	it("Create point from string", () => {
		let error: Error|undefined = undefined;
		try {
			Point.fromString("notacoord");
		} catch(err) {
			error = err
		}
		expect(error).to.not.equal(undefined);
		let pointA = Point.fromString("(10,20)");
		let pointB = Point.fromString("(-20, -5)");
		expect(pointA.x == 10 && pointA.y == 20).to.equal(true, "Positive");
		expect(pointB.x == -20 && pointB.y == -5).to.equal(true, "Negative");
	});
	it("Copy existing point", () => {
		let a = new Point(1, 2);
		let b = a;
		expect(a).to.equal(b);
		b = a.copy();
		expect(a).to.not.equal(b);
	});
	it("Transform a point", () => {
		let p0 = new Point(5, 2);
		let a = new Point(-2, 3);
		let t1 = a.rotate(Facing.East).add(p0);
		let t2 = a.rotate(Facing.North).add(p0);
		let t3 = a.rotate(Facing.West).add(p0);
		let t4 = a.rotate(Facing.South).add(p0);
		let t5 = a.rotate(Facing.East).add(p0);
		let t6 = a.rotate(Facing.North).add(p0);
		let t7 = a.rotate(Facing.West).flip(Axis.Y).add(p0);
		let t8 = a.rotate(Facing.South).flip(Axis.X).add(p0);
		expect(t1.x == (-2 + p0.x) && t1.y == ( 3 + p0.y)).to.equal(true);
		expect(t2.x == ( 3 + p0.x) && t2.y == ( 2 + p0.y)).to.equal(true);
		expect(t3.x == ( 2 + p0.x) && t3.y == (-3 + p0.y)).to.equal(true);
		expect(t4.x == (-3 + p0.x) && t4.y == (-2 + p0.y)).to.equal(true);
		expect(t5.x == (-2 + p0.x) && t5.y == ( 3 + p0.y)).to.equal(true);
		expect(t6.x == ( 3 + p0.x) && t6.y == ( 2 + p0.y)).to.equal(true);
		expect(t7.x == ( 2 + p0.x) && t7.y == ( 3 + p0.y)).to.equal(true);
		expect(t8.x == ( 3 + p0.x) && t8.y == (-2 + p0.y)).to.equal(true);
	});
})

describe("Coordinates: Line", () => {
	it("Create line through overloaded constructors", () => {
		let lineA = new Line(new Point(5, 2), new Point(3, 2));
		let lineB = new Line({a: {x: 9, y: 5}, b: {x: 9, y: 1}});
		expect(lineA.a.x == 3 && lineA.a.y == 2).to.equal(true);
		expect(lineA.b.x == 5 && lineA.b.y == 2).to.equal(true);
		expect(lineB.a.x == 9 && lineB.a.y == 1).to.equal(true);
		expect(lineB.b.x == 9 && lineB.b.y == 5).to.equal(true);
	});
	it("Test orientation of lines", () => {
		let lineA = new Line(new Point(5, 2), new Point(2, 2));
		let lineB = new Line({a: {x: 9, y: 5}, b: {x: 9, y: 1}});
		expect(lineA.isHorizontal()).to.equal(true, "A: Horizontal check failed");
		expect(lineA.isVertical()).to.equal(false, "A: Vertical check failed");
		expect(lineB.isHorizontal()).to.equal(false, "B: Horizontal check failed");
		expect(lineB.isVertical()).to.equal(true, "B: Vertical check failed");
	});
	it("Copy a line", () => {
		let a = new Line(new Point(1, 2), new Point(5, 2));
		let b = a;
		expect(a).to.equal(b);
		expect(a.a == b.a && a.b == b.b).to.equal(true);
		b = a.copy();
		expect(a).to.not.equal(b);
		expect(a.a != b.a && a.b != b.b).to.equal(true);
	});
	it("Piont is on a line", () => {
		let lineA = new Line(new Point(5, 2), new Point(2, 2));
		let lineB = new Line({a: {x: 9, y: 5}, b: {x: 9, y: 1}});
		let pointA = new Point(3, 2);
		let pointB = new Point(9, 3);
		expect(lineA.intersects(pointA)).to.equal(true);
		// expect(lineA.intersects(pointB)).to.equal(false);
		// expect(lineB.intersects(pointA)).to.equal(false);
		// expect(lineB.intersects(pointB)).to.equal(true);
	});
});
