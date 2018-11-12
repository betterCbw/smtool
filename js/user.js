



(function (window) {

    // vsrsion
    var VERSION = '0.0.1';

    // some tool for sm
    var utils = {

        inherit: function object(o) {
            function F() { }
            F.prototype = o;
            return new F();
        }
    }


    function User(elements, select, init, focus) {
        if (!(elements instanceof Array)) {
            throw new TypeError('elements must be a Array!')
        }
        this.elements = elements;
        this.focus = focus || elements[0][0].id;
        this.select = select || '';
        this.bind();
        if (typeof init === 'function') {
            init(this.focus, this.select);
        }

    }

    User.prototype.setFocus = function (focus) {
        this.focus = focus;
        return this.focus;
    }

    User.prototype.find = function (id) {
        var i = 0;
        for (; i < this.elements.length; i++) {

            if (this.elements[i]) {
                var j = 0;
                for (; j < this.elements[i].length; j++) {

                    var node = this.elements[i][j];

                    if (node.id === id) {
                        return node;
                    }
                }
            }
        }
        return null;
    }

    User.prototype.bind = function () {
        var i = 0;
        var newElements = [];

        for (; i < this.elements.length; i++) {

            var preLine = this.elements[i - 1] || null,
                nxtLine = this.elements[i + 1] || null;

            var j = 0,
                nodes = this.elements[i];
            for (; j < nodes.length; j++) {
                var node = nodes[j];
                if (node) {
                    if (node.id) {
                        var left = nodes[j - 1],
                            up = preLine ? preLine[j] ? preLine[j] : null : null,
                            right = nodes[j + 1],
                            down = nxtLine ? nxtLine[j] ? nxtLine[j] : null : null;

                        node.left = left;
                        node.up = up;
                        node.right = right;
                        node.down = down;
                    }
                }
                else {
                    throw new Error('node  is null');
                }
            }
        }
    }


    User.prototype.move = function (type) {
        var keyMap = PAGE.getKeyMap();

        var focus = this.focus;
        var node = this.find(focus);

        for (i in keyMap) {
            if (keyMap.hasOwnProperty(i)) {
                if (i === type && node && node[i] && node[i].id) {
                    this.setFocus(node[i].id)
                    console.log(this)
                    this.moveCallback(node.id, this.focus, this.select);
                }
            }
        }
    }

    User.prototype.moveCallback = function (oldFocus, newFocus, select) {

    }

    // User.prototype.init = function () {
    //     if (this.select) {
    //         document.getElementById(this.focus).style.backgroundImage = "url(" + this.select + ")";
    //         this.moveCallback(this.focus, this.focus, this.select)
    //     }
    // }

    User.prototype.print = function () {
        //console.log(this.find('apple'))
        //console.log(this);
    }




    function createUser(elements, select, init, focus) {
        // 创建用户
        var user = new User(elements, select, init, focus);

        // 用户订阅
        PAGE.addSubscriber('user', user, user.move);

        // 响应键盘事件
        document.onkeydown = function (e) {
            PAGE.bindOnKeyDown(e.keyCode);
        }

        return user;
    }

    window.createUser = createUser;
})(window)

