<script lang="ts">
	import type Arrow from '$lib/arrow'
	import NODE_RADIUS from '$lib/node/radius'

	export let arrow: Arrow

	const dist = Math.sqrt(
		(arrow.to.x - arrow.from.x) ** 2 + (arrow.to.y - arrow.from.y) ** 2
	)
	const to = {
		x: arrow.to.x - ((arrow.to.x - arrow.from.x) * NODE_RADIUS) / dist,
		y: arrow.to.y - ((arrow.to.y - arrow.from.y) * NODE_RADIUS) / dist
	}
</script>

<svg>
	<line
		x1={arrow.from.x}
		y1={arrow.from.y}
		x2={to.x}
		y2={to.y}
		stroke="black"
		stroke-width={2}
		marker-end="url(#arrow)"
	/>
	<line
		x1={arrow.from.x}
		y1={arrow.from.y}
		x2={to.x}
		y2={to.y}
		stroke="blue"
		stroke-width={5}
		marker-end="url(#arrow)"
		opacity={0}
	/>
</svg>
