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
    let setLineNumber = `<div style="float: left; width: ${maxLength}2px;"><span style="float: right;">${line}:</span></div>`
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
      // if (this.autoDetect) {
      //   result = hljs.highlightAuto(this.code)
      //   this.detectedLanguage = result.language
      // } else {
      //   result = hljs.highlight(this.language, this.code, this.ignoreIllegals)
      //   this.detectedLanguage = this.language
      // }
      // console.log('result', result)
      // return result.value
    },
    autoDetect () {
      return !this.language || hasValueOrEmptyAttribute(this.autodetect)
    },
    ignoreIllegals () {
      return true
    }
  },
  // this avoids needing to use a whole Vue compilation pipeline just
  // to build Highlight.js
  render (createElement) {
    return createElement('pre', {}, [
      createElement('code', {
        class: this.className,
        domProps: { innerHTML: this.highlighted }
      })
    ])
  }
  // template: `<pre><code :class="className" v-html="highlighted"></code></pre>`
}

export default {
  install (Vue) {
    Vue.component('highlightjs', Component)
  },
  component: Component
}
