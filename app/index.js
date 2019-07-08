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

// Initialize the constants (labels).
hrLabel.text = "BPM";
stepDot.text = ".";
stepLabel.text = "K STEPS";
calorieLabel.text = "CALS";

// We create a new, global HeartRateSensor object here and reuse it to save on runtime and memory.
let hrm = new HeartRateSensor();
let loaded = false;

// Update the clock every second.
clock.granularity = "seconds";
clock.ontick = (evt) => {
  let todayDate = evt.date;
  let seconds = todayDate.getSeconds();
  let minutes = todayDate.getMinutes();
  let hours = todayDate.getHours();
  let day = todayDate.getDay();
  
  // If we've opened the watch for the first time, fill in all variables.
  if (!loaded) {
    doMinutesEvents(minutes);
    doHoursEvents(hours);
    doDaysEvents(day, todayDate);
    
    loaded = true;
  }
  
  doSecondsEvents(seconds);
  
  // Lower runtime by only doing some events on a minutely, hourly, or daily basis.
  if (seconds == 0)
    doMinutesEvents(minutes);
  if (minutes == 0)
    doHoursEvents(hours);
  if (hours == 0)
    doDaysEvents(day, todayDate);
}

function doSecondsEvents(seconds) {
  timeColon.href = util.mapColonToImg(seconds);
  
  updateRunner(seconds);
}
  
function doMinutesEvents(minutes) {
  timeDigit3.href = util.mapNumToImg(util.getTensDigit(minutes));
  timeDigit4.href = util.mapNumToImg(util.getOnesDigit(minutes));
  
  let stepsCountK = Math.floor(today.local.steps / 100);
  stepDigit1.href = util.mapNumToImg(util.getHundredsDigit(stepsCountK));
  stepDigit2.href = util.mapNumToImg(util.getTensDigit(stepsCountK));
  stepDigit3.href = util.mapNumToImg(util.getOnesDigit(stepsCountK));

  let calorieCount = today.local.calories;
  calorieDigit1.href = util.mapNumToImg(util.getThousandsDigit(calorieCount));
  calorieDigit2.href = util.mapNumToImg(util.getHundredsDigit(calorieCount));
  calorieDigit3.href = util.mapNumToImg(util.getTensDigit(calorieCount));
  calorieDigit4.href = util.mapNumToImg(util.getOnesDigit(calorieCount));
  
  updateHeartRate();
}

function doHoursEvents(hours) {
  timeDigit1.href = util.mapNumToImg(util.getTensDigit(hours));
  timeDigit2.href = util.mapNumToImg(util.getOnesDigit(hours));
  
  batteryBar.href = util.mapBatteryToImg(battery.chargeLevel);
}

function doDaysEvents(day, todayDate) {
  weekday.href = util.mapDayToImg(day);
  
  dateMonth.href  = util.mapMonthToImg(todayDate.getMonth());
  dateDigit1.href = util.mapNumToImg(util.getTensDigit(todayDate.getDate()));
  dateDigit2.href = util.mapNumToImg(util.getOnesDigit(todayDate.getDate()));
}

/* --- Heart rate update section --- */
function updateHeartRate() {
  let heartRate = "---";
  
  if (hrm.activated != true)
    hrm.start();

  hrm.onreading = function() {
    heartRate = hrm.heartRate || "---";
    hrDigit1.href = util.mapNumToImg(util.getHundredsDigit(heartRate));
    hrDigit2.href = util.mapNumToImg(util.getTensDigit(heartRate));
    hrDigit3.href = util.mapNumToImg(util.getOnesDigit(heartRate));
    hrm.stop();
  }
}

/* --- Runner animation section --- */
function updateRunner(seconds) {
  seconds = seconds % 10;

  // The runner will be on-screen from seconds 1 through 9. Set the current runner to opaque and the rest to clear.
  // This isn't ideal, since it'll repeat many unnecessary "clear"-ings, but while testing
  // I found that sometimes previous runners weren't rendered clear. This is a failsafe.
  runner1.href = util.mapRunnerToImg(1, (seconds === 1));
  runner2.href = util.mapRunnerToImg(2, (seconds === 2));
  runner3.href = util.mapRunnerToImg(3, (seconds === 3));
  runner4.href = util.mapRunnerToImg(4, (seconds === 4));
  runner5.href = util.mapRunnerToImg(5, (seconds === 5));
  runner6.href = util.mapRunnerToImg(6, (seconds === 6));
  runner7.href = util.mapRunnerToImg(7, (seconds === 7));
  runner8.href = util.mapRunnerToImg(8, (seconds === 8));
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