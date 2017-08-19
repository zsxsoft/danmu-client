'use strict'
const url = require('url')
const path = require('path')

class ImageCache {
  constructor () {
    this.cache = []
    this.regex = null
  }

  test (callback, text) {
    if (!this.regex) return
    // Initialize here
    let ret = null
    this.regex.lastIndex = 0
    // Analyze text
    while ((ret = this.regex.exec(text)) !== null) {
      let src = ret[2]
      let imageWidth = parseInt(ret[1])
      let imageObject = this.getImage(src)
      if (imageObject === null) {
        imageObject = this.buildCache(src, imageWidth)
      }
      callback(ret, imageObject)
    }
    this.regex.lastIndex = 0
  }

  getImage (src) {
    return this.cache[src] || null
  }

  buildCache (src, width) {
    let parsedUrl = url.parse(src)
    let image = window.document.createElement('img')
    image.src = parsedUrl.protocol ? src : path.resolve('./', './' + src)
    image.width = width
    image.onerror = function () {
      window.console.error('Cannot load ' + src)
      this.cache[src].error = true
    }
    this.cache[src] = {
      error: false,
      element: image,
      width: width
    }
    return this.cache[src]
  }
}
let images = new ImageCache()

function tryCatch (fn, fnCatch) {
  try {
    fn()
  } catch (e) {
    fnCatch(e)
  }
}

module.exports = {
  imageAnalyzer: images,
  tryCatch
}
