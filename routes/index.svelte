<script lang="ts">
	import { onMount } from 'svelte'

	import type Node from '$lib/node'
	import type Tool from '$lib/tool'
	import view from '$lib/view/store'
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'
	import NodeElement from '../components/Node.svelte'
	import ToolButton from '../components/Tool.svelte'

	let nodes: Node[] = []
	let center = { x: 0, y: 0 }

	let tool: Tool = 'pointer'

	let dragging = false

	const onMouseDown = () => {
		if (tool !== 'pointer') return
		dragging = true
	}

	const onMouseMove = ({ movementX: x, movementY: y }: MouseEvent) => {
		if (!dragging) return
		center = { x: center.x + x, y: center.y - y }
	}

	const onMouseUp = () => {
		dragging = false
	}

	const onLayoutClick = ({ clientX: x, clientY: y }: MouseEvent) => {
		if (!($view && tool === 'node')) return

		nodes = [
			...nodes,
			{
				x: x - $view.width / 2 - center.x,
				y: -y + $view.height / 2 - center.y,
				name: 'Variable',
				color: 'red'
			}
		]
	}

	const onNodeClick = (node: Node) => {
		if (tool !== 'delete') return

		const nodeIndex = nodes.indexOf(node)
		if (nodeIndex < 0) return

		nodes = nodes.filter((_node, index) => index !== nodeIndex)
	}

	onMount(() => {
		Object.defineProperty(window, 'nodes', {
			get: () => nodes,
			set: (newNodes: Node[]) => (nodes = newNodes),
			configurable: true
		})

		return () => {
			delete (window as { nodes?: Node[] }).nodes
		}
	})
</script>

<svelte:body on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<svelte:head>
	<svg>
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
	</svg>
</svelte:head>

<MetaImage />
<MetaTitle />
<MetaDescription />

<header>
	<span class="styles">Styles</span>
</header>
<main on:mousedown={onMouseDown} on:click={onLayoutClick}>
	<span class="x" style="--y: {center.y}px;" />
	<span class="y" style="--x: {center.x}px;" />
	{#each nodes as node}
		<NodeElement bind:node {center} {tool} on:click={() => onNodeClick(node)} />
	{/each}
</main>
<footer>
	<ToolButton thisTool="pointer" bind:tool>☝</ToolButton>
	<ToolButton thisTool="node" bind:tool>⬤</ToolButton>
	<ToolButton thisTool="arrow" bind:tool>↗</ToolButton>
	<ToolButton thisTool="delete" bind:tool>🗑️</ToolButton>
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
		position: absolute;
		background: rgba(black, 0.1);
		z-index: 100;
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
