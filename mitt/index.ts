export type EventType = string | symbol;

export type Handler = <T = unknown>(data: T) => void;


export default function mitt<Events extends Record<EventType, unknown>> () {
    const all = new Map<keyof Events, Handler<Events<keyof Events>>>();

    return {
        on (type: EventType, cb: Handler) {
            let handlers = all.get(type);
            if (Array.isArray(handlers)) {
                handlers.push(cb);
                return;
            }

            handlers = [ cb ];
            all.set(type, handlers);
        },
        emit (type: EventType, payload: any) {
            const handlers = all.get(type);
            if (!handlers) return;

            handlers.forEach(handler => handler(payload));
        },
        off (type: EventType, handler?: Handler) {
            if (!handler) {
                all.delete(type);
                return;
            }

            const handlers = all.get(type);
            const index = handlers.findIndex(h => h === handler);
            if (index > -1)
                handlers.splice(handlers.indexOf(type), 1);
        },
        clear () {
            all.clear();
        }
    }
}