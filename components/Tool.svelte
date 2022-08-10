<script lang="ts">
	import type Tool from '$lib/tool'

	export let thisTool: Tool
	export let tool: Tool
</script>

<button
	aria-current={tool === thisTool ? 'true' : undefined}
	on:click={() => (tool = thisTool)}
>
	<slot />
</button>

<style lang="scss">
	[aria-current] {
		background: rgba(colors.$blue, 0.1);
	}
</style>
