// ==UserScript==
// @name         FUP
// @namespace    -
// @version      0.0.1
// @description  Unstable. No description.
// @author       LianSheng
// <!INCLUDES>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_addStyle
// ==/UserScript==

/**
 * [Public] All types of operation
 */
const ops = {
    discussion: {
        new: "new_discussion",
        title: "edit_title",
        tags: "edit_tags"
    },
    post: {
        new: "new_post",
        edit: "edit_post"
    }
}

/**
 * [Public] Connection data
 */
const connect = {
    apiUrl: "<!GASROOTURL>",
    corsProxy: "<!CORSPROXY>"
}

/**
 * [Public] All possible properties with config, data, and list.
 */
const payload = {
    config: {
        name: undefined,
        cookie: undefined,
        token: undefined,
        protocol: location.protocol,
        host: location.host,
        api: undefined
    },
    data: {
        method: undefined,
        title: undefined,
        content: undefined,
        tags: undefined,
        did: undefined,
        pid: undefined
    },
    list: []
};

/**
 * [Class] All operations about forum.
 */
class Forum {
    static newDiscussion = async() => {
        if (Validator.discussion.new()) {
            await fetch(`${connect.corsProxy}${connect.apiUrl}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    method: ops.discussion.new,
                    token: payload.config.token,
                    cookie: payload.config.cookie,
                    protocol: payload.config.protocol,
                    host: payload.config.host,
                    api: payload.config.api,
                    tags: payload.data.tags,
                    title: undefined,
                    content: undefined
                })
            }).then(
                r => r.json()
            ).then(
                r => console.log(r)
            ).catch(
                e => console.log(`[ERROR] ${ops.discussion.new}`, e)
            );
        } else {

        }
    }

    static editTitle = async() => {
        if (Validator.discussion.title()) {
            await fetch(`${connect.corsProxy}${connect.apiUrl}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    method: ops.discussion.title,
                    token: payload.config.token,
                    cookie: payload.config.cookie,
                    protocol: payload.config.protocol,
                    host: payload.config.host,
                    api: payload.config.api,
                    tags: payload.data.tags, 
                    did: undefined
                })
            }).then(
                r => r.json()
            ).then(
                r => console.log(r)
            ).catch(
                e => console.log(`[ERROR] ${ops.discussion.title}`, e)
            );
        } else {

        }
    }

    static editTags = async() => {

    }

    static newPost = async() => {

    }

    static editPost = async() => {

    }
}

/**
 * [Class] All messages
 */
class Message {
    static translate = (format, replacement) => format.replace("%s", replacement);

    static text = {
        discussion: {
            new: "<!TEXT_ERROR_DISCUSSON_NEW>",
            title: "<!TEXT_ERROR_DISCUSSON_TITLE>",
            tags: "<!TEXT_ERROR_DISCUSSON_TAGS>"
        },
        post: {
            new: "<!TEXT_ERROR_POST_NEW>",
            edit: "<!TEXT_ERROR_POST_EDIT>"
        },
        general: {
            invalid: "<!TEXT_WARNING_GENERAL_INVALID>"
        }
    };
    static error = {
        discussion: {
            new: () => this.text.discussion.new,
            title: () => this.translate(this.text.discussion.title, payload.data.did),
            tags: () => this.translate(this.text.discussion.tags, payload.data.did)
        },
        post: {
            new: () => this.translate(this.text.post.new, payload.data.did),
            edit: () => this.translate(this.text.post.edit, payload.data.pid)
        }
    };
}

/**
 * [Class] All properties checker
 */
class Validator {
    static warning = () => Message.text.general.invalid;
    static base = () => payload.config.cookie && payload.config.token && payload.data.method;
    static discussion = {
        new: () => this.base() && payload.data.title && payload.data.content,
        title: () => this.base() && payload.data.title && payload.data.did,
        tags: () => this.base() && payload.data.tags && payload.data.did
    }
    static post = {
        new: () => this.base() && payload.data.content && payload.data.did,
        edit: () => this.base() && payload.data.content && payload.data.pid
    }
}

