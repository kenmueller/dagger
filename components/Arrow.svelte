<script lang="ts">
	import type Arrow from '$lib/arrow'
	import type Position from '$lib/position'
	import NODE_RADIUS from '$lib/node/radius'
	import arrows from '$lib/arrow/arrows'
	import view from '$lib/view/store'
	import center from '$lib/center'
	import currentTool from '$lib/tool/current'

	export let arrow: Arrow<string> | null = null
	export let position: Arrow<Position>

	export let padding = true

	$: radius = padding ? NODE_RADIUS + 5 : 0

	$: distance = Math.sqrt(
		(position.to.x - position.from.x) ** 2 +
			(position.to.y - position.from.y) ** 2
	)

	$: from = $view && {
		x: $view.width / 2 + position.from.x + $center.x,
		y: $view.height / 2 - position.from.y - $center.y
	}

	$: to = $view && {
		x: $view.width / 2 + position.to.x + $center.x,
		y: $view.height / 2 - position.to.y - $center.y
	}

	$: toPadding = {
		x: ((position.to.x - position.from.x) * radius) / distance,
		y: ((position.to.y - position.from.y) * radius) / distance
	}

	$: toWithPadding = to && {
		x: to.x - toPadding.x,
		y: to.y + toPadding.y
	}

	const onMouseDown = () => {
		if ($currentTool !== 'delete') return

		$arrows = $arrows.filter(
			otherArrow =>
				!(arrow && arrow.from === otherArrow.from && arrow.to === otherArrow.to)
		)
	}
</script>

{#if from && to && toWithPadding}
	<line
		x1={from.x}
		y1={from.y}
		x2={toWithPadding.x}
		y2={toWithPadding.y}
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
		stroke-width={20}
		opacity={0}
		on:mousedown={onMouseDown}
	/>
{/if}
