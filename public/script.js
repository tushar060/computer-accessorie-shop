document.getElementById("enquiryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const enquiry = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    product: document.getElementById("product").value,
    message: document.getElementById("message").value
  };

  const response = await fetch("/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enquiry)
  });

  const result = await response.json();
  document.getElementById("response").innerText = result.message;
  document.getElementById("enquiryForm").reset();
});
