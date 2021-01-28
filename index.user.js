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

const url = "<!GASROOTURL>";
const corsProxy = "<!CORSPROXY>";

class Forum {
    static newDiscussion = async payload => {
        await fetch(`${corsProxy}${url}`, {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                method: "new_discussion",
                token: "token",
                cookie: "cookie",
                protocol: "protocol",
                host: "host.name",
                api: "apiName",
                tags: [26, 32]
            })
        }).then(
            r => r.json()
        ).then(
            r => console.log(r)
        ).catch(
            e => console.log("Error", e)
        );
    }
}

class Input {
    static configCookie = (payload, data) => payload.config.cookie = data;
    static configToken = (payload, data) => payload.config.token = data;
}

(async function () {
    'use strict';
    const payload = {
        config: {
            cookie: undefined,
            token: undefined,
            protocol: location.protocol,
            host: lcoation.host,
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

    const id = setInterval(() => {
        if (app && app.forum && app.forum.data) {
            payload.config.api = app.forum.data.attributes.apiUrl.split(`${payload.config.host}/`)[1];

            clearInterval(id);
            console.log(payload);
        }
    }, 100);
})();