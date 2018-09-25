//THE WEIRD PARTS
/*==========================================================*/

//Closure
function greet(whattosay){
    
    //not invoking a function, but creating and returning it...
    return function(){
        console.log(whattosay + ' ' + name);
    }
}

//invoking a function that returns a function
greet('Hi')('Lisa');

//create a new function
var sayHi = greet('Hi');

//how does sayHi function know what the whattosay variable is?
sayHi('Lisa'); 

//even though greet function finished (popped off stack) / gone, any functions created inside of //it - when they're called (in this case sayHi) will still have a reference to that greet //functions memory - what was in it's memory / execution context

//The sayHi Execution context has "closed in" it's outer variables even though the greet
//execution context has gone...

/*==========================================================*/

//Closure 1
function buildFunctions() {
    var arr = [];
    
    for (var i=0; i < 3; i++) {
        //function just pushed into array - its not invoked here...
        arr.push(function() {
            console.log(i);
        });
        
    }
    
    //What is the value of arr and i at this point when returning the array?
    // i is 3, arr is [f0,f1,f2]
    return arr;
}

var fs = buildFunctions();

//all three point to the same memory spot when goin up scope chain
//they were all created inside the same function - buildFunctions...
//All three of these have the same parent
fs[0]();
fs[1]();
fs[2]();

/*==========================================================*/

//New js functionality work around for the above - can use LET

function buildFunctions() {
    var arr = [];
    
    for (var i=0; i < 3; i++) {
        //this gets created and is scoped to the block - everytime loop runs x will 
        //be a new variable in memory - it will be sub segmented inside the memory
        //of this execution context. so everytime function called x will be pointing
        //to a different spot within that memory
        let x = i;
        arr.push(
            function() {
                console.log(x);
            }
        );
        
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

//Functional Programming - Part 1

var arr1 = [1,2,3];

function mapForEach(arr, func){
    var newArr = [];
    for(var i = 0; i < arr.length; i++){
        newArr.push(
            func(arr[i])
        )
    };
    
    //not mutating - but returning a new array **
    return newArr;
}

console.log(arr1);

//passing function to mapForEach - v powerful
var arr2 = mapForEach(arr1, function(item){
    return item * 2;
});

console.log(arr2);

var arr3 = mapForEach(arr1, function(item){
    return item > 2;
});

console.log(arr3);

//check and see if this item is past a certain limit
//this function accepts 2 params - whereas mapForEach wants a function that accepts just one
var checkPastLimit = mapForEach(arr1, function(limiter, item){
    return item > limiter;
});

//how to preset the limiter value... currying...
//bind creates a copy of function - we don't want to change the context so leave it at this
//if we pass pararameters to bind - we preset that value - in this case presetting limiter to 1
//so we've created copy of checkPastLimit on the fly with 1 as the limiter preset...
var arr4 = mapForEach(arr1, checkPastLimit.bind(this, 1));

//can we create a function instead of checkPastLimit without having to use the bind to 
//preset the limiter value everytime?

var checkPastLimitSimplified = function(limiter){
    
    //return a copy of the function with the limiter preset (bind creates a new copy)
    return function(limiter, item){
        return item > limiter;
    }.bind(this, limiter)
}

//now can just set limiter without having to use bind
var arr5 = mapForEach(arr1, checkPastLimitSimplified(1))

//** SIDE NOTE - Functional programming (especially tiny functions)- generally better to not //mutate data - better to return something new, or change it as high up as possible in that
//chain of functions...
