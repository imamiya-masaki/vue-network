import parseFunc from 'vue-ast'
import { parseCase, lowerToUpperCamel } from '@/utility/common.js'
addEventListener('message', e => {
  const res = e.data
  // console.log('res', res)
  const data = res.text
  const name = res.name
  const templateLength = '<template>'.length
  let templates = ''
  if (data) {
    templates = data.substr(data.indexOf('<template>') + templateLength, data.indexOf('</template>') - templateLength)
  }
  // console.log('templates', templates)
  if (templates) {
    if (templates.length > 0) {
      postMessage({ data: preNetwork(templates), name: name })
    } else {
      postMessage({ data: {}, name: name })
    }
  } else {
    postMessage({ data: {}, name: name })
  }
})

const preNetwork = function (templates, userOption, option = { chain: true }, lessDomName = [], onlyDomName = []) {
  // userOptionにより、userが容易にoption,less,onlyの追加ができる
  const parsed = astParseNetworkData(parseFunc(templates), option, lessDomName, onlyDomName)
  return parsed
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
