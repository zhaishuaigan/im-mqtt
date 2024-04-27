(() => {
    var 消息服务 = function (服务器, 用户名, 密码) {
        this.服务 = null;
        this.服务器 = 服务器;
        this.消息前缀 = "emqx_test";
        this.参数 = {
            // clean: true,
            // connectTimeout: 4000,
            clientId: 'emqx_test_' + Math.random().toString(16).substring(2, 8),
            username: 用户名 ? 用户名 : 'emqx_test',
            password: 密码 ? 密码 : 'emqx_test',
        };
        this.回调函数 = {
            连接成功: function () { },
            收到消息: function () { },
            连接失败: function () { },
        };

    }
    消息服务.prototype.连接服务器 = function () {
        var 初始化完成 = false;
        this.服务 = mqtt.connect(this.服务器, this.参数);
        this.服务.on('connect', (...参数) => {
            // if (初始化完成) {
            //     return;
            // }
            // 初始化完成 = true;
            this.回调函数.连接成功(...参数);
        });
        this.服务.on('message', (主题, 内容) => {
            this.回调函数.收到消息(主题, 内容.toString());
        });
    }
    消息服务.创建实例 = function () {
        return new 消息服务('wss://broker.emqx.io:8084/mqtt');
    }
    消息服务.prototype.连接成功 = function (回调) {
        this.回调函数.连接成功 = 回调;
    }

    消息服务.prototype.订阅主题 = function (主题) {
        this.服务.subscribe(主题);
    }

    消息服务.prototype.发送消息 = function (主题, 消息) {
        this.服务.publish(主题, 消息);
    }

    消息服务.prototype.收到消息 = function (回调) {
        this.回调函数.收到消息 = 回调;
    }

    window.消息服务 = 消息服务;
})();