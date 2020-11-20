import { expect } from "chai";
import "mocha";
import { threeValuedAnd, threeValuedNot, threeValuedOr, Bit, threeValuedNand, threeValuedNor,
	threeValuedXor, threeValuedXnor } from "../src/util/logic";

describe.only("Three-valued Logic", () => {
	it("AND", () => {
		expect(threeValuedAnd(Bit.Unknown, Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.Unknown, Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.Unknown, Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.Unknown, Bit.One    )).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.Error,   Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.Error,   Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.Error,   Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.Error,   Bit.One    )).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.Zero,    Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.Zero,    Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.Zero,    Bit.Zero   )).to.equal(Bit.Zero);
		expect(threeValuedAnd(Bit.Zero,    Bit.One    )).to.equal(Bit.Zero);
		expect(threeValuedAnd(Bit.One,     Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.One,     Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedAnd(Bit.One,     Bit.Zero   )).to.equal(Bit.Zero);
		expect(threeValuedAnd(Bit.One,     Bit.One    )).to.equal(Bit.One);
	});
	it("OR", () => {
		expect(threeValuedOr(Bit.Unknown, Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedOr(Bit.Unknown, Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedOr(Bit.Unknown, Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedOr(Bit.Unknown, Bit.One    )).to.equal(Bit.One);
		expect(threeValuedOr(Bit.Error,   Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedOr(Bit.Error,   Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedOr(Bit.Error,   Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedOr(Bit.Error,   Bit.One    )).to.equal(Bit.One);
		expect(threeValuedOr(Bit.Zero,    Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedOr(Bit.Zero,    Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedOr(Bit.Zero,    Bit.Zero   )).to.equal(Bit.Zero);
		expect(threeValuedOr(Bit.Zero,    Bit.One    )).to.equal(Bit.One);
		expect(threeValuedOr(Bit.One,     Bit.Unknown)).to.equal(Bit.One);
		expect(threeValuedOr(Bit.One,     Bit.Error  )).to.equal(Bit.One);
		expect(threeValuedOr(Bit.One,     Bit.Zero   )).to.equal(Bit.One);
		expect(threeValuedOr(Bit.One,     Bit.One    )).to.equal(Bit.One);
	});
	it("NOT", () => {
		expect(threeValuedNot(Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedNot(Bit.Error)).to.equal(Bit.Error);
		expect(threeValuedNot(Bit.Zero)).to.equal(Bit.One);
		expect(threeValuedNot(Bit.One)).to.equal(Bit.Zero);
	});
	it("NAND", () => {
		expect(threeValuedNand(Bit.Unknown, Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.Unknown, Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.Unknown, Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.Unknown, Bit.One    )).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.Error,   Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.Error,   Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.Error,   Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.Error,   Bit.One    )).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.Zero,    Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.Zero,    Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.Zero,    Bit.Zero   )).to.equal(Bit.One);
		expect(threeValuedNand(Bit.Zero,    Bit.One    )).to.equal(Bit.One);
		expect(threeValuedNand(Bit.One,     Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.One,     Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedNand(Bit.One,     Bit.Zero   )).to.equal(Bit.One);
		expect(threeValuedNand(Bit.One,     Bit.One    )).to.equal(Bit.Zero);
	});
	it("NOR", () => {
		expect(threeValuedNor(Bit.Unknown, Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedNor(Bit.Unknown, Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedNor(Bit.Unknown, Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedNor(Bit.Unknown, Bit.One    )).to.equal(Bit.Zero);
		expect(threeValuedNor(Bit.Error,   Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedNor(Bit.Error,   Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedNor(Bit.Error,   Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedNor(Bit.Error,   Bit.One    )).to.equal(Bit.Zero);
		expect(threeValuedNor(Bit.Zero,    Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedNor(Bit.Zero,    Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedNor(Bit.Zero,    Bit.Zero   )).to.equal(Bit.One);
		expect(threeValuedNor(Bit.Zero,    Bit.One    )).to.equal(Bit.Zero);
		expect(threeValuedNor(Bit.One,     Bit.Unknown)).to.equal(Bit.Zero);
		expect(threeValuedNor(Bit.One,     Bit.Error  )).to.equal(Bit.Zero);
		expect(threeValuedNor(Bit.One,     Bit.Zero   )).to.equal(Bit.Zero);
		expect(threeValuedNor(Bit.One,     Bit.One    )).to.equal(Bit.Zero);
	});
	it("XOR", () => {
		expect(threeValuedXor(Bit.Unknown, Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.Unknown, Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.Unknown, Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.Unknown, Bit.One    )).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.Error,   Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.Error,   Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.Error,   Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.Error,   Bit.One    )).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.Zero,    Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.Zero,    Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.Zero,    Bit.Zero   )).to.equal(Bit.Zero);
		expect(threeValuedXor(Bit.Zero,    Bit.One    )).to.equal(Bit.One);
		expect(threeValuedXor(Bit.One,     Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.One,     Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedXor(Bit.One,     Bit.Zero   )).to.equal(Bit.One);
		expect(threeValuedXor(Bit.One,     Bit.One    )).to.equal(Bit.Zero);
	});
	it("XNOR", () => {
		expect(threeValuedXnor(Bit.Unknown, Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.Unknown, Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.Unknown, Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.Unknown, Bit.One    )).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.Error,   Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.Error,   Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.Error,   Bit.Zero   )).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.Error,   Bit.One    )).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.Zero,    Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.Zero,    Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.Zero,    Bit.Zero   )).to.equal(Bit.One);
		expect(threeValuedXnor(Bit.Zero,    Bit.One    )).to.equal(Bit.Zero);
		expect(threeValuedXnor(Bit.One,     Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.One,     Bit.Error  )).to.equal(Bit.Error);
		expect(threeValuedXnor(Bit.One,     Bit.Zero   )).to.equal(Bit.Zero);
		expect(threeValuedXnor(Bit.One,     Bit.One    )).to.equal(Bit.One);
	});
});