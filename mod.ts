type Vector<N> = number[] & { length: N }

const euclidean =
<N>
(a: Vector<N>, b: Vector<N>) => Math.sqrt(
    a   .map((_, i) => (a[i] - b[i])**2)
        .reduce((prev, curr) => prev + curr, 0)
)

const manhattan =
<N>
(a: Vector<N>, b: Vector<N>) =>
    a   .map((_, i) => Math.abs(a[i] - b[i]))
        .reduce((prev, curr) => prev + curr, 0)

const hamming =
(a: number, b: number) =>
    [...(a ^ b).toString(2)]
        .map(Number)
        .reduce((prev, curr) => prev + curr, 0)

const jaccard =
<T>
(a: Set<T>, b: Set<T>) => 
    a.intersection(b).size / a.union(b).size

const sorensenDice =
<T>
(a: Set<T>, b: Set<T>) => 
    2*a.intersection(b).size / (a.size + b.size)

const size =
<N>
(v: Vector<N>) =>
    euclidean(v, v.map(() => 0) as Vector<N>)

const dot =
<N>
(a: Vector<N>, b: Vector<N>) =>
    a   .map((_, i) => a[i] * b[i])
        .reduce((prev, curr) => prev + curr, 0)

const cosineSim =
<N>
(a: Vector<N>, b: Vector<N>) =>
    dot(a, b) / size(a) / size(b)

const features = `
    딸기
    바나나
    수박
    망고
    멜론
    키위
    오렌지
    사과
`.trim().replaceAll(" ", "").split("\n")

const fromRecord =
(data: Record<string, number>) => ({
    vector: features.map(feature => data[feature] || 0),
    bits:
        parseInt(
            features.map(feature => data[feature] > 0 ? 1 : 0
        ).join(""), 2),
    set: new Set(features.filter(feature => data[feature] > 0)),
})

const format =
(n: number) =>
    Math.round(n * 100) / 100

const objMap =
<V, O>
(f: (entry: [string, V]) => [string, O]) => 
(obj: Record<string, V>) =>
    Object.fromEntries(
        Object.entries(obj).map(f)
    )

const row =
(a_: Record<string, number>, b_: Record<string, number>) => {
    const a = fromRecord(a_)
    const b = fromRecord(b_)
    const result = {
        euclidean: euclidean(a.vector, b.vector),
        manhattan: manhattan(a.vector, b.vector),
        hamming: hamming(a.bits, b.bits),
        jaccard: jaccard(a.set, b.set),
        sorensenDice: sorensenDice(a.set, b.set),
        cosineSim: cosineSim(a.vector, b.vector),
    }
    return objMap<number, number>(([k, v]) => [k, format(v)])(result)
}

const 희수 = {
    딸기: 1,
    바나나: 1,
    수박: 1,
    망고: 1,
    멜론: 1,
}

const 경아 = {
    딸기: 0.5,
    바나나: 0.5,
    키위: 1,
    오렌지: 1,
    사과: 1,
    망고: -1,
    멜론: -1,
}

const 민종 = {
    딸기: 1,
    수박: 1,
    사과: 1,
    멜론: 1,
}

console.table({
    "H & K": row(희수, 경아),
    "H & M": row(희수, 민종),
    "K & M": row(경아, 민종),
})