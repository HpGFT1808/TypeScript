// Типи для постів з JSONPlaceholder
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

// Отримуємо елементи DOM з типами
const modal: HTMLDivElement | null = document.querySelector("#modal");
const overlay: HTMLDivElement | null = document.querySelector("#overlay");
const openModalButtons: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll("[data-open-modal]");
const closeModalButton: HTMLButtonElement | null =
    document.querySelector("[data-close-modal]");
const header: HTMLElement | null = document.querySelector(".header");
const scrollTopBtn: HTMLButtonElement | null =
    document.querySelector("#scrollTopBtn");
const postsContainer: HTMLDivElement | null =
    document.querySelector("#posts-container");

// Функції для роботи з модальним вікном
function openModal(): void {
    if (!modal || !overlay) return;
    modal.classList.add("modal--visible");
    overlay.classList.add("overlay--visible");
}

function closeModal(): void {
    if (!modal || !overlay) return;
    modal.classList.remove("modal--visible");
    overlay.classList.remove("overlay--visible");
}

// Обробка скролу: тінь у хедера + кнопка "наверх"
function handleScroll(): void {
    const scrollY: number = window.scrollY;

    if (header) {
        if (scrollY > 10) {
            header.classList.add("header--scrolled");
        } else {
            header.classList.remove("header--scrolled");
        }
    }

    if (scrollTopBtn) {
        if (scrollY > 200) {
            scrollTopBtn.classList.add("scroll-top-btn--visible");
        } else {
            scrollTopBtn.classList.remove("scroll-top-btn--visible");
        }
    }
}

// Прокрутка сторінки наверх
function scrollToTop(): void {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Завантаження постів з JSONPlaceholder
async function loadPosts(): Promise<void> {
    if (!postsContainer) return;

    try {
        const response: Response = await fetch(
            "https://jsonplaceholder.typicode.com/posts?_limit=3"
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const posts: Post[] = await response.json();

        postsContainer.innerHTML = "";

        posts.forEach((post: Post): void => {
            const card: HTMLDivElement = document.createElement("div");
            card.className = "post-card";

            const titleElement: HTMLHeadingElement = document.createElement("h3");
            titleElement.textContent = post.title;

            const bodyElement: HTMLParagraphElement = document.createElement("p");
            bodyElement.textContent = post.body;

            card.appendChild(titleElement);
            card.appendChild(bodyElement);
            postsContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Помилка при завантаженні постів:", error);

        postsContainer.innerHTML =
            "<p>Не вдалося завантажити дані. Спробуйте пізніше.</p>";
    }
}

// Ініціалізація після завантаження DOM
document.addEventListener("DOMContentLoaded", (): void => {
    // Кліки по кнопках відкриття модального вікна
    openModalButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", openModal);
    });

    // Закриття модального
    if (closeModalButton) {
        closeModalButton.addEventListener("click", closeModal);
    }

    if (overlay) {
        overlay.addEventListener("click", closeModal);
    }

    // Обробка скролу
    window.addEventListener("scroll", handleScroll);

    // Кнопка "наверх"
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", scrollToTop);
    }

    // Завантажуємо пости
    void loadPosts();
});
