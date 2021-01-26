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

(async function () {
    'use strict';

    let url = "<!GASROOTURL>";
    let corsProxy = "<!CORSPROXY>";

    await fetch(`${corsProxy}/${url}`, {
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
        e => console.log(e)
    );
})();