// Завантаження та відображення постів з JSONPlaceholder
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Створює DOM-картку поста.
 */
function createPostCard(post) {
    const card = document.createElement("div");
    card.className = "post-card";
    const titleElement = document.createElement("h3");
    titleElement.textContent = post.title;
    const bodyElement = document.createElement("p");
    bodyElement.textContent = post.body;
    card.appendChild(titleElement);
    card.appendChild(bodyElement);
    return card;
}
/**
 * Завантажує пости з JSONPlaceholder та відображає їх у контейнері.
 */
export function loadPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const postsContainer = document.querySelector("#posts-container");
        if (!postsContainer) {
            console.warn("Posts container not found.");
            return;
        }
        try {
            const response = yield fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const posts = yield response.json();
            postsContainer.innerHTML = "";
            posts.forEach((post) => {
                const card = createPostCard(post);
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
