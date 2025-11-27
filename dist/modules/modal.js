// Логіка модального вікна: відкриття/закриття, прив'язка обробників
function openModal(modal, overlay) {
    modal.classList.add("modal--visible");
    overlay.classList.add("overlay--visible");
}
function closeModal(modal, overlay) {
    modal.classList.remove("modal--visible");
    overlay.classList.remove("overlay--visible");
}
/**
 * Налаштовує модальне вікно:
 * - знаходить DOM-елементи
 * - вішає обробники на кнопки відкриття/закриття та overlay
 */
export function setupModal() {
    const modal = document.querySelector("#modal");
    const overlay = document.querySelector("#overlay");
    const openButtons = document.querySelectorAll("[data-open-modal]");
    const closeButton = document.querySelector("[data-close-modal]");
    if (!modal || !overlay) {
        console.warn("Modal or overlay element not found.");
        return;
    }
    openButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            openModal(modal, overlay);
        });
    });
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            closeModal(modal, overlay);
        });
    }
    overlay.addEventListener("click", () => {
        closeModal(modal, overlay);
    });
}
