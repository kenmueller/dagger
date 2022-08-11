import { writable } from 'svelte/store'

/** From ID */
const currentArrow = writable<string | null>(null)

export default currentArrow
