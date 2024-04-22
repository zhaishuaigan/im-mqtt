(() => {
    var 消息服务 = function (服务器地址, 用户名, 密码) {
        this.配置 = {
            服务器地址: 服务器地址,
            用户名: 用户名,
            密码: 密码
        }
    }
    消息服务.创建实例 = function () {
        服务器地址
        return new 消息服务(服务器地址, '用户名', '密码');
    }
    消息服务.prototype.初始化 = function () {
        // 初始化MQTT连接
    }

    消息服务.prototype.订阅主题 = function (主题) {
        // 订阅MQTT主题
    }

    消息服务.prototype.发送消息 = function (主题, 消息) {

    }

    消息服务.prototype.收到消息 = function (消息) {

    }



    window.消息服务 = 消息服务;
})();