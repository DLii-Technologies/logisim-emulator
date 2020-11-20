import { Facing } from "../emulator/enums";
import { Point } from "./coordinates";

/**
 * The transform type
 */
export type Transform = [[number, number], [number, number]];

/**
 * Facing transforms
 */
export interface FacingTransform {
	[Facing.East]:  Transform;
	[Facing.West]:  Transform;
	[Facing.North]: Transform;
	[Facing.South]: Transform;
}

/**
 * Rotate to face a direction
 */
export const ROTATION: FacingTransform = {
	[Facing.East]:
		[[ 1,  0],
		 [ 0,  1]],

	[Facing.North]:
		[[ 0,  1],
		 [-1,  0]],

	[Facing.West]:
		[[-1, 0],
		 [ 0, -1]],

	[Facing.South]:
		[[ 0, -1],
		 [ 1,  0]],
}

/**
 * Mirror/rotate to face the direction
 */
export const MIRROR_ROTATION: FacingTransform = {
	[Facing.East]:
		[[ 1,  0],
		 [ 0,  1]],

	[Facing.North]:
		[[ 0,  1],
		 [-1,  0]],

	[Facing.West]:
		[[-1, 0],
		 [ 0, 1]],

	[Facing.South]:
		[[ 0,  1],
		 [ 1,  0]],
}

/**
 * Transform the given point p
 */
export function transform(p: Point, translation: Point, transform: Transform) {
	let x = transform[0][0]*p.x + transform[0][1]*p.y;
	let y = transform[1][0]*p.x + transform[1][1]*p.y;
	return new Point(x + translation.x, y + translation.y);
}
