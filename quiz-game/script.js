// DOM elements

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionSpan = document.getElementById("total-question");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");


const quizQuestions = [
    {
        question: "What is the capital of France?",
        answers: [
            {text: "London",correct: false},
            {text: "Berlin",correct: false},
            {text: "Paris",correct: true},
            {text: "Madrid",correct: false},
        ],
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            {text: "Venus",correct: false},
            {text: "Mars",correct: true},
            {text: "Jupiter",correct: false},
            {text: "Saturn",correct: false},
        ],
    },
    {
        question: "What is the largest ocean on earth?",
        answers: [
            {text: "Atlantic",correct: false},
            {text: "Indian",correct: false},
            {text: "Arctic",correct: false},
            {text: "Pacific",correct: true},
        ],
    },
    {
        question: "Which of these is not a programming language?",
        answers: [
            {text: "Python",correct: false},
            {text: "Java",correct: false},
            {text: "Banana",correct: true},
            {text: "Javascript",correct: false},
        ],
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: [
            {text: "Go",correct: false},
            {text: "Gd",correct: false},
            {text: "Au",correct: true},
            {text: "Ag",correct: false},
        ],
    },
]

// Game State Variables. 

let currentQuestionIndex = 0;
let score = 0;
let answerDisabled = false;

totalQuestionSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz() {
    // reset vars
    currentQuestionIndex = 0;
    score = 0;
    scoreSpan.textContent = 0;

    startScreen.classList.remove("active");
    quizScreen.classList.add("active");

    showQuestion();
}

function showQuestion() {
    // Update the score on the rightside
    answerDisabled = false;

    // Get the current Question by indexing the question from the quizQuestions object.
    const currentQuestion = quizQuestions[currentQuestionIndex];

    // Update the question number in the Browser
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    // Update the progressbar percentage
    const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
    progressBar.style.width = progressPercent + "%";
    
    // Display the current question from the list
    questionText.textContent = currentQuestion.question;

    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("answer-btn");

        // Dataset is an attribute of a button. It gives every button a default value. like true for answers that are correct and false for answers that are incorrect. They are different from links or functions that a button has.
        button.dataset.correct = answer.correct;
        
        // choose what happens when you click an answer button
        button.addEventListener("click", selectAnswer);

        // now add each button to the answersContainer
        answersContainer.appendChild(button);
    });
}

function selectAnswer(event) {
    if(answerDisabled) return;

    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === "true";

    Array.from(answersContainer.children).forEach((button) => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        } else if (button === selectedButton) {
            button.classList.add("incorrect");
        }
    });

    if(isCorrect) {
        score++
        scoreSpan.textContent = score;
    }


    setTimeout(() => {
        currentQuestionIndex++;

        // check if there are any other question or is this the last question
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    },1000);
}


function showResults() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    finalScoreSpan.textContent = score;

    const percentage = (score / quizQuestions.length) * 100;

    if (percentage === 100) {
        resultMessage.textContent = "Perfect! You're a Genius!";
    } else if (percentage >= 80) {
        resultMessage.textContent = "Great Job! You know your stuff!";
    } else if (percentage >= 60) {
        resultMessage.textContent = "Good job! Keep upskilling!";
    } else if (percentage >= 40) {
        resultMessage.textContent = "Not bad! Try again to improve!";
    } else {
        resultMessage.textContent = "Keep studying! you will improve!";
    }
}

function restartQuiz() {
    resultScreen.classList.remove("active");
    
    startQuiz()
}
