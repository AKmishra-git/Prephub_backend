/* ---------- PAGE NAVIGATION ---------- */

function openfeatures() {
    let elems = document.querySelectorAll('.section2');
    let pages = document.querySelectorAll('.page');
    let backButtons = document.querySelectorAll('.back');

    elems.forEach(ele => {
        ele.addEventListener('click', () => {
            pages.forEach(page => page.style.display = 'none');

            const targetPage = document.querySelector(`.page[id="${ele.id}"]`);
            if (targetPage) {
                targetPage.style.display = 'block';

                // 🔑 THIS IS THE FIX
                targetPage.scrollIntoView({ behavior: "instant", block: "start" });
            }
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.page').style.display = 'none';
        });
    });
}



/* ---------- TODO + LOCAL STORAGE ---------- */

function todolist() {
    let currenttask = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(currenttask));
    }

    function rendertask() {
        let alltask = document.querySelector('.alltask');
        if (!alltask) return;

        let sum = "";

        currenttask.forEach(ele => {
            sum += `
                <div class="task">
                    <h5>${ele.task}</h5>
                    <button>Mark as completed</button>
                </div>
            `;
        });

        alltask.innerHTML = sum;
    }

    rendertask();

    let form = document.querySelector('.addtask form');
    if (!form) return;

    let taskinput = form.querySelector('input');
    let taskdetails = form.querySelector('textarea');

    form.addEventListener('submit', e => {
        e.preventDefault();

        if (taskinput.value.trim() === "") return;

        currenttask.push({
            task: taskinput.value.trim(),
            details: taskdetails.value.trim()
        });

        saveTasks();
        rendertask();

        taskinput.value = "";
        taskdetails.value = "";
    });
}

/* ---------- DAILY PLANNER ---------- */

function dailyPlanner() {
    let dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {};
    let dayPlanner = document.querySelector('.day-planner-time');
    if (!dayPlanner) return;

    let arr = Array.from({ length: 18 }, (_, idx) =>
        `${6 + idx}:00 - ${7 + idx}:00`
    );

    let wholeDaySum = '';

    arr.forEach((ele, idx) => {
        let savedData = dayPlanData[idx] || '';
        wholeDaySum += `
            <div class="time-section">
                <p>${ele}</p>
                <input id="${idx}" type="text" placeholder="..." value="${savedData}">
            </div>
        `;
    });

    dayPlanner.innerHTML = wholeDaySum;

    document
        .querySelectorAll('.day-planner-time input')
        .forEach(input => {
            input.addEventListener('input', () => {
                dayPlanData[input.id] = input.value;
                localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData));
            });
        });
}






/* motivation-page */

function motivationquote(){
    let quote = document.querySelector('.motivation-wrapper .quotecontent p');
    let author = document.querySelector('.quotecontent .writer-name h2');

   async function fetchQuote(){

    let response = await fetch('https://api.quotable.io/random');
    let data = await response.json();
    
    quote.innerHTML = data.content;
    author.innerHTML = `~ ${data.author}`;
  }

fetchQuote();

}




/* timer-page */

function pomodoroTimer(){
    letBtn = document.querySelector('.pomo-timer .reset');
let timer = document.querySelector('.pomo-timer h1');
let startBtn = document.querySelector('.pomo-timer .start');
let pauseBtn = document.querySelector('.pomo-timer .pause');
let resetBtn = document.querySelector('.pomo-timer .reset');

let totalSeconds = 1500;
let timervariable = null;


function updateTime(){
    let minutes = Math.floor(totalSeconds/60);
    let seconds = totalSeconds%60;

    timer.innerHTML = `${String(minutes).padStart('2','0')}:${String(seconds).padStart('2', '0')}`;
    

    
}


function startTimer(){
    timervariable=setInterval(()=>{
      if(totalSeconds>0){
        totalSeconds--;
        updateTime();

      }else{
        clearInterval(timervariable);
      }
    }, 1000);
}

function pauseTimer(){
    clearInterval(timervariable)
}

function resetTimer(){
    totalSeconds = 25*60;
    clearInterval(timervariable);
    updateTime();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);



}



/* weather */

