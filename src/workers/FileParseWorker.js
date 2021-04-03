import parseFunc from 'vue-ast'
import { parseCase } from '@/utility/common.js'
addEventListener('message', e => {
  const res = e.data
  // console.log('res', res)
  const data = res.text
  const name = res.name
  const templateLength = '<template>'.length
  const scriptLength = '<script>'.length
  let templates = ''
  let script = ''
  if (data) {
    const templateStart = data.indexOf('<template>') + templateLength
    const templateEnd = data.indexOf('</template>') - templateStart
    const scriptStart = data.indexOf('<script>') + scriptLength
    const scriptEnd = data.indexOf('</script>') - scriptStart
    templates = data.substr(templateStart, templateEnd)
    script = data.substr(scriptStart, scriptEnd)
  }
  // console.log('templates', templates)
  if (templates) {
    if (templates.length > 0) {
      postMessage({ data: preNetwork(templates, script), name: name })
    } else {
      postMessage({ data: {}, name: name })
    }
  } else {
    postMessage({ data: {}, name: name })
  }
})

const preNetwork = function (templates, script, userOption, option = { chain: true }, lessDomName = [], onlyDomName = []) {
  // userOptionにより、userが容易にoption,less,onlyの追加ができる
  moduleLocalComponent(script)
  const parsed = astParseNetworkData(parseFunc(templates), option, lessDomName, onlyDomName)
  return parsed
}

const moduleLocalComponent = function (script) {
  // モジュールシステム内のローカル登録
  // importを見る -> 実際に登録されるまで監視する
  const { parse } = require('@babel/parser')
  console.log('script', script)
  const ast = parse(script, { sourceType: 'module' })
  console.log('ast', ast)
}

const astParseNetworkData = function (domAST, option, lessDomName, onlyDomName) {
  let lessDomObject = {}
  let onlyDomObject = {}
  let hitDomCount = {}
  for (let key of Object.keys(lessDomName)) {
    lessDomObject[parseCase(key, option)] = true
    onlyDomObject[parseCase(key, option)] = true
  }
  let targets = [domAST]
  while (targets.length > 0) {
    const que = targets.shift()
    const targetName = parseCase(que.name, option)
    if ((onlyDomName.length === 0 || onlyDomObject.hasOwnProperty(targetName)) && !lessDomObject.hasOwnProperty(targetName)) {
      if (!hitDomCount.hasOwnProperty(targetName)) {
        hitDomCount[targetName] = 0
      }
      hitDomCount[targetName]++
    }
    if (que.hasOwnProperty('children')) {
      targets.push(...que.children)
    }
  }
  return { counter: hitDomCount, pure: domAST }
}
export default {}
