import { writable } from 'svelte/store'

import type Node from '.'

const nodes = writable<Record<string, Node>>({})

export default nodes
