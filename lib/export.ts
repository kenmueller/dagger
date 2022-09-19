import type Node from './node'
import type Arrow from './arrow'
import nearestDivisor from './nearest/divisor'
import GRID_SPACING from './grid/spacing'

const exportDocument = (
	nodes: Record<string, Node>,
	arrows: Arrow<string>[]
) => {
	return `\\usepackage{tikz}
\\usetikzlibrary{arrows}

\\begin{tikzpicture}[->, >=stealth', thick, every node/.style={circle, fill, inner sep=1.5pt}, every label/.append style={rectangle}]
${Object.entries(nodes)
	.map(
		([id, node]) =>
			`\t\\node at (${[
				nearestDivisor(node.x, GRID_SPACING),
				nearestDivisor(node.y, GRID_SPACING)
			].join(', ')}) (${id}) [label=above:{${node.name}}]{};`
	)
	.join('\n')}
${arrows.map(arrow => `\t\\draw (${arrow.from}) -- (${arrow.to});`).join('\n')}
\\end{tikzpicture}`
}

export default exportDocument
