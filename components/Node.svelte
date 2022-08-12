<script lang="ts">
	import type Node from '$lib/node'
	import NODE_RADIUS from '$lib/node/radius'
	import GRID_SPACING from '$lib/grid/spacing'
	import roundToNearest from '$lib/round/nearest'
	import toRef from '$lib/ref/to'
	import latex from '$lib/latex'
	import mouse from '$lib/mouse/store'
	import nodes from '$lib/node/nodes'
	import arrows from '$lib/arrow/arrows'
	import currentArrow from '$lib/arrow/current'
	import center from '$lib/center'
	import currentTool from '$lib/tool/current'
	import CenteredInput from './Input/Centered.svelte'

	import '../styles/katex.less'

	const latexRef = toRef(latex)

	export let id: string
	export let node: Node

	let input: HTMLInputElement | null = null
	$: input?.focus()

	let editing = false

	$: result = latexRef(node.name)

	const edit = (event: MouseEvent) => {
		event.stopPropagation()
		editing = true
	}

	const onInput = ({ target }: Event) => {
		const input = target as HTMLInputElement | null
		if (!input) return

		$nodes = {
			...$nodes,
			[id]: { ...node, name: input.value }
		}
	}

	const blurWithKey = ({ key }: KeyboardEvent) => {
		if (key === 'Enter') editing = false
	}

	const blurWithClick = ({ target }: MouseEvent) => {
		if (input && input !== target) editing = false
	}

	let dragging = false

	const onMouseDown = (event: MouseEvent) => {
		switch ($currentTool) {
			case 'arrow':
				$currentArrow = id
				break
			case 'delete': {
				const newNodes = { ...$nodes }
				delete newNodes[id]

				$nodes = newNodes
				$arrows = $arrows.filter(({ from, to }) => !(from === id || to === id))

				break
			}
			default:
				event.stopPropagation()
				dragging = true
		}
	}

	const onMouseMove = () => {
		if (!(dragging && $mouse)) return

		$nodes = {
			...$nodes,
			[id]: {
				...node,
				x: node.x + $mouse.movement.x,
				y: node.y + $mouse.movement.y
			}
		}
	}

	const onMouseUp = () => {
		if (!dragging) return

		$nodes = {
			...$nodes,
			[id]: {
				...node,
				x: roundToNearest(node.x, GRID_SPACING),
				y: roundToNearest(node.y, GRID_SPACING)
			}
		}

		dragging = false
	}

	const onNodeMouseUp = (event: MouseEvent) => {
		if (!($currentTool === 'arrow' && $currentArrow)) return

		event.stopPropagation()

		if (
			id === $currentArrow ||
			$arrows.some(
				({ from, to }) =>
					(from === $currentArrow && to === id) ||
					(from === id && to === $currentArrow)
			)
		) {
			$currentArrow = null
			return
		}

		$arrows = [...$arrows, { from: $currentArrow, to: id }]
		$currentArrow = null
	}
</script>

<svelte:window on:keyup={blurWithKey} />
<svelte:body
	on:click={blurWithClick}
	on:mousemove={onMouseMove}
	on:mouseup={onMouseUp} />

<div
	class="outer"
	style="
		--x: {node.x}px;
		--y: {node.y}px;
		--center-x: {$center.x}px;
		--center-y: {$center.y}px;
		--radius: {NODE_RADIUS}px;
		--color: {node.color};
	"
	on:mousedown={onMouseDown}
	on:mouseup={onNodeMouseUp}
	on:click|stopPropagation
>
	<div class="inner">
		{#if editing}
			<CenteredInput
				bind:ref={input}
				placeholder="LaTeX code"
				value={node.name}
				on:input={onInput}
			/>
		{/if}
		<p class:editable={!editing} on:click={edit}>
			{#if !node.name}
				<span class="placeholder">Rendered LaTeX</span>
			{:else if result.error}
				<span class="error">{result.error.message}</span>
			{:else}
				{@html result.value}
			{/if}
		</p>
	</div>
</div>

<style lang="scss">
	.outer {
		position: absolute;
		left: calc(50% + var(--x) + var(--center-x));
		top: calc(50% - var(--y) - var(--center-y));
		width: calc(2 * var(--radius));
		height: calc(2 * var(--radius));
		background: var(--color);
		border-radius: 50%;
		z-index: 100;
		transform: translate(-50%, -50%);
	}

	.inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		left: 50%;
		bottom: calc(5px + 2 * var(--radius));
		transform: translateX(-50%);
	}

	.inner > :global(input) {
		--min-width: 10rem;
		--horizontal-padding: 0.8rem;
		--vertical-padding: 0.5rem;

		background: rgba(black, 0.1);
		border-radius: 0.5rem;
	}

	p {
		width: max-content;
		height: 1.44rem;
		margin-top: 0.3rem;
		text-align: center;
	}

	.editable {
		cursor: pointer;
	}

	.placeholder {
		opacity: 0.5;
	}

	.error {
		color: red;
	}
</style>
