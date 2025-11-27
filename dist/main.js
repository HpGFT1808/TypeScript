"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Отримуємо елементи DOM з типами
const modal = document.querySelector("#modal");
const overlay = document.querySelector("#overlay");
const openModalButtons = document.querySelectorAll("[data-open-modal]");
const closeModalButton = document.querySelector("[data-close-modal]");
const header = document.querySelector(".header");
const scrollTopBtn = document.querySelector("#scrollTopBtn");
const postsContainer = document.querySelector("#posts-container");
// Функції для роботи з модальним вікном
function openModal() {
    if (!modal || !overlay)
        return;
    modal.classList.add("modal--visible");
    overlay.classList.add("overlay--visible");
}
function closeModal() {
    if (!modal || !overlay)
        return;
    modal.classList.remove("modal--visible");
    overlay.classList.remove("overlay--visible");
}
// Обробка скролу: тінь у хедера + кнопка "наверх"
function handleScroll() {
    const scrollY = window.scrollY;
    if (header) {
        if (scrollY > 10) {
            header.classList.add("header--scrolled");
        }
        else {
            header.classList.remove("header--scrolled");
        }
    }
    if (scrollTopBtn) {
        if (scrollY > 200) {
            scrollTopBtn.classList.add("scroll-top-btn--visible");
        }
        else {
            scrollTopBtn.classList.remove("scroll-top-btn--visible");
        }
    }
}
// Прокрутка сторінки наверх
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
// Завантаження постів з JSONPlaceholder
function loadPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!postsContainer)
            return;
        try {
            const response = yield fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const posts = yield response.json();
            postsContainer.innerHTML = "";
            posts.forEach((post) => {
                const card = document.createElement("div");
                card.className = "post-card";
                const titleElement = document.createElement("h3");
                titleElement.textContent = post.title;
                const bodyElement = document.createElement("p");
                bodyElement.textContent = post.body;
                card.appendChild(titleElement);
                card.appendChild(bodyElement);
                postsContainer.appendChild(card);
            });
        }
        catch (error) {
            console.error("Помилка при завантаженні постів:", error);
            postsContainer.innerHTML =
                "<p>Не вдалося завантажити дані. Спробуйте пізніше.</p>";
        }
    });
}
// Ініціалізація після завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
    // Кліки по кнопках відкриття модального вікна
    openModalButtons.forEach((btn) => {
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
