type GeneratorFunction = () => Generator

export function co(generator: GeneratorFunction): Promise<unknown> {
    const gen = generator()

    const step = (nextFn: () => IteratorResult<unknown>): Promise<unknown> => {
        let res: IteratorResult<unknown>
        try {
            res = nextFn()
        }
        catch (error) {
            return Promise.reject(error)
        }

        if (res.done)
            return Promise.resolve(res.value)

        const value = toPromise(res.value)
        if (isPromise(value)) {
            return Promise.resolve(value).then(
                value => step(() => gen.next(value)),
                error => step(() => gen.throw(error)),
            )
        }

        return step(() => gen.next(value))
    }

    return step(() => gen.next())
}

// ------------------ Promise helpers ------------------

function toPromise(value: unknown): unknown | Promise<unknown> {
    if (!value)
        return value
    if (isPromise(value))
        return value
    if (Array.isArray(value))
        return arrayToPromise(value)
    if (isGeneratorFunction(value))
        return co(value)
    if (isGenerator(value))
        return co(() => value)
    if (isObject(value))
        return objectToPromise(value)
    return value
}

function isGeneratorFunction(value: unknown): value is GeneratorFunction {
    return typeof value === 'function' && value.constructor.name === 'GeneratorFunction'
}

function isGenerator(value: unknown): value is Generator {
    return isObject(value) && typeof value.next === 'function' && typeof value.throw === 'function'
}

function isPromise(value: unknown): value is Promise<unknown> {
    return isObject(value) && typeof value.then === 'function'
}

function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object'
}

function arrayToPromise(arr: unknown[]): Promise<unknown[]> {
    return Promise.all(arr.map(toPromise))
}

function objectToPromise(obj: Record<string, unknown>): Promise<Record<string, unknown>> {
    const promises: Promise<unknown>[] = []
    const result: Record<string, unknown> = Object.create(Object.getPrototypeOf(obj))
    const keys = Object.keys(obj)

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const promise = toPromise(obj[key])
        if (isPromise(promise)) {
            result[key] = undefined
            promises.push(promise.then((value) => {
                result[key] = value
            }))
        }
        else {
            result[key] = promise
        }
    }

    return Promise.all(promises).then(() => result)
}
