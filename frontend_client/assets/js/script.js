// Load events and notices when page loads
document.addEventListener('DOMContentLoaded', async function() {
    await loadEvents();
    await loadNotices();
    checkAuthStatus();
});

// Load events from backend
async function loadEvents() {
    try {
        const events = await getEvents();
        displayEvents(events);
    } catch (error) {
        console.error('Failed to load events:', error);
        // Fallback to static content if backend fails
    }
}

// Load notices from backend
async function loadNotices() {
    try {
        const notices = await getNotices();
        displayNotices(notices);
    } catch (error) {
        console.error('Failed to load notices:', error);
        // Fallback to static content
    }
}

// Display events
function displayEvents(events) {
    const eventsBox = document.getElementById('eventsBox');
    if (!eventsBox || events.length === 0) return;

    eventsBox.innerHTML = events.slice(0, 3).map(event => {
        const startDate = new Date(event.startDate);
        return `
        <div class="event-item">
            <div class="event-date">
                <span class="date-day">${startDate.getDate()}</span>
                <span class="date-month">${startDate.toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
            </div>
            <div class="event-info">
                <h4>${event.title}</h4>
                <p>${event.department || 'General'} • ${event.venue || 'TBA'}</p>
                <span class="event-status ${event.status}">${event.status}</span>
            </div>
        </div>
    `}).join('');
}

// Display notices
function displayNotices(notices) {
    const noticesBox = document.getElementById('noticesBox');
    if (!noticesBox || notices.length === 0) return;

    noticesBox.innerHTML = notices.slice(0, 3).map(notice => `
        <div class="notice-item">
            <div class="notice-icon">
                <i class="fas fa-file-pdf"></i>
            </div>
            <div class="notice-info">
                <h4>${notice.title}</h4>
                <p>${notice.description || ''}</p>
                ${notice.fileUrl ? `
                    <a href="${notice.fileUrl}" download class="download-link">
                        <i class="fas fa-download"></i> Download PDF
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Check authentication status
function checkAuthStatus() {
    const loginBtn = document.querySelector('.login-btn');
    if (isAuthenticated()) {
        const user = getCurrentUser();
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
            loginBtn.href = '#';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                alert('Dashboard coming soon!');
            };
        }
    }
}

// Redirect to login
function redirectToLogin() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        alert('You are already logged in!');
    }
}

// Chatbot functions
function toggleChatbot() {
    const chatbot = document.getElementById('chatbotBox');
    chatbot.classList.toggle('active');
}