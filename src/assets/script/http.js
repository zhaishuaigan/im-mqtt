(() => {
    window.网络请求 = {
        获取数据: async (接口地址) => {
            var 返回结果 = await fetch(接口地址);
            var 返回数据 = await 返回结果.json();
            return 返回数据;
        },
        获取文本: async (接口地址) => {
            var 返回结果 = await fetch(接口地址);
            var 返回数据 = await 返回结果.text();
            return 返回数据;
        },

        发送数据: async (接口地址, 数据) => {
            var 返回结果 = await fetch(接口地址, {
                method: 'POST',
                body: JSON.stringify(数据),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        发送文本: async (接口地址, 数据) => {
            var 返回结果 = await fetch(接口地址, {
                method: 'POST',
                body: 数据,
                headers: {
                    'Content-Type': 'text/plain'
                }

            });
        }
    }

})();