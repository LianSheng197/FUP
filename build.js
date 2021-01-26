const fs = require('fs');
const config = require('./config.json');

const dir = './build';
const source = './index.user.js';
const target = './build/index.user.js';

// mkdir
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// copy
fs.copyFile(source, target, err => {
    if (err) throw err;
});

// replace
fs.readFile(target, 'utf8', (err, data) => {
    if (err) return console.log(err);

    let replacement = "";
    config.cfgIncludeList.forEach(each => replacement += `\n// @include      ${each}`);

    let result = data.replace(/\n\/\/\ *<!INCLUDES>/, replacement);

    fs.writeFile(target, result, 'utf8', err => {
        if (err) return console.log(err);
    });
});

console.log("Completed!");