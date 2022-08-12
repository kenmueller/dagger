const nearestDivisor = (value: number, multiple: number) =>
	Math.floor((value + multiple / 2) / multiple)

export default nearestDivisor
