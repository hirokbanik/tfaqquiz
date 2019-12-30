(function() {
  const progress = $(".progress-question");
  const question = $(".question");
  const choiceBox = $(".choice-box");
  const button = $(".button");
  let questions = [];
  let current_question = "";
  let choices = [];
  let correct = "";
  let score = 0;
  let count = 1;

  button.addEventListener("click", () => {
    if (button.innerText != "Next") {
      buildQuestions();
      updateDOM();
      button.innerText = "Next";
    } else updateDOM();
  });

  choiceBox.addEventListener("click", e => {
    // debugger;
    if (!e.target.classList.contains("choice")) return;
    if (e.target.innerText == correct) {
      e.target.style.backgroundColor = "#00ff007e";
      score++;
      setTimeout(updateDOM, 500);
    } else {
      e.target.style.backgroundColor = "#ff00008c";
      e.target.parentElement.childNodes.forEach(i => {
        if (i.innerText == correct) i.style.backgroundColor = "#00ff007e";
      });
      setTimeout(updateDOM, 1000);
    }
  });

  function updateDOM() {
    if (count > 10) {
      showResult();
    } else {
      let current = questions[count - 1];
      current_question = current.question;
      choices = current.choices;
      correct = current.correct_answer;

      progress.innerHTML = `${count}/${questions.length}`;
      question.innerHTML = current_question;
      choiceBox.innerHTML = "";
      while (choices.length != 0) {
        let randomNumber = Math.floor(Math.random() * choices.length);
        choiceBox.appendChild(createElement(choices[randomNumber]));
        choices[randomNumber];
        choices = choices.filter(i => i != choices[randomNumber]);
      }
      count++;
    }
  }

  function showResult() {
    choiceBox.innerHTML = "";
    button.innerText = "Play";
    question.innerHTML = `<div class="score"><h3>Your Score</h3><h1>${score}</h1><div>`;
    count = 1;
    score = 0;
  }

  function createElement(option) {
    let el = document.createElement("div");
    el.classList.add("choice");
    el.innerHTML = option;
    return el;
  }

  function buildQuestions() {
    getQuestions();
    let rawData = JSON.parse(localStorage.getItem("test_questions"));
    let data = rawData.results.map(i => {
      i.choices = [...i.incorrect_answers, i.correct_answer];
      return i;
    });
    questions = data;
  }

  async function getQuestions() {
    let apiURL = "https://opentdb.com/api.php?amount=10";
    let response = await fetch(apiURL).then(res => res.json());
    localStorage.setItem("test_questions", JSON.stringify(response));
  }

  function $(el) {
    return document.querySelector(el);
  }
})();
