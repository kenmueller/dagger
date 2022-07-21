<script lang="ts">
	import type Arrow from '$lib/arrow'

	export let arrow: Arrow
</script>

<svg
	><line
		x1={arrow.from.x}
		y1={arrow.from.y}
		x2={arrow.to.x}
		y2={arrow.to.y}
		stroke="black"
		stroke-width="2"
		marker-end="url(#arrow)"
	/></svg
>
