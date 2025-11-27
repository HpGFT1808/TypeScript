// ---------- Крок 1. Базові типи товарів ----------

export type BaseProduct = {
    id: number;
    name: string;
    price: number;
    inStock: boolean;  // базове поле: чи є в наявності
    description?: string; // необов'язковий опис
};

export type Electronics = BaseProduct & {
    category: "electronics";
    brand: string;
    warrantyMonths: number;
    powerWatts?: number;
};

export type Clothing = BaseProduct & {
    category: "clothing";
    size: "XS" | "S" | "M" | "L" | "XL";
    material: string;
    gender: "male" | "female" | "unisex";
};

export type Book = BaseProduct & {
    category: "book";
    author: string;
    pages: number;
    isHardcover: boolean;
};

// Узагальнений тип для змішаних колекцій товарів
export type AnyProduct = Electronics | Clothing | Book;

// ---------- Крок 2. Generic-функції для пошуку ----------

/**
 * findProduct:
 * Шукає товар за id в масиві продуктів.
 * Повертає знайдений елемент або undefined.
 */
export const findProduct = <T extends BaseProduct>(
    products: T[],
    id: number
): T | undefined => {
    if (!Array.isArray(products)) {
        console.warn("findProduct: products is not an array");
        return undefined;
    }

    if (typeof id !== "number" || Number.isNaN(id)) {
        console.warn("findProduct: invalid id");
        return undefined;
    }

    return products.find((product: T): boolean => product.id === id);
};

/**
 * filterByPrice:
 * Фільтрує товари за максимальною ціною.
 * Повертає новий масив товарів з price <= maxPrice.
 */
export const filterByPrice = <T extends BaseProduct>(
    products: T[],
    maxPrice: number
): T[] => {
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

    return products.filter((product: T): boolean => product.price <= maxPrice);
};

// ---------- Крок 3. Кошик з generic-типом ----------

export type CartItem<T extends BaseProduct> = {
    product: T;
    quantity: number;
};

/**
 * addToCart:
 * Додає товар у кошик.
 * - якщо товар уже є в кошику, збільшує quantity
 * - якщо немає — додає новий CartItem
 * Працює з будь-яким типом T, що розширює BaseProduct.
 */
export const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    if (!product) {
        console.warn("addToCart: product is undefined or null");
        return cart;
    }

    if (quantity <= 0 || !Number.isFinite(quantity)) {
        console.warn("addToCart: quantity must be a positive number");
        return cart;
    }

    const existingIndex: number = cart.findIndex(
        (item: CartItem<T>): boolean => item.product.id === product.id
    );

    // Створюємо копію масиву, щоб не мутувати вхідний
    const updatedCart: CartItem<T>[] = [...cart];

    if (existingIndex !== -1) {
        const existingItem: CartItem<T> = updatedCart[existingIndex];
        updatedCart[existingIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity
        };
    } else {
        updatedCart.push({
            product,
            quantity
        });
    }

    return updatedCart;
};

/**
 * calculateTotal:
 * Рахує загальну вартість кошика як суму price * quantity.
 * Якщо quantity або price некоректні — такий елемент ігнорується.
 */
export const calculateTotal = <T extends BaseProduct>(
    cart: CartItem<T>[]
): number => {
    if (!Array.isArray(cart)) {
        console.warn("calculateTotal: cart is not an array");
        return 0;
    }

    const total: number = cart.reduce(
        (sum: number, item: CartItem<T>): number => {
            const price: number = item.product.price;
            const quantity: number = item.quantity;

            if (
                typeof price !== "number" ||
                typeof quantity !== "number" ||
                price < 0 ||
                quantity <= 0
            ) {
                return sum; // пропускаємо некоректні записи
            }

            return sum + price * quantity;
        },
        0
    );

    return total;
};

// ---------- Крок 4. Тестові дані та приклади використання ----------

// Тестові дані для електроніки
const electronicsProducts: Electronics[] = [
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
const clothingProducts: Clothing[] = [
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
const bookProducts: Book[] = [
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
const allProducts: AnyProduct[] = [
    ...electronicsProducts,
    ...clothingProducts,
    ...bookProducts
];

// ---------- Демонстрація роботи функцій ----------

// 1. Пошук товару за id
const phone: Electronics | undefined = findProduct<Electronics>(
    electronicsProducts,
    1
);

const cheapProducts: AnyProduct[] = filterByPrice<AnyProduct>(
    allProducts,
    2000
);

// 2. Робота з кошиком (електроніка)
let electronicsCart: CartItem<Electronics>[] = [];

if (phone) {
    electronicsCart = addToCart<Electronics>(electronicsCart, phone, 1);
    electronicsCart = addToCart<Electronics>(electronicsCart, phone, 2); // ще 2 шт.
}

const electronicsTotal: number = calculateTotal<Electronics>(electronicsCart);

// 3. Змішаний кошик (електроніка + одяг + книги)
let mixedCart: CartItem<AnyProduct>[] = [];

const tshirt: Clothing | undefined = findProduct<Clothing>(
    clothingProducts,
    3
);
const tsBook: Book | undefined = findProduct<Book>(bookProducts, 5);

if (phone) {
    mixedCart = addToCart<AnyProduct>(mixedCart, phone, 1);
}
if (tshirt) {
    mixedCart = addToCart<AnyProduct>(mixedCart, tshirt, 2);
}
if (tsBook) {
    mixedCart = addToCart<AnyProduct>(mixedCart, tsBook, 1);
}

const mixedTotal: number = calculateTotal<AnyProduct>(mixedCart);

// Ці console.log можна прибрати перед здачею, або лишити для перевірки
console.log("Знайдений телефон:", phone);
console.log("Товари до 2000 грн:", cheapProducts);
console.log("Кошик (електроніка):", electronicsCart);
console.log("Сума кошика (електроніка):", electronicsTotal);
console.log("Змішаний кошик:", mixedCart);
console.log("Сума змішаного кошика:", mixedTotal);
