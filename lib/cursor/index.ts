import type Position from '$lib/position'

export default interface Cursor extends Position {
	button: number
	mouse: boolean
}
