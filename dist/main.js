"use strict";
// ---------- Enum-и ----------
// Статус студента
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
// Тип курсу
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
// Семестр
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
// Оцінки (шкала 2–5)
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
// Факультети
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// ---------- Клас UniversityManagementSystem ----------
/**
 * Основна система управління студентами, курсами,
 * реєстраціями та оцінками.
 */
class UniversityManagementSystem {
    constructor() {
        // Приватні сховища даних
        this.students = [];
        this.courses = [];
        this.registrations = [];
        this.grades = [];
        // Лічильники для автоінкременту id
        this.nextStudentId = 1;
        this.nextCourseId = 1;
    }
    // ---------------- Допоміжні приватні методи ----------------
    /**
     * Пошук студента за id.
     */
    findStudentById(studentId) {
        return this.students.find((s) => s.id === studentId);
    }
    /**
     * Пошук курсу за id.
     */
    findCourseById(courseId) {
        return this.courses.find((c) => c.id === courseId);
    }
    /**
     * Перевірка, чи студент уже зареєстрований на курс.
     */
    isStudentRegisteredForCourse(studentId, courseId) {
        return this.registrations.some((r) => r.studentId === studentId && r.courseId === courseId);
    }
    /**
     * Отримати кількість реєстрацій на курс.
     */
    getRegistrationsCountForCourse(courseId) {
        return this.registrations.filter((r) => r.courseId === courseId).length;
    }
    // ---------------- Публічні методи ----------------
    /**
     * enrollStudent:
     * Додає нового студента в систему.
     * id генерується автоматично.
     */
    enrollStudent(student) {
        const newStudent = Object.assign(Object.assign({}, student), { id: this.nextStudentId++ });
        this.students.push(newStudent);
        return newStudent;
    }
    /**
     * addCourse:
     * Додатковий метод (для зручності),
     * який дозволяє додати курс у систему.
     */
    addCourse(course) {
        const newCourse = Object.assign(Object.assign({}, course), { id: this.nextCourseId++ });
        this.courses.push(newCourse);
        return newCourse;
    }
    /**
     * registerForCourse:
     * Реєструє студента на курс.
     * Перевірки:
     * - чи існує студент і курс
     * - чи студент активний
     * - чи збігається факультет студента і курсу
     * - чи курс не переповнений
     * - чи студент ще не зареєстрований на цей курс
     */
    registerForCourse(studentId, courseId) {
        const student = this.findStudentById(studentId);
        const course = this.findCourseById(courseId);
        if (!student) {
            console.error("Студента не знайдено, id =", studentId);
            return;
        }
        if (!course) {
            console.error("Курс не знайдено, id =", courseId);
            return;
        }
        if (student.status !== StudentStatus.Active) {
            console.error(`Студент має статус ${student.status} і не може реєструватися на курс.`);
            return;
        }
        if (student.faculty !== course.faculty) {
            console.error(`Факультет студента (${student.faculty}) не відповідає факультету курсу (${course.faculty}).`);
            return;
        }
        const currentCount = this.getRegistrationsCountForCourse(courseId);
        if (currentCount >= course.maxStudents) {
            console.error("Курс уже заповнений, id =", courseId);
            return;
        }
        if (this.isStudentRegisteredForCourse(studentId, courseId)) {
            console.warn("Студент уже зареєстрований на цей курс.");
            return;
        }
        this.registrations.push({ studentId, courseId });
    }
    /**
     * setGrade:
     * Виставляє оцінку студенту за курс.
     * Перевірки:
     * - чи існує студент і курс
     * - чи студент зареєстрований на курс
     */
    setGrade(studentId, courseId, grade) {
        const student = this.findStudentById(studentId);
        const course = this.findCourseById(courseId);
        if (!student) {
            console.error("Студента не знайдено, id =", studentId);
            return;
        }
        if (!course) {
            console.error("Курс не знайдено, id =", courseId);
            return;
        }
        if (!this.isStudentRegisteredForCourse(studentId, courseId)) {
            console.error("Неможливо виставити оцінку: студент не зареєстрований на курс.");
            return;
        }
        const record = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };
        // Якщо раніше вже була оцінка за цей курс і семестр — оновимо її
        const existingIndex = this.grades.findIndex((g) => g.studentId === studentId &&
            g.courseId === courseId &&
            g.semester === course.semester);
        if (existingIndex !== -1) {
            this.grades[existingIndex] = record;
        }
        else {
            this.grades.push(record);
        }
    }
    /**
     * updateStudentStatus:
     * Змінює статус студента з базовою валідацією.
     * Логіка:
     * - не можна змінити статус, якщо студент не існує
     * - не можна перевести Expelled/Graduated назад в Active
     */
    updateStudentStatus(studentId, newStatus) {
        const student = this.findStudentById(studentId);
        if (!student) {
            console.error("Студента не знайдено, id =", studentId);
            return;
        }
        // Простий приклад валідації переходів
        const currentStatus = student.status;
        if ((currentStatus === StudentStatus.Graduated ||
            currentStatus === StudentStatus.Expelled) &&
            newStatus === StudentStatus.Active) {
            console.error(`Неможливо перевести студента зі статусу ${currentStatus} назад у Active.`);
            return;
        }
        student.status = newStatus;
    }
    /**
     * getStudentsByFaculty:
     * Повертає всіх студентів певного факультету.
     */
    getStudentsByFaculty(faculty) {
        return this.students.filter((s) => s.faculty === faculty);
    }
    /**
     * getStudentGrades:
     * Повертає всі оцінки студента.
     */
    getStudentGrades(studentId) {
        return this.grades.filter((g) => g.studentId === studentId);
    }
    /**
     * getAvailableCourses:
     * Повертає список курсів певного факультету та семестру,
     * на які ще є вільні місця.
     */
    getAvailableCourses(faculty, semester) {
        return this.courses.filter((course) => {
            if (course.faculty !== faculty || course.semester !== semester) {
                return false;
            }
            const registeredCount = this.getRegistrationsCountForCourse(course.id);
            return registeredCount < course.maxStudents;
        });
    }
    /**
     * calculateAverageGrade:
     * Обчислює середній бал студента (по всіх оцінках).
     * Якщо оцінок немає — повертає 0.
     */
    calculateAverageGrade(studentId) {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) {
            return 0;
        }
        const sum = studentGrades.reduce((acc, record) => acc + record.grade, 0);
        const avg = sum / studentGrades.length;
        // Округлюємо до двох знаків після коми
        return Math.round(avg * 100) / 100;
    }
    /**
     * getHonorsStudentsByFaculty:
     * Повертає список "відмінників" по факультету.
     * Критерій: середній бал >= 4.5
     */
    getHonorsStudentsByFaculty(faculty) {
        const facultyStudents = this.getStudentsByFaculty(faculty);
        return facultyStudents.filter((student) => {
            const avg = this.calculateAverageGrade(student.id);
            return avg >= 4.5;
        });
    }
}
// ---------- Приклад використання (можна залишити для перевірки) ----------
// Створюємо екземпляр системи
const ums = new UniversityManagementSystem();
// Додаємо курси
const algorithmsCourse = ums.addCourse({
    name: "Алгоритми та структури даних",
    type: CourseType.Mandatory,
    credits: 6,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 2
});
const economicsCourse = ums.addCourse({
    name: "Мікроекономіка",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Economics,
    maxStudents: 3
});
// Зараховуємо студентів
const student1 = ums.enrollStudent({
    fullName: "Іван Петренко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-11"
});
const student2 = ums.enrollStudent({
    fullName: "Олена Коваленко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-11"
});
const student3 = ums.enrollStudent({
    fullName: "Марія Іванчук",
    faculty: Faculty.Economics,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "EC-21"
});
// Реєструємо студентів на курси
ums.registerForCourse(student1.id, algorithmsCourse.id);
ums.registerForCourse(student2.id, algorithmsCourse.id);
ums.registerForCourse(student3.id, economicsCourse.id);
// Виставляємо оцінки
ums.setGrade(student1.id, algorithmsCourse.id, Grade.Excellent);
ums.setGrade(student2.id, algorithmsCourse.id, Grade.Good);
ums.setGrade(student3.id, economicsCourse.id, Grade.Excellent);
// Рахуємо середні бали
const avg1 = ums.calculateAverageGrade(student1.id);
const avg2 = ums.calculateAverageGrade(student2.id);
// Список відмінників по Computer_Science
const csHonors = ums.getHonorsStudentsByFaculty(Faculty.Computer_Science);
// Вивід для перевірки (перед здачею можна закоментувати)
console.log("Середній бал студента 1:", avg1);
console.log("Середній бал студента 2:", avg2);
console.log("Відмінники CS:", csHonors);
console.log("Доступні курси CS, 1 семестр:", ums.getAvailableCourses(Faculty.Computer_Science, Semester.First));
