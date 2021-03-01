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

const preNetwork = function (templates) {
  const parsed = parseFunc(templates)
  return parsed
}

export default {}
