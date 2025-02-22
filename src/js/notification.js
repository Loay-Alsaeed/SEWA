function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  const messageElement = notification.querySelector("#notification .message");

  notification.className = `notification ${type}`;
  messageElement.textContent = message;
  notification.classList.remove("hidden");
  notification.classList.add("show");

  setTimeout(closeNotification, 5000);
}

function closeNotification() {
  const notification = document.getElementById("notification");
  notification.classList.remove("show");
  notification.classList.add("hidden");
}

