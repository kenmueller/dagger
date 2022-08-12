import { writable } from 'svelte/store'

const nextId = writable(0)

export default nextId
