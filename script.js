let countdownInterval;
let soundEnabled = true;
let eventList = JSON.parse(localStorage.getItem('eventList')) || [];

// Start Countdown
function startCountdown(eventDate, eventName) {
    const eventTime = new Date(eventDate).getTime();

    // Validate the event date
    if (eventTime <= Date.now()) {
        alert("Please select a future event date.");
        return;
    }
    
    // Hide the countdown display until the timer starts
    document.getElementById("eventMessage").textContent = "";

    // Start the countdown
    countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const distance = eventTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdownDisplay").innerHTML = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdownDisplay").textContent = `The ${eventName} has arrived!`;
            document.getElementById("eventMessage").textContent = "🎉🎉🎉 The event has arrived! 🎉🎉🎉";
            document.getElementById("eventMessage").classList.add("event-arrived");
            if (soundEnabled) playCelebrationSound();
            showNotification(eventName);
        }
    }, 1000);
}

// Play Celebration Sound
function playCelebrationSound() {
    const audio = new Audio('notification_audio.mp3');
    audio.play();

}

// Show Browser Notification
function showNotification(eventName) {
    if (Notification.permission === "granted") {
        new Notification(`${eventName} 🎉 Event has arrived!`);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(`${eventName} 🎉 Event has arrived!`);
            }
        });
    }
}

// Toggle Menu
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}


// Reset Timer
function resetTimer() {
    clearInterval(countdownInterval);
    document.getElementById("eventDate").value = "";
    document.getElementById("countdownDisplay").innerHTML = "";
    document.getElementById("eventMessage").textContent = "";
}

// Toggle Sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    alert(`Sound has been ${soundEnabled ? "enabled" : "disabled"}.`);
}

// Change Background Color
function changeBackgroundColor() {
    let red = Math.floor(Math.random()*255);
    let green = Math.floor(Math.random()*255);
    let blue = Math.floor(Math.random()*255);

    let color = `rgb(${red},${green},${blue})`;
    document.body.style.backgroundColor = color;
}

// Add Event Modal
function toggleAddEventModal() {
    const modal = document.getElementById("addEventModal");
    modal.style.display = modal.style.display === "block" ? "none" : "block";
}

// Close the Add Event Modal
function closeAddEventModal() {
    document.getElementById("addEventModal").style.display = "none";
}

// Save Event
function saveEvent() {
    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;

    if (!eventName || !eventDate) {
        alert("Please provide both event name and date.");
        return;
    }

    const newEvent = {
        name: eventName,
        date: eventDate
    };

    // Add event to event list and save to local storage
    eventList.push(newEvent);
    localStorage.setItem('eventList', JSON.stringify(eventList));

    // Close the modal and clear the input fields
    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    closeAddEventModal();
}

// Delete Event
function deleteEvent(eventIndex) {
    eventList.splice(eventIndex, 1); // Remove the event from the array
    localStorage.setItem('eventList', JSON.stringify(eventList)); // Update localStorage
    listEvents(); // Refresh the events list
}


// List Events
function listEvents() {

    const eventsListDiv = document.getElementById("eventsList");
    const eventListItems = document.getElementById("eventListItems");

    // Show the events list section

    const menu = document.getElementById("eventsList");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
    // eventsListDiv.style.display = "block";


    eventListItems.innerHTML = ""; // Clear any previous items

    // Loop through the stored events and display them
    if (eventList.length === 0) {
        eventListItems.innerHTML = "<li>No events found.</li>";
    } else {
        eventList.forEach((event, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${event.name} - ${new Date(event.date).toLocaleString()}`;

            // Create the Start Timer Button
            const startButton = document.createElement("button");
            startButton.textContent = "Start Timer";
            startButton.classList.add("start-timer-btn");
            startButton.onclick = function () {
                startCountdown(event.date, event.name);
            };

            // Create the Delete Button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-btn");
            deleteButton.onclick = function () {
                deleteEvent(index);
            };

            // Append the buttons next to the event text
            listItem.appendChild(startButton);
            listItem.appendChild(deleteButton);

            eventListItems.appendChild(listItem);
        });
    }
}

