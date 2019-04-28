import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { today } from "user-activity";
import * as util from "../common/utils";
import * as messaging from "messaging";

let background = document.getElementById("background");

let hrDigit1   = document.getElementById("hrDigit1");
let hrDigit2   = document.getElementById("hrDigit2");
let hrDigit3   = document.getElementById("hrDigit3");
const hrLabel  = document.getElementById("hrLabel");

let batteryBar = document.getElementById("batteryBar");

let weekday = document.getElementById("weekday");

let timeDigit1 = document.getElementById("timeDigit1");
let timeDigit2 = document.getElementById("timeDigit2");
let timeColon  = document.getElementById("timeColon");
let timeDigit3 = document.getElementById("timeDigit3");
let timeDigit4 = document.getElementById("timeDigit4");

let dateMonth  = document.getElementById("dateMonth");
let dateDigit1 = document.getElementById("dateDigit1");
let dateDigit2 = document.getElementById("dateDigit2");

let runner1 = document.getElementById("runner1");
let runner2 = document.getElementById("runner2");
let runner3 = document.getElementById("runner3");
let runner4 = document.getElementById("runner4");
let runner5 = document.getElementById("runner5");
let runner6 = document.getElementById("runner6");
let runner7 = document.getElementById("runner7");
let runner8 = document.getElementById("runner8");

let stepDigit1   = document.getElementById("stepDigit1");
let stepDigit2   = document.getElementById("stepDigit2");
const stepDot    = document.getElementById("stepDot");
let stepDigit3   = document.getElementById("stepDigit3");
const stepLabel  = document.getElementById("stepLabel");

const calorieLabel = document.getElementById("calorieLabel");
let calorieDigit1  = document.getElementById("calorieDigit1");
let calorieDigit2  = document.getElementById("calorieDigit2");
let calorieDigit3  = document.getElementById("calorieDigit3");
let calorieDigit4  = document.getElementById("calorieDigit4");

// Initialize the constants (labels)
hrLabel.text = "BPM";
stepDot.text = ".";
stepLabel.text = "K STEPS";
calorieLabel.text = "CALS";

// Update the clock every second
clock.granularity = "seconds";


/* --- Built-in settings: time, stats, and runner animation --- */
clock.ontick = (evt) => {
  let todayDate = evt.date;
  let hours = todayDate.getHours();
      hours = hours % 12 || 12;
  let mins = todayDate.getMinutes();
  let secs = todayDate.getSeconds();
  
  
  /* --- Time section --- */
    // Weekday adjustment code
    weekday.href = util.mapDayToImg(todayDate.getDay());

    // Clock adjustment code
    timeDigit1.href = util.mapNumToImg(util.getTensDigit(hours));
    timeDigit2.href = util.mapNumToImg(util.getOnesDigit(hours));
    timeColon.href  = util.mapColonImg(secs);
    timeDigit3.href = util.mapNumToImg(util.getTensDigit(mins));
    timeDigit4.href = util.mapNumToImg(util.getOnesDigit(mins));

    // Month adjustment code
    dateMonth.href  = util.mapMonthToImg(todayDate.getMonth());
    dateDigit1.href = util.mapNumToImg(util.getTensDigit(todayDate.getDate()));
    dateDigit2.href = util.mapNumToImg(util.getOnesDigit(todayDate.getDate()));
  
  
  /* --- Stats section --- */
    // Heart rate adjustment code
    let hrm = new HeartRateSensor();
    let heartRate = "---";
  
    if (hrm.activated != true) {
      hrm.start();
    }
  
    hrm.onreading = function() {
      heartRate = hrm.heartRate || "---";
      hrDigit1.href = util.mapNumToImg(util.getHundredsDigit(heartRate));
      hrDigit2.href = util.mapNumToImg(util.getTensDigit(heartRate));
      hrDigit3.href = util.mapNumToImg(util.getOnesDigit(heartRate));
      hrm.stop();
    }
    
    // Battery adjustment code
    batteryBar.href = util.mapBatteryToImg(battery.chargeLevel);
  
    // Step adjustment code
    let stepsCountK = Math.floor(today.local.steps / 1000);
    stepDigit1.href = util.mapNumToImg(util.getHundredsDigit(stepsCountK));
    stepDigit2.href = util.mapNumToImg(util.getTensDigit(stepsCountK));
    stepDigit3.href = util.mapNumToImg(util.getOnesDigit(stepsCountK));
  
    // Calorie count code
    let calorieCount = today.local.calories;
    calorieDigit1.href = util.mapNumToImg(util.getThousandsDigit(calorieCount));
    calorieDigit2.href = util.mapNumToImg(util.getHundredsDigit(calorieCount));
    calorieDigit3.href = util.mapNumToImg(util.getTensDigit(calorieCount));
    calorieDigit4.href = util.mapNumToImg(util.getOnesDigit(calorieCount));
  
  
  /* --- Runner animation section --- */
    let runnerSecs = Math.floor(secs % 10);
    console.log(runnerSecs);
  
    // Run through 1 to 9. Set the correct runner to opaque and the rest to clear.
    // This isn't ideal, since it'll repeat some "clear"-ings, but while testing
    // I found that sometimes previous runners weren't rendered clear. This is a failsafe.
    runner1.href = util.mapRunnerToImg(1, (runnerSecs === 1));
    runner2.href = util.mapRunnerToImg(2, (runnerSecs === 2));
    runner3.href = util.mapRunnerToImg(3, (runnerSecs === 3));
    runner4.href = util.mapRunnerToImg(4, (runnerSecs === 4));
    runner5.href = util.mapRunnerToImg(5, (runnerSecs === 5));
    runner6.href = util.mapRunnerToImg(6, (runnerSecs === 6));
    runner7.href = util.mapRunnerToImg(7, (runnerSecs === 7));
    runner8.href = util.mapRunnerToImg(8, (runnerSecs === 8));
}


/* --- User settings: Clock background color --- */
// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "color" && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    console.log(`Setting background color: ${color}`);
    background.style.fill = color;
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};