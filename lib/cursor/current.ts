import { get, readable } from 'svelte/store'

import { browser } from '$app/environment'

import type Cursor from '.'
import cursorHandler from './handler'
import view from '$lib/view/store'
import center from '$lib/center'

const currentCursor = readable<Cursor | null>(null, set => {
	if (!browser) return set(null)

	const setCursor = cursorHandler(cursor => {
		const $view = get(view)
		if (!$view) return set(null)

		const $center = get(center)

		set({
			...cursor,
			x: cursor.x - $view.width / 2 - $center.x,
			y: -cursor.y + $view.height / 2 - $center.y
		})
	})

	document.body.addEventListener('mousemove', setCursor)
	document.body.addEventListener('touchmove', setCursor)

	return () => {
		document.body.removeEventListener('mousemove', setCursor)
		document.body.removeEventListener('touchmove', setCursor)
	}
})

export default currentCursor
