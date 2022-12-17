import { get } from 'svelte/store'

import nodes from '$lib/node/nodes'
import arrows from '$lib/arrow/arrows'
import nearestDivisor from '$lib/nearest/divisor'
import GRID_SPACING from '$lib/grid/spacing'

const shareUrl = (
	origin: string | URL,
	{ view = null }: { view?: 'main' | null } = {}
) =>
	new URL(
		`/?nodes=${encodeURIComponent(
			JSON.stringify(
				Object.entries(get(nodes)).map(([id, node]) => [
					id,
					nearestDivisor(node.x, GRID_SPACING),
					nearestDivisor(node.y, GRID_SPACING),
					node.name,
					node.color,
					node.rotation
				])
			)
		)}&arrows=${encodeURIComponent(
			JSON.stringify(get(arrows).map(({ from, to }) => [from, to]))
		)}${view ? `&view=${encodeURIComponent(view)}` : ''}`,
		origin
	).href

export default shareUrl
