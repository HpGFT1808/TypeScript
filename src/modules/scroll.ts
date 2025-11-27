// Логіка для зміни хедера при скролі та кнопки "наверх"

function handleScroll(
    header: HTMLElement | null,
    scrollTopBtn: HTMLButtonElement | null
): void {
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

function scrollToTop(): void {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/**
 * Налаштовує поведінку при скролі:
 * - додає/знімає тінь у хедера
 * - показує/ховає кнопку "наверх"
 * - додає обробник кліку по кнопці
 */
export function setupScrollEffects(): void {
    const header: HTMLElement | null = document.querySelector(".header");
    const scrollTopBtn: HTMLButtonElement | null =
        document.querySelector("#scrollTopBtn");

    window.addEventListener("scroll", (): void => {
        handleScroll(header, scrollTopBtn);
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", scrollToTop);
    }
}
