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

export { parseCase, lowerToUpperCamel }
