import type Position from '../position'

export default interface Arrow<Point extends string | Position> {
	from: Point
	to: Point
}
