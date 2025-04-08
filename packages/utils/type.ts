export function isObject (obj: unknown): obj is object {
    return typeof obj === 'object' && obj !== null;
}

export function isFunction (fn: unknown): fn is Function {
    return typeof fn === 'function'
}

export function isMap<K = unknown, V = unknown> (map: unknown): map is Map<K, V> {
    return Object.prototype.toString.call(map) === '[object Map]'
}

export function isArray<T = unknown> (arr: unknown): arr is Array<T> {
    return Array.isArray(arr)
}
