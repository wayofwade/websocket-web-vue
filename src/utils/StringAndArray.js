const StringAndArray = {
  StringToArray: function (str) {
    let strs = [] // 定义一数组
    if (str === null) {
      return strs
    } else {
      strs = str.split(',') // 字符分割
    }
    return strs
  },
  ArrayToString: function (list) {
    let nodesStr = ''
    if (list.length === 0) {
      return nodesStr
    } else {
      nodesStr = list.join(',')
    }
    return nodesStr // 0,1
  }
}
export { // 很关键
  StringAndArray
}