/**
 * [Class] All input event
 */
class Input {
    static init = () => {
        let root = DOM.find(document, "#FUP_root");

        let components = {
            main: {
                method: DOM.find(root, "#FUP_mainMethod"),
                user: DOM.find(root, "#FUP_mainUser"),
                tags: DOM.find(root, "#FUP_mainTags"),
                title: DOM.find(root, "#FUP_mainTitle"),
                content: DOM.find(root, "#FUP_mainContent"),
                submit: DOM.find(root, "#FUP_mainSubmit"),
                config: DOM.find(root, "#FUP_mainModify"),
                hidden: DOM.find(root, "#FUP_mainHidden")
            }
        };

        this.initMethodList(components.main.method);
    };

    static initMethodList = target => {
        let temp = "";
        Object.entries(ops).forEach(([group, methods]) => {
            let options = "";
            Object.values(methods).forEach(method => {
                options += `<option value="${method}">${method}</option>`;
            });

            console.log(options);
            temp += `<optgroup label="${group}">${options}</optgroup>`;
        });

        target.innerHTML = temp;
        console.log("init method list ok")
    }

    static configCookie = changeData => payload.config.cookie = changeData;
    static configToken = changeData => payload.config.token = changeData;
    static dataMethod = changeData => payload.data.method = changeData;
    static dataTitle = changeData => payload.data.title = changeData;
    static dataContent = changeData => payload.data.content = changeData;
    static dataTags = changeData => payload.data.tags = changeData;
    static dataDiscussionId = changeData => payload.data.did = changeData;
    static dataPostId = changeData => payload.data.pid = changeData;
}

/**
 * [Class] All functions about storage of userscript
 */
class DataStorage {
    static init = () => {
        let all = GM_listValues();

        if (!all.includes("list")) GM_setValue("list", []);
        if (!all.includes("cookie")) GM_setValue("cookie", []);
        if (!all.includes("token")) GM_setValue("token", []);
        if (!all.includes("name")) GM_setValue("name", []);

        payload.list = GM_getValue("list");
    };

    static create = {
        cookie: data => {
            let origin = GM_getValue("cookie");
            origin.push(data);
            GM_setValue("cookie", origin);
        },
        token: data => {
            let origin = GM_getValue("token");
            origin.push(data);
            GM_setValue("token", origin);
        },
        name: data => {
            let origin = GM_getValue("name");
            origin.push(data);
            GM_setValue("name", origin);
        }
    };

    static read = {
        cookie: index => payload.config.cookie = GM_getValue("cookie")[index],
        token: index => payload.config.token = GM_getValue("token")[index],
        name: index => payload.config.name = GM_getValue("name")[index]
    };

    static update = {
        cookie: (index, data) => {
            let origin = GM_getValue("cookie");
            origin[index] = data;
            GM_setValue("cookie", origin);
        },
        token: (index, data) => {
            let origin = GM_getValue("token");
            origin[index] = data;
            GM_setValue("token", origin);
        },
        name: (index, data) => {
            let origin = GM_getValue("name");
            origin[index] = data;
            GM_setValue("name", origin);
        }
    };

    static delete = {
        cookie: index => {
            let origin = GM_getValue("cookie");
            origin.splice(index, 1);
            GM_setValue("cookie", origin);
        },
        token: index => {
            let origin = GM_getValue("token");
            origin.splice(index, 1);
            GM_setValue("token", origin);
        },
        name: index => {
            let origin = GM_getValue("name");
            origin.splice(index, 1);
            GM_setValue("name", origin);
        }
    };
}

/**
 * [Class] dom function
 */
