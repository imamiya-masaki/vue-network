import parseFunc from 'vue-ast'
import { parseCase, lowerToUpperCamel, camelVueCase } from '@/utility/common.js'
addEventListener('message', e => {
  const res = e.data
  // console.log('res', res)
  const data = res.text
  const name = res.name
  const path = res.path
  const rawPath = res.rawPath
  const templateLength = '<template>'.length
  const scriptLength = '<script>'.length
  const absoluteAlias = '@' // これ後々ユーザーが選べるもしくは、設定ファイルから読み取れるようにしたい。
  let templates = ''
  let script = ''
  let userOption = {}
  userOption.absoluteAlias = absoluteAlias
  let nameInPath = path
  nameInPath.push(name)
  const absolutePath = nameInPath.join('/')
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
      postMessage(
        {
          data: preNetwork(templates, script, name, path, userOption),
          name: name,
          path: absolutePath,
          rawPath: rawPath,
          rawTemplate: templates,
          rawScript: script
        }
      )
    } else {
      postMessage({ data: {}, name: name })
    }
  } else {
    postMessage({ data: {}, name: name })
  }
})

const preNetwork = function (templates, script, name = '', path = [], userOption = {}, option = { chain: true }, lessDomName = [], onlyDomName = []) {
  // userOptionにより、userが容易にoption,less,onlyの追加ができる
  const registedComponents = moduleLocalComponent(script, name, path, userOption.absoluteAlias)
  const parsed = astParseNetworkData(parseFunc(templates), option, lessDomName, onlyDomName, registedComponents)
  return parsed
}

const moduleLocalComponent = function (script, name, path, absoluteAlias) {
  // モジュールシステム内のローカル登録
  // importを見る -> 実際に登録されるまで監視する
  const { parse } = require('@babel/parser')
  const ast = parse(script, { sourceType: 'module' })
  let rootRegistImports = {}
  let rootRegistComponents = {}
  console.log('moduleLocalComponent', name, path)
  if (ast.type === 'File' && ast.hasOwnProperty('program') && ast.program.type === 'Program') {
    const bodys = ast.program.body
    for (let body of bodys) {
      switch (body.type) {
        case 'ImportDeclaration':
          rootRegistImports = Object.assign(rootRegistImports, funcImportDeclaration(body, path, absoluteAlias))
          break
        case 'ExportDefaultDeclaration':
          for (const [key, value] of Object.entries(funcExportDeclaration(body))) {
            if (rootRegistImports.hasOwnProperty(value)) {
              rootRegistComponents[key] = rootRegistImports[value]
            } else {
              console.error('why is not import?', value)
            }
          }
          break
      }
    }
  }
  return rootRegistComponents
}
const absoluteSourcePath = function (source, path, absoluteAlias) {
  let variablePath = path
  let sourceSplit = source.split('/')
  // errorで処理を中断するのか別のリカバリー処理をするのかは別途考える。
  for (let i = 0; i < sourceSplit.length; i++) {
    const target = sourceSplit[i]
    switch (target) {
      case '..':
        if (variablePath.length > 0) {
          variablePath.pop()
        } else {
          console.error('I cant go back to path anymore')
        }
        break
      case '.':
        if (i !== 0) {
          console.error('Can only be used with the first index')
        }
        break
      case absoluteAlias:
        if (i !== 0) {
          // これ例えばworker-loader!の時とかどうしよ...
          // ↑これ一応vueファイルだけを見る名目だけなら無視できるか...?
          console.error('Can only be used with the first index')
        }
        variablePath = []
        break
      default:
        variablePath.push(target)
    }
  }
  if (variablePath[variablePath.length - 1].match(/.+\.vue/)) {
    // vueファイルだったら...
    variablePath[variablePath.length - 1] = camelVueCase(variablePath[variablePath.length - 1])
  }
  return variablePath.join('/')
}
const funcImportDeclaration = function (ImportDeclaration, path, absoluteAlias = '@') {
  // ImportDeclaration
  let sourceText = ''
  if (ImportDeclaration.hasOwnProperty('source') && ImportDeclaration.source) {
    // ここも絶対参照しかうけとれないし、srcを基準とした相対 -> 絶対にするようにしないと...
    sourceText = absoluteSourcePath(ImportDeclaration.source.value, path, absoluteAlias) || ''
    // console.log('sourceText', absoluteSourcePath(sourceText, path, absoluteAlias))
  }
  let specifiers = []
  let registImports = {}
  let sameErrNames = {} // ここでエラー処理入れても良いな
  if (ImportDeclaration.hasOwnProperty('specifiers')) {
    for (let specify of ImportDeclaration.specifiers) {
      if (specify.type === 'ImportDefaultSpecifier' || specify.type === 'ImportSpecifier') {
        // とりあえず、defaultと名前指定の両方を、specifiersに追加する
        // 後々defaultと名前指定で処理変更しても良いかも
        if (specify.local.type === 'Identifier') {
          specifiers.push(specify.local.name)
          if (registImports.hasOwnProperty(specify.local.name)) {
            sameErrNames[specify.local.name] = 1
            console.error('sameErrName', specify.local.name)
          }
          registImports[specify.local.name] = sourceText
        }
      }
    }
  }
  return registImports
}

const funcExportDeclaration = function (ExportDeclaration) {
  // exportの中身
  // ここからcomponents
  const declaration = ExportDeclaration.declaration
  let registComponents = {} // keyで登録された名前 valueでimportを参照するための名前
  if (declaration.type === 'ObjectExpression' && declaration.hasOwnProperty('properties')) {
    for (let property of declaration.properties) {
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
  return registComponents
}

const astParseNetworkData = function (domAST, option, lessDomName, onlyDomName, registedComponents) {
  let lessDomObject = {}
  let onlyDomObject = {}
  let hitDomCount = {}
  let hitDomHilightLine = {}
  for (let key of Object.keys(lessDomName)) {
    lessDomObject[parseCase(key, option)] = true
    onlyDomObject[parseCase(key, option)] = true
  }
  let targets = [domAST]
  while (targets.length > 0) {
    const que = targets.shift()
    if (que.hasOwnProperty('string') && que.string) {
      continue
    }
    const targetName = parseCase(que.name, option)
    let setName = targetName
    if (registedComponents.hasOwnProperty(targetName)) {
      setName = registedComponents[targetName]
    }
    if ((onlyDomName.length === 0 || onlyDomObject.hasOwnProperty(targetName)) && !lessDomObject.hasOwnProperty(targetName)) {
      if (!hitDomCount.hasOwnProperty(setName)) {
        hitDomCount[setName] = 0
        hitDomHilightLine[setName] = []
      }
      const line = {}
      if (que.hasOwnProperty('startLine')) {
        line.startLine = que.startLine
      }
      if (que.hasOwnProperty('endLine')) {
        line.endLine = que.endLine
      }
      hitDomHilightLine[setName].push(line)
      hitDomCount[setName]++
    }
    if (que.hasOwnProperty('children')) {
      targets.push(...que.children)
    }
  }
  return { counter: hitDomCount, pure: domAST, hilightLine: hitDomHilightLine }
}
export default {}
