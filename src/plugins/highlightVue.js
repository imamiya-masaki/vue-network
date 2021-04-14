import { escapeHTML } from './lib/utils.js'
import hljs from 'highlight.js'

function hasValueOrEmptyAttribute (value) {
  return Boolean(value || value === '')
}

function lineByLineHighilght (language, body, hilightLine) {
  let state = null
  const output = []
  const bodySplit = body.split('\n')
  let maxLength = String(bodySplit.length).length
  for (let line = 0; line < bodySplit.length; line++) {
    const row = bodySplit[line]
    const result = hljs.highlight(language, row, true, state)
    let setLineNumber = `<div style="float: left; width: ${maxLength}7px;"><span style="float: right; padding-right: 5px;">${line}:</span></div>`
    let setLine = `<div class="lineNumber">${setLineNumber}<span class="line-value">${result.value}</span></div>`
    if (result.value.length === 0) {
      setLine = `<div class="lineNumber">${setLineNumber}</div></br>`
    }
    state = result.top
    output.push(setLine)
  }
  return output.join('')
}

const Component = {
  props: ['language', 'code', 'autodetect', 'highlightLine'],
  data: function () {
    return {
      detectedLanguage: '',
      unknownLanguage: false
    }
  },
  computed: {
    className () {
      if (this.unknownLanguage) return ''

      return 'hljs ' + this.detectedLanguage
    },
    highlighted () {
      // autoDetect禁止にするか...
      if (!this.autoDetect && !hljs.getLanguage(this.language)) {
        console.warn(`The language "${this.language}" you specified could not be found.`)
        this.unknownLanguage = true
        return escapeHTML(this.code)
      }
      let result = {}
      return lineByLineHighilght(this.language, this.code)
    },
    autoDetect () {
      return !this.language || hasValueOrEmptyAttribute(this.autodetect)
    },
    ignoreIllegals () {
      return true
    }
  },
  render (createElement) {
    return createElement('pre', {}, [
      createElement('code', {
        class: this.className,
        domProps: { innerHTML: this.highlighted }
      })
    ])
  }
}

export default {
  install (Vue) {
    Vue.component('highlightjs', Component)
  },
  component: Component
}
