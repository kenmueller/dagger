<script lang="ts">
	export let ref: HTMLInputElement | null = null
	export let placeholder: string | null = null
	export let value: string

	$: length = Math.max(placeholder?.length ?? 0, value.length)
</script>

<input
	bind:this={ref}
	placeholder={placeholder || undefined}
	bind:value
	style="--length: {length};"
/>

<style lang="scss">
	input {
		min-width: var(--min-width, 0);
		width: calc(var(--length) * 1ch + var(--horizontal-padding, 0) * 2);
		padding: var(--vertical-padding, 0) var(--horizontal-padding, 0);

		&,
		&::placeholder {
			text-align: center;
			font-family: monospace;
			font-size: 1rem;
		}
	}
</style>
