// Логіка модального вікна: відкриття/закриття, прив'язка обробників

function openModal(modal: HTMLDivElement, overlay: HTMLDivElement): void {
    modal.classList.add("modal--visible");
    overlay.classList.add("overlay--visible");
}

function closeModal(modal: HTMLDivElement, overlay: HTMLDivElement): void {
    modal.classList.remove("modal--visible");
    overlay.classList.remove("overlay--visible");
}

/**
 * Налаштовує модальне вікно:
 * - знаходить DOM-елементи
 * - вішає обробники на кнопки відкриття/закриття та overlay
 */
export function setupModal(): void {
    const modal: HTMLDivElement | null = document.querySelector("#modal");
    const overlay: HTMLDivElement | null = document.querySelector("#overlay");
    const openButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-open-modal]");
    const closeButton: HTMLButtonElement | null =
        document.querySelector("[data-close-modal]");

    if (!modal || !overlay) {
        console.warn("Modal or overlay element not found.");
        return;
    }

    openButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => {
            openModal(modal, overlay);
        });
    });

    if (closeButton) {
        closeButton.addEventListener("click", (): void => {
            closeModal(modal, overlay);
        });
    }

    overlay.addEventListener("click", (): void => {
        closeModal(modal, overlay);
    });
}
