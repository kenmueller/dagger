import type Ref from '.'

const toRef =
	<Args extends unknown[], Result>(transform: (...args: Args) => Result) =>
	(...args: Args): Ref<Result> => {
		try {
			return { error: null, value: transform(...args) }
		} catch (error) {
			return { error: error as Error }
		}
	}

export default toRef
