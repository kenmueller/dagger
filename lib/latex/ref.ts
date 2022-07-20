import type Ref from '../ref'
import latex from '.'

const latexRef = (code: string): Ref<string> => {
	try {
		return { error: null, value: latex(code) }
	} catch (error) {
		return { error: error as Error }
	}
}

export default latexRef
