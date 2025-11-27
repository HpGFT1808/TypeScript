"use strict";
const userName = "Gary";
const userAge = 34;
const isStudent = false;
function getUserInfo(name, age, student) {
    const status = student ? "є студентом" : "не є студентом";
    return `Користувач ${name}, вік: ${age}, ${status}.`;
}
const message = getUserInfo(userName, userAge, isStudent);
console.log(message);
