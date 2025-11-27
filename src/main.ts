// ---------- Enum-и ----------

// Статус студента
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

// Тип курсу
enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

// Семестр
enum Semester {
    First = "First",
    Second = "Second"
}

// Оцінки (шкала 2–5)
enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

// Факультети
enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// ---------- Інтерфейси ----------

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number; // курс навчання (1,2,3,4,...)
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

// Умова в завданні: interface Grade з полем grade: Grade.
// Щоб не конфліктувати з enum Grade, робимо інтерфейс GradeRecord.
interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

// Допоміжний тип для реєстрацій студентів на курси
type StudentCourseRegistration = {
    studentId: number;
    courseId: number;
};

// ---------- Клас UniversityManagementSystem ----------

/**
 * Основна система управління студентами, курсами,
 * реєстраціями та оцінками.
 */
class UniversityManagementSystem {
    // Приватні сховища даних
    private students: Student[] = [];
    private courses: Course[] = [];
    private registrations: StudentCourseRegistration[] = [];
    private grades: GradeRecord[] = [];

    // Лічильники для автоінкременту id
    private nextStudentId: number = 1;
    private nextCourseId: number = 1;

    // ---------------- Допоміжні приватні методи ----------------

    /**
     * Пошук студента за id.
     */
    private findStudentById(studentId: number): Student | undefined {
        return this.students.find((s: Student): boolean => s.id === studentId);
    }

    /**
     * Пошук курсу за id.
     */
    private findCourseById(courseId: number): Course | undefined {
        return this.courses.find((c: Course): boolean => c.id === courseId);
    }

    /**
     * Перевірка, чи студент уже зареєстрований на курс.
     */
    private isStudentRegisteredForCourse(
        studentId: number,
        courseId: number
    ): boolean {
        return this.registrations.some(
            (r: StudentCourseRegistration): boolean =>
                r.studentId === studentId && r.courseId === courseId
        );
    }

    /**
     * Отримати кількість реєстрацій на курс.
     */
    private getRegistrationsCountForCourse(courseId: number): number {
        return this.registrations.filter(
            (r: StudentCourseRegistration): boolean => r.courseId === courseId
        ).length;
    }

    // ---------------- Публічні методи ----------------

    /**
     * enrollStudent:
     * Додає нового студента в систему.
     * id генерується автоматично.
     */
    public enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = {
            ...student,
            id: this.nextStudentId++
        };

