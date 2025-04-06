let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Function to add items to the cart
function addToCart(productName, price, imgSrc, button) {
    let existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: productName, price: price, quantity: 1, img: imgSrc });
    }

    cartCount++;
    cartTotal += price;

    updateCartUI();
    updateButtonCounter(button, productName);
}

// Function to update the cart UI
function updateCartUI() {
    document.getElementById("cart-count").innerText = cartCount;
    let cartItemsContainer = document.getElementById("cart-items");
    let cartTotalElement = document.getElementById("cart-total");

    cartItemsContainer.innerHTML = "";

    cart.forEach((item) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.img}" class="cart-item-img">
                <div>
                    <span class="cart-item-text">${item.name} (x${item.quantity})</span><br>
                    <span class="cart-item-price">₹${item.price * item.quantity}</span>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.name}')">❌</button>
        `;
        cartItemsContainer.appendChild(listItem);
    });

    cartTotalElement.innerText = `₹${cartTotal.toFixed(2)}`; // Format total with two decimal places
}

// Function to remove one quantity at a time
function removeFromCart(productName) {
    let itemIndex = cart.findIndex(item => item.name === productName);

    if (itemIndex !== -1) {
        let removedItem = cart[itemIndex];

        if (removedItem.quantity > 1) {
            removedItem.quantity--; // Reduce quantity by 1
            cartTotal -= removedItem.price; // Deduct only one item's price
            cartCount--; // Reduce cart count
        } else {
            cartTotal -= removedItem.price; // Deduct the last item's price
            cartCount--; // Reduce cart count
            cart.splice(itemIndex, 1); // Remove the item completely when quantity is 0
        }

        updateCartUI();
        updateAllButtonCounters();
    }
}

// Function to update button counter
function updateButtonCounter(button, productName) {
    let existingItem = cart.find(item => item.name === productName);
    let count = existingItem ? existingItem.quantity : 0;
    button.innerText = count > 0 ? `Add to Cart (${count})` : "Add to Cart";
}

// Function to update all button counters
function updateAllButtonCounters() {
    let buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach((button) => {
        let productName = button.getAttribute("data-product");
        let existingItem = cart.find(item => item.name === productName);
        let count = existingItem ? existingItem.quantity : 0;
        button.innerText = count > 0 ? `Add to Cart (${count})` : "Add to Cart";
    });
}

// Function to toggle the cart sidebar
function toggleCart() {
    let cartSidebar = document.getElementById("cart-sidebar");

    if (cartSidebar.classList.contains("open")) {
        cartSidebar.classList.remove("open");
    } else {
        cartSidebar.classList.add("open");
    }
}

// Function to load products dynamically
document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('product-list');
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Filter out invalid products
    const validProducts = products.filter(product => {
        const isValid = product && product.id && product.name && product.category && product.image && product.price;
        if (!isValid) {
            console.log('Removing invalid product:', product); // Debugging log for invalid products
        }
        return isValid;
    });

    // Save cleaned-up product list back to localStorage
    localStorage.setItem('products', JSON.stringify(validProducts));

    // Check if any valid products are left
    if (validProducts.length === 0) {
        productList.innerHTML = '<p>No products available. Add some products on the Sell page!</p>';
        return;
    }


    // Display valid products on the page
validProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
            <h2>${product.name}</h2>
            <p>Category: ${product.category}</p>
            <p>Price: ₹${product.price}</p>
            <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price}, '${product.image}', this)">Add to Cart</button>
            <button id="view-details-btn" onclick="viewProduct(${product.id})">View Details</button>
        </div>
    `;



    productList.appendChild(productCard);
});
});

// Function to handle "View Details" button click
function viewProduct(id) {
    localStorage.setItem('currentProductId', id); // Save the product ID in localStorage
    window.location.href = 'view.html'; // Redirect to the product details page
}

function logout() {
    localStorage.removeItem('currentUser'); // Clear the logged-in user's data
    alert('You have been logged out.');
    window.location.href = 'login.html'; // Redirect to the login page
}

// Function to handle checkout
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add items before checking out.");
    } else {
        alert("Proceeding to checkout...");
        window.location.href = 'checkout.html'; // Redirect to checkout page
    }
}

