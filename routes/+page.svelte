<script lang="ts">
	import { onMount } from 'svelte'
	import copy from 'copy-to-clipboard'
	import { saveAs } from 'file-saver'

	import { page } from '$app/stores'

	import type Node from '$lib/node'
	import type Arrow from '$lib/arrow'
	import type Cursor from '$lib/cursor'
	import GRID_SPACING from '$lib/grid/spacing'
	import _exportDocument from '$lib/export'
	import roundToNearest from '$lib/nearest/round'
	import view from '$lib/view/store'
	import currentCursor from '$lib/cursor/current'
	import nodes from '$lib/node/nodes'
	import arrows from '$lib/arrow/arrows'
	import currentArrow from '$lib/arrow/current'
	import center from '$lib/center'
	import currentTool from '$lib/tool/current'
	import getId from '$lib/id'
	import cursorHandler from '$lib/cursor/handler'
	import getShareUrl from '$lib/share/url'
	import errorFromValue from '$lib/error/from/value'
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'
	import NodeElement from '../components/Node.svelte'
	import ArrowElement from '../components/Arrow.svelte'
	import ToolButton from '../components/Tool.svelte'
	import PointerIcon from '../images/Pointer.svelte'
	import NodeIcon from '../images/Node.svelte'
	import ArrowIcon from '../images/Arrow.svelte'
	import DeleteIcon from '../images/Trash.svelte'
	import HttpError from '$lib/error/http'

	$: viewType = $page.url.searchParams.get('view') || null

	const share = () => {
		const url = getShareUrl($page.url)

		copy(url)
		copy(url)

		alert('Copied graph URL to clipboard')
	}

	let saveImageLoading = false

	const saveImage = async () => {
		try {
			if (saveImageLoading) return
			saveImageLoading = true

			const response = await fetch(
				`https://sitepic.onrender.com?url=${encodeURIComponent(
					getShareUrl('https://dag.monster', { view: 'main' })
				)}&wait=load&width=1280&height=720`
			)

			if (!response.ok)
				throw new HttpError(response.status, await response.text())

			saveAs(await response.blob(), 'graph.png')
		} catch (error) {
			console.error(error)
			alert(errorFromValue(error).message)
		} finally {
			saveImageLoading = false
		}
	}

	const exportDocument = () => {
		const code = _exportDocument($nodes, $arrows)

		copy(code)
		copy(code)

		alert('Copied TikZ code to clipboard')
	}

	let draggingCursor: Cursor | null = null

	const onCursorDown = cursorHandler(cursor => {
		switch ($currentTool) {
			case 'pointer':
				draggingCursor = cursor
				break
			case 'node':
				if (!$currentCursor) break

				$nodes = {
					...$nodes,
					[getId()]: {
						x: roundToNearest($currentCursor.x, GRID_SPACING),
						y: roundToNearest($currentCursor.y, GRID_SPACING),
						name: 'Variable',
						color: 'red',
						rotation: 0
					}
				}

				break
		}
	})

	const onCursorMove = cursorHandler(cursor => {
		if (!draggingCursor) return

		$center = {
			x: $center.x + (cursor.x - draggingCursor.x),
			y: $center.y - (cursor.y - draggingCursor.y)
		}

		draggingCursor = cursor
	})

	const onCursorUp = cursorHandler(() => {
		switch ($currentTool) {
			case 'pointer':
				draggingCursor = null
				break
			case 'arrow':
				$currentArrow = null
				break
		}
	})
</script>

<svelte:body
	on:mousemove={onCursorMove}
	on:touchmove={onCursorMove}
	on:mouseup={onCursorUp}
	on:touchend={onCursorUp}
/>

<MetaImage />
<MetaTitle />
<MetaDescription />

{#if viewType === null}
	<header>
		<h1>DAG Monster</h1>
		<button on:click={saveImage} aria-busy={saveImageLoading || undefined}>
			{saveImageLoading ? 'Saving...' : 'Save as PNG'}
		</button>
		<button on:click={share}>Share</button>
		<button on:click={exportDocument}>Export</button>
	</header>
{/if}
<main on:mousedown={onCursorDown} on:touchstart={onCursorDown}>
	{#if viewType === null}
		<span class="x" style="--y: {$center.y}px;" />
		<span class="y" style="--x: {$center.x}px;" />
	{/if}
	{#each Object.entries($nodes) as [id, node] (id)}
		<NodeElement {id} {node} />
	{/each}
	{#if $view}
		<svg class="arrows" viewBox="0 0 {$view.width} {$view.height}">
			<defs>
				<marker
					id="arrow"
					viewBox="0 0 10 10"
					refX={5}
					refY={5}
					markerWidth={6}
					markerHeight={6}
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" />
				</marker>
			</defs>
			{#each $arrows as arrow}
				<ArrowElement
					{arrow}
					position={{ from: $nodes[arrow.from], to: $nodes[arrow.to] }}
				/>
			{/each}
			{#if $currentArrow && $currentCursor}
				<ArrowElement
					position={{ from: $nodes[$currentArrow], to: $currentCursor }}
					padding={false}
				/>
			{/if}
		</svg>
	{/if}
</main>
{#if viewType === null}
	<footer>
		<ToolButton tool="pointer" keys={['1', 'a', 'j']}>
			<PointerIcon />
		</ToolButton>
		<ToolButton tool="node" keys={['2', 's', 'k']}>
			<NodeIcon />
		</ToolButton>
		<ToolButton tool="arrow" keys={['3', 'd', 'l']}>
			<ArrowIcon />
		</ToolButton>
		<ToolButton tool="delete" keys={['4', 'f', ';']}>
			<DeleteIcon />
		</ToolButton>
	</footer>
{/if}

<style lang="scss">
	header {
		pointer-events: none;
		position: absolute;
		left: 1rem;
		right: 1rem;
		top: 1rem;
		display: flex;
		align-items: flex-start;
		z-index: 100;
	}

	h1 {
		margin: -0.2rem auto 0 0.2rem;
	}

	button {
		pointer-events: all;
		color: colors.$blue;
		transition: opacity 0.3s;

		&[aria-busy] {
			pointer-events: none;
			opacity: 0.5;
		}

		&:hover {
			opacity: 0.7;
		}

		& + & {
			margin-left: 1rem;
		}
	}

	main {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 0;
	}

	.x,
	.y {
		pointer-events: none;
		position: absolute;
		background: rgba(black, 0.1);
		z-index: 200;
	}

	.x {
		left: 0;
		right: 0;
		top: calc(50% - var(--y));
		height: 1px;
		transform: translateY(-50%);
	}

	.y {
		left: calc(50% + var(--x));
		top: 0;
		bottom: 0;
		width: 1px;
		transform: translateX(-50%);
	}

	.arrows {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 0;
	}

	footer {
		$spacing: 0.5rem;

		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 50%;
		bottom: 1rem;
		padding: $spacing;
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 0 20px 5px rgba(black, 0.1);
		transform: translateX(-50%);
		z-index: 100;

		> :global(button + button) {
			margin-left: $spacing;
		}
	}
</style>
