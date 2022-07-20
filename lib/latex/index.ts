import katex from 'katex'

const latex = (code: string) => katex.renderToString(code)

export default latex
