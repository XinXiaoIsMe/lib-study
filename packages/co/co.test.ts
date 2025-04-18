import { co } from './index'

describe('co', () => {
  it('should call the generator function', () => {
    const fn = vi.fn(function* () { })
    co(fn)
    expect(fn).toHaveBeenCalled()
  })

  it('should return a Promise', () => {
    const fn = vi.fn(function* () { })
    const res = co(fn)
    expect(isPromise(res)).toBe(true)
  })

  it('should resolve generator yield Promise value', async () => {
    const result = await co(function* () {
      return yield fetchData()
    })
    expect(result).toBe(1)
  })

  it('should reject if generator yield a rejected Promise', async () => {
    try {
      await co(function* () {
        return yield getErrorPromise()
      })
    } catch (err) {
      expect(err).toBe('error')
    }
  })

  it('should yield multiple Promises sequentially', async () => {
    const result = await co(function* () {
      const a = yield fetchData()
      const b = yield fetchData()
      return [a, b]
    })
    expect(result).toEqual([1, 1])
  })

  it('should yield an array of Promises', async () => {
    const result = await co(function* () {
      return yield [Promise.resolve(1), Promise.resolve(2)]
    })
    expect(result).toEqual([1, 2])
  })

  it('should yield an object of Promises', async () => {
    const result = await co(function* () {
      return yield {
        a: Promise.resolve(1),
        b: Promise.resolve(2)
      }
    })
    expect(result).toEqual({
      a: 1,
      b: 2
    })
  })

  it('should yield a generator function', async () => {
    function* fn(): Generator<number[]> {
      const result = yield [1, 2]
      return result
    }

    const result = await co(function* () {
      return yield fn()
    })
    expect(result).toEqual([1, 2])
  })
})

// --------------------- helpers -----------------------
function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve(1), 10)
  })
}

function getErrorPromise() {
  return new Promise((_, reject) => {
    setTimeout(() => reject('error'), 10);
  });
}

function isPromise(val: any): val is Promise<unknown> {
  return typeof val === 'object' && val !== null && typeof val.then === 'function';
}