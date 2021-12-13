// Partial/sort of incorrect polyfill of proposed https://tc39.es/proposal-iterator-helpers
if (!globalThis.Iterator) {
  globalThis.Iterator = class Iterator {
    static from(iterable) {
      return iterable[Symbol.iterator]()
    }

    toArray() {
      return [...this]
    }

    forEach(f) {
      for (const x of this)
        f(x)
    }

    * map(f) {
      for (const x of this)
        yield f(x)
    }

    * filter(f) {
      for (const x of this)
        if (f(x))
          yield x
    }

    * take(n) {
      let limit = n

      if (limit < 1)
        return

      for (const x of this) {
        yield x

        limit--
        if (limit < 1)
          return
      }
    }
  }

  Object.setPrototypeOf(
    Object.getPrototypeOf(
      Object.getPrototypeOf(
        [][Symbol.iterator]()
      )
    ),
    new Iterator()
  )
}
