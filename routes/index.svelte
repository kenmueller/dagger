<script lang="ts">
	import { onMount } from 'svelte'

	import type Node from '$lib/node'
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'
	import NodeElement from '../components/Node.svelte'

	let nodes: Node[] = []
	let tool: 'pointer' | 'arrow' | 'node' | 'delete' = 'pointer'

	onMount(() => {
		Object.defineProperty(window, 'nodes', { get: () => nodes })
	})
</script>

<MetaImage />
<MetaTitle />
<MetaDescription />

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

<header>
	<span class="hamburger">☰</span>
	<div class="view">
		<span class="zoom">100%</span>
		<span class="styles">Styles</span>
	</div>
</header>
{#each nodes as node}
	<NodeElement bind:node />
{/each}
<footer>
	<button on:click={() => (tool = 'pointer')}>☝</button>
	<button on:click={() => (tool = 'node')}>⬤</button>
	<button on:click={() => (tool = 'arrow')}>↗</button>
	<button on:click={() => (tool = 'delete')}>🗑️</button>
</footer>

<style lang="scss">
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		top: 1rem;
		left: 1rem;
		right: 1rem;
	}

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		right: 1rem;
	}
</style>
