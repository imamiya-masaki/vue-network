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
  let maxViewLength = 0
  let resultViewLength = 600
  for (const row of bodySplit) {
    // 一番長い列の表示サイズが欲しい
    // もっといい方法ありそう...
    // 例えばlengthで求めて、全角サイズのものは正規表現でmatch -> lengthでいい感じに求める
    // 等した場合ってどっちが速いんやろ...記事書きたい
    let length = 0
    for (let i = 0; i < row.length; i++) {
      let c = row.charCodeAt(i)
      if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
        length += 1
      } else {
        length += 2
      }
    }
    if (length > maxViewLength) {
      maxViewLength = length
    }
  }
  if (resultViewLength < Math.ceil(maxViewLength * 8.65)) {
    resultViewLength = Math.ceil(maxViewLength * 8.65)
  }
  for (let line = 0; line < bodySplit.length; line++) {
    hilightStyle = {}
    const row = bodySplit[line]
    const result = hljs.highlight(language, row, true, state)
    let size = resultViewLength
    console.log('result', result, resultViewLength)
    if (hilightLine.hasOwnProperty(line)) {
      // hilightLineをcloseに展開する。
      const mainLines = hilightLine[line].value
      closeSubHilight[hilightLine[line].end] = line
      for (let mainLine of Object.values(mainLines)) {
        // domの情報が来るはずなので、start,endで同一な数が複数個来る場合は、同一行で完結しているモノ
        if (mainHilight.hasOwnProperty(mainLine.start)) {
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
      hilightStyle.width = `${size}px`
      hilightStyle.height = '21px'
    } else if (Object.keys(closeSubHilight).length > 0) {
      hilightStyle['background-color'] = '#fffacd'
      hilightStyle.width = `${size}px`
      hilightStyle.height = '21px'
    }
    let HilightStyleSlice = []
    for (const [key, value] of Object.entries(hilightStyle)) {
      // 後々hilight時にstyleを適用するかもしれないので汎用的に
      HilightStyleSlice.push(`${key}: ${value};`)
    }
    let setLineNumber = `<div style="float: left; width: ${maxLength}7px;"><span style="float: right; padding-right: 5px;">${line}:</span></div>`
    let setLine = `<div class="lineNumber" style="${HilightStyleSlice.join(' ')}">${setLineNumber}<span class="line-value" >${result.value}</span></div>`
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
  props: ['language', 'code', 'highlightLines', 'lineSize'],
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
      // autoDetect使いたい場合はgithubのhilight.js参照
      let result = {}
      return lineByLineHighilght(this.language, this.code, this.highlightLines)
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
