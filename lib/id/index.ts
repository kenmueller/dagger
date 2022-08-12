import { get } from 'svelte/store'

import nextId from './next'

const getId = () => {
	const id = get(nextId).toString()
	nextId.update(id => id + 1)

	return id
}

export default getId
