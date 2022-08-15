<script lang="ts">
	import type Tool from '$lib/tool'
	import currentTool from '$lib/tool/current'

	export let tool: Tool
	export let keys: string[]

	const setTool = () => {
		$currentTool = tool
	}

	const onKeyDown = ({ target, key: currentKey }: KeyboardEvent) => {
		if (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement
		)
			return

		if (keys.includes(currentKey)) setTool()
	}
</script>

<svelte:window on:keydown={onKeyDown} />

<button
	aria-label={tool}
	aria-current={$currentTool === tool ? 'true' : undefined}
	on:click={setTool}
>
	<slot />
</button>

<style lang="scss">
	button {
		padding: 0.5rem;
		border-radius: 0.35rem;

		> :global(svg) {
			height: 1.4rem;
		}
	}

	[aria-current] {
		background: rgba(colors.$blue, 0.2);
	}
</style>
