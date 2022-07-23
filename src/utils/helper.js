import { showSuccess } from "./notifications";

const moment = require("moment-timezone");
const timeZone = process.env.REACT_APP_TIME_ZONE || 'Asia/Kolkata'


export const getFormatedDate = (date, dateFormat) => {

  if (dateFormat) {
    return moment.utc(date).tz(timeZone).format(dateFormat);
  }
  return moment.utc(date).tz(timeZone).format('DD-MM-YYYY HH:mm:ss');
}

export const getISODatetime = (date) => {
  let newDate = moment.utc(date).tz(timeZone).format();
  let splitDate = newDate.slice(0,16);
  return splitDate;
}

export const dateTimeToIST = (date, days) => {

  if(days) {
    return moment.utc(date).tz('Asia/Kolkata').fromNow();
  }

  let newDate = moment.utc(date).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss');
  return newDate;
}

export const dateToIST = (date) => {

  let newDate = moment.utc(date).tz('Asia/Kolkata').format('DD-MM-YYYY');
  return newDate;
}

export const dateDiff = (date) => {

  let newDate = moment().diff(date, 'years');
  return newDate;
}

export const activityDate = (date) => {
  let newDate = moment.utc(date).tz(timeZone).format('ddd MMM DD YYYY');
  return newDate;
}

export const activityTimeWithzTimeZone = (date) => {
  let newDate = moment.utc(date).tz(timeZone).format('HH:mm:ss z');
  return newDate;
}

export const copyText = (text) => {
  var textField = document.createElement('textarea')
  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()
  showSuccess('Text copied to clipboard')
}

export const trimmedString = (data) => {
  if (data && data.length > 15){
    return `${data.substring(0, 15)}...`
  } else {
    return data
  }
}

export const beautifyStr = (str) => {
  let i, frags = str.split('_');
  for (i=0; i<frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1).toLowerCase();
  }
  return frags.join(' ');
}