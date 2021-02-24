
addEventListener('message', e => {
  const { data } = e
  postMessage(data * 5)
})
