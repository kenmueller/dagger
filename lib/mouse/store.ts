import { get, readable } from 'svelte/store'

import { browser } from '$app/env'

import type Mouse from '.'
import view from '$lib/view/store'
import center from '$lib/center'

const mouse = readable<Mouse | null>(null, set => {
	if (!browser) return set(null)

	const setMouse = (event: MouseEvent) => {
		const $view = get(view)
		const $center = get(center)

		if (!$view) return set(null)

		set({
			position: {
				x: event.clientX - $view.width / 2 - $center.x,
				y: -event.clientY + $view.height / 2 - $center.y
			},
			movement: {
				x: event.movementX,
				y: -event.movementY
			}
		})
	}

	document.body.addEventListener('mousemove', setMouse)

	return () => {
		document.body.removeEventListener('mousemove', setMouse)
	}
})

export default mouse
