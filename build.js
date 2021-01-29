const fs = require('fs');
const config = require('./config.json');

const dir = './build';
const source = './index.user.js';
const target = './build/index.user.js';
const target4test = './build/test.js';

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

    let includes = "";
    config.cfgIncludeList.forEach(each => includes += `\n// @include      ${each}`);

    // Includes
    let result = data.replace(/\n\/\/\ *<!INCLUDES>/, includes);

    // Connect
    result = result.replace("<!GASROOTURL>", config.gasRootUrl);
    result = result.replace("<!CORSPROXY>", config.corsProxy);

    // Text
    result = result.replace("<!TEXT_ERROR_DISCUSSON_NEW>", config.text.error.discussion.new);
    result = result.replace("<!TEXT_ERROR_DISCUSSON_TITLE>", config.text.error.discussion.title);
    result = result.replace("<!TEXT_ERROR_DISCUSSON_TAGS>", config.text.error.discussion.tags);
    result = result.replace("<!TEXT_ERROR_POST_NEW>", config.text.error.post.new);
    result = result.replace("<!TEXT_ERROR_POST_EDIT>", config.text.error.post.edit);
    result = result.replace("<!TEXT_WARNING_GENERAL_INVALID>", config.text.warning.general.invalid);

    fs.writeFile(target, result, 'utf8', err => {
        if (err) return console.log(err);
    });
});

console.log("Completed!");