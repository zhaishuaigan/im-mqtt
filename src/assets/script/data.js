(() => {
    if (!window.网络请求) {
        console.log('请先引入网络请求[http.js]才能使用这个模块');
        return;
    }
    window.数据库 = {
        前缀: '',
        获取: async function (标志) {

        },
        保存: async function (标志, 数据) {

        }
    }
})();