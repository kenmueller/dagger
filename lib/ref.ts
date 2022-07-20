type Ref<Value> = { error: null; value: Value } | { error: Error }

export default Ref
