// Page elements:
var questionViewWrap = document.getElementById('questionViewWrap'),
    userInfo = document.getElementById('userInfo'),
    questionNumber = document.getElementById('questionNumber'),
    questionContent = document.getElementById('questionContent'),
    answer1 = document.getElementById('answer1'),
    answer2 = document.getElementById('answer2'),
    answer3 = document.getElementById('answer3'),
    user_name = document.getElementById('greetBoxUsernameInput'),
    notification = document.getElementById('notify'),
    notify_title = document.getElementById('notify_title'),
    answer4 = document.getElementById('answer4');

// Server requests and display:
const pointPerQuestion = 500,
    streakBonus = 200;

var currentQuestion = 0,
    questionList = [],
    streakList = 0,
    currentStreak = 0,
    username = '',
    userScore = 0,
    timeStamp = '';

var assessQuestionResult = (option) => {
    if (option === questionList[currentQuestion].answers) {
        displayNotification('right');
        userScore += pointPerQuestion + streakBonus*currentStreak;
        currentStreak++;
        if (currentStreak > streakList) {
            streakList = currentStreak;
            console.log(streakList)
        }
    }
    else {
        displayNotification('wrong');
        currentStreak = 0;
        console.log(streakList)
    }
};

var assessQuizResult = () => {
    questionViewWrap.style.top = '-100vh';
    var date = new Date();
    timeStamp = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}%20${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    streakList = streakList.toString();

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST","/storeuser", true);
    xmlhttp.setRequestHeader('Content-type',"application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = () =>{
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
        }
    };

    let dataToSend = `username=${username}&score=${userScore}&highestStreak=${streakList}&quizTime=${timeStamp}`;
    console.log(dataToSend);
    xmlhttp.send(dataToSend);
    setTimeout(()=>{
        window.location.replace('/leaderboard');
    }, 1000);
};

var nextQuestion = () => {
    if (currentQuestion < 9) {
        currentQuestion++;
        displayQuestion();
    }
    else {
        assessQuizResult();
    }
    
};

var fetchQuestions = () => {
    console.log(document.styleSheets);
    username = user_name.value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST","/getquestions", true);
    xmlhttp.onreadystatechange = () =>{
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // document.getElementById('questionNumber').innerHTML = 'QUESTION ' + currentQuestion.toString();
            questionList = JSON.parse(xmlhttp.responseText);
            console.log(questionList);

            displayQuestion();
        }
    };
    xmlhttp.send();
};

var displayQuestion = () => {
    questionViewWrap.style.top = '-100vh';
    notification.style.left = '0';
    setTimeout(() => {
        userInfo.innerHTML = userScore;
        questionNumber.innerHTML = 'QUESTION ' + (currentQuestion + 1);
        questionContent.innerHTML = questionList[currentQuestion].question;
        answer1.innerHTML = questionList[currentQuestion].option1;
        answer2.innerHTML = questionList[currentQuestion].option2;
        answer3.innerHTML = questionList[currentQuestion].option3;
        answer4.innerHTML = questionList[currentQuestion].option4;
        questionViewWrap.style.top = "50vh";
        notification.style.left = 'calc(100% + 1vh)';
    }, 1200)
};

let displayNotification = (mode) => {
    let thumbUp = 'url(/assets/images/icons/thumb-up.svg)';
    let thumbDown = 'url(/assets/images/icons/dislike.svg)';

    if (mode === 'wrong') {
        notify_title.innerHTML = "Wrong! :(";
        document.getElementById('tooltip').style.backgroundImage = thumbDown
    } else if ( mode === 'right') {
        notify_title.innerHTML = "Good Job! :)";
        document.getElementById('tooltip').style.backgroundImage = thumbUp
    }
    // setTimeout(() => {
    //     notification.style.top = '0';
    // }, 2000);
};

