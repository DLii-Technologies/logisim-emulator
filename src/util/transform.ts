import { Facing } from "../emulator/enums";
import { Point } from "./coordinates";

/**
 * Facing to rotation mapping
 */
const ROT = {
	[Facing.East]:
		[[1, 0],
		[0, 1]],

	[Facing.North]:
		[[1, 0],
		[0, 1]],

	[Facing.West]:
		[[1, 0],
		[0, 1]],

	[Facing.South]:
		[[1, 0],
		[0, 1]],
}

/**
 * Transform the given point p
 */
export function transform(p: Point, translation: Point, facing: Facing) {
	let rot = ROT[facing];
	let x = rot[0][0]*p.x + rot[0][1]*p.y;
	let y = rot[1][0]*p.x + rot[1][1]*p.y;
	return new Point(x + translation.x, y + translation.y);
}
