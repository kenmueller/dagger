import renderMathInElement from 'katex/dist/contrib/auto-render.js'

const latex = (code: string) => {
	try {
		const element = document.createElement('div')

		element.textContent = code

		renderMathInElement(element, {
			delimiters: [{ left: '$', right: '$', display: false }]
		})

		return element.innerHTML
	} catch (error) {
		if (error instanceof Error)
			error.message = error.message.replace('KaTeX parse error: ', '')

		throw error
	}
}

export default latex
