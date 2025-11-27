// Точка входу: підключає всі модулі та ініціалізує інтерактивність

import { setupModal } from "./modules/modal.js";
import { setupScrollEffects } from "./modules/scroll.js";
import { loadPosts } from "./modules/posts.js";

function initApp(): void {
    setupModal();
    setupScrollEffects();
    void loadPosts();
}

document.addEventListener("DOMContentLoaded", (): void => {
    initApp();
});
