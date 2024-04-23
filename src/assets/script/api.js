(() => {
    var 接口 = {
        上次请求时间: 0,
        接口调用间隔: 2000,
        延时: async function (时间) {
            console.log('延时时间: ', 时间);
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 时间);
            })
        },
        自动处理接口调用时间: async function () {
            console.log('自动处理接口调用时间:', this.上次请求时间);
            var 当前时间 = new Date().getTime();
            var 延时时间 = 0;
            console.log('当前时间:', 当前时间);
            // 上次请求时间大于当前时间，需要排队请求
            if (this.上次请求时间 >= 当前时间) {
                延时时间 = this.上次请求时间 - 当前时间 + this.接口调用间隔;
                this.上次请求时间 += this.接口调用间隔;
                await this.延时(延时时间);
                return;
            }

            // 在接口调用间隔内
            if (当前时间 - this.上次请求时间 < this.接口调用间隔) {
                延时时间 = this.接口调用间隔 - (当前时间 - this.上次请求时间);
                this.上次请求时间 = 当前时间 + 延时时间;
                await this.延时(延时时间);
                return;
            }

            // 不在接口调用间隔内
            this.上次请求时间 = 当前时间;
        },
        加密标志: (标志) => {
            return encodeURIComponent(标志);
        },
        加密内容: (内容) => {
            return btoa(encodeURIComponent(JSON.stringify(内容)));
        },
        解密内容: (内容) => {
            try {
                return JSON.parse(decodeURIComponent(atob(内容)));
            } catch (e) {
                return null;
            }
        },
        获取数据: async function (标志, 默认值) {
            await this.自动处理接口调用时间();
            var 接口地址 = "https://dweet.io/get/latest/dweet/for/" + 接口.加密标志(标志);
            var 返回结果 = await fetch(接口地址);
            返回结果 = await 返回结果.json();
            if (返回结果 && 返回结果.with && 返回结果.with[0] && 返回结果.with[0].content && 返回结果.with[0].content.value) {
                return 接口.解密内容(返回结果.with[0].content.value);
            }
            return 默认值 ? 默认值 : null;
        },
        保存数据: async function (标志, 内容) {
            await this.自动处理接口调用时间();
            var 接口地址 = "https://dweet.io/dweet/for/" + 接口.加密标志(标志) + "?value=" + 接口.加密内容(内容);
            var 返回结果 = await fetch(接口地址);
            return await 返回结果.json();
        },
        上传图片: async (file) => {
            return new Promise(resolve => {
                resolve({
                    // 图片地址
                })
            })
        },
        上传文件: async (file) => {
            return new Promise(resolve => {
                resolve({
                    // 文件地址
                })
            })
        },
        获取聊天室列表: async function () {
            return await this.获取数据('聊天室列表', []);
        },
        根据名字获取聊天室: async function (名字) {
            var 聊天室列表 = await this.获取聊天室列表();
            for (var i = 0; i < 聊天室列表.length; i++) {
                if (聊天室列表[i].名字 === 名字) {
                    return 聊天室列表[i];
                }
            }
            return null;
        },
        发送邮件: async (邮箱, 标题, 内容) => {
            var 接口地址 = 'https://api.apiopen.top/api/sendMail';
            var 参数 = {
                method: 'POST',
                body: JSON.stringify({
                    "mail": 邮箱,
                    "title": 标题,
                    "content": 内容,
                }),
                headers: {
                    'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyMzgsImlkIjoxMjM4LCJjcmVhdGVkQXQiOiIyMDI0LTA0LTIxIDIwOjEzOjQxIiwidXBkYXRlZEF0IjoiMjAyNC0wNC0yMSAyMDoxMzo0MSIsImRlbGV0ZWRBdCI6bnVsbCwiYWNjb3VudCI6InpoYWlzaHVhaWdhbkBxcS5jb20iLCJsZXZlbCI6MCwiZXhwIjoxNzE0MzA2NDIxLCJpc3MiOiJhcGlfb3BlbiIsIm5iZiI6MTcxMzcwMDYyMX0.9_4NPGKKpbpiwp5B7Cc-DEUUFYlV_NfMPMOEefPAuV8',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            var 返回结果 = await fetch(接口地址, 参数);
            return await 返回结果.json();
        }
    }

    window.接口 = 接口;
})();