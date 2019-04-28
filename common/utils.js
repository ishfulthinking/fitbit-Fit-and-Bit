// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function getOnesDigit(x) {
  x = x % 10;
  return x;
}
export function getTensDigit(x) {
  x = x % 100;
  x = Math.floor(x/10);
  return x;
}
export function getHundredsDigit(x) {
  x = x % 1000;
  x = Math.floor(x/100);
  return x;
}
export function getThousandsDigit(x) {
  x = x % 10000;
  x = Math.floor(x/1000);
  return x;
}

export function mapDayToImg(day) {
  if (day >= 0 && day < 7)
    return "days/" + day + ".png";
  
  return "days/_.png";
}

export function mapNumToImg(num) {
  // Dates will always return a number.
  if (num >= 0 && num <= 9)
    return "numbers/" + num + ".png";
  
  // This will return a "-" in case of null heart rates.
  return "numbers/-.png";
}

export function mapColonImg(seconds) {
  if (seconds % 2 == 0)
    return "numbers/colon_black.png";
  
  return "numbers/colon_clear.png";
}

export function mapMonthToImg(month) {
  if (month >= 0 && month < 12)
    return "months/" + month + ".png";
  
  return "months/_.png";
}

export function mapRunnerToImg(num, opaque) {
  let opacity = (opaque ? "black" : "clear");
  
  return "runner/" + num + opacity + ".png";
}

export function mapBatteryToImg(percentage) {
  if (percentage > 66)
    return "battery/3.png";
  if (percentage > 33)
    return "battery/2.png";
  
  return "battery/1.png";
}