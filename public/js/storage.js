//storage instance
const Storage = class {

  setItem(key, value) {
    // this[key] = value
    window.localStorage.setItem(key, value)
  }

  removeItem(key) {
    window.localStorage.removeItem(key)
  }

  clear() {
    window.localStorage.clear()
  }

  getItem(key) {
    // return this[key]
    return window.localStorage.getItem(key)
  }
}


export default Storage