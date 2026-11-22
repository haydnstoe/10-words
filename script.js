const vocabulary = [

{
word:"Decadent",
definition:"Characterised by luxury, self-indulgence, or moral decline.",
scenario:"The guests enjoyed rich desserts, expensive wines, and extravagant entertainment throughout the evening.",
application:'Which word best completes the sentence?\n\n"The banquet was so extravagant that many described it as ________."',
synonym:"Luxurious",
antonym:"Simple"
},

{
word:"Obligatory",
definition:"Required by rule, law, or custom.",
scenario:"Every pupil must wear a school badge whilst on the premises.",
application:'Which word best completes the sentence?\n\n"Safety equipment is ________ before entering the laboratory."',
synonym:"Required",
antonym:"Optional"
},

{
word:"Bovine",
definition:"Relating to cattle.",
scenario:"The animals grazed peacefully in the field and produced milk for the dairy farm.",
application:'Which word best completes the sentence?\n\n"The veterinarian specialised in ________ animals such as cows."',
synonym:"Cow-like",
antonym:"Feline"
},

{
word:"Carnivore",
definition:"An animal that eats meat.",
scenario:"The lion relies on hunting other animals for food.",
application:'Which word best completes the sentence?\n\n"A tiger is a ________ because it survives by eating other animals."',
synonym:"Meat-eater",
antonym:"Herbivore"
},

{
word:"Herbivore",
definition:"An animal that eats plants.",
scenario:"The rabbit spends most of its time eating grass and leaves.",
application:'Which word best completes the sentence?\n\n"A giraffe is a ________ because it feeds on leaves."',
synonym:"Plant-eater",
antonym:"Carnivore"
},

{
word:"Omnivore",
definition:"An animal that eats both plants and animals.",
scenario:"Bears may eat berries, fish, insects and small mammals.",
application:'Which word best completes the sentence?\n\n"An animal that eats both plants and meat is an ________."',
synonym:"Mixed feeder",
antonym:"Specialist eater"
},

{
word:"Despondent",
definition:"Feeling hopeless or discouraged.",
scenario:"After several setbacks, Lucy felt that nothing she did would improve the situation.",
application:'Which word best completes the sentence?\n\n"After losing every match, the team became ________."',
synonym:"Disheartened",
antonym:"Hopeful"
},

{
word:"Satirise",
definition:"To criticise using humour, irony or exaggeration.",
scenario:"The comedian mocked political leaders through jokes and exaggerated stories.",
application:'Which word best completes the sentence?\n\n"The cartoonist used humour to ________ government policies."',
synonym:"Mock",
antonym:"Praise"
},

{
word:"Perceive",
definition:"To become aware of or understand something.",
scenario:"Although the change was subtle, Maria immediately recognised that something was different.",
application:'Which word best completes the sentence?\n\n"Only a few people could ________ the slight difference in colour."',
synonym:"Notice",
antonym:"Ignore"
},

{
word:"Correspondent",
definition:"A reporter or regular communicator.",
scenario:"The journalist regularly sent reports from overseas.",
application:'Which word best completes the sentence?\n\n"The foreign ________ reported on events from around the world."',
synonym:"Reporter",
antonym:"Audience member"
},

{
word:"Penalise",
definition:"To impose a punishment or disadvantage.",
scenario:"The referee awarded a free kick after a player broke the rules.",
application:'Which word best completes the sentence?\n\n"The teacher may ________ students who repeatedly break classroom rules."',
synonym:"Punish",
antonym:"Reward"
},

{
word:"Vivacious",
definition:"Lively, energetic and full of life.",
scenario:"Her cheerful energy improved the atmosphere for everyone.",
application:'Which word best completes the sentence?\n\n"Her ________ personality made her popular with everyone she met."',
synonym:"Animated",
antonym:"Dull"
}

];

function shuffle(array){
    return [...array].sort(()=>Math.random()-0.5);
}

document.getElementById("referenceList").innerHTML =
vocabulary.map(v => `
<div class="card word-entry">
    <h3>${v.word}</h3>
    <p>${v.definition}</p>
    <p><em>${v.scenario}</em></p>
</div>
`).join("");

