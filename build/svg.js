var fs = require('fs');
// 读取目录中所有的svg文件
var files = fs.readdirSync('./src/assets/svg');
var result = {};
// 遍历所有文件
files.forEach(function (file) {
    // 读取文件内容
    var content = fs.readFileSync('./src/assets/svg/' + file, 'utf8');
    result[file] = content;
});
// 将结果写入文件
fs.writeFileSync('./src/assets/script/svg.js', 'window.表情 =' + JSON.stringify(result, 4));

console.log('表情包生成成功!');