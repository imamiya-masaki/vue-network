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
      postMessage({ data: preNetwork(templates, script, name), name: name })
    } else {
      postMessage({ data: {}, name: name })
    }
  } else {
    postMessage({ data: {}, name: name })
  }
})

const preNetwork = function (templates, script, name = '', userOption, option = { chain: true }, lessDomName = [], onlyDomName = []) {
  // userOptionにより、userが容易にoption,less,onlyの追加ができる
  moduleLocalComponent(script, name)
  const parsed = astParseNetworkData(parseFunc(templates), option, lessDomName, onlyDomName)
  return parsed
}

const moduleLocalComponent = function (script, name) {
  // モジュールシステム内のローカル登録
  // importを見る -> 実際に登録されるまで監視する
  const { parse } = require('@babel/parser')
  console.log('script', script)
  const ast = parse(script, { sourceType: 'module' })
  console.log('ast', name, ast)
}

const funcImportDeclaration = function (ImportDeclaration) {
  // ImportDeclaration
  let sourceText = ''
  if (ImportDeclaration.hasOwnProperty('source') && ImportDeclaration.source) {
    // ここも絶対参照しかうけとれないし、srcを基準とした相対 -> 絶対にするようにしないと...
    sourceText = ImportDeclaration.source.value || ''
  }
  let specifiers = []
  if (ImportDeclaration.hasOwnProperty('specifiers')) {
    for (let specify of ImportDeclaration.specifiers) {
      if (specify.type === 'ImportDefaultSpecifier' || specify.type === 'ImportSpecifier') {
        // とりあえず、defaultと名前指定の両方を、specifiersに追加する
        // 後々defaultと名前指定で処理変更しても良いかも
        if (specify.local.type === 'Identifier') {
          specifiers.push(specify.local.name)
        }
      }
    }
  }
  console.log('funcImportDeclaration', sourceText, specifiers)
  return { source: sourceText, specifiers: specifiers }
}

const funcExporttDeclaration = function (ExportDeclaration) {
  // exportの中身
  // ここからcomponents
  let registComponents = {} // keyで登録された名前 valueでimportを参照するための名前
  if (ExportDeclaration.type === 'ObjectExpression' && ExportDeclaration.hasOwnProperty('properties')) {
    for (let property of ExportDeclaration.properties) {
      if (property.type === 'ObjectProperty' && property.hasOwnProperty('key') && property.hasOwnProperty('value')) {
        switch (property.key.name) {
          case 'components':
            if (property.value.type === 'ObjectExpression' && property.value.properties) {
              for (let componentProperty of property.value.properties) {
                if (componentProperty.type === 'ObjectProperty') {
                  if (componentProperty.hasOwnProperty('key') && componentProperty.hasOwnProperty('value')) {
                    // keyを[key]のように、追加できると思うが、
                    // とりあえず、変数ではなく、文字列のみで処理するようにする <- いずれ改修して変数も対応できるようにしようかな...?
                    let reserveKey = ''
                    let reserveValue = ''
                    if (componentProperty.key.type === 'Identifier') {
                      reserveKey = componentProperty.key.name
                    }
                    if (componentProperty.value.type === 'Identifier') {
                      reserveValue = componentProperty.value.name
                    }
                    registComponents[reserveKey] = reserveValue
                  }
                }
              }
            }
            break
        }
      }
    }
  }
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
