import { isArray, isFunction, isMap, isObject } from '@lib-study/utils/type'
import mitt from './index'

describe('mitt', () => {
  let emitter: ReturnType<typeof mitt>;
  let emitter2: ReturnType<typeof mitt>;
  let fn: ReturnType<typeof vi.fn>
  let fn2: ReturnType<typeof vi.fn>

  beforeEach(() => {
    emitter = mitt()
    emitter2 = mitt()
    fn = vi.fn()
    fn2 = vi.fn()
  })

  it('test return value', () => {
    expect(emitter === emitter2).toBe(false)
    expect(isObject(emitter)).toBe(true)
    expect(isFunction(emitter.on)).toBe(true)
    expect(isFunction(emitter.emit)).toBe(true)
    expect(isFunction(emitter.off)).toBe(true)
    expect(isMap(emitter.all)).toBe(true)
    expect(emitter.all === emitter2.all).toBe(false)
  })

  it('test param', () => {
    const map = new Map()
    const emitter = mitt(map)
    expect(emitter.all === map).toBe(true)
  })

  it('test on', () => {
    emitter.on('click', fn)

    expect(emitter.all.has('click')).toBe(true)
    expect(isArray(emitter.all.get('click'))).toBe(true)

    const callbacks: Function[] = emitter.all.get('click')
    expect(callbacks.length).toBe(1)
    expect(callbacks.some(cb => cb === fn)).toBe(true)

    emitter.on('click', fn2)
    const callbacks2: Function[] = emitter.all.get('click')
    expect(callbacks2.length).toBe(2)
    expect(callbacks2.some(cb => cb === fn2)).toBe(true)
    expect(callbacks2.indexOf(fn2)).toBe(1)

    emitter.on('mouseover', fn2)
    expect(emitter.all.has('mouseover')).toBe(true)
    expect(isArray(emitter.all.get('mouseover'))).toBe(true)
    const callbacks3: Function[] = emitter.all.get('click')
    expect(callbacks3.some(cb => cb === fn2)).toBe(true)
    expect(emitter.all.size).toBe(2)
  })

  it('test emit', () => {
    emitter.on('click', fn)
    emitter.emit('click')
    expect(fn).toHaveBeenCalledTimes(1)

    fn.mockClear()
    emitter.on('click', fn)
    emitter.emit('click')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('test off', () => {
    emitter.on('click', fn)
    emitter.emit('click')
    expect(fn).toHaveBeenCalledTimes(1)

    fn.mockClear()
    emitter.off('click')
    emitter.emit('click')
    expect(fn).toHaveBeenCalledTimes(0)
    expect(emitter.all.has('click')).toBe(false)

    fn.mockClear()
    emitter.on('click', fn)
    emitter.on('click', fn)
    emitter.on('click', fn2)
    emitter.emit('click')
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn2).toHaveBeenCalledTimes(1)
    fn.mockClear()
    fn2.mockClear()
    emitter.off('click', fn2)
    emitter.emit('click')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('test clear', () => {
    emitter.on('click', fn)
    emitter.on('mousemove', fn)
    emitter.emit('click')
    emitter.emit('mousemove')
    expect(fn).toHaveBeenCalledTimes(2)
    fn.mockClear()
    emitter.clear()
    emitter.emit('click')
    expect(fn).toHaveBeenCalledTimes(0)
    expect(emitter.all.size).toBe(0)
  })

  it('test *', () => {
    emitter.on('click', fn)
    emitter.on('*', fn2)
    emitter.emit('click')
    expect(fn).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()

    fn.mockClear()
    fn2.mockClear()
    emitter.off('click')
    emitter.emit('click')
    expect(fn).toHaveBeenCalledTimes(0)
    expect(fn2).toHaveBeenCalledOnce()
  })
})
