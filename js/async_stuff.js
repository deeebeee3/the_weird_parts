const posts = [
  { title: "First Post", body: "this is the first post" },
  { title: "Second Post", body: "this is the second post" }
];

function getPosts() {
  setTimeout(() => {
    let output = "";
    posts.forEach((post, index) => {
      output += `<li>${post.title}<\li>`;
    });
    document.body.innerHTML = output;
  }, 1000);
}

function createPost(post) {
  setTimeout(() => {
    posts.push(post);
  }, 2000);
}

//will show posts on page after a second
getPosts();

//will create a post after two seconds
createPost({ title: "Third Post", body: "this is the third post" });

//Obviously third post wont be visible on the page because it is added after two seconds
//How to fix???

//1. Add a callback ----------------------------------------------------

function createPost(post, callback) {
  setTimeout(() => {
    posts.push(post);
    callback();
  }, 2000);
}

createPost({ title: "Third Post", body: "this is the third post" }, getPosts());

//2a. Use Promises ----------------------------------------------------

function createPost(post) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      posts.push(post);

      const error = false;

      if (!error) {
        resolve("Success: Post created.");
      } else {
        reject("Error: Something went wrong.");
      }
    }, 2000);
  });
}

createPost({ title: "Third Post", body: "this is the third post" }).then(
  getPosts
).catch(err => console.log(err));


//2b. Promise all example (wrap in script tags and stick in html page to see timeout working) 

const promise1 = Promise.resolve('Hello World');
const promise2 = 10;
const promise3 = new Promise((resolve, reject) => {
    setTimeout(() => { resolve('i promised i would take 5 seconds!') }, 5000);
});

//fetch API
const promise4 = fetch('https://jsonplaceholder.typicode.com/posts/1').then(response => response.json());

Promise.all([promise1, promise2, promise3, promise4]).then((values) => {
    console.log(values);
});


//3. Async / Await ----------------------------------------------------

async function init(){
    await createPost({ title: "Third Post", body: "this is the third post" });

    getPosts();

    console.log('you will see me first, before the posts!')
}

init();


//4. Async / Await / Fetch ------------------------------------------------

async function fetchUsers(){
    const results = await fetch('https://jsonplaceholder.typicode.com/posts/1');

    const data = await results.json();

    console.log(data)
}

fetchUsers();
