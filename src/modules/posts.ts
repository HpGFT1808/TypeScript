// Завантаження та відображення постів з JSONPlaceholder

import { Post } from "../types/post.js";

/**
 * Створює DOM-картку поста.
 */
function createPostCard(post: Post): HTMLDivElement {
    const card: HTMLDivElement = document.createElement("div");
    card.className = "post-card";

    const titleElement: HTMLHeadingElement = document.createElement("h3");
    titleElement.textContent = post.title;

    const bodyElement: HTMLParagraphElement = document.createElement("p");
    bodyElement.textContent = post.body;

    card.appendChild(titleElement);
    card.appendChild(bodyElement);

    return card;
}

/**
 * Завантажує пости з JSONPlaceholder та відображає їх у контейнері.
 */
export async function loadPosts(): Promise<void> {
    const postsContainer: HTMLDivElement | null =
        document.querySelector("#posts-container");

    if (!postsContainer) {
        console.warn("Posts container not found.");
        return;
    }

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
            const card: HTMLDivElement = createPostCard(post);
            postsContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Помилка при завантаженні постів:", error);
        postsContainer.innerHTML =
            "<p>Не вдалося завантажити дані. Спробуйте пізніше.</p>";
    }
}