function weatherForecast(){

    let apikey = "37652955bcfe40339cc164932260301";
    let city = "Noida"; // fallback city

    let dayheader = document.querySelector('.second .header2 .day');
    let tempheader = document.querySelector('.header1 h2');
    let precip = document.querySelector('.header1 .precipitation .precip');
    let humid = document.querySelector('.header1 .humidity .humid');
    let wind = document.querySelector('.header1 .wind .air');
    let weathertype = document.querySelector('.header2 .condn');

    let data = null;

    /* ---------------- WEATHER API ---------------- */

    async function weatherAPI(){
        let response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`
        );

        data = await response.json();

        currentTemp();
        precipitation();
        humidity();
        windblow();
        condition();
    }

    function currentTemp(){
        tempheader.innerHTML = `${data.current.temp_c}°C`;
    }

    function precipitation(){
        precip.innerHTML = `Precipitation: ${data.current.precip_mm}mm`;
    }

    function humidity(){
        humid.innerHTML = `Humidity: ${data.current.humidity}%`;
    }

    function windblow(){
        wind.innerHTML = `Wind: ${data.current.wind_kph} Km/h`;
    }

    function condition(){
        weathertype.innerHTML = data.current.condition.text;
    }

    /* ---------------- LIVE LOCATION ---------------- */

    function getLiveLocation(){
        if(!navigator.geolocation){
            weatherAPI(); // fallback
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try{
                    const res = await fetch(
                        `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${lat},${lon}`
                    );
                    const locData = await res.json();

                    city = locData.location.name; // 🔑 update city
                    weatherAPI();                 // fetch weather
                }catch(err){
                    weatherAPI(); // fallback
                }
            },
            () => {
                weatherAPI(); // permission denied
            }
        );
    }

    /* ---------------- DATE & TIME ---------------- */

    function timeDate(){
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        let date = new Date();

        let day = days[date.getDay()];
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;

        let time = `${hours}:${String(minutes).padStart(2,"0")} ${ampm}`;
        dayheader.innerHTML = `${day}, ${time}`;
    }

    timeDate();
    setInterval(timeDate, 60000);

    /* ---------------- INIT ---------------- */
    getLiveLocation();
}


/* theme change */

function changeTheme(){
    let theme=document.querySelector('.theme');
    let rootElement = document.documentElement;
    let flag =0;
    theme.addEventListener('click', ()=>{
    

    if(flag==0){
        rootElement.style.setProperty('--sec', '#061E29');
        flag=1;
    }else if(flag==1){
        rootElement.style.setProperty('--sec', '#1D546D');
        flag=2;
    }else if(flag==2){
        rootElement.style.setProperty('--sec', '#1C4D8D');
        flag=3;
    }else if(flag==3){
        rootElement.style.setProperty('--sec', '#DE1A58');
        flag=4;

    }else if(flag==4){
        rootElement.style.setProperty('--sec', '#4E1F00');
        flag=0;

    }


    
})

}



function goals(){
    const textarea = document.querySelector(".goals-container textarea");
   const addBtn = document.querySelector(".goals-container button");
   const goalsList = document.querySelector(".goals-list");


let goals = JSON.parse(localStorage.getItem("goals")) || [];


function renderGoals() {
    
    goalsList.querySelectorAll(".goal-item").forEach(item => item.remove());

    goals.forEach((goal, index) => {
        const div = document.createElement("div");
        div.className = `goal-item ${goal.completed ? "completed" : ""}`;

        div.innerHTML = `
            <span>${goal.text}</span>
            <button class="complete-btn">
                ${goal.completed ? "Completed" : "Mark as Completed"}
            </button>
        `;

        const btn = div.querySelector(".complete-btn");

        btn.addEventListener("click", () => {
            goals[index].completed = !goals[index].completed;
            saveGoals();
            renderGoals();
        });

        goalsList.appendChild(div);
    });
}


function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
}


addBtn.addEventListener("click", () => {
    const text = textarea.value.trim();
    if (text === "") return;

    goals.push({
        text: text,
        completed: false
    });

    textarea.value = "";
    saveGoals();
    renderGoals();
});


renderGoals();

}


openfeatures();
todolist();
dailyPlanner();
motivationquote();
pomodoroTimer();
weatherForecast();
changeTheme();
goals();








