(function(window) {

    // 版本号
    var VERSION = '0.0.3';
    // 更新
    /* 
    Publisher：
        1.改变订阅存储格式
        2.addSubscriber()增加参数type、typeName，需传入类与类名
        3.removeSubscriber()增加参数typeName，需传入类名
    
    *************************** v.0.0.2 ***************************
    KeyMap： 
        1.由String: Int改为String: Array
        2.增加基础函数不可修改 

    其他更新：
        1.增加Array.indexOf的兼容
    */

    // api
    /* 
    // KEYMAP部分：
    PAGE.getKeyMap() // 返回当前KEYMAP
    PAGE.setKeyMap(key, value) // 设置KEYMAP[key] = value
    PAGE.getValueByKey(key) // 通过key获取value，返回key、value键值对{key: value}
    PAGE.getKeyByValue(value) // 通过value获取key，返回key

    // 发布部分：
    PAGE.addSubscriber(typeName, type, fn) // 向发布器中添加一个订阅者及订阅函数，typeof fn === 'function'
    PAGE.removeSubscriber(typeName, name) // 通过函数名取消订阅
    PAGE.modifySubscriber(typeName, type) // 修改订阅者，用于更新订阅者

    // 按键事件：
    bindOnKeyDown(keyCode) // keyCode:键值

    // 附加：
    PAGE.publish(type) // 发布消息，无需调用
    makePublisher() // 创建一个新的发布器
    */

    // 示例
    /* 
    user = {
        name: 'chen',
        getName: function(e) { console.log(this); return this.name; }
    };
    PAGE.addSubscriber('user', user, user.getName);
    PAGE.removeSubscriber('user', 'getName')
    */

    function init() {
        // 键值映射及其操作函数
        var KeyMap = {
            up: [1, 38],
            down: [2, 40],
            left: [3, 37],
            right: [4, 39],

            enter: [13],
            back: [8, 48, 96, 126, 283, 339, 340],

            upPage: [33, 372],
            downPage: [34, 373],

            playPause: [85, 263],
            volUp: [259],
            volDown: [260],
            fastForward: [264],
            fastRewind: [265],
            mute: [261],
            track: [1060],

            number0: [48],
            number1: [49],
            number2: [50],
            number3: [51],
            number4: [52],
            number5: [53],
            number6: [54],
            number7: [55],
            number8: [56],
            number9: [57],

            setKeyMap: function(key, value) {
                if (key !== 'setKeyMap' && key !== 'getValueByKey' && key !== 'getKeyByValue') {
                    this[key].push(value);
                } else {
                    throw new Error("Can't modify the base function of KeyMap!");
                }
            },
            getValueByKey: function(key) {
                var temp = {};
                temp[key] = this[key];
                return temp;
            },
            getKeyByValue: function(value) {
                for (var i in this) {
                    if (this[i] instanceof Array && this[i].indexOf(value) !== -1) {
                        return i;
                    }
                }
            }
        };

        // 发布器
        var Publisher = {
            subscribers: {
                any: []
            },
            addSubscriber: function(typeName, type, fn) {
                typeName = typeName || 'any';
                if (typeof fn !== 'function') {
                    throw new Error("Publisher addSubscriber error: fn must be function!");
                }
                if (!typeName in this.subscribers) {
                    if (this.subscribers[typeName].indexOf(null) != -1) {
                        this.subscribers[typeName][this.subscribers[typeName].indexOf(null)] = fn;
                    } else {
                        this.subscribers[typeName].push(fn);
                    }
                } else {
                    this.subscribers[typeName] = [type, fn];
                }
            },
            removeSubscriber: function(typeName, name) {
                typeName = typeName || 'any';
                if (!typeName in this.subscribers) {
                    throw new Error("Publisher has no subscriber named '" + typeName + "'.");
                }
                for (var i = 1; i < this.subscribers[typeName].length; i++) {
                    if (this.subscribers[typeName][i] != null && this.subscribers[typeName][i].name === name) {
                        this.subscribers[typeName][i] = null;
                    }
                }
            },
            // modifySubscriber: function(typeName, type) {
            //     if (!typeName in this.subscribers) {
            //         throw new Error("Publisher has no subscriber named '" + typeName + "'.");
            //     }
            //     this.subscribers[typeName][0] = type;
            // },
            publish: function(type) {
                for (var key in this.subscribers) {
                    for (var i = 1; i < this.subscribers[key].length; i++) {
                        this.subscribers[key][i].apply(this.subscribers[key][0], [type]);
                    }
                }
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
            addSubscriber: function(typeName, type, fn) {
                this.__publisher.addSubscriber(typeName, type, fn);
            },
            removeSubscriber: function(typeName, name) {
                this.__publisher.removeSubscriber(typeName, name);
            },
            publish: function(type) {
                this.__publisher.publish(type)
            },

            bindOnKeyDown: function(keyCode) {
                this.publish(this.getKeyByValue(keyCode));
            }
        }
    }

    if (!'indexOf' in Array.prototype) {
        Array.prototype.indexOf = function(searchElement, fromIndex) {
            fromIndex = fromIndex || 0
            for (var i = fromIndex; i < this.length; i++) {
                if (this[i] === searchElement) {
                    return i
                }
            }
            return -1;
        }
    }

    window.makePublisher = init;
    window.PAGE = init();
})(window);