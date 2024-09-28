const posts = JSON.parse(localStorage.getItem('posts') || []);
const blogForm = document.getElementById('blogForm');

function displayPosts() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const postItem = document.createElement('div');
        postItem.classList.add('postItem');

        if (post.featured) {
            postItem.classList.add('featured');
        }

        postItem.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <button class="postBtn">Feature post</button>
        <button class='editBtn'>Edit post</button>
        <button class='deleteBtn'>Delete post</button>`
        postList.appendChild(postItem);
    });
}

function featurePost() {
    const featureBtns = document.querySelectorAll('.postBtn');

    featureBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const postItem = btn.parentElement;

            if (posts[index].featured) {
                posts[index].featured = false;
                postItem.classList.remove('featured');
                btn.innerHTML = 'Feature post';
            } else {
                posts[index].featured = true;
                postItem.classList.add('featured');
                btn.innerHTML = 'Unfeature post';
            }
            localStorage.setItem('posts', JSON.stringify(posts));
        });
    });
}

function editPost() {
    const editBtns = document.querySelectorAll('.editBtn');

    editBtns.forEach((button, index) => {
        button.addEventListener('click', () => {
            const postItem = button.parentElement;

            const originalTitle = postItem.querySelector('h3').textContent;
            const originalContent = postItem.querySelector('p').textContent;

            const editForm = document.createElement('form');
            editForm.classList.add('editForm');

            editForm.innerHTML = `
            <input type='text' id='editTitle' value="${originalTitle}"><br>
            <textarea id='editContent'>${originalContent}</textarea><br>
            <button type="submit">Save changes</button>
            <button type="button" id="cancelChanges">Cancel changes</button>`;

            postItem.innerHTML = '';
            postItem.appendChild(editForm);

            editForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const editedPostTitle = document.getElementById('editTitle').value;
                const editedPostContent = document.getElementById('editContent').value;

                posts[index].title = editedPostTitle;
                posts[index].content = editedPostContent;

                localStorage.setItem('posts', JSON.stringify(posts));

                postItem.innerHTML = `
                    <h3>${editedPostTitle}</h3>
                    <p>${editedPostContent}</p>
                    <button class="postBtn">Feature post</button>
                    <button class='editBtn'>Edit post</button>
                    <button class='deleteBtn'>Delete post</button>`;

                featurePost();
                editPost();
            });

            const cancelBtn = document.getElementById('cancelChanges');
            cancelBtn.addEventListener('click', () => {
                // Restore the original post content
                postItem.innerHTML = `
                    <h3>${originalTitle}</h3>
                    <p>${originalContent}</p>
                    <button class="postBtn">Feature post</button>
                    <button class='editBtn'>Edit post</button>
                    <button class='deleteBtn'>Delete post</button>`;

                featurePost();
                editPost();
            });
        });
    });
}

function deletePost() {
    const deleteBtns = document.querySelectorAll('.deleteBtn');

    deleteBtns.forEach((button, index) => {
        button.addEventListener('click', () => {
            posts.splice(index, 1);

            localStorage.setItem('posts', JSON.stringify(posts));

            displayPosts();
            featurePost();
            editPost();
            deletePost();
        });
    });
}


displayPosts();

blogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const postTitle = document.getElementById('postTitle').value;
    const postContent = document.getElementById('postContent').value;

    posts.push({ title: postTitle, content: postContent });
    localStorage.setItem('posts', JSON.stringify(posts));

    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';

    displayPosts();


});

featurePost();
editPost();
deletePost();