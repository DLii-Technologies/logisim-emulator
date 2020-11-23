/**
 * The transform type
 */
export type Transform = [[number, number], [number, number]];

/**
 * Transformation axes
 */
export enum Axis {
	X,
	Y
}

/**
 * Facing directions
 */
export enum Facing {
	East  = "east",
	West  = "west",
	North = "north",
	South = "south",
}

/**
 * Map facing directions to rotation transforms
 */
interface RotationMap {
	[Facing.East]:  Transform;
	[Facing.West]:  Transform;
	[Facing.North]: Transform;
	[Facing.South]: Transform;
}

/**
 * Map facing directions to mirror transforms
 */
interface MirrorMap {
	[Axis.X]: Transform,
	[Axis.Y]: Transform
}

/**
 * Rotate to face a direction
 */
export const ROTATION: RotationMap = {
	[Facing.East]:
		[[ 1,  0],
		 [ 0,  1]],

	[Facing.North]:
		[[ 0,  1],
		 [-1,  0]],

	[Facing.West]:
		[[-1,  0],
		 [ 0, -1]],

	[Facing.South]:
		[[ 0, -1],
		 [ 1,  0]],
};

/**
 * Axis mirroring
 */
export const MIRROR: MirrorMap = {
	[Axis.X]:
		[[-1, 0],
		 [ 0, 1]],

	[Axis.Y]:
		[[ 1, 0],
		 [ 0,-1]],
};
