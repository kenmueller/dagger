<script lang="ts">
	import type Tool from '$lib/tool'
	import currentTool from '$lib/tool/current'

	export let tool: Tool
</script>

<button
	aria-current={$currentTool === tool ? 'true' : undefined}
	on:click={() => ($currentTool = tool)}
>
	<slot />
</button>

<style lang="scss">
	[aria-current] {
		background: rgba(colors.$blue, 0.1);
	}
</style>