class DOM {
    static position = [
        "beforebegin",
        "afterbegin",
        "beforeend",
        "afterend"
    ];
    static exist = (root, selector) => root.querySelectorAll(selector).length > 0;
    static find = (root, selector) => root.querySelector(selector);
    static finds = (root, selector) => root.querySelectorAll(selector);
    static addHTML = (target, position_id, html) => target.insertAdjacentHTML(this.position[position_id], html);
    static addElement = (target, position_id, element) => target.insertAdjacentElement(this.position[position_id], element);
}

/**
 * [Class] Draggable window
 */
class Drag {
    static register(element) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        let head = DOM.find(element, `#${element.id}Head`);
        head.onmousedown = e => dragMouseDown(e);

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = e => dragMouseUp(e);
            document.onmousemove = e => elementDrag(e);
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function dragMouseUp() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

(async function() {
    'use strict';

    const css = `
        #FUP_root {}
        
        #FUP_main { z-index: 999999; position: fixed; top: 60px; left: calc(100vw - 400px - 20px); width: fit-content; height: fit-content; border: 1px solid #333; border-radius: 8px; background-color: #fffc; box-shadow: 6px 6px 4px #0003; }
        #FUP_mainHead { width: calc(100% + 2px); height: 24px; border: 1px solid #333; border-top-left-radius: 8px; border-top-right-radius: 8px; background-color: #333; color: #ccc; margin-top: -1px; margin-left: -1px;}
        #FUP_mainBody { padding: 8px; user-select: none; color: #444;}
        #FUP_mainBody td { padding: 4px;}
        #FUP_mainMessage {  color: #a00; font-weight: bold;}
        #FUP_mainHidden { width: 16px; height: 16px; margin-top: 4px; margin-right: 8px; border-radius: 50%; background-color: #a00; cursor: pointer; }
        #FUP_mainHidden:hover { background-color: #d00; }

        .FUP_left { text-align: left; }
        .FUP_right { text-align: right; }

        custom-textarea { -moz-appearance: textfield-multiline; -webkit-appearance: textarea; border: 1px solid gray; font: medium -moz-fixed; font: -webkit-small-control; height: 28px; overflow: auto; padding: 2px; resize: both; width: 200px; display: block; background-color: white; }
    `;
    GM_addStyle(css);

    DataStorage.init();

    const id = setInterval(() => {
        if (app && app.forum && app.forum.data && DOM.exist(document, "#app")) {
            payload.config.api = app.forum.data.attributes.apiUrl.split(`${payload.config.host}/`)[1];

            const root = DOM.find(document, "#app");
            const html = `
            <div id="FUP_root">
                <div id="FUP_main">
                    <div id="FUP_mainHead" class="FUP_right"><button id="FUP_mainHidden"></button></div>
                    <div id="FUP_mainBody">
                        <table>
                            <tr>
                                <td>Method</td>
                                <td><select id="FUP_mainMethod"></select></td>
                            </tr>
                            <tr>
                                <td>User</td>
                                <td><select id="FUP_mainUser"></select></td>
                            </tr>
                            <tr>
                                <td>Tags</td>
                                <td><select id="FUP_mainTags" multiple></select></td>
                            </tr>
                            <tr>
                                <td>Title</td>
                                <td><input id="FUP_mainTitle" type="text"></td>
                            </tr>
                            <tr>
                                <td>Content</td>
                                <td><custom-textarea id="FUP_mainContent" contenteditable></custom-textarea></td>
                            </tr>
                            <tr>
                                <td id="FUP_mainMessage" class="FUP_right" colspan="2">.</td>
                            </tr>
                            <tr>
                                <td class="FUP_left"><button id="FUP_mainModify">Config</button></td>
                                <td class="FUP_right"><button id="FUP_mainSubmit">Submit</button></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            `;

            DOM.addHTML(root, 1, html);
            let main = DOM.find(root, "#FUP_main");
            console.log(main)
            Drag.register(main);
            Input.init();

            clearInterval(id);
            console.log(payload);
        }
    }, 100);
})();