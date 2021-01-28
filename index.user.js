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
    static newDiscussion = async () => {
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
                    tags: payload.data.tags
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
}

/**
 * [Class] All messages
 */
class Message {
    static text = {
        discussion: {
            new: "<!TEXT_ERROR_DISCUSSON_NEW>",
            title: "<!TEXT_ERROR_DISCUSSON_TITLE>",
            tags: "<!TEXT_ERROR_DISCUSSON_TAGS>"
        },
        post: {
            new: "<!TEXT_ERROR_POST_NEW>",
            edit: "<!TEXT_ERROR_POST_EDIT>"
        }
    };
    static translate = (format, replacement) => format.replace("%s", replacement);
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
    static base = () => payload.config.cookie && payload.config.token && payload.data.method;
    static discussion = {
        new: () => this.base() && payload.data.title && payload.data.content,
        title: () => this.base() && payload.data.title && payload.data.did,
        tags: () => this.base() && payload.data.tags && payload.data.did
    }
    static data = {
        new: () => this.base() && payload.data.content && payload.data.did,
        edit: () => this.base() && payload.data.content && payload.data.pid
    }
}

/**
 * [Class] All input event
 */
class Input {
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
class Storage {
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

(async function () {
    'use strict';

    Storage.init();

    const id = setInterval(() => {
        if (app && app.forum && app.forum.data) {
            payload.config.api = app.forum.data.attributes.apiUrl.split(`${payload.config.host}/`)[1];

            clearInterval(id);
            console.log(Message);
        }
    }, 100);
})();