
"use strict";

// =====================================
// INVENTRIXA PRODUCT STORAGE
// =====================================

const PRODUCT_KEY = "inventrixaProducts";

const sampleProducts = [
    {
        id: 1,
        name: "Sugar",
        category: "Food",
        quantity: 150,
        buyingPrice: 200,
        sellingPrice: 250,
        minimumStock: 20
    },
    {
        id: 2,
        name: "Milk",
        category: "Dairy",
        quantity: 20,
        buyingPrice: 140,
        sellingPrice: 180,
        minimumStock: 25
    },
    {
        id: 3,
        name: "Rice",
        category: "Food",
        quantity: 300,
        buyingPrice: 260,
        sellingPrice: 320,
        minimumStock: 30
    }
];

function getProducts() {
    try {
        const saved = localStorage.getItem(PRODUCT_KEY);

        if (saved === null) {
            localStorage.setItem(
                PRODUCT_KEY,
                JSON.stringify(sampleProducts)
            );
            return [...sampleProducts];
        }

        const products = JSON.parse(saved);
        return Array.isArray(products) ? products : [];
    } catch (error) {
        console.error("Could not load products:", error);
        return [];
    }
}

function saveProducts(products) {
    try {
        localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
        return true;
    } catch (error) {
        console.error("Could not save products:", error);
        alert("Unable to save products. Check your browser storage.");
        return false;
    }
}

function formatMoney(amount) {
    return "KSh " + Number(amount).toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function getStockStatus(product) {
    if (Number(product.quantity) === 0) {
        return { label: "Out of Stock", className: "critical" };
    }

    if (Number(product.quantity) <= Number(product.minimumStock)) {
        return { label: "Low Stock", className: "low" };
    }

    return { label: "In Stock", className: "" };
}

// =====================================
// ADD PRODUCT FORM
// =====================================

const productForm = document.getElementById("productForm");

if (productForm) {
    productForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("productName").value.trim();
        const category = document.getElementById("productCategory").value;
        const quantity = Number(
            document.getElementById("productQuantity").value
        );
        const buyingPrice = Number(
            document.getElementById("buyingPrice").value
        );
        const sellingPrice = Number(
            document.getElementById("sellingPrice").value
        );
        const minimumStock = Number(
            document.getElementById("minimumStock").value
        );

        const message = document.getElementById("formMessage");

        if (!name || !category) {
            message.textContent = "Please enter a product name and category.";
            return;
        }

        if (
            !Number.isInteger(quantity) ||
            quantity < 0 ||
            !Number.isInteger(minimumStock) ||
            minimumStock < 0 ||
            !Number.isFinite(buyingPrice) ||
            buyingPrice < 0 ||
            !Number.isFinite(sellingPrice) ||
            sellingPrice < 0
        ) {
            message.textContent = "Please enter valid, non-negative values.";
            return;
        }

        const products = getProducts();

        const duplicate = products.some(
            product => product.name.toLowerCase() === name.toLowerCase()
        );

        if (duplicate) {
            message.textContent =
                "A product with this name already exists. Use a unique name.";
            return;
        }

        const nextId = products.reduce(
            (largest, product) => Math.max(largest, Number(product.id) || 0),
            0
        ) + 1;

        products.push({
            id: nextId,
            name,
            category,
            quantity,
            buyingPrice,
            sellingPrice,
            minimumStock
        });

        if (saveProducts(products)) {
            message.textContent = "Product saved successfully!";
            message.style.color = "#059669";
            productForm.reset();

            document.getElementById("minimumStock").value = 10;
        }
    });
}

// =====================================
// INVENTORY TABLE, SEARCH, EDIT, DELETE
// =====================================

const productsTable = document.querySelector(".products-table");
const productSearch = document.querySelector(".toolbar input");
const addProductButton = document.querySelector(".toolbar .add-btn");

if (addProductButton) {
    addProductButton.addEventListener("click", function () {
        window.location.href = "add-product.html";
    });
}

