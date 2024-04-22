(() => {
    var 聊天室 = function () {
        this.名字 = "";
        this.密码 = "";
        this.管理员 = "";
        this.成员 = [];
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
    聊天室.创建聊天室 = async function (聊天室名字, 聊天室密码) {
        var 聊天已存在 = await 聊天室.检测聊天室是否存在(聊天室名字);
        if (聊天已存在) {
            return false;
        }

        console.log('聊天已存在: ', 聊天已存在);

        var 新聊天室 = new 聊天室();
        新聊天室.名字 = 聊天室名字;
        新聊天室.密码 = 聊天室.加密密码(聊天室密码);
        var 聊天室列表 = await 接口.获取数据('聊天室列表', []);
        聊天室列表.unshift({
            名字: 新聊天室.名字,
            密码: 新聊天室.密码,
            创建时间: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
        await 接口.保存数据('聊天室列表', 聊天室列表);
        return 新聊天室;
    }

    聊天室.prototype.链接服务器 = function (房间名字, 房间密码) {
        var 消息服务 = new 消息服务();
    }

    聊天室.prototype.修改密码 = function (房间密码) {
        this.房间密码 = 房间密码;
    }

    聊天室.prototype.收到消息 = function (发送人, 消息) {

    }

    聊天室.prototype.发送消息 = function (发送人, 消息) {

    }



    window.聊天室 = 聊天室;
})();