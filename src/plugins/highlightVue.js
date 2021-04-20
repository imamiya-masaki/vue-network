import { escapeHTML } from './lib/utils.js'
import hljs from 'highlight.js'

function hasValueOrEmptyAttribute (value) {
  return Boolean(value || value === '')
}

function lineByLineHighilght (language, body, hilightLine = {}) {
  let state = null
  const output = []
  if (!body) {
    return ''
  }
  const bodySplit = body.split('\n')
  let maxLength = String(bodySplit.length).length
  let mainHilight = {}
  let closeMainHilight = {}
  let closeSubHilight = {}
  let hilightStyle = {}
  for (let line = 0; line < bodySplit.length; line++) {
    hilightStyle = {}
    if (hilightLine.hasOwnProperty(line)) {
      // hilightLineをcloseに展開する。
      const mainLines = hilightLine[line].value
      closeSubHilight[hilightLine[line].end] = line
      for (let mainLine of Object.values(mainLines)) {
        // domの情報が来るはずなので、start,endで同一な数が複数個こないことが前提
        if (mainHilight.hasOwnProperty(mainLine.start)) {
          console.error('why is multiple identical number there?')
        }
        mainHilight[mainLine.start] = mainLine.end
      }
    }
    if (mainHilight.hasOwnProperty(line)) {
      // mainHilightを新たに発火させ、closeできるように予約する
      closeMainHilight[mainHilight[line]] = line
    }
    if (Object.keys(closeMainHilight).length > 0) {
      hilightStyle['background-color'] = '#ffd700' // yellow
      hilightStyle.width = '100vh'
    } else if (Object.keys(closeSubHilight).length > 0) {
      hilightStyle['background-color'] = '#fffacd'
      hilightStyle.width = '100vh'
    }

    let HilightStyleSlice = []
    for (const [key, value] of Object.entries(hilightStyle)) {
      // 後々hilight時にstyleを適用するかもしれないので汎用的に
      HilightStyleSlice.push(`${key}: ${value};`)
    }
    const row = bodySplit[line]
    const result = hljs.highlight(language, row, true, state)
    let setLineNumber = `<div style="float: left; width: ${maxLength}7px;"><span style="float: right; padding-right: 5px;">${line}:</span></div>`
    let setLine = `<div class="lineNumber" style="${HilightStyleSlice.join(' ')}">${setLineNumber}<span class="line-value">${result.value}</span></div>`
    if (result.value.length === 0) {
      setLine = `<div class="lineNumber">${setLineNumber}</div></br>`
    }
    state = result.top
    output.push(setLine)
    if (closeMainHilight.hasOwnProperty(line)) {
      // これメモリリーク起きないよね...? <- 解放されるよね...?
      // 起きる場合は、weakMap,weakSetに代用するか、他のもので用いる
      delete closeMainHilight[line]
    }
    if (closeSubHilight.hasOwnProperty(line)) {
      delete closeSubHilight[line]
    }
  }
  return output.join('')
}

const Component = {
  props: ['language', 'code', 'autodetect', 'highlightLines'],
  data: function () {
    return {
      detectedLanguage: '',
      unknownLanguage: false
    }
  },
  watch: {
    highlightLines: function (value) {
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
      return lineByLineHighilght(this.language, this.code, this.highlightLines)
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
