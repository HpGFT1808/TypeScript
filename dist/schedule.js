"use strict";
// -------- 1. Базові типи (union + type alias) --------
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedule = exports.courses = exports.classrooms = exports.professors = void 0;
exports.addProfessor = addProfessor;
exports.validateLesson = validateLesson;
exports.addLesson = addLesson;
exports.findAvailableClassrooms = findAvailableClassrooms;
exports.getProfessorSchedule = getProfessorSchedule;
exports.getClassroomUtilization = getClassroomUtilization;
exports.getMostPopularCourseType = getMostPopularCourseType;
exports.reassignClassroom = reassignClassroom;
exports.cancelLesson = cancelLesson;
// Можливі значення для перебору в аналітиці
const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];
const timeSlots = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15"
];
// -------- 3. Масиви даних (база для прикладу) --------
exports.professors = [
    { id: 1, name: "Іван Петренко", department: "Комп'ютерні науки" },
    { id: 2, name: "Олена Коваленко", department: "Математика" }
];
exports.classrooms = [
    { number: "101", capacity: 30, hasProjector: true },
    { number: "202", capacity: 25, hasProjector: false },
    { number: "303", capacity: 40, hasProjector: true }
];
exports.courses = [
    { id: 1, name: "Алгоритми та структури даних", type: "Lecture" },
    { id: 2, name: "Алгоритми та структури даних (практика)", type: "Practice" },
    { id: 3, name: "Бази даних (лабораторна)", type: "Lab" }
];
// Масив розкладу (початково порожній)
exports.schedule = [];
// -------- 3b. Додавання професора --------
/**
 * Додає нового професора, якщо id ще не використовується.
 */
function addProfessor(professor) {
    const exists = exports.professors.some((p) => p.id === professor.id);
    if (exists) {
        console.warn("Professor with this id already exists:", professor.id);
        return;
    }
    exports.professors.push(professor);
}
/**
 * Перевіряє, чи створює заняття конфлікт:
 * - ProfessorConflict: викладач уже має пару в цей час
 * - ClassroomConflict: аудиторія вже зайнята в цей час
 */
function validateLesson(lesson) {
    for (const scheduledLesson of exports.schedule) {
        const sameTime = scheduledLesson.dayOfWeek === lesson.dayOfWeek &&
            scheduledLesson.timeSlot === lesson.timeSlot;
        if (sameTime && scheduledLesson.professorId === lesson.professorId) {
            return {
                type: "ProfessorConflict",
                // ScheduledLesson сумісний з Lesson (має всі потрібні поля)
                lessonDetails: scheduledLesson
            };
        }
        if (sameTime && scheduledLesson.classroomNumber === lesson.classroomNumber) {
            return {
                type: "ClassroomConflict",
                lessonDetails: scheduledLesson
            };
        }
    }
    return null;
}
// -------- 3c. Додавання заняття --------
/**
 * Додає заняття в розклад, якщо немає конфліктів.
 * Повертає true, якщо заняття додано, і false, якщо стався конфлікт.
 */
function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict !== null) {
        console.warn("Cannot add lesson. Conflict:", conflict.type, conflict);
        return false;
    }
    const nextId = exports.schedule.length === 0 ? 1 : exports.schedule[exports.schedule.length - 1].id + 1;
    const scheduledLesson = Object.assign(Object.assign({}, lesson), { id: nextId });
    exports.schedule.push(scheduledLesson);
    return true;
}
// -------- 4a. Пошук вільних аудиторій --------
/**
 * Повертає номери аудиторій, які вільні у вказаний день та часовий слот.
 */
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const occupiedNumbers = exports.schedule
        .filter((lesson) => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map((lesson) => lesson.classroomNumber);
    const available = exports.classrooms
        .filter((room) => occupiedNumbers.indexOf(room.number) === -1)
        .map((room) => room.number);
    return available;
}
// -------- 4b. Розклад викладача --------
/**
 * Повертає розклад конкретного викладача.
 * Тип повернення Lesson[] (ScheduledLesson сумісний по структурі).
 */
function getProfessorSchedule(professorId) {
    return exports.schedule.filter((lesson) => lesson.professorId === professorId);
}
// -------- 6a. Аналіз: використання аудиторії --------
/**
 * Обчислює відсоток використання аудиторії.
 * Формула: (кількість занять у цій аудиторії) / (максимально можливі слоти за тиждень) * 100
 */
