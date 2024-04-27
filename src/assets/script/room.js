(() => {
    var 聊天室 = function () {
        this.消息服务 = null;
        this.回调函数 = {
            连接成功: function () { },
            连接失败: function () { },
            收到消息: function () { },
            断开连接: function () { },
        };
        this.名字 = "";
        this.加入密码 = "";
        this.管理密码 = "";
        this.公告 = "";
        this.已是管理员 = false;
        this.消息主题名 = '';
    }

    聊天室.加密密码 = function (密码) {
        var 密码字符串 = btoa(encodeURIComponent(密码));
        var 加密后 = '';
        for (var i = 0; i < 密码字符串.length; i++) {
            加密后 += '' + 密码字符串[i].charCodeAt(0);
        }
        return 加密后.substring(-16);
    }
    聊天室.检测聊天室是否存在 = async function (聊天室名字) {
        var 聊天室列表 = await 接口.获取聊天室列表();
        if (!聊天室列表 || 聊天室列表.length == 0) {
            return false;
        }

        for (var i = 0; i < 聊天室列表.length; i++) {
            if (聊天室列表[i].名字 == 聊天室名字) {
                return true;
            }
        }
        return false;
    }
    聊天室.创建聊天室 = async function (名字, 加入密码, 管理密码) {
        if (await 聊天室.已存在(名字)) {
            throw new Error('聊天室已存在, 无法创建!');
        }
        var 新聊天室 = new 聊天室();
        新聊天室.名字 = 名字;
        新聊天室.加入密码 = 聊天室.加密密码(加入密码);
        新聊天室.管理密码 = 聊天室.加密密码(管理密码);
        var 聊天室列表 = await 接口.获取数据('聊天室列表', []);
        聊天室列表.unshift({
            名字: 新聊天室.名字,
            加入密码: 新聊天室.加入密码,
            管理密码: 新聊天室.管理密码,
            创建时间: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
        await 接口.保存数据('聊天室列表', 聊天室列表);
        新聊天室.已是管理员 = true;
        return 新聊天室;
    }

    聊天室.加入聊天室 = async function (名字, 加入密码, 管理密码) {
        var 要加入的聊天室 = await 接口.根据名字获取聊天室(名字);
        if (!要加入的聊天室) {
            throw new Error('房间不存在');
        };
        if (要加入的聊天室.加入密码 != 聊天室.加密密码(加入密码)) {
            throw new Error('密码错误');
        }
        if (管理密码) {
            if (要加入的聊天室.管理密码 != 聊天室.加密密码(管理密码)) {
                throw new Error('管理密码错误!');
            }
        }
        var 新聊天室 = new 聊天室();
        新聊天室.名字 = 名字;
        新聊天室.加入密码 = 聊天室.加密密码(加入密码)
        if (管理密码) {
            新聊天室.管理密码 = 聊天室.加密密码(管理密码);
            新聊天室.已是管理员 = true;
        }
        console.log('加入聊天室成功!');
        return 新聊天室;
    }

    聊天室.已存在 = async function (聊天室名字) {
        var 聊天室列表 = await 接口.获取聊天室列表();
        for (var i = 0; i < 聊天室列表.length; i++) {
            if (聊天室列表[i].名字 == 聊天室名字) {
                return true;
            }
        }
        return false;
    }

    聊天室.不存在 = async function (聊天室名字) {
        var 已存在 = await 聊天室.已存在(聊天室名字);
        return !已存在;
    }

    聊天室.prototype.升级管理权限 = async function (管理密码) {
        var 聊天室数据 = await 接口.根据名字获取聊天室(this.名字);
        if (聊天室数据.管理密码 == 聊天室.加密密码(管理密码)) {
            this.已是管理员 = true;
            return true;
        }
        throw new Error('管理密码错误!');
    }

    聊天室.prototype.修改密码 = function (房间密码) {
        this.房间密码 = 房间密码;
    }

    聊天室.prototype.连接服务器 = async function () {
        this.消息主题名 = '/room/' + 接口.加密内容(this.名字);
        this.消息服务 = 消息服务.创建实例();
        this.消息服务.连接成功((...参数) => {
            this.回调函数.连接成功(...参数);
            this.消息服务.订阅主题(this.消息主题名);
        })
        this.消息服务.收到消息((...参数) => {
            this.回调函数.收到消息(...参数);
        });
        this.消息服务.连接服务器();
    }

    聊天室.prototype.断开服务器 = function () {
        this.消息服务.断开服务器();
    }

    聊天室.prototype.连接成功 = function (回调) {
        this.回调函数.连接成功 = 回调;
    }

    聊天室.prototype.收到消息 = function (回调函数) {
        this.回调函数.收到消息 = 回调函数;
    }

    聊天室.prototype.发送消息 = function (消息) {
        this.消息服务.发送消息(this.消息主题名, 消息);
    }

    window.聊天室 = 聊天室;
})();