"use strict";
// ---------- Крок 1. Базові типи товарів ----------
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotal = exports.addToCart = exports.filterByPrice = exports.findProduct = void 0;
// ---------- Крок 2. Generic-функції для пошуку ----------
/**
 * findProduct:
 * Шукає товар за id в масиві продуктів.
 * Повертає знайдений елемент або undefined.
 */
const findProduct = (products, id) => {
    if (!Array.isArray(products)) {
        console.warn("findProduct: products is not an array");
        return undefined;
    }
    if (typeof id !== "number" || Number.isNaN(id)) {
        console.warn("findProduct: invalid id");
        return undefined;
    }
    return products.find((product) => product.id === id);
};
exports.findProduct = findProduct;
/**
 * filterByPrice:
 * Фільтрує товари за максимальною ціною.
 * Повертає новий масив товарів з price <= maxPrice.
 */
const filterByPrice = (products, maxPrice) => {
    if (!Array.isArray(products)) {
        console.warn("filterByPrice: products is not an array");
        return [];
    }
    if (typeof maxPrice !== "number" || Number.isNaN(maxPrice)) {
        console.warn("filterByPrice: invalid maxPrice");
        return [];
    }
    // Якщо передали негативну ціну — просто повертаємо порожній результат
    if (maxPrice < 0) {
        return [];
    }
    return products.filter((product) => product.price <= maxPrice);
};
exports.filterByPrice = filterByPrice;
/**
 * addToCart:
 * Додає товар у кошик.
 * - якщо товар уже є в кошику, збільшує quantity
 * - якщо немає — додає новий CartItem
 * Працює з будь-яким типом T, що розширює BaseProduct.
 */
const addToCart = (cart, product, quantity) => {
    if (!product) {
        console.warn("addToCart: product is undefined or null");
        return cart;
    }
    if (quantity <= 0 || !Number.isFinite(quantity)) {
        console.warn("addToCart: quantity must be a positive number");
        return cart;
    }
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    // Створюємо копію масиву, щоб не мутувати вхідний
    const updatedCart = [...cart];
    if (existingIndex !== -1) {
        const existingItem = updatedCart[existingIndex];
        updatedCart[existingIndex] = Object.assign(Object.assign({}, existingItem), { quantity: existingItem.quantity + quantity });
    }
    else {
        updatedCart.push({
            product,
            quantity
        });
    }
    return updatedCart;
};
exports.addToCart = addToCart;
/**
 * calculateTotal:
 * Рахує загальну вартість кошика як суму price * quantity.
 * Якщо quantity або price некоректні — такий елемент ігнорується.
 */
const calculateTotal = (cart) => {
    if (!Array.isArray(cart)) {
        console.warn("calculateTotal: cart is not an array");
        return 0;
    }
    const total = cart.reduce((sum, item) => {
        const price = item.product.price;
        const quantity = item.quantity;
        if (typeof price !== "number" ||
            typeof quantity !== "number" ||
            price < 0 ||
            quantity <= 0) {
            return sum; // пропускаємо некоректні записи
        }
        return sum + price * quantity;
    }, 0);
    return total;
};
exports.calculateTotal = calculateTotal;
// ---------- Крок 4. Тестові дані та приклади використання ----------
// Тестові дані для електроніки
const electronicsProducts = [
    {
        id: 1,
        name: "Смартфон",
        price: 10000,
        inStock: true,
        description: "Смартфон з AMOLED дисплеєм",
        category: "electronics",
        brand: "SuperPhone",
        warrantyMonths: 24,
        powerWatts: 20
    },
    {
        id: 2,
        name: "Ноутбук",
        price: 32000,
        inStock: true,
        description: "Ультрабук для роботи та навчання",
        category: "electronics",
        brand: "UltraBook",
        warrantyMonths: 12
    }
];
// Тестові дані для одягу
const clothingProducts = [
    {
        id: 3,
        name: "Футболка",
        price: 700,
        inStock: true,
        description: "Базова чорна футболка",
        category: "clothing",
        size: "M",
        material: "Cotton",
        gender: "unisex"
    },
    {
        id: 4,
        name: "Куртка",
        price: 2500,
        inStock: false,
        description: "Демісезонна куртка",
        category: "clothing",
        size: "L",
        material: "Polyester",
        gender: "female"
    }
];
// Тестові дані для книг
const bookProducts = [
    {
        id: 5,
        name: "TypeScript для початківців",
        price: 900,
        inStock: true,
        description: "Навчальний посібник з TypeScript",
        category: "book",
        author: "John Doe",
        pages: 320,
        isHardcover: true
    },
    {
        id: 6,
        name: "Алгоритми та структури даних",
        price: 1200,
        inStock: true,
        description: "Книга для студентів комп'ютерних спеціальностей",
        category: "book",
        author: "Jane Smith",
        pages: 450,
        isHardcover: false
    }
];
// Приклад змішаного масиву товарів
const allProducts = [
    ...electronicsProducts,
    ...clothingProducts,
    ...bookProducts
];
// ---------- Демонстрація роботи функцій ----------
// 1. Пошук товару за id
const phone = (0, exports.findProduct)(electronicsProducts, 1);
const cheapProducts = (0, exports.filterByPrice)(allProducts, 2000);
// 2. Робота з кошиком (електроніка)
let electronicsCart = [];
if (phone) {
    electronicsCart = (0, exports.addToCart)(electronicsCart, phone, 1);
    electronicsCart = (0, exports.addToCart)(electronicsCart, phone, 2); // ще 2 шт.
}
const electronicsTotal = (0, exports.calculateTotal)(electronicsCart);
// 3. Змішаний кошик (електроніка + одяг + книги)
let mixedCart = [];
const tshirt = (0, exports.findProduct)(clothingProducts, 3);
const tsBook = (0, exports.findProduct)(bookProducts, 5);
if (phone) {
    mixedCart = (0, exports.addToCart)(mixedCart, phone, 1);
}
if (tshirt) {
    mixedCart = (0, exports.addToCart)(mixedCart, tshirt, 2);
}
if (tsBook) {
    mixedCart = (0, exports.addToCart)(mixedCart, tsBook, 1);
}
const mixedTotal = (0, exports.calculateTotal)(mixedCart);
// Ці console.log можна прибрати перед здачею, або лишити для перевірки
console.log("Знайдений телефон:", phone);
console.log("Товари до 2000 грн:", cheapProducts);
console.log("Кошик (електроніка):", electronicsCart);
console.log("Сума кошика (електроніка):", electronicsTotal);
console.log("Змішаний кошик:", mixedCart);
console.log("Сума змішаного кошика:", mixedTotal);
