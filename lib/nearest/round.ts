import nearestDivisor from './divisor'

const roundToNearest = (value: number, multiple: number) =>
	nearestDivisor(value, multiple) * multiple

export default roundToNearest
