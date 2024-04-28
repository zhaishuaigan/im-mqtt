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
                成员列表: {},
                当前用户名: 接口.获取本地缓存('当前用户名'),
                当前用户标识: 接口.生成用户标识(),
                用户输入的内容: '',
            };
        },
        created: async function () {
            主程序 = this;
            主程序.进入开始界面();
            // TODO 加载资源
            主程序.加载完成 = true;
            this.提示用户输入昵称();
        },
        methods: {
            进入开始界面: function () {
                主程序界面.style.visibility = 'visible';
                加载中.remove();
            },
            提示用户输入昵称: async function () {
                if (this.当前用户名) {
                    return;
                }
                await ElementPlus.ElMessageBox.prompt('请输入你的昵称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /.{2,12}/,
                    inputErrorMessage: '昵称必须在2-12个字符之间',
                })
                    .then((参数) => {
                        this.当前用户名 = 参数.value;
                        console.log(this.当前用户名);
                        接口.保存本地缓存('当前用户名', 参数.value);
                    })
                    .catch(() => {
                        ElementPlus.ElMessage({
                            type: 'info',
                            message: '没有昵称将不能发送消息',
                        })
                    })
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
                this.连接聊天服务器();
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
                this.加入聊天室的界面 = false;
                this.连接聊天服务器();
            },

            连接聊天服务器: function () {
                this.当前聊天室.连接成功((...参数) => {
                    console.log('连接成功: ', ...参数);
                    this.定时更新成员信息();

                    this.当前聊天室.发送消息(接口.加密内容({
                        发送人: this.当前用户名,
                        用户标识: this.当前用户标识,
                        消息类型: '获取成员信息',
                        内容: '',
                    }))
                    // this.当前聊天室.发送消息('test', "hello world");
                });
                this.当前聊天室.收到消息(this.收到消息);
                this.当前聊天室.连接服务器();
            },
            收到消息: function (主题, 内容) {
                var 消息 = 接口.解密内容(内容);

                switch (消息.消息类型) {
                    case '文本':
                    case '图片':
                    case '视频':
                    case '文件':
                        this.消息列表.push(消息);
                        setTimeout(() => {
                            this.$refs['历史消息区域'].scrollTop = this.$refs['历史消息区域'].scrollHeight;
                        }, 200);
                        break;
                    case '更新成员信息':
                        this.成员列表[消息.成员信息.用户标识] = 消息.成员信息;
                        break;
                    case '获取成员信息':
                        this.发送成员信息();
                        break;
                }
            },

            定时更新成员信息: function () {
                setInterval(() => {
                    if (this.当前聊天室) {
                        this.发送成员信息();
                    }
                }, 10000);
            },
            发送成员信息: function () {
                var 成员信息 = {
                    用户标识: this.当前用户标识,
                    用户名: this.当前用户名,
                };
                var 消息 = 接口.加密内容({
                    发送人: this.当前用户名,
                    用户标识: this.当前用户标识,
                    消息类型: '更新成员信息',
                    成员信息: 成员信息,
                    内容: '',
                });
                this.当前聊天室.发送消息(消息);
            },
            发送消息: async function () {
                await this.提示用户输入昵称();
                if (!this.用户输入的内容) {
                    ElementPlus.ElMessage({
                        type: 'info',
                        message: '消息不能为空',
                    })
                    return;
                }
                var 消息 = 接口.加密内容({
                    发送人: this.当前用户名,
                    用户标识: this.当前用户标识,
                    消息类型: '文本',
                    内容: this.用户输入的内容,
                });
                this.当前聊天室.发送消息(消息);
                this.用户输入的内容 = '';
            },
            发送图片: async function (图片) {
                var 网络地址 = 'https://api.apiopen.top' + 图片.result.name;
                this.当前聊天室.发送消息(接口.加密内容({
                    发送人: this.当前用户名,
                    用户标识: this.当前用户标识,
                    消息类型: '图片',
                    内容: 网络地址,
                }))
            },
            发送视频: async function (视频) {
                var 网络地址 = 'https://api.apiopen.top' + 视频.result.name;
                this.当前聊天室.发送消息(接口.加密内容({
                    发送人: this.当前用户名,
                    用户标识: this.当前用户标识,
                    消息类型: '视频',
                    内容: 网络地址,
                }));
            },
            发送文件: async function (文件) {
                var 网络地址 = 'https://api.apiopen.top' + 文件.result.name;
                this.当前聊天室.发送消息(接口.加密内容({
                    发送人: this.当前用户名,
                    用户标识: this.当前用户标识,
                    消息类型: '文件',
                    文件名: 文件.result.name.replace(/.*\//, ''),
                    文件大小: 文件.result.size,
                    文件地址: 网络地址,
                }));
            },
            暂未实现: function () {
                ElementPlus.ElMessage({
                    type: 'info',
                    message: '暂未实现',
                })
            }
        }
    }).use(ElementPlus).mount('#主程序界面');
})();