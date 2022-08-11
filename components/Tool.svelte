<script lang="ts">
	import type Tool from '$lib/tool'
	import currentTool from '$lib/tool/current'

	export let tool: Tool
	export let key: string

	const setTool = () => {
		$currentTool = tool
	}

	const onKeyDown = ({ key: currentKey }: KeyboardEvent) => {
		if (key === currentKey) setTool()
	}
</script>

<svelte:window on:keydown={onKeyDown} />

<button
	aria-current={$currentTool === tool ? 'true' : undefined}
	on:click={setTool}
>
	<slot />
</button>

<style lang="scss">
	[aria-current] {
		background: rgba(colors.$blue, 0.1);
	}
</style>
