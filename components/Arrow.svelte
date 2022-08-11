<script lang="ts">
	import type Arrow from '$lib/arrow'
	import type Position from '$lib/position'
	import NODE_RADIUS from '$lib/node/radius'
	import view from '$lib/view/store'
	import center from '$lib/center'

	export let arrow: Arrow<Position>
	export let padding = true

	$: radius = padding ? NODE_RADIUS + 5 : 0
	$: distance = Math.sqrt(
		(arrow.to.x - arrow.from.x) ** 2 + (arrow.to.y - arrow.from.y) ** 2
	)

	$: from = $view && {
		x: $view.width / 2 + arrow.from.x + $center.x,
		y: $view.height / 2 - arrow.from.y - $center.y
	}

	$: to = $view && {
		x:
			$view.width / 2 +
			(arrow.to.x - ((arrow.to.x - arrow.from.x) * radius) / distance) +
			$center.x,
		y:
			$view.height / 2 -
			(arrow.to.y - ((arrow.to.y - arrow.from.y) * radius) / distance) -
			$center.y
	}
</script>

{#if from && to}
	<line
		x1={from.x}
		y1={from.y}
		x2={to.x}
		y2={to.y}
		stroke="black"
		stroke-width={2}
		marker-end="url(#arrow)"
	/>
	<line
		x1={from.x}
		y1={from.y}
		x2={to.x}
		y2={to.y}
		stroke="blue"
		stroke-width={5}
		marker-end="url(#arrow)"
		opacity={0}
	/>
{/if}
