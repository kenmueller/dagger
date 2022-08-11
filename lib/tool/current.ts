import { writable } from 'svelte/store'

import type Tool from '.'

const currentTool = writable<Tool>('pointer')

export default currentTool
