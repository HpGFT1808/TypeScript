// -------- 1. Базові типи (union + type alias) --------

export type DayOfWeek =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday";

export type TimeSlot =
    | "8:30-10:00"
    | "10:15-11:45"
    | "12:15-13:45"
    | "14:00-15:30"
    | "15:45-17:15";

export type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// Можливі значення для перебору в аналітиці
const daysOfWeek: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

const timeSlots: TimeSlot[] = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15"
];

// -------- 2. Основні структури (type aliases) --------

export type Professor = {
    id: number;
    name: string;
    department: string;
};

export type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

export type Course = {
    id: number;
    name: string;
    type: CourseType;
};

export type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// Внутрішній тип для розкладу з унікальним id заняття
// (в самому завданні id нема, але його вимагають у функціях reassign/cancel)
type ScheduledLesson = Lesson & { id: number };

// -------- 3. Масиви даних (база для прикладу) --------

export const professors: Professor[] = [
    { id: 1, name: "Іван Петренко", department: "Комп'ютерні науки" },
    { id: 2, name: "Олена Коваленко", department: "Математика" }
];

export const classrooms: Classroom[] = [
    { number: "101", capacity: 30, hasProjector: true },
    { number: "202", capacity: 25, hasProjector: false },
    { number: "303", capacity: 40, hasProjector: true }
];

export const courses: Course[] = [
    { id: 1, name: "Алгоритми та структури даних", type: "Lecture" },
    { id: 2, name: "Алгоритми та структури даних (практика)", type: "Practice" },
    { id: 3, name: "Бази даних (лабораторна)", type: "Lab" }
];

// Масив розкладу (початково порожній)
export const schedule: ScheduledLesson[] = [];

// -------- 3b. Додавання професора --------

/**
 * Додає нового професора, якщо id ще не використовується.
 */
export function addProfessor(professor: Professor): void {
    const exists: boolean = professors.some(
        (p: Professor): boolean => p.id === professor.id
    );

    if (exists) {
        console.warn("Professor with this id already exists:", professor.id);
        return;
    }

    professors.push(professor);
}

// -------- 3c / 5. Перевірка конфліктів --------

export type ConflictType = "ProfessorConflict" | "ClassroomConflict";

export type ScheduleConflict = {
    type: ConflictType;
    lessonDetails: Lesson;
};

/**
 * Перевіряє, чи створює заняття конфлікт:
 * - ProfessorConflict: викладач уже має пару в цей час
 * - ClassroomConflict: аудиторія вже зайнята в цей час
 */
