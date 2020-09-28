// 响应式
function defineReactive(obj, key, val) {
  //obj 当前所在的对象
  //,key 要响应的名称
  // ,val 响应对应的值
  observe(val)

//Object.defineProperty()
// 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

  Object.defineProperty(obj, key, {

      get() {
        console.log('get ' + key);
        return val
      },
      set(newVal) {
        if (newVal !== val) {
          observe(newVal)
          console.log('set ' + key + ':' + newVal);
          val = newVal
        }
      }
})

}

function observe(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return

  }

  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })

}

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: {
    a: 1
  },
  arr: [1, 2, 3]
}


obj.foo

console.log('obj.foo ' + obj.foo);
