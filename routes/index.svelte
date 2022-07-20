<script lang="ts">
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'
</script>

<MetaImage />
<MetaTitle />
<MetaDescription />

<header>
	<span id="hamburger">☰</span>
	<div id="view">
		<span id="zoom">100%</span><span id="styles">Styles</span>
	</div>
</header>
<main>
	<textarea placeholder="LaTeX code" bind:value={code} />
	<p>
		{#if !code}
			<span class="placeholder">Rendered LaTeX</span>
		{:else if result.error}
			<span class="error">{result.error.message}</span>
		{:else}
			{@html result.value}
		{/if}
	</p>
</main>
<footer>
	<span id="pointer" />
</footer>

<style lang="scss">
	:global {
		@import 'katex/dist/katex';
	}

	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	textarea {
		min-width: 25rem;
		min-height: 10rem;
		padding: 0.5rem 0.7rem;
		background: rgba(black, 0.1);
		border-radius: 0.5rem;
	}

	p {
		min-height: 1.5rem;
		margin-top: 1rem;
	}

	.placeholder {
		opacity: 0.5;
	}

	.error {
		color: red;
	}
</style>
