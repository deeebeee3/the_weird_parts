// https://jakearchibald.com/2015/thats-so-fetch/

// There's been some confusion around the new fetch API recently. Let's clear things up.
// The first thing you'll notice about fetch is it's a massive improvement on XMLHttpRequest in terms of API design. 
// Here's how to get some JSON using XHR:

var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.responseType = 'json';

xhr.onload = function() {
  console.log(xhr.response);
};

xhr.onerror = function() {
  console.log("Booo");
};

xhr.send();

// Now mop up that vomit and take a look at how fetch does the same thing:

fetch(url).then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
}).catch(function() {
  console.log("Booo");
});

// Mix in some ES6 arrow functions and it gets even more compact:

fetch(url).then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.log("Booo"))

// And with ES7 async functions it can be structured like sync code, whilst still being async:

(async() => {
  try {
    var response = await fetch(url);
    var data = await response.json();
    console.log(data);
  } catch (e) {
    console.log("Booo")
  }
})();
