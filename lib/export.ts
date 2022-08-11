import type Node from './node'
import type Arrow from './arrow'

const exportDocument = (
	nodes: Record<string, Node>,
	arrows: Arrow<string>[]
) => {
	return `\\usepackage{tikz}
\\usetikzlibrary{positioning}
\\usetikzlibrary{arrows}

\\begin{tikzpicture}[->,>=stealth',node distance=2cm,
thick,main node/.style={circle,fill,inner sep=1.5pt}]
\\node[main node] (0) [label=above:{$Z$}]{};
\\node[main node] (1) [below =1cm of 0,label=above:{$W$}]{};
\\node[main node] (2) [below left =1cm of 1,label=left:$X$]{};
\\node[main node] (3) [below right =1cm of 1,label=right:$Y$] {};
\\path[every node/.style={font=\\sffamily\\small}]
   (2) edge node {} (3)
   (0) edge node {} (2)
   (0) edge node {} (3)
   (1) edge node {} (2)
   (1) edge node {} (3);
\\end{tikzpicture}`
}

export default exportDocument
