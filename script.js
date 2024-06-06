// ==UserScript==
// @name         X Tag Blocks
// @namespace    http://tampermonkey.net/
// @version      2024-06-06
// @description  Block tags on X / Twitter posts
// @author       @kangwijen
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var tags = localStorage.getItem('blockedTags');
    if (!tags) {
        tags = prompt('Enter tags to block (separated by commas):').split(',').map(tag => '#' + tag.trim());
        localStorage.setItem('blockedTags', JSON.stringify(tags));
    } else {
        tags = JSON.parse(tags);
    }

    var intv = setInterval(function() {
        var getPosts = function() {
            var posts = document.querySelectorAll(
                'div.css-146c3p1.r-8akbws.r-krxsd3.r-dnmrzs.r-1udh08x.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-16dba41.r-bnwqim'
            );
            return posts;
        };

        var posts = getPosts();

        posts.forEach(function(post) {
            var links = post.querySelectorAll('a');
            links.forEach(function(link) {
                tags.forEach(function(tag) {
                    if (link.innerText.toLowerCase() === tag.toLowerCase()) {
                        var parentDiv = post.closest('div.css-175oi2r.r-1igl3o0.r-qklmqi.r-1adg3ll.r-1ny4l3l');
                        if (parentDiv) {
                            parentDiv.style.display = 'none';
                        }
                    }
                });
            });
        });

    }, 1000);
})();