export function validateLesson(lesson: Lesson): ScheduleConflict | null {
    for (const scheduledLesson of schedule) {
        const sameTime: boolean =
            scheduledLesson.dayOfWeek === lesson.dayOfWeek &&
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
export function addLesson(lesson: Lesson): boolean {
    const conflict: ScheduleConflict | null = validateLesson(lesson);

    if (conflict !== null) {
        console.warn("Cannot add lesson. Conflict:", conflict.type, conflict);
        return false;
    }

    const nextId: number =
        schedule.length === 0 ? 1 : schedule[schedule.length - 1].id + 1;

    const scheduledLesson: ScheduledLesson = {
        ...lesson,
        id: nextId
    };

    schedule.push(scheduledLesson);
    return true;
}

// -------- 4a. Пошук вільних аудиторій --------

/**
 * Повертає номери аудиторій, які вільні у вказаний день та часовий слот.
 */
export function findAvailableClassrooms(
    timeSlot: TimeSlot,
    dayOfWeek: DayOfWeek
): string[] {
    const occupiedNumbers: string[] = schedule
        .filter(
            (lesson: ScheduledLesson): boolean =>
                lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek
        )
        .map((lesson: ScheduledLesson): string => lesson.classroomNumber);

    const available: string[] = classrooms
        .filter(
            (room: Classroom): boolean =>
                occupiedNumbers.indexOf(room.number) === -1
        )
        .map((room: Classroom): string => room.number);

    return available;
}

// -------- 4b. Розклад викладача --------

/**
 * Повертає розклад конкретного викладача.
 * Тип повернення Lesson[] (ScheduledLesson сумісний по структурі).
 */
export function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(
        (lesson: ScheduledLesson): boolean =>
            lesson.professorId === professorId
    );
}

// -------- 6a. Аналіз: використання аудиторії --------

/**
 * Обчислює відсоток використання аудиторії.
 * Формула: (кількість занять у цій аудиторії) / (максимально можливі слоти за тиждень) * 100
 */
export function getClassroomUtilization(classroomNumber: string): number {
    const totalSlotsPerWeek: number =
        daysOfWeek.length * timeSlots.length;

    if (totalSlotsPerWeek === 0) {
        return 0;
    }

    const usedSlots: number = schedule.filter(
        (lesson: ScheduledLesson): boolean =>
            lesson.classroomNumber === classroomNumber
    ).length;

    const utilization: number = (usedSlots / totalSlotsPerWeek) * 100;

    // Округлюємо до одного знака після коми
    return Math.round(utilization * 10) / 10;
}

// -------- 6b. Аналіз: найпопулярніший тип занять --------

// Локальний тип для підрахунку без дженериків
type CourseTypeStats = {
    Lecture: number;
    Seminar: number;
    Lab: number;
    Practice: number;
};

/**
 * Визначає найпопулярніший тип занять на основі розкладу.
 */
export function getMostPopularCourseType(): CourseType {
    const stats: CourseTypeStats = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };

    for (const lesson of schedule) {
        const course: Course | undefined = courses.find(
            (c: Course): boolean => c.id === lesson.courseId
        );

        if (!course) {
            continue;
        }

        const currentValue: number = stats[course.type];
        stats[course.type] = currentValue + 1;
    }

    // За замовчуванням нехай буде Lecture
    let mostPopular: CourseType = "Lecture";
    let maxCount: number = stats[mostPopular];

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
export function reassignClassroom(
    lessonId: number,
    newClassroomNumber: string
): boolean {
    const index: number = schedule.findIndex(
        (lesson: ScheduledLesson): boolean => lesson.id === lessonId
    );

    if (index === -1) {
        console.warn("Lesson not found, id =", lessonId);
        return false;
    }

    const classroomExists: boolean = classrooms.some(
        (room: Classroom): boolean => room.number === newClassroomNumber
    );

    if (!classroomExists) {
        console.warn("Classroom does not exist:", newClassroomNumber);
        return false;
    }

    const currentLesson: ScheduledLesson = schedule[index];

    // Готуємо "оновлений" варіант заняття для перевірки конфліктів
    const updatedLesson: Lesson = {
        courseId: currentLesson.courseId,
        professorId: currentLesson.professorId,
        classroomNumber: newClassroomNumber,
        dayOfWeek: currentLesson.dayOfWeek,
        timeSlot: currentLesson.timeSlot
    };

    // Перевіряємо лише ClassroomConflict, враховуючи, що це те саме заняття
    for (const existing of schedule) {
        if (existing.id === lessonId) {
            continue; // пропускаємо самі себе
        }

        const sameTime: boolean =
            existing.dayOfWeek === updatedLesson.dayOfWeek &&
            existing.timeSlot === updatedLesson.timeSlot;

        if (sameTime && existing.classroomNumber === updatedLesson.classroomNumber) {
            console.warn(
                "Cannot reassign classroom. ClassroomConflict with lesson id =",
                existing.id
            );
            return false;
        }
    }

    schedule[index].classroomNumber = newClassroomNumber;
    return true;
}

// -------- 7b. Скасування заняття --------

/**
 * Видаляє заняття з розкладу за його id.
 */
export function cancelLesson(lessonId: number): void {
    const index: number = schedule.findIndex(
        (lesson: ScheduledLesson): boolean => lesson.id === lessonId
    );

    if (index === -1) {
        console.warn("Lesson not found, nothing to cancel. id =", lessonId);
        return;
    }

    schedule.splice(index, 1);
}

// -------- 8. Невеликий приклад використання (можна прибрати або лишити для перевірки) --------

// Приклад додавання занять
const lesson1: Lesson = {
    courseId: 1,
    professorId: 1,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
};

const lesson2: Lesson = {
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
