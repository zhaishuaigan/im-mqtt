(async () => {
    var 主程序 = null;
    Vue.createApp({
        el: '#app',
        data: function () {
            return {
                聊天室: null,
                加载完成: false,
                显示界面: '开始界面',
                创建聊天室的界面: false,
                创建聊天室的数据: {
                    名字: '',
                    加入密码: '',
                    管理密码: '',
                },
                加入聊天室的界面: false,
                加入聊天室的数据: {
                    名字: '',
                    加入密码: '',
                    管理密码: '',
                },
                当前聊天室: null,
                消息列表: [],
            };
        },
        created: async function () {
            主程序 = this;
            主程序.进入开始界面();
            // TODO 加载资源
            主程序.加载完成 = true;
            await this.测试聊天室界面();
        },
        methods: {
            测试聊天室界面: async function () {
                var 测试聊天室 = {
                    名字: '吃瓜群众一起吃瓜',
                    加入密码: '1',
                    管理密码: '1',
                };
                await this.创建聊天室(测试聊天室);
                await this.加入聊天室(测试聊天室);
            },
            进入开始界面: function () {
                主程序界面.style.visibility = 'visible';
                加载中.remove();
            },
            创建聊天室: async function (创建聊天室的数据) {
                var 名字 = 创建聊天室的数据.名字;
                var 加入密码 = 创建聊天室的数据.加入密码;
                var 管理密码 = 创建聊天室的数据.管理密码;
                if (await 聊天室.已存在(名字)) {
                    ElementPlus.ElNotification({
                        title: '提示',
                        message: '聊天室名字已存在',
                        type: 'error',
                        duration: 3000,
                    });
                    return;
                }
                this.当前聊天室 = await 聊天室.创建聊天室(名字, 加入密码, 管理密码);
                console.log('新聊天室: ', this.当前聊天室);
                this.显示界面 = '聊天室界面';
                this.创建聊天室的界面 = false;
            },
            加入聊天室: async function (加入聊天室的数据) {
                var 名字 = 加入聊天室的数据.名字;
                var 加入密码 = 加入聊天室的数据.加入密码;
                var 管理密码 = 加入聊天室的数据.管理密码;
                var 加入的聊天室 = await 聊天室.加入聊天室(名字, 加入密码, 管理密码)
                    .catch((错误信息) => {
                        ElementPlus.ElNotification({
                            title: '提示',
                            message: 错误信息,
                            type: 'error',
                            duration: 3000,
                        });
                    });
                if (!加入的聊天室) {
                    return;
                }
                this.当前聊天室 = 加入的聊天室;
                this.显示界面 = '聊天室界面';
            },

            收到消息: function (发送人, 消息) {
                console.log('收到消息: ', 聊天室, 消息);

                // TODO:: 根据消息类型, 执行不同操作
                // 暂时想到的类型有: 文字消息, 图片消息, 文件消息, 特殊命令消息

                // TODO:: 实现消息展示
                消息列表.push({
                    发送人: 发送人,
                    消息: 消息,
                });
            },

            发送消息: function (发送人, 消息) {
                主程序.聊天室.发送消息(发送人, 消息);
            }
        }
    }).use(ElementPlus).mount('#主程序界面');
})();