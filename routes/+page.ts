import { error } from '@sveltejs/kit'

import type { PageLoad } from './$types'

import GRID_SPACING from '$lib/grid/spacing'
import nodes from '$lib/node/nodes'
import nextId from '$lib/id/next'
import arrows from '$lib/arrow/arrows'
import errorFromValue from '$lib/error/from/value'

export const load: PageLoad = ({ url }) => {
	try {
		const nodesString = url.searchParams.get('nodes')
		const nodesValue = (JSON.parse(nodesString || 'null') || []) as
			| [string, number, number, string, string, number][]

		const nodesMap = Object.fromEntries(
			nodesValue.map(([id, x, y, name, color, rotation]) => [
				id,
				{
					x: x * GRID_SPACING,
					y: y * GRID_SPACING,
					name,
					color,
					rotation: rotation as 0 | 90 | 180 | 270
				}
			])
		)

		nodes.set(nodesMap)

		nextId.set(
			Object.keys(nodesMap).reduce(
				(max, id) => Math.max(max, Number.parseInt(id)),
				-1
			) + 1
		)

		const arrowsString = url.searchParams.get('arrows')
		const arrowsValue = (JSON.parse(arrowsString || 'null') || []) as
			| [string, string][]

		arrows.set(arrowsValue.map(([from, to]) => ({ from, to })))

		return {}
	} catch (value) {
		const { code, message } = errorFromValue(value)
		throw error(code, message)
	}
}
