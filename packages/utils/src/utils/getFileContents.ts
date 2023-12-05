import nReadlines from 'n-readlines'
import path from 'path'

export function getFileContents({
	filename = 'input',
}: { filename?: string } = {}) {
	return new nReadlines(path.resolve(path.dirname(process.argv[1]), filename))
}