        this.students.push(newStudent);
        return newStudent;
    }

    /**
     * addCourse:
     * Додатковий метод (для зручності),
     * який дозволяє додати курс у систему.
     */
    public addCourse(course: Omit<Course, "id">): Course {
        const newCourse: Course = {
            ...course,
            id: this.nextCourseId++
        };

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
    public registerForCourse(studentId: number, courseId: number): void {
        const student: Student | undefined = this.findStudentById(studentId);
        const course: Course | undefined = this.findCourseById(courseId);

        if (!student) {
            console.error("Студента не знайдено, id =", studentId);
            return;
        }

        if (!course) {
            console.error("Курс не знайдено, id =", courseId);
            return;
        }

        if (student.status !== StudentStatus.Active) {
            console.error(
                `Студент має статус ${student.status} і не може реєструватися на курс.`
            );
            return;
        }

        if (student.faculty !== course.faculty) {
            console.error(
                `Факультет студента (${student.faculty}) не відповідає факультету курсу (${course.faculty}).`
            );
            return;
        }

        const currentCount: number = this.getRegistrationsCountForCourse(courseId);
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
    public setGrade(
        studentId: number,
        courseId: number,
        grade: Grade
    ): void {
        const student: Student | undefined = this.findStudentById(studentId);
        const course: Course | undefined = this.findCourseById(courseId);

        if (!student) {
            console.error("Студента не знайдено, id =", studentId);
            return;
        }

        if (!course) {
            console.error("Курс не знайдено, id =", courseId);
            return;
        }

        if (!this.isStudentRegisteredForCourse(studentId, courseId)) {
            console.error(
                "Неможливо виставити оцінку: студент не зареєстрований на курс."
            );
            return;
        }

        const record: GradeRecord = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };

        // Якщо раніше вже була оцінка за цей курс і семестр — оновимо її
        const existingIndex: number = this.grades.findIndex(
            (g: GradeRecord): boolean =>
                g.studentId === studentId &&
                g.courseId === courseId &&
                g.semester === course.semester
        );

        if (existingIndex !== -1) {
            this.grades[existingIndex] = record;
        } else {
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
    public updateStudentStatus(
        studentId: number,
        newStatus: StudentStatus
    ): void {
        const student: Student | undefined = this.findStudentById(studentId);

        if (!student) {
            console.error("Студента не знайдено, id =", studentId);
            return;
        }

        // Простий приклад валідації переходів
        const currentStatus: StudentStatus = student.status;

        if (
            (currentStatus === StudentStatus.Graduated ||
                currentStatus === StudentStatus.Expelled) &&
            newStatus === StudentStatus.Active
        ) {
            console.error(
                `Неможливо перевести студента зі статусу ${currentStatus} назад у Active.`
            );
            return;
        }

        student.status = newStatus;
    }

    /**
     * getStudentsByFaculty:
     * Повертає всіх студентів певного факультету.
     */
    public getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(
            (s: Student): boolean => s.faculty === faculty
        );
    }

    /**
     * getStudentGrades:
     * Повертає всі оцінки студента.
     */
    public getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter(
            (g: GradeRecord): boolean => g.studentId === studentId
        );
    }

    /**
     * getAvailableCourses:
     * Повертає список курсів певного факультету та семестру,
     * на які ще є вільні місця.
     */
    public getAvailableCourses(
        faculty: Faculty,
        semester: Semester
    ): Course[] {
        return this.courses.filter((course: Course): boolean => {
            if (course.faculty !== faculty || course.semester !== semester) {
                return false;
            }

            const registeredCount: number = this.getRegistrationsCountForCourse(
                course.id
            );
            return registeredCount < course.maxStudents;
        });
    }

    /**
     * calculateAverageGrade:
     * Обчислює середній бал студента (по всіх оцінках).
     * Якщо оцінок немає — повертає 0.
     */
    public calculateAverageGrade(studentId: number): number {
        const studentGrades: GradeRecord[] = this.getStudentGrades(studentId);

        if (studentGrades.length === 0) {
            return 0;
        }

        const sum: number = studentGrades.reduce(
            (acc: number, record: GradeRecord): number => acc + record.grade,
            0
        );

        const avg: number = sum / studentGrades.length;
        // Округлюємо до двох знаків після коми
        return Math.round(avg * 100) / 100;
    }

    /**
     * getHonorsStudentsByFaculty:
     * Повертає список "відмінників" по факультету.
     * Критерій: середній бал >= 4.5
     */
    public getHonorsStudentsByFaculty(faculty: Faculty): Student[] {
        const facultyStudents: Student[] = this.getStudentsByFaculty(faculty);

        return facultyStudents.filter((student: Student): boolean => {
            const avg: number = this.calculateAverageGrade(student.id);
            return avg >= 4.5;
        });
    }
}

// ---------- Приклад використання (можна залишити для перевірки) ----------

// Створюємо екземпляр системи
const ums: UniversityManagementSystem = new UniversityManagementSystem();

// Додаємо курси
const algorithmsCourse: Course = ums.addCourse({
    name: "Алгоритми та структури даних",
    type: CourseType.Mandatory,
    credits: 6,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 2
});

const economicsCourse: Course = ums.addCourse({
    name: "Мікроекономіка",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Economics,
    maxStudents: 3
});

// Зараховуємо студентів
const student1: Student = ums.enrollStudent({
    fullName: "Іван Петренко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-11"
});

const student2: Student = ums.enrollStudent({
    fullName: "Олена Коваленко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-11"
});

const student3: Student = ums.enrollStudent({
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
const avg1: number = ums.calculateAverageGrade(student1.id);
const avg2: number = ums.calculateAverageGrade(student2.id);

// Список відмінників по Computer_Science
const csHonors: Student[] = ums.getHonorsStudentsByFaculty(
    Faculty.Computer_Science
);

// Вивід для перевірки (перед здачею можна закоментувати)
console.log("Середній бал студента 1:", avg1);
console.log("Середній бал студента 2:", avg2);
console.log("Відмінники CS:", csHonors);
console.log(
    "Доступні курси CS, 1 семестр:",
    ums.getAvailableCourses(Faculty.Computer_Science, Semester.First)
);
