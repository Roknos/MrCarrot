import chalk from "chalk";

function getTimeStamp() {
  // a function to return time as "[dd/mm/yyyy hh:mm]"
  // when hour or minute is less than 10, add a 0 before it

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  return `[${day}/${month}/${year} ${hours}:${minutes}]`;
}

export function logInfo(message: string) {
  console.log(getTimeStamp() + chalk.blueBright("[Info] ") + message);
}

export function logWarning(message: string) {
  console.log(getTimeStamp() + chalk.yellowBright("[Warning] ") + message);
}

export function logStatus(message: string) {
  console.log(getTimeStamp() + chalk.greenBright("[Status] ") + message);
}

export function logSuccess(message: string) {
  console.log(getTimeStamp() + chalk.green("[Success] ") + message);
}

export function logError(message: string) {
  console.log(getTimeStamp() + chalk.redBright("[Error] ") + message);
}

export function logStatup(message: string) {
  console.log(getTimeStamp() + chalk.magentaBright("[Startup] ") + message);
}
