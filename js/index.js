// Dark mode
const btn = document.querySelector('.theme-switch input[type="checkbox"]');

// Listen for a click on the button
btn.addEventListener('change', function(e) {
  // Then toggle (add/remove) the .dark-theme class to the body
  if (e.target.checked) {
    document.body.classList.add('dark-theme');
  }  else {
    document.body.classList.remove('dark-theme');
  }
})

// post Class
class Post {
    constructor (name, pos, text) {
        this.name = name;
        this.pos = pos;
        this.text = text;
    }
}

// UI Class
class UI {
    static displayPosts() {
        const posts = Store.getPosts();

        posts.forEach(post => UI.addPostToList(post));
    }

    static addPostToList(post) {
        let currDate = new Date().toLocaleString();

        const list = document.querySelector('#post-list');
        const article = document.createElement('article');
        article.innerHTML = `
        <h3>${post.name}</h3>
        <p><em>${post.pos}</em></p>
        <p>${post.text}</p>
        <section class="mod">
            <i class="edit-btn fa fa-pencil-square-o" title="Edit"></i>
            <i class="delete-btn fa fa-times-circle" title="Delete"></i>
        </section>
        <p class="date">${currDate}</p>
        `;

        list.appendChild(article);
    }
    
    static deletePost(el) {
        if (el.classList.contains('delete-btn')) {
            el.parentElement.parentElement.remove();
        }
    }

    static editPost(el) {
        const name = document.querySelector('#name').value
        const pos = document.querySelector('#position').value
        const text = document.querySelector('#text').value

        if(el.classList.contains('edit-btn')) {
            if(name === '' && pos === '' && text === ''){
                document.querySelector('#name').value = `${el.parentElement.parentElement.firstElementChild.textContent}`;
                document.querySelector('#position').value = `${el.parentElement.parentElement.firstElementChild.nextElementSibling.textContent}`;
                document.querySelector('#text').value = `${el.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.textContent}`;
                // remove
                el.parentElement.parentElement.remove();
            } else {
                alert('Please clear the fields.');
            }   
        }
    }

    static clearFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#position').value = '';
        document.querySelector('#text').value = '';
    }
}

// Store Class
class Store {
    static getPosts() {
        let posts;
        if(localStorage.getItem('posts') === null) {
            posts = [];
        } else {
            posts = JSON.parse(localStorage.getItem('posts'));
        }
        return posts;
    }
    static addPost(post) {
        const posts = Store.getPosts();
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
    }
    static removePost(name, text) {
        const posts = Store.getPosts();
        posts.forEach((post, index) => {
            if(post.name === name && post.text === text) {
                posts.splice(index, 1);
            }
        });
        localStorage.setItem('posts', JSON.stringify(posts));
    }
}

// Event: display posts
document.addEventListener('DOMContentLoaded', UI.displayPosts);

// Event: add a post
document.querySelector('#post-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // get form values
    const name = document.querySelector('#name').value;
    const pos = document.querySelector('#position').value;
    const text = document.querySelector('#text').value;
    
    // validation
    if(name === '' || pos ===  '' || text === '') {
        alert('Please fill-in all fields.');
    } else {
        // instantiate post
        const post = new Post (name, pos, text);
    
        // add post to UI
        UI.addPostToList(post);

        // add post to localStorage
        Store.addPost(post);

        // clear fields
        UI.clearFields();
    }
});

// Event: remove or edit a post
document.querySelector('#post-list').addEventListener('click', (e) => {
    // remove book from UI
    UI.deletePost(e.target)

    // edit a post
    UI.editPost(e.target)

    // remove book from localStorage
    Store.removePost( e.target.parentElement.parentElement.firstElementChild.textContent, e.target.parentElement.previousElementSibling.textContent);
});

// const initPosts = [
//     {
//         name: 'Sir Melvin',
//         pos: 'Instructor',
//         text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia incidunt nisi tempora inventore consequuntur nam veritatis similique facere? Dolorem, mollitia.'
//     },
//     {
//         name: "Ma'am Annie",
//         pos: 'Dept. Chair',
//         text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil aspernatur quos necessitatibus culpa laboriosam tenetur? '
//     }
// ]
// initPosts.forEach(post => UI.addPostToList(post));