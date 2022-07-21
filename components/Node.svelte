<script lang="ts">
	import type Node from '$lib/node'
	import toRef from '$lib/ref/to'
	import latex from '$lib/latex'
	import CenteredInput from './Input/Centered.svelte'

	const latexRef = toRef(latex)

	export let node: Node

	let input: HTMLInputElement | null = null
	$: input?.focus()

	let editing = false

	$: result = latexRef(node.name)

	const edit = (event: MouseEvent) => {
		if (!editing) event.stopPropagation()
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
</script>

<svelte:window on:keyup={blurWithKey} />
<svelte:body on:click={blurWithClick} />

<div
	class="outer"
	style="--color: {node.color}; --x: {node.x}px; --y: {node.y}px;"
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
		<p on:click={edit}>
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

	$radius: 15px;

	.outer {
		position: absolute;
		left: calc(50vw + var(--x));
		top: calc(50vh - var(--y));
		width: $radius * 2;
		height: $radius * 2;
		background: var(--color);
		border-radius: 50%;
	}

	.inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		left: 50%;
		bottom: $radius * 2 + 5px;
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

	.placeholder {
		opacity: 0.5;
	}

	.error {
		color: red;
	}
</style>
