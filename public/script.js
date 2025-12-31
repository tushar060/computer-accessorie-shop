// Auth Guard handled in index.html head

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}

let cart = [];

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  // Update floating summary
  const summaryEl = document.getElementById("cart-summary");
  document.getElementById("cart-count").innerText = `${totalItems} Items`;
  document.getElementById("cart-total").innerText = `$${totalPrice}`;

  if (totalItems > 0) {
    summaryEl.style.display = "flex";
    document.getElementById("cart-details").style.display = "block";
  } else {
    summaryEl.style.display = "none";
    document.getElementById("cart-details").style.display = "none";
  }

  // Update Enquiry Form List
  const listEl = document.getElementById("cart-items-list");
  listEl.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name} x ${item.quantity}</span> <span>$${(item.price * item.quantity).toFixed(2)}</span>`;
    listEl.appendChild(li);
  });
  document.getElementById("cart-total-display").innerText = totalPrice;
}


document.getElementById("enquiryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Please add items to your cart before sending an enquiry!");
    return;
  }

  const enquiry = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    product: "Multiple Items (Cart)", // Legacy field
    message: document.getElementById("message").value,
    cart: cart,
    totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  };

  const response = await fetch("/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enquiry)
  });

  const result = await response.json();
  document.getElementById("response").innerText = result.message;

  // Clear cart and form
  cart = [];
  updateCartUI();
  document.getElementById("enquiryForm").reset();
});
