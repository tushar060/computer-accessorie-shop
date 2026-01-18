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
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let discount = 0;
  if (subTotal >= 1000) {
    discount = subTotal * 0.10;
  }

  const finalTotal = subTotal - discount;

  // Update floating summary
  const summaryEl = document.getElementById("cart-summary");
  document.getElementById("cart-count").innerText = `${totalItems} Items`;
  document.getElementById("cart-total").innerText = `₹${finalTotal.toFixed(2)}`;

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
    li.innerHTML = `<span>${item.name} x ${item.quantity}</span> <span>₹${(item.price * item.quantity).toFixed(2)}</span>`;
    listEl.appendChild(li);
  });

  // Update Totals Display
  const totalDisplay = document.getElementById("cart-total-info");
  if (discount > 0) {
    totalDisplay.innerHTML = `
        <p>Subtotal: ₹${subTotal.toFixed(2)}</p>
        <p style="color: green;">Discount (10%): -₹${discount.toFixed(2)}</p>
        <p><strong>Total: ₹${finalTotal.toFixed(2)}</strong></p>
      `;
  } else {
    totalDisplay.innerHTML = `<p><strong>Total: ₹${finalTotal.toFixed(2)}</strong></p>`;
  }
}


document.getElementById("enquiryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Please add items to your cart before sending an enquiry!");
    return;
  }

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  if (subTotal >= 1000) {
    discount = subTotal * 0.10;
  }
  const finalTotal = subTotal - discount;

  const enquiry = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    product: "Multiple Items (Cart)", // Legacy field
    message: document.getElementById("message").value,
    cart: cart,
    totalAmount: finalTotal
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

// Feedback handling
const feedbackForm = document.getElementById("feedbackForm");
if (feedbackForm) {
  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("feedback-name").value;
    const email = document.getElementById("feedback-email").value;
    const phone = document.getElementById("feedback-phone").value;
    const feedback = document.getElementById("feedback-text").value;
    const errorDiv = document.getElementById("feedback-error");

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) {
      errorDiv.innerText = "Please enter a valid email address.";
      return;
    }

    if (!phoneRegex.test(phone)) {
      errorDiv.innerText = "Please enter a valid 10-digit phone number.";
      return;
    }

    errorDiv.innerText = ""; // Clear errors

    const response = await fetch("/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, feedback })
    });

    const result = await response.json();
    document.getElementById("feedback-response").innerText = result.message;
    feedbackForm.reset();
  });
}
