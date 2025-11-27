const userName: string = "Gary";
const userAge: number = 34;
const isStudent: boolean = false;

function getUserInfo(name: string, age: number, student: boolean): string {
    const status = student ? "є студентом" : "не є студентом";
    return `Користувач ${name}, вік: ${age}, ${status}.`;
}

const message: string = getUserInfo(userName, userAge, isStudent);
console.log(message);