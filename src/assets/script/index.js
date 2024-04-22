(async () => {
    var 主程序 = null;
    console.log(1111);
    Vue.createApp({
        el: '#app',
        data: function () {
            return {
                聊天室: null,
                加载完成: false,
                显示界面: '开始界面',
                创建聊天室的界面: false,
                创建聊天室的数据: {
                    聊天室名字: '',
                    聊天室密码: '',
                },
                加入聊天室的界面: false,
                加入聊天室的数据: {
                    聊天室名字: '',
                    聊天室密码: '',
                },
                当前聊天室: null,
                消息列表: [],
            };
        },
        created: async function () {
            console.log('主程序初始化');
            主程序 = this;
            主程序.进入开始界面();
            // TODO 加载资源

            主程序.加载完成 = true;

            var 房间列表 = await 接口.获取数据('房间列表', [
                {
                    房间名字: '大厅2',
                    房间密码: '',
                    创建时间: moment().format('YYYY-MM-DD HH:mm:ss'),
                }
            ]);
            console.log('房间列表: ', 房间列表);

            // console.log('密码测试: ', 聊天室.加密密码("123"));

            // 接口.发送邮件('zhaishuaigan@qq.com', '测试一下', '这是内容, 居然需要超过五个字符.')
            //     .then((返回结果) => {
            //         console.log('发送邮件接口的返回结果: ', 返回结果);
            //     });
        },
        methods: {
            进入开始界面: function () {
                console.log('进入开始界面');
                主程序界面.style.visibility = 'visible';
                加载中.remove();
            },
            创建聊天室: async function (创建聊天室的数据) {
                var 名字存在 = await 聊天室.检测聊天室是否存在(创建聊天室的数据.聊天室名字);
                if (名字存在) {
                    ElementPlus.ElNotification({
                        title: '提示',
                        message: '聊天室名字已存在',
                        type: 'error',
                        duration: 3000,
                    });
                    return;
                }
                this.当前聊天室 = await 聊天室.创建聊天室(创建聊天室的数据.聊天室名字, 创建聊天室的数据.聊天室密码);
                console.log('新聊天室: ', this.当前聊天室);
                this.显示界面 = '聊天室界面';
                this.创建聊天室的界面 = false;
            },
            加入聊天室: function (加入聊天室的数据) {

                // TODO:: 聊天室名字是否存在

                console.log('加入聊天室: ', 加入聊天室的数据);
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