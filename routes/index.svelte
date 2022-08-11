<script lang="ts">
	import { onMount } from 'svelte'

	import type Node from '$lib/node'
	import type Arrow from '$lib/arrow'
	import view from '$lib/view/store'
	import mouse from '$lib/mouse/store'
	import nodes from '$lib/node/nodes'
	import arrows from '$lib/arrow/arrows'
	import currentArrow from '$lib/arrow/current'
	import center from '$lib/center'
	import currentTool from '$lib/tool/current'
	import nextId from '$lib/id'
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'
	import NodeElement from '../components/Node.svelte'
	import ArrowElement from '../components/Arrow.svelte'
	import ToolButton from '../components/Tool.svelte'

	let dragging = false

	const onMouseDown = () => {
		switch ($currentTool) {
			case 'pointer':
				dragging = true
				break
			case 'node':
				if (!$mouse) break

				$nodes = {
					...$nodes,
					[nextId()]: {
						x: $mouse.position.x,
						y: $mouse.position.y,
						name: 'Variable',
						color: 'red'
					}
				}

				break
		}
	}

	const onMouseMove = () => {
		if (!(dragging && $mouse)) return

		$center = {
			x: $center.x + $mouse.movement.x,
			y: $center.y + $mouse.movement.y
		}
	}

	const onMouseUp = () => {
		switch ($currentTool) {
			case 'pointer':
				dragging = false
				break
			case 'arrow':
				$currentArrow = null
				break
		}
	}

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

<svelte:body on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<MetaImage />
<MetaTitle />
<MetaDescription />

<header>
	<span class="styles">Styles</span>
</header>
<main on:mousedown={onMouseDown}>
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
			{#each $arrows as { from, to }}
				<ArrowElement arrow={{ from: $nodes[from], to: $nodes[to] }} />
			{/each}
			{#if $currentArrow && $mouse}
				<ArrowElement
					arrow={{ from: $nodes[$currentArrow], to: $mouse.position }}
					padding={false}
				/>
			{/if}
		</svg>
	{/if}
</main>
<footer>
	<ToolButton tool="pointer">☝</ToolButton>
	<ToolButton tool="node">⬤</ToolButton>
	<ToolButton tool="arrow">↗</ToolButton>
	<ToolButton tool="delete">🗑️</ToolButton>
</footer>

<style lang="scss">
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		right: 1rem;
		top: 1rem;
		z-index: 100;
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
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 50%;
		bottom: 1rem;
		padding: 0.5rem 1rem;
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 0 20px 5px rgba(black, 0.1);
		transform: translateX(-50%);
		z-index: 100;

		> :global(button + button) {
			margin-left: 1rem;
		}
	}
</style>
