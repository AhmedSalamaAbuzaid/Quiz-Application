// Select elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");



// set question index
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

// get json obj data
function getQuestions() {

    const myRequest = new XMLHttpRequest();
    // .onreadystatechange check if there is respond (if my request on ready state)
    myRequest.onload = function () { // dont use arrow function here

        if (this.readyState === 4 && this.status === 200) {
            let qsObj = JSON.parse(this.responseText);
            let questionCount = qsObj.length;


            
            

            // create bullets + Set Q count
            creatBullets(questionCount);
            
            // add qustion data
            addQuestionData(qsObj[currentIndex],questionCount);

            // strt countdown 
            countdown(60, questionCount)

            // Click On Submit 
            submitButton.onclick = () =>  {

                // get right answer first 
                let theRightAnswer = qsObj[currentIndex].right_answer;

                // Increase Index
                currentIndex++;

                // check th answer
                checkAnswer(theRightAnswer,questionCount);

                // Remove previous Question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

                 // update qustion data after remove
                addQuestionData(qsObj[currentIndex],questionCount);

                // handle bullets class 
                handleBullets();

                // clear interval
                clearInterval(countDownInterval);

                // strt countdown after clicking again 
                countdown(60, questionCount);

                // show results
                showResults(questionCount);
            };
        };
    };

    // [1] get and sent the rqeust and async is true 
    myRequest.open('get', "html_questions.json", true);
    myRequest.send();
}
getQuestions();


function creatBullets(num) {

    countSpan.innerHTML = num;

    // create spans
    for (let i=1; i <= num; i++) {
        // create span
        theBullet = document.createElement("span");

        // check first span
        if (i === 1) {
            theBullet.className ='on';
        }
        // append to main container
        bulletsSpanContainer.appendChild(theBullet);
    };
    
};


function addQuestionData(obj, count){

    if (currentIndex < count) {
            // create Q Element
        let qElement = document.createElement("h2");
        
        // create Q text content
        let qText = document.createTextNode(obj.title);
        
        // append text to h2 
        qElement.appendChild(qText);

        // append the h2 to the quiz area
        quizArea.appendChild(qElement);

        // create the answers
        for (let i = 1 ; i<= 4; i++) {
            // create main answer div 
            let mainDiv = document.createElement("div");

            // add class to main div 
            mainDiv.className = 'answer';

            // creat radio input
            let radioInput = document.createElement("input");

            // add type + name + id + data-attribute
            radioInput.name = 'questions';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answers_${i}`]; // `${obj.answers_}${i}`

            // Make First Option Selected
            if (i === 1){
            radioInput.checked = true;
            }


            let lable = document.createElement("label");
            // ****HtmlFor****
            lable.htmlFor = `answer_${i}`;

            // create lable Text 
            let theLableText = document.createTextNode(obj[`answers_${i}`]);
            // add the text to label
            lable.appendChild(theLableText);

            // add input + lable To main Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(lable);

            answersArea.appendChild(mainDiv);
        };
    };
};


function checkAnswer (rAnswer, count) {

    let answers = document.getElementsByName("questions");
    let theChoosenAnswer;
    

    for (let i=0; i < answers.length; i++){
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].getAttribute("data-answer"); // answers[i].dataset.answer; 
        }
    }
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
    
}

// function handle bullets
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index) => {

        if (currentIndex === index){

            span.classList.add("on")
        }
    })
}

// fuction show results
function showResults(count) {
    let theResults;

        if (currentIndex === count){
            quizArea.remove();
            answersArea.remove();
            submitButton.remove();
            bullets.remove();


            if (rightAnswers > (count / 2) && rightAnswers < count) {
                theResults = `
                <span class="good" >Good </span> You Answerd ${rightAnswers} From ${count} `
            } else if (rightAnswers === count){
                theResults = `
                <span class="perfect" >Perfect </span> You Answerd ${rightAnswers} From ${count} congratulation! You won a badge!`
            }else {
                theResults = `
                <span class="bad" >Bad </span> You Answerd ${rightAnswers} From ${count} You need some practicing :( !`
            }
            resultsContainer.innerHTML = theResults;
            resultsContainer.style.cssText = "display: flex;flex-direction: column;justify-content: space-around;font-size:50px;padding:20px;height: 400px;text-align: center";
        }
}


function countdown (duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;
            countDownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }
        },1000);
    };
};
