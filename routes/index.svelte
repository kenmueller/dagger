<script lang="ts" context="module">
	export const load: Load = ({ url }) => {
		try {
			const nodesString = url.searchParams.get('nodes')
			const nodesValue = (JSON.parse(nodesString || 'null') || []) as
				| [string, number, number, string, string][]

			const nodesMap = Object.fromEntries(
				nodesValue.map(([id, x, y, name, color]) => [
					id,
					{ x: x * GRID_SPACING, y: y * GRID_SPACING, name, color }
				])
			)

			nodes.set(nodesMap)

			nextId.set(
				Object.keys(nodesMap).reduce(
					(max, id) => Math.max(max, Number.parseInt(id)),
					-1
				) + 1
			)

			const arrowsString = url.searchParams.get('arrows')
			const arrowsValue = (JSON.parse(arrowsString || 'null') || []) as
				| [string, string][]

			arrows.set(arrowsValue.map(([from, to]) => ({ from, to })))

			return {}
		} catch (value) {
			const { code, message } = errorFromValue(value)
			return { status: code, body: message }
		}
	}
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit'
	import { onMount } from 'svelte'
	import copy from 'copy-to-clipboard'

	import { page } from '$app/stores'

	import type Node from '$lib/node'
	import type Arrow from '$lib/arrow'
	import type Cursor from '$lib/cursor'
	import GRID_SPACING from '$lib/grid/spacing'
	import _exportDocument from '$lib/export'
	import roundToNearest from '$lib/nearest/round'
	import view from '$lib/view/store'
	import currentCursor from '$lib/cursor/current'
	import nodes from '$lib/node/nodes'
	import arrows from '$lib/arrow/arrows'
	import currentArrow from '$lib/arrow/current'
	import center from '$lib/center'
	import currentTool from '$lib/tool/current'
	import getId from '$lib/id'
	import nextId from '$lib/id/next'
	import cursorHandler from '$lib/cursor/handler'
	import nearestDivisor from '$lib/nearest/divisor'
	import errorFromValue from '$lib/error/from/value'
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'
	import NodeElement from '../components/Node.svelte'
	import ArrowElement from '../components/Arrow.svelte'
	import ToolButton from '../components/Tool.svelte'
	import PointerIcon from '../images/Pointer.svelte'
	import NodeIcon from '../images/Node.svelte'
	import ArrowIcon from '../images/Arrow.svelte'
	import DeleteIcon from '../images/Trash.svelte'

	const share = () => {
		copy(
			new URL(
				`/?nodes=${encodeURIComponent(
					JSON.stringify(
						Object.entries($nodes).map(([id, node]) => [
							id,
							nearestDivisor(node.x, GRID_SPACING),
							nearestDivisor(node.y, GRID_SPACING),
							node.name,
							node.color
						])
					)
				)}&arrows=${encodeURIComponent(
					JSON.stringify($arrows.map(({ from, to }) => [from, to]))
				)}`,
				$page.url
			).href
		)

		alert('Copied graph URL to clipboard')
	}

	const exportDocument = () => {
		copy(_exportDocument($nodes, $arrows))
		alert('Copied TikZ code to clipboard')
	}

	let draggingCursor: Cursor | null = null

	const onCursorDown = cursorHandler(cursor => {
		switch ($currentTool) {
			case 'pointer':
				draggingCursor = cursor
				break
			case 'node':
				if (!$currentCursor) break

				$nodes = {
					...$nodes,
					[getId()]: {
						x: roundToNearest($currentCursor.x, GRID_SPACING),
						y: roundToNearest($currentCursor.y, GRID_SPACING),
						name: 'Variable',
						color: 'red'
					}
				}

				break
		}
	})

	const onCursorMove = cursorHandler(cursor => {
		if (!draggingCursor) return

		$center = {
			x: $center.x + (cursor.x - draggingCursor.x),
			y: $center.y - (cursor.y - draggingCursor.y)
		}

		draggingCursor = cursor
	})

	const onCursorUp = cursorHandler(() => {
		switch ($currentTool) {
			case 'pointer':
				draggingCursor = null
				break
			case 'arrow':
				$currentArrow = null
				break
		}
	})

	onMount(() => {
		Object.defineProperty(window, 'nodes', {
			get: () => $nodes,
			set: (newNodes: Record<string, Node>) => ($nodes = newNodes),
			configurable: true
		})

		Object.defineProperty(window, 'arrows', {
			get: () => $arrows,
			set: (newArrows: Arrow<string>[]) => ($arrows = newArrows),
			configurable: true
		})

		return () => {
			delete (window as { nodes?: Record<string, Node> }).nodes
			delete (window as { arrows?: Arrow<string>[] }).arrows
		}
	})
