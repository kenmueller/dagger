import type Position from '$lib/position'

export default interface Node extends Position {
	name: string
	color: string
	rotation: 0 | 90 | 180 | 270
}
