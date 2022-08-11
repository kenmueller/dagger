const roundToNearest = (value: number, multiple: number) =>
	Math.floor((value + multiple / 2) / multiple) * multiple

export default roundToNearest
