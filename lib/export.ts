import type Node from './node'
import type Arrow from './arrow'
import nearestDivisor from './nearest/divisor'
import GRID_SPACING from './grid/spacing'

const rotationToLabelPosition = (rotation: 0 | 90 | 180 | 270) => {
	switch (rotation) {
		case 0:
			return 'above'
		case 90:
			return 'right'
		case 180:
			return 'below'
		case 270:
			return 'left'
	}
}

const exportDocument = (
	nodes: Record<string, Node>,
	arrows: Arrow<string>[]
) => {
	return `\\usepackage{tikz}
\\usetikzlibrary{arrows}

\\begin{tikzpicture}[->, >=stealth', thick, every node/.style={circle, fill, inner sep=2pt, scale=1.3}, every label/.append style={rectangle}]
${Object.entries(nodes)
	.map(
		([id, node]) =>
			`\t\\node at (${[
				nearestDivisor(node.x, GRID_SPACING),
				nearestDivisor(node.y, GRID_SPACING)
			].join(', ')}) (${id}) [label=${rotationToLabelPosition(
				node.rotation
			)}:{${node.name}}]{};`
	)
	.join('\n')}
${arrows.map(arrow => `\t\\draw (${arrow.from}) -- (${arrow.to});`).join('\n')}
\\end{tikzpicture}`
}

export default exportDocument
