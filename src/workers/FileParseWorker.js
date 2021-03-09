import parseFunc from 'vue-ast'
addEventListener('message', e => {
  const { data } = e
  const templateLength = '<template>'.length
  let templates = ''
  if (data) {
    templates = data.substr(data.indexOf('<template>') + templateLength, data.indexOf('</template>') - templateLength)
  }
  // console.log('templates', templates)
  if (templates) {
    if (templates.length > 0) {
      postMessage(preNetwork(templates))
    } else {
      postMessage('')
    }
  } else {
    postMessage('')
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

const parseCase = function (name, option) {
  const symbols = []
  if (option.chain) {
    symbols.push('-')
  }
  if (option.snake) {
    symbols.push('_')
  }
  const regexp = new RegExp(symbols.join('|'), 'g')
  let output = name.split(regexp).map(name => lowerToUpperCamel(name)).join('')
  // lowerCamel -> upperCamel用
  return lowerToUpperCamel(output)
}

const lowerToUpperCamel = function (name) {
  if (name && typeof name === 'string' && name.length > 0) {
    return name.slice(0, 1).toUpperCase() + name.slice(1)
  } else {
    return name
  }
}

export default {}
