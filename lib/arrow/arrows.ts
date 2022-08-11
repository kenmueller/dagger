import { writable } from 'svelte/store'

import type Arrow from '.'

const arrows = writable<Arrow<string>[]>([])

export default arrows
