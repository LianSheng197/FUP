// ==UserScript==
// @name         FUP
// @namespace    -
// @version      0.0.1
// @description  Unstable. No description.
// @author       LianSheng
// <!INCLUDES>
// @grant        GM_setValue
// @grant        GM_getValue
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
 * [Public] All possible properties with config, data, and link.
 */
const payload = {
    config: {
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

(async function () {
    'use strict';

    const id = setInterval(() => {
        if (app && app.forum && app.forum.data) {
            payload.config.api = app.forum.data.attributes.apiUrl.split(`${payload.config.host}/`)[1];

            clearInterval(id);
            console.log(connect, payload);
        }
    }, 100);
})();