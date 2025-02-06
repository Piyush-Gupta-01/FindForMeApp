
function updateNavbar() {
 // Flag to identify navbar.js script

    const navbar = document.querySelector('.navbar-collapse .d-flex');
    const savedUser = localStorage.getItem('loggedInUser');

    if (savedUser) {
        const loggedInUser = JSON.parse(savedUser);

        navbar.innerHTML = `
            <div class="d-flex align-items-center position-relative">
                <img 
                    id="loggedInProfileImage" 
                    src="${loggedInUser.profileImage || 'default-profile.png'}" 
                    alt="Profile" 
                    class="rounded-circle" 
                    style="cursor: pointer; width: 40px; height: 40px;">
                <span class="ms-2">${loggedInUser.firstName}</span>
                <div 
                    id="miniDashboard" 
                    class="mini-dashboard" 
                    style="
                        position: fixed; 
                        top: 70px;  
                        right: 0; 
                        background: #fff; 
                        width: 200px; 
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                        border-radius: 8px; 
                        display: none; 
                        z-index: 1000;
                    ">
                    <ul style="list-style: none; padding: 10px; margin: 0;">
                        <li><strong>Welcome, ${loggedInUser.firstName || 'User'}!</strong></li>
                        <hr>
                        <li><a href="#" onclick="goToProfile()">Profile</a></li>
                        <li><a href="#" onclick="goToSettings()">Settings</a></li>
                        <li><a href="#" onclick="logout()">Logout</a></li>
                    </ul>
                </div>
            </div>
        `;

        // Attach event listeners for toggling the mini-dashboard
        const profileImage = document.getElementById('loggedInProfileImage');
        const miniDashboard = document.getElementById('miniDashboard');

        profileImage.addEventListener('click', () => {
            // Toggle mini-dashboard visibility
            if (miniDashboard.style.display === 'block') {
                miniDashboard.style.display = 'none';
            } else {
                miniDashboard.style.display = 'block';
            }
        });

        // Close mini-dashboard when clicking outside of it
        document.addEventListener('click', (event) => {
            if (!navbar.contains(event.target)) {
                miniDashboard.style.display = 'none';
            }
        });
    } else {
        navbar.innerHTML = `
            <div class="d-flex m-3 me-0">
                <button class="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4" data-bs-toggle="modal" data-bs-target="#searchModal"><i class="fas fa-search text-primary"></i></button>
                <button id="loginButton" class="btn btn-primary">Login</button>
            </div>
        `;
    }
} 

// Redirect to Partner Dashboard
function goToProfile() {
    window.location.href = 'partnerDashboard.html';
}

// Logout Functionality
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html'; // Redirect to homepage or login page
}

// Example for Settings Redirect (Optional)
function goToSettings() {
    alert('Settings feature coming soon!'); // Replace with actual redirection when ready
}

// Run the function on page load
document.addEventListener('DOMContentLoaded', updateNavbar);
