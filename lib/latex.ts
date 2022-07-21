import katex from 'katex'

const latex = (code: string) => {
	try {
		return katex.renderToString(code)
	} catch (error) {
		if (error instanceof Error)
			error.message = error.message.replace('KaTeX parse error: ', '')

		throw error
	}
}

export default latex
