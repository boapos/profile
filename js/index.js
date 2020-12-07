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
    constructor (name, pos, text, date, key) {
        this.name = name;
        this.pos = pos;
        this.text = text;
        this.date = date;
        this.key = key;
    }
}

// UI Class
class UI {
    static displayPosts() {
        document.querySelector('#post-list').innerHTML = '';  
        const posts = Store.getPosts();

        posts.forEach(post => UI.addPostToList(post));
    }

    static addPostToList(post) {
        

        const list = document.querySelector('#post-list');
        const article = document.createElement('article');
        article.innerHTML = `
        <h3>${post.name}</h3>
        <p>${post.pos}</p>
        <p>${post.text}</p>
        <section class="mod">
            <i class="edit-btn fa fa-pencil-square-o" title="Edit"></i>
            <i class="delete-btn fa fa-times-circle" title="Delete"></i>
            <span class="key">${post.key}</span>
        </section>
        <p class="date">${post.date}</p>
        `;

        list.appendChild(article);
    }
    
    static deletePost(el) {
        if (el.classList.contains('delete-btn')) {
            el.parentElement.parentElement.remove();
        }
    }

    static editPost(el) {
      if(el.classList.contains('edit-btn')) {
        document.querySelectorAll('.mod').forEach(element => {
          element.style.display = 'none';
        });
        document.getElementById('name').disabled = true;
        document.getElementById('position').disabled = true;
        document.getElementById('text').disabled = true;
        document.getElementById('post').disabled = true;
  
        let name = el.parentElement.parentElement.firstElementChild.textContent;
        let pos = el.parentElement.parentElement.firstElementChild.nextElementSibling.textContent;
        let text = el.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.textContent;
        let date = el.parentElement.parentElement.lastElementChild.textContent;
        let key = el.nextElementSibling.nextElementSibling.textContent;
        
        el.parentElement.parentElement.firstElementChild.innerHTML = `<input class="feedback-input edit" type="text" value="${name}">`;
        el.parentElement.parentElement.firstElementChild.nextElementSibling.innerHTML = `<input class="feedback-input edit" type="text" value="${pos}">`;
        el.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.innerHTML = `<textarea class="feedback-input">${text}</textarea>`;
        let save = document.createElement('input');
        let discard = document.createElement('input');
        save.setAttribute('id', 'save');
        save.setAttribute('class', 'post-btn save-btn');
        save.setAttribute('type', 'submit');
        save.setAttribute('value', 'Save');
        discard.setAttribute('id', 'discard');
        discard.setAttribute('class', 'post-btn discard-btn');
        discard.setAttribute('type', 'submit');
        discard.setAttribute('value', 'Discard');
        
        el.parentElement.parentElement.appendChild(save);
        el.parentElement.parentElement.appendChild(discard);
        let temp = new Post(name, pos, text, date, key)
        Store.addTemp(temp)
        // Store.removePost(name, pos, text);
    }
  }
  static savePost(el) {
      if(el.classList.contains('save-btn')) { 
        document.querySelectorAll('.mod').forEach(element => {
          element.style.display = '';
        });
        let date = new Date().toLocaleString();
        date = '(Edited) ' + date;
        let name = el.parentElement.firstElementChild.firstElementChild.value;
        let pos = el.parentElement.firstElementChild.nextElementSibling.firstElementChild.value;
        let text = el.parentElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.value;
        let key = el.previousElementSibling.previousElementSibling.lastElementChild.textContent;
        if(name === '' || pos ===  '' || text === '') {
          alert('Please fill-in all fields.');
        } else {
          Store.removePost(key)
          Store.removeTemp(key)
          const updatedPost = new Post (name, pos, text, date, null);
          Store.addPost(updatedPost)
          UI.displayPosts();
          document.getElementById('name').disabled = false;
          document.getElementById('position').disabled = false;
          document.getElementById('text').disabled = false;
          document.getElementById('post').disabled = false;
        }
    }
  }
    static discardPost(el) {
      if(el.classList.contains('discard-btn')) {
        document.querySelectorAll('.mod').forEach(element => {
          element.style.display = '';
        });
        let key = el.previousElementSibling.previousElementSibling.previousElementSibling.lastElementChild.textContent;
        let temps = Store.getTemps();
        temps.forEach((temp) => {
          if (temp.key == key) {
              el.parentElement.firstElementChild.innerHTML = temp.name;
              el.parentElement.firstElementChild.nextElementSibling.innerHTML = temp.pos;
              el.parentElement.firstElementChild.nextElementSibling.nextElementSibling.innerHTML = temp.text;
              el.previousElementSibling.previousElementSibling.previousElementSibling.style.display = '';
              el.previousElementSibling.remove();
              el.remove();
              Store.removeTemp(key);
              document.getElementById('name').disabled = false;
              document.getElementById('position').disabled = false;
              document.getElementById('text').disabled = false;
              document.getElementById('post').disabled = false;
          }
        });
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
        posts.forEach((post, index) => {
          post.key = index;
        });
        localStorage.setItem('posts', JSON.stringify(posts));
    }
    static removePost(key) {
        const posts = Store.getPosts();
        posts.forEach((post, index) => {
            if(post.key == key) {
                posts.splice(index, 1);
            }
        });
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    static getTemps() {
      let temps;
      if(localStorage.getItem('temps') === null) {
          temps = [];
      } else {
          temps = JSON.parse(localStorage.getItem('temps'));
      }
      return temps;
  }
    static addTemp(temp) {
      const temps = Store.getTemps();
      temps.push(temp);
      localStorage.setItem('temps', JSON.stringify(temps));
    }
    static removeTemp(key) {
      const temps = Store.getTemps();
      temps.forEach((temp, index) => {
          if(temp.key == key) {
              temps.splice(index, 1);
          }
      });
      localStorage.setItem('temps', JSON.stringify(temps));
  }
    static resetTemp() {
      let temps = [];
      localStorage.setItem('temps', JSON.stringify(temps));
    }
}

// Event: display posts
document.addEventListener('DOMContentLoaded', UI.displayPosts);
document.addEventListener('DOMContentLoaded', Store.resetTemp);

// Event: add a post
document.querySelector('#post-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // get form values
    const name = document.querySelector('#name').value;
    const pos = document.querySelector('#position').value;
    const text = document.querySelector('#text').value;
    const date = new Date().toLocaleString();
    
    // validation
    if(name === '' || pos ===  '' || text === '') {
        alert('Please fill-in all fields.');
    } else {
        // instantiate post
        const post = new Post (name, pos, text, date, null);
    
        // add post to localStorage
        Store.addPost(post);

        // add post to UI
        // UI.addPostToList(post);

        UI.displayPosts();

        // clear fields
        UI.clearFields();
    }
});

// Event: remove or edit a post
document.querySelector('#post-list').addEventListener('click', (e) => {
    // remove post from UI
    if (e.target.classList.contains('delete-btn')) {
      UI.deletePost(e.target)
      Store.removePost(e.target.nextElementSibling.textContent);
    }
    // edit a post
    UI.editPost(e.target);
    
    // save edit 
    UI.savePost(e.target);
    
    UI.discardPost(e.target);
});

    
