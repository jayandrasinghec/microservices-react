// const SHA512 = require("crypto-js/sha512");
const CryptoJS = require("crypto-js");


export const encrypt = (login, password) => {
  // encrypt(message, secret)
  var encrypted = CryptoJS.AES.encrypt(password, login);
  return encrypted.toString();
}