let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let studentAnswers = [];
let quizMode = "practice";

function generateQuestion(word){

    const types = [
        "definition",
        "scenario",
        "synonym",
        "antonym",
        "application"
    ];

    const type =
        types[Math.floor(
            Math.random()*types.length
        )];

    let questionText = "";
    let answer = "";
    let pool = [];

    switch(type){

        case "definition":
            questionText =
                `What is the definition of "${word.word}"?`;
            answer = word.definition;
            pool = vocabulary.map(v=>v.definition);
            break;

        case "scenario":
            questionText =
                `${word.scenario}\n\nWhich vocabulary word best matches this situation?`;
            answer = word.word;
            pool = vocabulary.map(v=>v.word);
            break;

        case "synonym":
            questionText =
                `Which is the best synonym for "${word.word}"?`;
            answer = word.synonym;
            pool = vocabulary.map(v=>v.synonym);
            break;

        case "antonym":
            questionText =
                `Which is the best antonym for "${word.word}"?`;
            answer = word.antonym;
            pool = vocabulary.map(v=>v.antonym);
            break;

        case "application":
            questionText =
                word.application;
            answer = word.word;
            pool = vocabulary.map(v=>v.word);
            break;
    }

    const options = [answer];

    while(options.length < 4){

        const choice =
            pool[Math.floor(
                Math.random()*pool.length
            )];

        if(!options.includes(choice)){
            options.push(choice);
        }
    }

    return {
        word: word.word,
        definition: word.definition,
        answer,
        questionText,
        options: shuffle(options)
    };
}

document
.getElementById("startQuiz")
.addEventListener("click", startQuiz);

function startQuiz(){

    quizMode =
        document.querySelector(
            'input[name="mode"]:checked'
        ).value;

    score = 0;
    currentQuestionIndex = 0;
    studentAnswers = [];

    questions =
        shuffle(
            vocabulary.map(generateQuestion)
        );

    renderQuestion();
}

function renderQuestion(){

    const q =
        questions[currentQuestionIndex];

    const progress =
        ((currentQuestionIndex+1)
        / questions.length) * 100;

    document.getElementById("quiz")
    .innerHTML = `
    <div class="card">

        <div class="progress">
        Question ${currentQuestionIndex+1}
        of ${questions.length}
        </div>

        <div class="progress-bar">
            <div
                class="progress-fill"
                style="width:${progress}%">
            </div>
        </div>

        <h3>${q.questionText}</h3>

        <div id="options"></div>

    </div>
    `;

    const options =
        document.getElementById("options");

    q.options.forEach(option=>{

        const btn =
            document.createElement("button");

        btn.className =
            "answer-button";

        btn.textContent = option;

        btn.onclick =
            ()=>answerQuestion(
                q,
                option,
                btn
            );

        options.appendChild(btn);

    });
}

function answerQuestion(
    question,
    selected,
    button
){

    const correct =
        selected === question.answer;

    if(correct){

        score++;
        button.classList.add("correct");

    }else{

        button.classList.add("incorrect");

    }

    studentAnswers.push({

        word: question.word,
        selected,
        answer: question.answer,
        definition: question.definition,
        correct

    });

    setTimeout(()=>{

        currentQuestionIndex++;

        if(
            currentQuestionIndex
            <
            questions.length
        ){
            renderQuestion();
        }else{
            showResults();
        }

    }, 1500);
}

function showResults(){

    const percent =
        Math.round(
            (score/questions.length)
            *100
        );

    let award = "Pass";

    if(percent >= 90){
        award = "🏆 Gold";
    }
    else if(percent >= 75){
        award = "🥈 Silver";
    }
    else if(percent >= 60){
        award = "🥉 Bronze";
    }

    document.getElementById("quiz")
    .innerHTML = "";

    document.getElementById("results")
    .innerHTML = `
    <div class="card">

        <h2>
            Quiz Complete
        </h2>

        <p>
            Score:
            ${score}
            /
            ${questions.length}
        </p>

        <p>
            ${percent}%
        </p>

        <div class="award">
            ${award}
        </div>

    </div>
    `;
}