function getClassroomUtilization(classroomNumber) {
    const totalSlotsPerWeek = daysOfWeek.length * timeSlots.length;
    if (totalSlotsPerWeek === 0) {
        return 0;
    }
    const usedSlots = exports.schedule.filter((lesson) => lesson.classroomNumber === classroomNumber).length;
    const utilization = (usedSlots / totalSlotsPerWeek) * 100;
    // Округлюємо до одного знака після коми
    return Math.round(utilization * 10) / 10;
}
/**
 * Визначає найпопулярніший тип занять на основі розкладу.
 */
function getMostPopularCourseType() {
    const stats = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };
    for (const lesson of exports.schedule) {
        const course = exports.courses.find((c) => c.id === lesson.courseId);
        if (!course) {
            continue;
        }
        const currentValue = stats[course.type];
        stats[course.type] = currentValue + 1;
    }
    // За замовчуванням нехай буде Lecture
    let mostPopular = "Lecture";
    let maxCount = stats[mostPopular];
    if (stats.Seminar > maxCount) {
        mostPopular = "Seminar";
        maxCount = stats.Seminar;
    }
    if (stats.Lab > maxCount) {
        mostPopular = "Lab";
        maxCount = stats.Lab;
    }
    if (stats.Practice > maxCount) {
        mostPopular = "Practice";
        maxCount = stats.Practice;
    }
    return mostPopular;
}
// -------- 7a. Зміна аудиторії --------
/**
 * Змінює аудиторію для заняття, якщо воно існує
 * і нова аудиторія не створює ClassroomConflict.
 */
function reassignClassroom(lessonId, newClassroomNumber) {
    const index = exports.schedule.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) {
        console.warn("Lesson not found, id =", lessonId);
        return false;
    }
    const classroomExists = exports.classrooms.some((room) => room.number === newClassroomNumber);
    if (!classroomExists) {
        console.warn("Classroom does not exist:", newClassroomNumber);
        return false;
    }
    const currentLesson = exports.schedule[index];
    // Готуємо "оновлений" варіант заняття для перевірки конфліктів
    const updatedLesson = {
        courseId: currentLesson.courseId,
        professorId: currentLesson.professorId,
        classroomNumber: newClassroomNumber,
        dayOfWeek: currentLesson.dayOfWeek,
        timeSlot: currentLesson.timeSlot
    };
    // Перевіряємо лише ClassroomConflict, враховуючи, що це те саме заняття
    for (const existing of exports.schedule) {
        if (existing.id === lessonId) {
            continue; // пропускаємо самі себе
        }
        const sameTime = existing.dayOfWeek === updatedLesson.dayOfWeek &&
            existing.timeSlot === updatedLesson.timeSlot;
        if (sameTime && existing.classroomNumber === updatedLesson.classroomNumber) {
            console.warn("Cannot reassign classroom. ClassroomConflict with lesson id =", existing.id);
            return false;
        }
    }
    exports.schedule[index].classroomNumber = newClassroomNumber;
    return true;
}
// -------- 7b. Скасування заняття --------
/**
 * Видаляє заняття з розкладу за його id.
 */
function cancelLesson(lessonId) {
    const index = exports.schedule.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) {
        console.warn("Lesson not found, nothing to cancel. id =", lessonId);
        return;
    }
    exports.schedule.splice(index, 1);
}
// -------- 8. Невеликий приклад використання (можна прибрати або лишити для перевірки) --------
// Приклад додавання занять
const lesson1 = {
    courseId: 1,
    professorId: 1,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
};
const lesson2 = {
    courseId: 2,
    professorId: 1,
    classroomNumber: "202",
    dayOfWeek: "Monday",
    timeSlot: "10:15-11:45"
};
addLesson(lesson1);
addLesson(lesson2);
// Приклад викликів
console.log("Schedule for professor 1:", getProfessorSchedule(1));
console.log("Available classrooms on Monday 8:30:", findAvailableClassrooms("8:30-10:00", "Monday"));
console.log("Utilization of room 101:", getClassroomUtilization("101"), "%");
console.log("Most popular course type:", getMostPopularCourseType());
