import renderMathInElement from 'katex/dist/contrib/auto-render.js'

const latex = (code: string) => {
	const element = document.createElement('div')

	element.textContent = code

	renderMathInElement(element, {
		delimiters: [{ left: '$', right: '$', display: false }]
	})

	return element.innerHTML
}

export default latex
