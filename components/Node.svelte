<script lang="ts">
	import { browser } from '$app/env'

	import type Node from '$lib/node'
	import NODE_RADIUS from '$lib/node/radius'
	import GRID_SPACING from '$lib/grid/spacing'
	import roundToNearest from '$lib/nearest/round'
	import cursorHandler from '$lib/cursor/handler'
	import toRef from '$lib/ref/to'
	import latex from '$lib/latex'
	import nodes from '$lib/node/nodes'
	import arrows from '$lib/arrow/arrows'
	import currentArrow from '$lib/arrow/current'
	import center from '$lib/center'
	import currentTool from '$lib/tool/current'
	import CenteredInput from './Input/Centered.svelte'

	import '../styles/katex.less'
	import type Cursor from '$lib/cursor'

	const latexRef = toRef(latex)

	export let id: string
	export let node: Node

	let input: HTMLInputElement | null = null
	$: input?.focus()

	let editing = false

	$: result = browser ? latexRef(node.name) : null

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

	let draggingCursor: Cursor | null = null

	const onCursorDown = cursorHandler((cursor, event) => {
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
				draggingCursor = cursor
		}
	})

	const onCursorMove = cursorHandler(cursor => {
		if (!draggingCursor) return

		$nodes = {
			...$nodes,
			[id]: {
				...node,
				x: node.x + (cursor.x - draggingCursor.x),
				y: node.y - (cursor.y - draggingCursor.y)
			}
		}

		draggingCursor = cursor
	})

	const onCursorUp = cursorHandler(() => {
		if (!draggingCursor) return

		$nodes = {
			...$nodes,
			[id]: {
				...node,
				x: roundToNearest(node.x, GRID_SPACING),
				y: roundToNearest(node.y, GRID_SPACING)
			}
		}

		draggingCursor = null
	})

	const onNodeCursorUp = cursorHandler((_cursor, event) => {
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
	})
</script>

<svelte:window on:keyup={blurWithKey} />
<svelte:body
	on:click={blurWithClick}
	on:mousemove={onCursorMove}
	on:touchmove={onCursorMove}
	on:mouseup={onCursorUp}
	on:touchend={onCursorUp} />

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
	on:mousedown={onCursorDown}
	on:touchstart={onCursorDown}
	on:mouseup={onNodeCursorUp}
	on:touchend={onNodeCursorUp}
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
			{:else if result}
				{#if result.error}
					<span class="error">{result.error.message}</span>
				{:else}
					{@html result.value}
				{/if}
			{:else}
				{node.name}
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
