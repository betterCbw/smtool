(function(window) {

    // 版本号
    var VERSION = '0.0.1';
    /* 
    // KEYMAP部分：
    PAGE.getKeyMap() // 返回当前KEYMAP
    PAGE.setKeyMap(key, value) // 设置KEYMAP[key] = value
    PAGE.getValueByKey(key) // 通过key获取value，返回key、value键值对{key: value}
    PAGE.getKeyByValue(value) // 通过value获取key，返回key

    // 发布部分：
    PAGE.addSubscriber(fn) // 向发布器中添加一个订阅函数，typeof fn === 'function'
    PAGE.removeSubscriber(name) // 通过函数名取消订阅

    // 按键事件：
    bindOnKeyDown(keyCode) // keyCode:键值

    // 附加：
    PAGE.publish(type) // 发布消息，无需调用
    makePublisher() // 创建一个新的发布器
    */

    function init() {
        // 键值映射及其操作函数
        var KeyMap = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            enter: 13,
            back: 96,

            setKeyMap: function(key, value) {
                this[key] = value;
            },
            getValueByKey: function(key) {
                var temp = {};
                temp[key] = this[key];
                return temp;
            },
            getKeyByValue: function(value) {
                for (var i in this) {
                    if (this[i] === value) {
                        return i;
                    }
                }
            }
        };

        // 发布器
        var Publisher = {
            subscribers: [],
            addSubscriber: function(fn) {
                if (typeof fn !== "function") {
                    throw new Error("Publisher addSubscriber error: fn must be function!");
                }
                this.subscribers.push(fn);
            },
            removeSubscriber: function(name) {
                this.subscribers.forEach(function(val, index, arr) {
                    if (name === val.name) {
                        arr[index] = null;
                    }
                })
            },
            publish: function(type) {
                this.subscribers.forEach(function(val, index, arr) {
                    arr[index](type);
                })
            },
        };

        // 返回值
        return {
            __keyMap: KeyMap,
            getKeyMap: function() {
                return this.__keyMap
            },
            setKeyMap: function(key, value) {
                this.__keyMap.setKeyMap(key, value);
            },
            getValueByKey: function(key) {
                return this.__keyMap.getValueByKey(key);
            },
            getKeyByValue: function(value) {
                return this.__keyMap.getKeyByValue(value);
            },

            __publisher: Publisher,
            addSubscriber: function(fn) {
                this.__publisher.addSubscriber(fn);
            },
            removeSubscriber: function(name) {
                this.__publisher.removeSubscriber(name);
            },
            publish: function(type) {
                this.__publisher.publish(type)
            },

            bindOnKeyDown: function(keyCode) {
                this.publish(this.getKeyByValue(keyCode));
            }
        }
    }

    window.makePublisher = init;
    window.PAGE = init();
})(window);