function renderProducts(searchTerm = "") {
    if (!productsTable) return;

    const tbody = productsTable.querySelector("tbody");
    if (!tbody) return;

    const products = getProducts();
    const term = searchTerm.trim().toLowerCase();

    const filteredProducts = products.filter(product =>
        String(product.name).toLowerCase().includes(term) ||
        String(product.category).toLowerCase().includes(term)
    );

    tbody.replaceChildren();

    if (filteredProducts.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 7;
        cell.textContent = "No products found.";
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    filteredProducts.forEach(product => {
        const row = document.createElement("tr");
        const status = getStockStatus(product);

        const values = [
            product.id,
            product.name,
            product.category,
            product.quantity,
            formatMoney(product.sellingPrice),
            status.label
        ];

        values.forEach((value, index) => {
            const cell = document.createElement("td");
            cell.textContent = value;

            if (index === 5 && status.className) {
                cell.classList.add(status.className);
            }

            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.className = "table-action edit-action";
        editButton.addEventListener("click", () => editProduct(product.id));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "table-action delete-action";
        deleteButton.addEventListener("click", () => deleteProduct(product.id));

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });
}

function editProduct(id) {
    const products = getProducts();
    const product = products.find(item => item.id === id);

    if (!product) return;

    const name = prompt("Product name:", product.name);
    if (name === null) return;

    const category = prompt("Category:", product.category);
    if (category === null) return;

    const quantityText = prompt("Quantity in stock:", product.quantity);
    if (quantityText === null) return;

    const buyingPriceText = prompt("Buying price (KSh):", product.buyingPrice);
    if (buyingPriceText === null) return;

    const sellingPriceText = prompt(
        "Selling price (KSh):",
        product.sellingPrice
    );
    if (sellingPriceText === null) return;

    const minimumStockText = prompt(
        "Minimum stock level:",
        product.minimumStock
    );
    if (minimumStockText === null) return;

    const updated = {
        ...product,
        name: name.trim(),
        category: category.trim(),
        quantity: Number(quantityText),
        buyingPrice: Number(buyingPriceText),
        sellingPrice: Number(sellingPriceText),
        minimumStock: Number(minimumStockText)
    };

    if (!updated.name || !updated.category) {
        alert("Name and category cannot be empty.");
        return;
    }

    if (
        !Number.isInteger(updated.quantity) ||
        updated.quantity < 0 ||
        !Number.isInteger(updated.minimumStock) ||
        updated.minimumStock < 0 ||
        !Number.isFinite(updated.buyingPrice) ||
        updated.buyingPrice < 0 ||
        !Number.isFinite(updated.sellingPrice) ||
        updated.sellingPrice < 0
    ) {
        alert("Please enter valid, non-negative values.");
        return;
    }

    const duplicate = products.some(
        item =>
            item.id !== id &&
            item.name.toLowerCase() === updated.name.toLowerCase()
    );

    if (duplicate) {
        alert("Another product already uses that name.");
        return;
    }

    const updatedProducts = products.map(item =>
        item.id === id ? updated : item
    );

    if (saveProducts(updatedProducts)) {
        renderProducts(productSearch ? productSearch.value : "");
    }
}

function deleteProduct(id) {
    const products = getProducts();
    const product = products.find(item => item.id === id);

    if (!product) return;

    if (!confirm(`Delete "${product.name}" from your inventory?`)) {
        return;
    }

    const remainingProducts = products.filter(item => item.id !== id);

    if (saveProducts(remainingProducts)) {
        renderProducts(productSearch ? productSearch.value : "");
    }
}

if (productSearch) {
    productSearch.addEventListener("input", function () {
        renderProducts(this.value);
    });
}

renderProducts();

// =====================================
// DASHBOARD CHARTS
// =====================================

if (typeof Chart !== "undefined") {
    const salesCanvas = document.getElementById("salesChart");

    if (salesCanvas) {
        new Chart(salesCanvas, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    label: "Sales (KSh)",
                    data: [12000, 19000, 15000, 22000, 28000, 24000, 32000],
                    borderWidth: 3,
                    tension: 0.4
                }]
            },
            options: { responsive: true }
        });
    }

    const topProductsCanvas =
        document.getElementById("topProductsChart");

    if (topProductsCanvas) {
        new Chart(topProductsCanvas, {
            type: "bar",
            data: {
                labels: ["Sugar", "Milk", "Rice", "Flour", "Cooking Oil"],
                datasets: [{
                    label: "Sales (KSh)",
                    data: [85000, 72000, 65000, 54000, 48000],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    const inventoryCanvas = document.getElementById("inventoryChart");

    if (inventoryCanvas) {
        new Chart(inventoryCanvas, {
            type: "pie",
            data: {
                labels: ["Food", "Beverages", "Cleaning", "Personal Care"],
                datasets: [{
                    label: "Inventory",
                    data: [40, 25, 20, 15],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, position: "right" }
                }
            }
        });
    }
}

// =====================================
// NOTIFICATIONS
// =====================================

const notificationButton =
    document.getElementById("notificationButton");
const notificationPanel =
    document.getElementById("notificationPanel");

if (notificationButton && notificationPanel) {
    notificationButton.addEventListener("click", function () {
        notificationPanel.classList.toggle("show");
    });
}
