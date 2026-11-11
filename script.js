
const foods = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 249,
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600",
        description: "Cheesy and delicious classic pizza"
    },
    {
        id: 2,
        name: "Veg Burger",
        category: "Burger",
        price: 149,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        description: "Crispy veggie burger with fresh toppings"
    },
    {
        id: 3,
        name: "Chicken Biryani",
        category: "Biryani",
        price: 299,
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600",
        description: "Traditional aromatic chicken biryani"
    },
    {
        id: 4,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 349,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600",
        description: "Loaded with cheese and toppings"
    },
    {
        id: 5,
        name: "Cheese Burger",
        category: "Burger",
        price: 199,
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=600",
        description: "Juicy burger with melted cheese"
    },
    {
        id: 6,
        name: "Gulab Jamun",
        category: "Dessert",
        price: 99,
        image: "https://images.unsplash.com/photo-1666190092159-8d2b7d0c2d5a?w=600",
        description: "Sweet and delicious Indian dessert"
    }
];

// Load saved cart from LocalStorage
let cart = JSON.parse(localStorage.getItem("foodCart")) || [];

let selectedCategory = "All";

// Display food items
function displayFoods(items) {
    const container = document.getElementById("food-container");

    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = "<p>No food items found.</p>";
        return;
    }

    items.forEach(food => {
        const card = document.createElement("div");
        card.className = "food-card";

        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}">
            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>
                <div class="food-bottom">
                    <span class="price">₹${food.price}</span>
                    <button class="add-btn"
                        onclick="addToCart(${food.id})">
                        Add +
                    </button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Add food to cart
function addToCart(id) {
    const food = foods.find(item => item.id === id);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...food,
            quantity: 1
        });
    }

    saveCart();
    alert(food.name + " added to cart!");
}

// Save cart
function saveCart() {
    localStorage.setItem("foodCart", JSON.stringify(cart));
    updateCart();
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";

    let count = 0;
    let subtotal = 0;

    cart.forEach(item => {
        count += item.quantity;
        subtotal += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price * item.quantity}</p>

                    <div class="quantity">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>

                    <button class="remove-btn"
                        onclick="removeItem(${item.id})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    });

    const delivery = subtotal === 0 ? 0 : 40;
    const total = subtotal + delivery;

    document.getElementById("cart-count").textContent = count;
    document.getElementById("subtotal").textContent = "₹" + subtotal;
    document.getElementById("delivery").textContent = "₹" + delivery;
    document.getElementById("total").textContent = "₹" + total;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty!</p>";
    }
}

// Increase or decrease quantity
function changeQuantity(id, change) {
    const item = cart.find(food => food.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(food => food.id !== id);
    }

    saveCart();
}

// Remove item
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

// Open or close cart
function toggleCart() {
    document.getElementById("cart-panel").classList.toggle("show");
    document.getElementById("overlay").classList.toggle("show");
}

// Category filtering
document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category.active")
            ?.classList.remove("active");

        button.classList.add("active");

        selectedCategory = button.dataset.category;
        filterFoods();
    });
});

// Search functionality
document.getElementById("search").addEventListener("input", filterFoods);

function filterFoods() {
    const searchValue = document
        .getElementById("search")
        .value.toLowerCase();

    const filtered = foods.filter(food => {
        const matchesCategory =
            selectedCategory === "All" ||
            food.category === selectedCategory;

        const matchesSearch =
            food.name.toLowerCase().includes(searchValue);

        return matchesCategory && matchesSearch;
    });

    displayFoods(filtered);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    document.getElementById("checkout-modal").classList.add("show");
}

function closeCheckout() {
    document.getElementById("checkout-modal").classList.remove("show");
}

// Place order
document.getElementById("checkout-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("customer-name").value;
    const phone = document.getElementById("customer-phone").value;
    const address = document.getElementById("customer-address").value;

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const total = subtotal + 40;

    const order = {
        orderId: Date.now(),
        customer: name,
        phone: phone,
        address: address,
        items: cart,
        total: total,
        date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem("foodOrders")) || [];

    orders.push(order);

    localStorage.setItem("foodOrders", JSON.stringify(orders));

    alert(
        "Order placed successfully!\n" +
        "Thank you, " + name + "!\n" +
        "Your total bill is ₹" + total
    );

    cart = [];
    saveCart();

    document.getElementById("checkout-form").reset();
    closeCheckout();
    toggleCart();
});

// Initial loading
displayFoods(foods);
updateCart();
