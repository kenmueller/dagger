<script context="module" lang="ts">
	export const load: Load = ({ url }) => ({
		props: { url }
	})
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit'

	import MetaBase from '../components/Meta/Base.svelte'
	import PageTransition from '../components/Transition/Page.svelte'

	export let url: URL
</script>

<MetaBase />

<PageTransition {url}>
	<slot />
</PageTransition>

<style lang="scss" global>
	*,
	::before,
	::after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: none;
		outline: none;
	}

	html,
	body {
		height: 100%;
	}

	body {
		overflow: hidden;
		font-family: font.$family;
	}

	a,
	button,
	input,
	textarea {
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
	}

	a {
		text-decoration: none;
	}

	button {
		cursor: pointer;
		background: none;

		&:disabled {
			cursor: default;
		}
	}

	svg {
		display: block;
	}
</style>
