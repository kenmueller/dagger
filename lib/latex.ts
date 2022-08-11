import renderInElement from 'katex/dist/contrib/auto-render'

const latex = (code: string) => {
	try {
		const element = document.createElement('div')

		element.textContent = code

		renderInElement(element, {
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
