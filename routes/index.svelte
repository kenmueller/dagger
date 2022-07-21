<script lang="ts">
	import type Node from '$lib/node'
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'
	import NodeElement from '../components/Node.svelte'

	let nodes: Node[] = []
</script>

<MetaImage />
<MetaTitle />
<MetaDescription />

<svg
	><defs
		><marker
			id="arrow"
			viewBox="0 0 10 10"
			refX="5"
			refY="5"
			markerWidth="6"
			markerHeight="6"
			orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker
		></defs
	></svg
>

<header>
	<span class="hamburger">☰</span>
	<div class="view">
		<span class="zoom">100%</span>
		<span class="styles">Styles</span>
	</div>
</header>
{#each nodes as node}
	<NodeElement {node} />
{/each}
<footer>
	<button class="pointer">☝</button>
	<button
		class="node"
		on:click={() =>
			(nodes = [...nodes, { name: 'Variable', color: 'red', x: 0, y: 0 }])}
	>
		⬤
	</button>
	<button class="arrow">↗</button>
	<button class="delete">🗑️</button>
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
