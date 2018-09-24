//THE WEIRD PARTS
/*==========================================================*/

//Closure 1
function buildFunctions() {
    var arr = [];
    
    for (var i=0; i < 3; i++) {
        arr.push(function() {
            console.log(i);
        });
        
    }
    
    return arr;
}

var fs = buildFunctions();

fs[0]();
fs[1]();
fs[2]();

/*==========================================================*/

//Closure 2
function buildFunctions2() {
    var arr = [];
    
    for (var i=0; i < 3; i++) {
        arr.push(
            //to preserve value of i - we need seperate execution context for each of the functions i'm pushing into //array - i need a parent scope that holds current value of i as the loop goes.
            //the only way to do that is to execute a function - so how can we do that on the fly...? Well we need an //IIFE...
            
            (function(j){ //Will have 3 execution contexts
                return function(){
                    console.log(j);
                }
            }(i))
            
        );
        
    }
    
    return arr;
}

var fs2 = buildFunctions2();

fs2[0]();
fs2[1]();
fs2[2]();

/*==========================================================*/

//Function factories
function makeGreeting(language){
    return function(firstname, lastname){
        if(language === 'en'){
           console.log('Hello ' + firstname + ' ' + lastname);
        }
        if(language === 'es'){
           console.log('Hola ' + firstname + ' ' + lastname);
        }
    }
}

//Functions created from the factory...
var greetEnglish = makeGreeting('en'); //one execution context
var greetSpanish = makeGreeting('es'); //another execution context

greetEnglish('Dee','Bee');
greetSpanish('Dee','Bee');

/*==========================================================*/

//Callback
function tellMeWhenDone(callback){
    var a = 1000;
    var b = 2000;
    
    callback();
}

tellMeWhenDone(function(){
    console.log('I am done!');
});

tellMeWhenDone(function(){
    console.log('All done!');
});

//event loop / queue
//Web API's - DOM, Ajax, setTimeout()
//Web API's can spawn multiple threads, Javascript runtime is single threaded

//example using function expression (creating function on fly), closure
function func(){
    var symbol = 'beta';
    
    console.log('alpha');
    setTimeout(function(){console.log(symbol)}, 0);
    console.log('gamma');
}

func();

/*==========================================================*/

//Call, Apply, Bind (bind creates copy)

var person = {
    firstname: 'John',
    lastname: 'Doe',
    getFullName: function(){
        var fullname = this.firstname + ' ' + this.lastname;
        return fullname;
    }
}


var logName = function(lang1, lang2){
    console.log('Logged: ' + this.getFullName());
    console.log('Arguments: ' + lang1 + ' ' + lang2);
    console.log('-----------');
}

//bind
var logPersonName = logName.bind(person);
logPersonName('en', 'es');

//call
logName.call(person, 'en', 'es');

//apply
logName.apply(person, ['en','es']);

//example of creating function on the fly and immediately invoking
(function(lang1, lang2){
    console.log('Logged: ' + this.getFullName());
    console.log('Arguments: ' + lang1 + ' ' + lang2);
    console.log('-----------');
}).apply(person, ['en','es']);

//Function Borrowing example
var person2 = {
    firstname: 'Jane',
    lastname: 'Doe',
}

console.log(person.getFullName.apply(person2));

//Function Currying example
function multiply(a,b){
    return a*b;
}

//parameter a will always be a 2
//made a permanent copy of the function with a parameter(s) set by default
var multiplyByTwo = multiply.bind(this, 2);

//parameter b is 5
multiplyByTwo(5); //result 10

/*==========================================================*/


