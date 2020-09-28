//数据响应式
function defineReactive(obj, key, val) {

    // 递归
  observe(val)

  // 创建一个Dep和当前key一一对应
  const dep = new Dep()

  
  // 对传入obj进行访问拦截
  Object.defineProperty(obj, key, {
    get() {
      //watcher调用的时候创建了全局变量
      // 当前响应进入的时候 创建watcher收集
      // 依赖收集在这里
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set(newVal) {

      if (newVal !== val) {
        console.log('set ' + key + ':' + newVal);
        // 如果传入的newVal依然是obj，需要做响应化处理
        observe(newVal)

        val = newVal
        // 通知更新
        dep.notify()
      }
    }
  })


}
//判断数据类型  选择如何做响应式

function observe(obj) {

  if (typeof obj !== 'object' && obj !== null) {
    // 希望传入的是obj
    return
  }

  // 创建Observer实例
  new Observer(obj)


}

// 根据对象类型决定如何做响应化
class Observer {
  constructor(value) {
    this.value = value

    // 判断其类型
    if (typeof value == 'object') {

      this.walk(value)

    }


    //数组类型判断

  }
  // 对象数据响应化
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }

  // 数组数据响应化，待补充

}



// 观察者:保存更新函数，值发生变化调用更新函数
// const watchers = []
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm
    this.key = key
    this.updateFn = updateFn

    //每一次触发watcher  就定义一个全局变量 调用当前的值
    //getter函数调用  
    // Dep.target静态属性上设置为当前watcher实例
    Dep.target = this
    this.vm[this.key] //读取

    Dep.target = null
  }


  //响应式在deps遍历的时候执行了更新
  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }



}


// 创建LVue构造函数
class LVue {
  constructor(options) {
    // 保存选项
    this.$options = options
    this.$data = options.data

    // 响应化处理
    observe(this.$data)
    // 代理
    proxy(this, '$data')

    // 创建编译器
    new Compiler(options.el, this)

  }
}

// Dep：依赖，管理某个key相关所有Watcher实例
class Dep {
  constructor() {
    this.deps = []
  }
  //dep就是一个watch实例
  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}



// 代理函数，方便用户直接访问$data中的数据
function proxy(vm, sourceKey) {
  // vm[sourceKey]就是vm[$data]
  Object.keys(vm[sourceKey]).forEach(key => {
    // 将$data中的key代理到vm属性中
    Object.defineProperty(vm, key, {
      get() {
        return vm[sourceKey][key]
      },
      set(newVal) {
        vm[sourceKey][key] = newVal
      }
    })
  })
}