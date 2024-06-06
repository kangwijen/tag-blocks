// ==UserScript==
// @name         X Tag Blocks
// @namespace    http://tampermonkey.net/
// @version      v2.0.0
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
        tags = prompt('Enter tags to block (separated by commas):').split(',').map(tag => tag.trim());
        if (tags.length === 1 && tags[0] === '') {
            alert('Error: No tags entered');
            return;
        }
        tags = tags.map(tag => tag.startsWith('#') ? tag : '#' + tag);
        localStorage.setItem('blockedTags', JSON.stringify(tags));
    } else {
        tags = JSON.parse(tags);
    }

    function addTag(tag) {
        if (!tags.includes(tag)) {
            tags.push(tag);
            localStorage.setItem('blockedTags', JSON.stringify(tags));
            updateTagList();
            alert('Tag added: ' + tag + '. Please refresh the page to apply changes.');
        } else {
            alert('Tag already exists: ' + tag);
        }
    }

    function removeTag(tag) {
        var index = tags.indexOf(tag);
        if (index !== -1) {
            tags.splice(index, 1);
            localStorage.setItem('blockedTags', JSON.stringify(tags));
            updateTagList();
            alert('Tag removed: ' + tag + '. Please refresh the page to apply changes.');
        } else {
            alert('Tag not found: ' + tag);
        }
    }

    function updateTagList() {
        var tagList = document.getElementById('blocked-tag-list');
        tagList.innerHTML = '';
        tags.forEach(function(tag) {
            var listItem = document.createElement('li');
            listItem.textContent = tag;
            listItem.style.color = 'black';
            tagList.appendChild(listItem);
        });
    }

    function createUI() {
        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.backgroundColor = 'white';
        container.style.padding = '10px';
        container.style.border = '1px solid black';
        container.style.zIndex = '10000';
    
        var addInput = document.createElement('input');
        addInput.type = 'text';
        addInput.placeholder = 'Add tag';
    
        var addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.onclick = function() {
            var tag = addInput.value.trim();
            if (tag) {
                addTag(tag.startsWith('#') ? tag : '#' + tag);
                addInput.value = '';
            }
        };
    
        var removeInput = document.createElement('input');
        removeInput.type = 'text';
        removeInput.placeholder = 'Remove tag';
    
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() {
            var tag = removeInput.value.trim();
            if (tag) {
                removeTag(tag.startsWith('#') ? tag : '#' + tag);
                removeInput.value = '';
            }
        };
    
        var tagListTitle = document.createElement('h4');
        tagListTitle.textContent = 'Blocked Tags:';
        tagListTitle.style.color = 'black';
    
        var tagList = document.createElement('ul');
        tagList.id = 'blocked-tag-list';
    
        container.appendChild(addInput);
        container.appendChild(addButton);
        container.appendChild(document.createElement('br'));
        container.appendChild(removeInput);
        container.appendChild(removeButton);
        container.appendChild(tagListTitle);
        container.appendChild(tagList);
    
        document.body.appendChild(container);
    
        updateTagList();
    }

    createUI();

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
                            console.log('Removed post:', parentDiv);
                        }
                    }
                });
            });
        });

    }, 1000);
})();