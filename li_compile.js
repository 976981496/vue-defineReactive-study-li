class Compiler {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)
        if (this.$el) {
            this.compiler(this.$el)

        }
    }


    compiler(el) {
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                this.compileElement(node)
            } else if (this.isInter(node)) {
                this.compileText(node)
            }

            if (node.childNodes&&node.childNodes.length>0) {
                this.compiler(node)
                
            }

        })


    }

    isElement(node) {
        return node.nodeType === 1
    }

    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    // text模板的编译
    compileText(node) {
        this.update(node, RegExp.$1, 'text')

    }

    compileElement(node) {
        const nodeAttrs = node.attributes
        Array.from(nodeAttrs).forEach(attr => {
            const attrName = attr.name
            const exp = attr.value

            if (this.isDirective(attrName)) {
                const dir = attrName.substring(2)
                this[dir] && this[dir](node, exp)
            }
        })
    }

    //dir 指令
    // exp  表达式
    //节点

    update(node, exp, dir) {
        const fn = this[dir + 'Updater']
        fn && fn(node, this.$vm[exp])

        new Watcher(this.$vm, exp, function (val) {
            fn && fn(node, val)

        })
    }

    isDirective(attr) {
        return attr.indexOf('l-') === 0

    }

    textUpdater(node, value) {
        node.textContent = value
    }
    text(node, exp) {
        this.update(node, exp, 'text')

    }
    htmlUpdater(node, value) {
        node.innerHTML = value
    }
    html(node, exp) {
        this.update(node, exp, 'html')

    }
}