<script lang="ts">
	import type Position from '$lib/position'
	import type Node from '$lib/node'
	import NODE_RADIUS from '$lib/node/radius'
	import toRef from '$lib/ref/to'
	import latex from '$lib/latex'
	import CenteredInput from './Input/Centered.svelte'

	const latexRef = toRef(latex)

	export let node: Node
	export let center: Position

	let input: HTMLInputElement | null = null
	$: input?.focus()

	let editing = false

	$: result = latexRef(node.name)

	const edit = (event: MouseEvent) => {
		event.stopPropagation()
		editing = true
	}

	const onInput = ({ target }: Event) => {
		const name = (target as HTMLInputElement | null)?.value
		if (name) node = { ...node, name }
	}

	const blurWithKey = ({ key }: KeyboardEvent) => {
		if (key === 'Enter') editing = false
	}

	const blurWithClick = ({ target }: MouseEvent) => {
		if (input && input !== target) editing = false
	}

	let dragging = false

	const onMouseDown = (event: MouseEvent) => {
		event.stopPropagation()
		dragging = true
	}

	const onMouseMove = ({ movementX: x, movementY: y }: MouseEvent) => {
		if (!dragging) return
		node = { ...node, x: node.x + x, y: node.y - y }
	}

	const onMouseUp = () => {
		dragging = false
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
		--center-x: {center.x}px;
		--center-y: {center.y}px;
		--radius: {NODE_RADIUS}px;
		--color: {node.color};
	"
	on:mousedown={onMouseDown}
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
	:global {
		@import 'katex/dist/katex';
	}

	.outer {
		position: absolute;
		left: calc(50% + var(--x) + var(--center-x));
		top: calc(50% - var(--y) - var(--center-y));
		width: calc(2 * var(--radius));
		height: calc(2 * var(--radius));
		background: var(--color);
		border-radius: 50%;
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
