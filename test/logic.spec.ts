import { expect } from "chai";
import "mocha";
import { threeValuedAnd, threeValuedNot, threeValuedOr, Bit, threeValuedNand, threeValuedNor,
	threeValuedXor, threeValuedXnor, threeValuedMerge, threeValuedIncrement, bitCombinations, bitCombinationsSync} from "../src/util/logic";

describe("Three-valued Logic", () => {
	it("AND", () => {
		expect(threeValuedAnd([Bit.Unknown, Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.Unknown, Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.Unknown, Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.Unknown, Bit.One    ])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.Error,   Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.Error,   Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.Error,   Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.Error,   Bit.One    ])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.Zero,    Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.Zero,    Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.Zero,    Bit.Zero   ])).to.equal(Bit.Zero);
		expect(threeValuedAnd([Bit.Zero,    Bit.One    ])).to.equal(Bit.Zero);
		expect(threeValuedAnd([Bit.One,     Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.One,     Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedAnd([Bit.One,     Bit.Zero   ])).to.equal(Bit.Zero);
		expect(threeValuedAnd([Bit.One,     Bit.One    ])).to.equal(Bit.One);
	});
	it("OR", () => {
		expect(threeValuedOr([Bit.Unknown, Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedOr([Bit.Unknown, Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedOr([Bit.Unknown, Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedOr([Bit.Unknown, Bit.One    ])).to.equal(Bit.One);
		expect(threeValuedOr([Bit.Error,   Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedOr([Bit.Error,   Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedOr([Bit.Error,   Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedOr([Bit.Error,   Bit.One    ])).to.equal(Bit.One);
		expect(threeValuedOr([Bit.Zero,    Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedOr([Bit.Zero,    Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedOr([Bit.Zero,    Bit.Zero   ])).to.equal(Bit.Zero);
		expect(threeValuedOr([Bit.Zero,    Bit.One    ])).to.equal(Bit.One);
		expect(threeValuedOr([Bit.One,     Bit.Unknown])).to.equal(Bit.One);
		expect(threeValuedOr([Bit.One,     Bit.Error  ])).to.equal(Bit.One);
		expect(threeValuedOr([Bit.One,     Bit.Zero   ])).to.equal(Bit.One);
		expect(threeValuedOr([Bit.One,     Bit.One    ])).to.equal(Bit.One);
	});
	it("NOT", () => {
		expect(threeValuedNot(Bit.Unknown)).to.equal(Bit.Error);
		expect(threeValuedNot(Bit.Error)).to.equal(Bit.Error);
		expect(threeValuedNot(Bit.Zero)).to.equal(Bit.One);
		expect(threeValuedNot(Bit.One)).to.equal(Bit.Zero);
	});
	it("NAND", () => {
		expect(threeValuedNand([Bit.Unknown, Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.Unknown, Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.Unknown, Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.Unknown, Bit.One    ])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.Error,   Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.Error,   Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.Error,   Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.Error,   Bit.One    ])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.Zero,    Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.Zero,    Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.Zero,    Bit.Zero   ])).to.equal(Bit.One);
		expect(threeValuedNand([Bit.Zero,    Bit.One    ])).to.equal(Bit.One);
		expect(threeValuedNand([Bit.One,     Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.One,     Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedNand([Bit.One,     Bit.Zero   ])).to.equal(Bit.One);
		expect(threeValuedNand([Bit.One,     Bit.One    ])).to.equal(Bit.Zero);
	});
	it("NOR", () => {
		expect(threeValuedNor([Bit.Unknown, Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedNor([Bit.Unknown, Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedNor([Bit.Unknown, Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedNor([Bit.Unknown, Bit.One    ])).to.equal(Bit.Zero);
		expect(threeValuedNor([Bit.Error,   Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedNor([Bit.Error,   Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedNor([Bit.Error,   Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedNor([Bit.Error,   Bit.One    ])).to.equal(Bit.Zero);
		expect(threeValuedNor([Bit.Zero,    Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedNor([Bit.Zero,    Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedNor([Bit.Zero,    Bit.Zero   ])).to.equal(Bit.One);
		expect(threeValuedNor([Bit.Zero,    Bit.One    ])).to.equal(Bit.Zero);
		expect(threeValuedNor([Bit.One,     Bit.Unknown])).to.equal(Bit.Zero);
		expect(threeValuedNor([Bit.One,     Bit.Error  ])).to.equal(Bit.Zero);
		expect(threeValuedNor([Bit.One,     Bit.Zero   ])).to.equal(Bit.Zero);
		expect(threeValuedNor([Bit.One,     Bit.One    ])).to.equal(Bit.Zero);
	});
	it("XOR", () => {
		expect(threeValuedXor([Bit.Unknown, Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.Unknown, Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.Unknown, Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.Unknown, Bit.One    ])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.Error,   Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.Error,   Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.Error,   Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.Error,   Bit.One    ])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.Zero,    Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.Zero,    Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.Zero,    Bit.Zero   ])).to.equal(Bit.Zero);
		expect(threeValuedXor([Bit.Zero,    Bit.One    ])).to.equal(Bit.One);
		expect(threeValuedXor([Bit.One,     Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.One,     Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedXor([Bit.One,     Bit.Zero   ])).to.equal(Bit.One);
		expect(threeValuedXor([Bit.One,     Bit.One    ])).to.equal(Bit.Zero);
	});
	it("XNOR", () => {
		expect(threeValuedXnor([Bit.Unknown, Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.Unknown, Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.Unknown, Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.Unknown, Bit.One    ])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.Error,   Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.Error,   Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.Error,   Bit.Zero   ])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.Error,   Bit.One    ])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.Zero,    Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.Zero,    Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.Zero,    Bit.Zero   ])).to.equal(Bit.One);
		expect(threeValuedXnor([Bit.Zero,    Bit.One    ])).to.equal(Bit.Zero);
		expect(threeValuedXnor([Bit.One,     Bit.Unknown])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.One,     Bit.Error  ])).to.equal(Bit.Error);
		expect(threeValuedXnor([Bit.One,     Bit.Zero   ])).to.equal(Bit.Zero);
		expect(threeValuedXnor([Bit.One,     Bit.One    ])).to.equal(Bit.One);
	});
	it("Merge", () => {
		expect(threeValuedMerge([],            [Bit.Unknown])).to.eql([Bit.Unknown]);
		expect(threeValuedMerge([],            [Bit.Error]  )).to.eql([Bit.Error]);
		expect(threeValuedMerge([],            [Bit.Zero]   )).to.eql([Bit.Zero]);
		expect(threeValuedMerge([],            [Bit.One]    )).to.eql([Bit.One]);
		expect(threeValuedMerge([Bit.Unknown], []           )).to.eql([Bit.Unknown]);
		expect(threeValuedMerge([Bit.Error],   []           )).to.eql([Bit.Error]);
		expect(threeValuedMerge([Bit.Zero],    []           )).to.eql([Bit.Zero]);
		expect(threeValuedMerge([Bit.One],     []           )).to.eql([Bit.One]);
		expect(threeValuedMerge([Bit.Unknown], [Bit.Unknown])).to.eql([Bit.Unknown]);
		expect(threeValuedMerge([Bit.Unknown], [Bit.Error]  )).to.eql([Bit.Error]);
		expect(threeValuedMerge([Bit.Unknown], [Bit.Zero]   )).to.eql([Bit.Zero]);
		expect(threeValuedMerge([Bit.Unknown], [Bit.One]    )).to.eql([Bit.One]);
		expect(threeValuedMerge([Bit.Error],   [Bit.Unknown])).to.eql([Bit.Error]);
		expect(threeValuedMerge([Bit.Error],   [Bit.Error]  )).to.eql([Bit.Error]);
		expect(threeValuedMerge([Bit.Error],   [Bit.Zero]   )).to.eql([Bit.Error]);
		expect(threeValuedMerge([Bit.Error],   [Bit.One]    )).to.eql([Bit.Error]);
		expect(threeValuedMerge([Bit.Zero],    [Bit.Unknown])).to.eql([Bit.Zero]);
		expect(threeValuedMerge([Bit.Zero],    [Bit.Error]  )).to.eql([Bit.Error]);
		expect(threeValuedMerge([Bit.Zero],    [Bit.Zero]   )).to.eql([Bit.Zero]);
		expect(threeValuedMerge([Bit.Zero],    [Bit.One]    )).to.eql([Bit.Error]);
		expect(threeValuedMerge([Bit.One],     [Bit.Unknown])).to.eql([Bit.One]);
		expect(threeValuedMerge([Bit.One],     [Bit.Error]  )).to.eql([Bit.Error]);
		expect(threeValuedMerge([Bit.One],     [Bit.Zero]   )).to.eql([Bit.Error]);
		expect(threeValuedMerge([Bit.One],     [Bit.One]    )).to.eql([Bit.One]);
	});
	it("Increment", () => {
		expect(threeValuedIncrement([Bit.Zero, Bit.Zero   ])).to.eql([Bit.Zero, Bit.One]);
		expect(threeValuedIncrement([Bit.Zero, Bit.One    ])).to.eql([Bit.One, Bit.Zero]);
		expect(threeValuedIncrement([Bit.One,  Bit.One    ])).to.eql([Bit.Zero, Bit.Zero]);
		expect(threeValuedIncrement([Bit.One,  Bit.Unknown])).to.eql([Bit.Error, Bit.Error]);
		expect(threeValuedIncrement([Bit.One,  Bit.Error  ])).to.eql([Bit.Error, Bit.Error]);
	});
	it("Original inputs are unmodified", () => {
		let testA = [Bit.Zero, Bit.One];
		let testB = [Bit.One, Bit.Zero];

		threeValuedMerge(testA, testB);
		expect(testA).to.eql([Bit.Zero, Bit.One]);
		expect(testB).to.eql([Bit.One, Bit.Zero]);

		threeValuedIncrement(testA);
		expect(testA).to.eql([Bit.Zero, Bit.One]);
	})
	it("Combination Generator (Synchronous)", () => {
		let combinations = new Set<string>([
			[Bit.Zero, Bit.Zero].toString(),
			[Bit.Zero, Bit.One ].toString(),
			[Bit.One,  Bit.Zero].toString(),
			[Bit.One,  Bit.One].toString()
		]);
		bitCombinationsSync(2, (comb) => {
			expect(combinations.delete(comb.toString())).to.equal(true);
		});
		expect(combinations.size).to.equal(0);
	});
	it("Combination Generator (Asynchronous)", async () => {
		let combinations = new Set<string>([
			[Bit.Zero, Bit.Zero].toString(),
			[Bit.Zero, Bit.One ].toString(),
			[Bit.One,  Bit.Zero].toString(),
			[Bit.One,  Bit.One].toString()
		]);
		await bitCombinations(2, async (comb) => {
			expect(combinations.delete(comb.toString())).to.equal(true);
		});
		expect(combinations.size).to.equal(0);
	});
});
