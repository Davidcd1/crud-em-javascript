
const miniRedeSocial = {
    users: [
        {  
            id: 0,
            email: 'admin@admin.com',
            username: 'admin',
            password: '1234'
        },
    ],
    posts: [
        {
            id: Date.now(),
            owner: 'admin',
            content: ''
        }
    ],

    login(username, password) {
        const user = miniRedeSocial.users.find((currentUser) => currentUser.username === username);
        if (user) {
            if (user.password === password) {
                // Login successful
                return 0;
            } else {
                return "Senha incorreta!";
            }
        } else {
            return "Usuário não existente!";
        }
    },
    register(email, name, password){
        rep = false; 
        const usersList = miniRedeSocial.users.filter((currentUser) => {
            if(currentUser.email === email && currentUser.name === name){
                rep = true;
            }
        });
        if(rep === false){
            miniRedeSocial.users.push({
                id: miniRedeSocial.users.length,
                email: email,
                username: name,
                password: password
            });
            return true;
        }else{
            return false;
        }
    },

    ReadPosts(){
        miniRedeSocial.posts.forEach(({ id, owner, content }) => {
            miniRedeSocial.createPost({ id, owner: owner, content: content }, true);
        })
    },

    createPost(datas, htmlOnly = false){
        const internid = Date.now();
        if(!htmlOnly){
            miniRedeSocial.posts.push({
                id: datas.id || internid,
                owner: datas.owner, 
                content: datas.content
            });
        }
        const $postsList = document.querySelector('.postsList');
        $postsList.insertAdjacentHTML('afterbegin', `
                <li data-id="${internid}">
                    <div class="listbuttonv">
                        <button class="btn-edit">Edit</button>
                        <button class="btn-delete">Delete</button>
                    </div>
                    <div class="datapost">
                        <strong>${datas.owner}</strong><br>
                        ${datas.content}
                    </div>
                </li>
            `);
    },

    updateContent(id, newContent){
        const post = miniRedeSocial.posts.find((post) => {
            return post.id === id;
        });
    
        if (post) {
            post.content = newContent;
        } else {
            console.error(`Post com ID "${id}" não encontrado`);
        }
    },

    deletePost(id){
        const updatedlist = miniRedeSocial.posts.filter((currentPost) => {
            return currentPost.id !== Number(id);
        });
        miniRedeSocial.posts = updatedlist;
    },

    activatePostEdit(id) {
        const postElement = document.querySelector(`li[data-id="${id}"]`);

        if (postElement) {
            // Obtém a postagem atual do array miniRedeSocial.posts
            const currentPost = miniRedeSocial.posts.find(post => post.id === Number(id));
            id = currentPost.id;
            owner = currentPost.owner;

            if (currentPost) {
                // Substitui a div pelo campo de edição (textarea)
                postElement.innerHTML = `
                    <div class="listbuttonv">
                        <button class="btn-save">Save</button>
                        <button class="btn-cancel">Cancel</button>
                    </div>
                    <textarea data-id="" class="data-post">${currentPost.content}</textarea>
                `;

                // Adiciona eventos para os botões Save e Cancel
                postElement.querySelector('.btn-save').addEventListener('click', () => {
                    const updatedContent = postElement.querySelector('.data-post').value;
                    postElement.innerHTML = `
                        <li data-id="${id}">
                            <div class="listbuttonv">
                                <button class="btn-edit">Edit</button>
                                <button class="btn-delete">Delete</button>
                            </div>
                            <div class="datapost">
                                <strong>${owner}</strong><br>
                                ${updatedContent}
                            </div>
                        </li>
                    `;
                    miniRedeSocial.updateContent(id, updatedContent);
                });

                postElement.querySelector('.btn-cancel').addEventListener('click', () => {
                    miniRedeSocial.cancelUpdate(id, currentPost.content);
                });
            } else {
                console.error(`Post com ID "${id}" não encontrado`);
            }
        } else {
            console.error(`Elemento com data-id="${id}" não encontrado`);
        }
    },
    
    cancelUpdate(id, content){
        const postElement = document.querySelector(`li[data-id="${id}"]`);
        if(postElement){
            const currentPost = miniRedeSocial.posts.find(post => post.id === Number(id));
            postElement.innerHTML = `
                <div class="listbuttonv">
                    <button class="btn-edit">Edit</button>
                    <button class="btn-delete">Delete</button>
                </div>
                <div class="datapost">
                    <strong>${currentPost.owner}</strong><br>
                    ${currentPost.content}
                </div>
            `;
        }
    }  
}

// [READ]
/**miniRedeSocial.posts.forEach(({ owner, content }) => {
    miniRedeSocial.createPost({ owner: owner, content: content }, false);
})**/

// [CREATE]
const $myForm = document.querySelector('form[name="cpost"]');
const $myRegister = document.querySelector('form[name="register"]');
const $myLogin = document.querySelector('form[name="login"]');

$myForm.addEventListener('submit', function createPostController(eventInfo){
    eventInfo.preventDefault();
    const $createPostField = document.querySelector('textarea[name="fieldPost"]').value;
    miniRedeSocial.createPost({owner: 'admin', content: $createPostField}, false);
});

$myRegister.addEventListener('submit', function createRegisterController(eventInfo){
    eventInfo.preventDefault();

    var deleta = true;

    const nameR = document.querySelector('input[name="nameR"]').value;
    const emailR = document.querySelector('input[name="emailR"]').value;
    const passwordR = document.querySelector('input[name="passwordR"]').value;

    if(nameR && emailR && passwordR){
        deleta = miniRedeSocial.register(emailR, nameR, passwordR);
        if(deleta){
            $myRegister.classList.remove('show');
            $myRegister.classList.add('hide');
        }
    }else{
        alert("Preencha os campos para poder registrar");
    }
});

$myLogin.addEventListener('submit', function createLoginController(eventInfo){
    eventInfo.preventDefault();
    const name = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
    if(name){
        if(password){
            var isvalid = miniRedeSocial.login(name, password);
            if(isvalid !== 0){
                alert(isvalid);
            }else{
                const show = document.getElementsByClassName('show');
                Array.from(show).forEach((element) => {
                    // Adicionar a classe 'hide'
                    element.classList.add('hide');
                    // Remover a classe 'show'
                    element.classList.remove('show');
                });
                const forum = document.getElementsByClassName('posts')[0];
                forum.classList.remove('hide');
                forum.classList.add('show');
            }
        }
    }

});

//[DELETE]
document.querySelector('.postsList').addEventListener('click', function (eventInfos){
    const isBtnDeleteClick = eventInfos.target.classList.contains('btn-delete');
    const isBtnEditClick = eventInfos.target.classList.contains('btn-edit');
    const currentElementParent = eventInfos.target.closest('li');
    const id = currentElementParent ? currentElementParent.getAttribute('data-id') : null;
    //const id = currentElementParent.getAttribute('data-id');
    

    if(isBtnDeleteClick){
        miniRedeSocial.deletePost(id);
        currentElementParent.remove();
    }
    if(isBtnEditClick){
        miniRedeSocial.activatePostEdit(id);
    }
});