</script>

<svelte:body
	on:mousemove={onCursorMove}
	on:touchmove={onCursorMove}
	on:mouseup={onCursorUp}
	on:touchend={onCursorUp} />

<MetaImage />
<MetaTitle />
<MetaDescription />

<header>
	<h1>Dagger</h1>
	<button on:click={share}>Share</button>
	<button on:click={exportDocument}>Export</button>
</header>
<main on:mousedown={onCursorDown} on:touchstart={onCursorDown}>
	<span class="x" style="--y: {$center.y}px;" />
	<span class="y" style="--x: {$center.x}px;" />
	{#each Object.entries($nodes) as [id, node] (id)}
		<NodeElement {id} {node} />
	{/each}
	{#if $view}
		<svg class="arrows" viewBox="0 0 {$view.width} {$view.height}">
			<defs>
				<marker
					id="arrow"
					viewBox="0 0 10 10"
					refX={5}
					refY={5}
					markerWidth={6}
					markerHeight={6}
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" />
				</marker>
			</defs>
			{#each $arrows as arrow}
				<ArrowElement
					{arrow}
					position={{ from: $nodes[arrow.from], to: $nodes[arrow.to] }}
				/>
			{/each}
			{#if $currentArrow && $currentCursor}
				<ArrowElement
					position={{ from: $nodes[$currentArrow], to: $currentCursor }}
					padding={false}
				/>
			{/if}
		</svg>
	{/if}
</main>
<footer>
	<ToolButton tool="pointer" keys={['1', 'a', 'j']}>
		<PointerIcon />
	</ToolButton>
	<ToolButton tool="node" keys={['2', 's', 'k']}>
		<NodeIcon />
	</ToolButton>
	<ToolButton tool="arrow" keys={['3', 'd', 'l']}>
		<ArrowIcon />
	</ToolButton>
	<ToolButton tool="delete" keys={['4', 'f', ';']}>
		<DeleteIcon />
	</ToolButton>
</footer>

<style lang="scss">
	header {
		pointer-events: none;
		position: absolute;
		left: 1rem;
		right: 1rem;
		top: 1rem;
		display: flex;
		align-items: flex-start;
		z-index: 100;
	}

	h1 {
		margin: -0.2rem auto 0 0.2rem;
	}

	button {
		pointer-events: all;
		color: colors.$blue;
		transition: opacity 0.3s;

		&:hover {
			opacity: 0.7;
		}

		& + & {
			margin-left: 1rem;
		}
	}

	main {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 0;
	}

	.x,
	.y {
		pointer-events: none;
		position: absolute;
		background: rgba(black, 0.1);
		z-index: 200;
	}

	.x {
		left: 0;
		right: 0;
		top: calc(50% - var(--y));
		height: 1px;
		transform: translateY(-50%);
	}

	.y {
		left: calc(50% + var(--x));
		top: 0;
		bottom: 0;
		width: 1px;
		transform: translateX(-50%);
	}

	.arrows {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 0;
	}

	footer {
		$spacing: 0.5rem;

		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 50%;
		bottom: 1rem;
		padding: $spacing;
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 0 20px 5px rgba(black, 0.1);
		transform: translateX(-50%);
		z-index: 100;

		> :global(button + button) {
			margin-left: $spacing;
		}
	}
</style>
