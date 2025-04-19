export type EventType = string | symbol;

export default function mitt(all?: any) {
    all = all || new Map()

    return {
        all,

        on(key: EventType, handler: Function) {
            if (all.has(key)) {
                all.get(key).push(handler)
            } else {
                all.set(key, [handler])
            }
        },

        emit(key: EventType, payload?: any) {
            let handlers = all.get(key)
            handlers && handlers.forEach(fn => fn(payload))

            handlers = all.get('*')
            handlers && handlers.forEach(fn => fn(payload))
        },

        off(key: EventType, handler?: Function) {
            if (handler) {
                const handlerList = all.get(key)
                if (handlerList) {
                    all.set(key, handlerList.filter(h => h !== handler))
                }
            } else {
                all.delete(key)
            }
        },

        clear() {
            all.clear()
        }
    }
}