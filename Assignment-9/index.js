// script.js
document.addEventListener("DOMContentLoaded", function () {
  const bookingForm = document.getElementById("booking-form");
  const confirmationPopup = document.getElementById("confirmation-popup");
  const appointmentForm = document.getElementById("appointment-form");
  const appointmentsTable = document.getElementById("appointments-table").getElementsByTagName("tbody")[0];
  const serviceButtons = document.querySelectorAll(".service-btn");

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  // Open booking form when a service button is clicked
  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      bookingForm.style.display = "block";
      document.getElementById("service").value = button.dataset.service;
    });
  });

  // Close modal when clicking the close button
  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      bookingForm.style.display = "none";
      confirmationPopup.style.display = "none";
    });
  });

  // Form submission
  appointmentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const service = document.getElementById("service").value;
    const datetime = document.getElementById("datetime").value;
    const requests = document.getElementById("requests").value;
    const terms = document.getElementById("terms").checked;

    // Validation
    let isValid = true;

    if (!name) {
      document.getElementById("name-error").textContent = "Name is required.";
      isValid = false;
    } else {
      document.getElementById("name-error").textContent = "";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById("email-error").textContent = "Invalid email format.";
      isValid = false;
    } else {
      document.getElementById("email-error").textContent = "";
    }

    if (!/^\d{10}$/.test(phone)) {
      document.getElementById("phone-error").textContent = "Phone number must be 10 digits.";
      isValid = false;
    } else {
      document.getElementById("phone-error").textContent = "";
    }

    if (new Date(datetime) < new Date()) {
      document.getElementById("datetime-error").textContent = "Date must be in the future.";
      isValid = false;
    } else {
      document.getElementById("datetime-error").textContent = "";
    }

    if (!terms) {
      document.getElementById("terms-error").textContent = "You must agree to the terms.";
      isValid = false;
    } else {
      document.getElementById("terms-error").textContent = "";
    }

    if (isValid) {
      const appointment = {
        name,
        email,
        phone,
        service,
        datetime,
        requests,
        status: "Pending",
      };

      appointments.push(appointment);
      localStorage.setItem("appointments", JSON.stringify(appointments));

      // Display confirmation popup
      document.getElementById("confirmation-message").textContent = `Thank you, ${name}! Your appointment for ${service} on ${datetime} is confirmed.`;
      confirmationPopup.style.display = "block";

      // Clear form
      appointmentForm.reset();
      bookingForm.style.display = "none";

      // Update appointments list
      updateAppointmentsList();
    }
  });

  // Update appointments list
  function updateAppointmentsList() {
    appointmentsTable.innerHTML = "";
    appointments.forEach((appointment) => {
      const row = appointmentsTable.insertRow();
      row.insertCell(0).textContent = appointment.name;
      row.insertCell(1).textContent = appointment.service;
      row.insertCell(2).textContent = appointment.datetime;
      row.insertCell(3).textContent = appointment.status;
    });
  }

  // Load appointments on page load
  updateAppointmentsList();
});
