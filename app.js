let auth0Client = null;

const fetchAuthConfig = () => fetch("auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();

    auth0Client = await auth0.createAuth0Client({
        domain: config.domain,
        clientId: config.clientId,
        cacheLocation: "localstorage", // Persist session across refresh
        useRefreshTokens: true, // Allow long-lived sessions
    });
};
const checkAuthAndRedirect = async (occupation) => {
    // Check if the user is authenticated using the existing auth0 client
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
        // If authenticated, navigate to service page with the occupation query parameter
        window.location.href = `service.html?occupation=${occupation}`;
    } else {
        // If not authenticated, redirect to login page
       login();
    }
};

window.onload = async () => {
    await configureClient();

    // Check if user is authenticated
    const isAuthenticated = await auth0Client.isAuthenticated();

    // Handle redirect callback
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        try {
            await auth0Client.handleRedirectCallback();
        } catch (error) {
            console.error("Error handling redirect callback:", error);
        }
        window.history.replaceState({}, document.title, "/"); // Clean up URL
    }

    // Update UI based on authentication state
    if (isAuthenticated) {
        updateUI();
    } else {
        document.getElementById("loginButton").style.display = "block";
        document.getElementById("profileContainer").style.display = "none";
    }

    // Attach event listeners
    document.addEventListener("click", hideMiniDashboard);

    // Toggle login options on button click
    const loginButton = document.getElementById("loginButton");
    const loginOptions = document.getElementById("loginOptions");

    if (loginButton && loginOptions) {
        loginButton.addEventListener("click", () => {
            const isVisible = loginOptions.style.display === "block";
            loginOptions.style.display = isVisible ? "none" : "block";
        });

        // Close the dropdown when clicking outside
        document.addEventListener("click", (event) => {
            if (!loginOptions.contains(event.target) && !loginButton.contains(event.target)) {
                loginOptions.style.display = "none";
            }
        });
    }

    // Attach profile container events
    const profileContainer = document.getElementById("profileContainer");
    if (profileContainer) {
        profileContainer.addEventListener("click", (event) => toggleMiniDashboard(event));
    }
};

const login = async () => {
    try {
        await auth0Client.loginWithRedirect({
            authorizationParams: {
                redirect_uri: window.location.origin,
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
    }
};

const loginAsPartner = () => {
    // Redirect to registration.html
    window.location.href = "registration.html";
};

const logout = async () => {
    await auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin,
        },
    });
};

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
        const user = await auth0Client.getUser();
        document.getElementById("loginButton").style.display = "none";
        document.getElementById("profileContainer").style.display = "block";
        document.getElementById("userProfileImage").src = user.picture;
        document.getElementById("userImage").src = user.picture;

        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("userDisplayName").textContent = user.name || user.email;

        // Ensure mini dashboard starts hidden
        document.getElementById("miniDashboard").style.right = "-250px";
    } else {
        document.getElementById("loginButton").style.display = "block";
        document.getElementById("profileContainer").style.display = "none";
    }
};

// Function to toggle the mini dashboard
const toggleMiniDashboard = (event) => {
    if (event) event.stopPropagation(); // Ensure the event object exists before calling stopPropagation
    const dashboard = document.getElementById("miniDashboard");
    const isVisible = dashboard.style.right === "0px";
    dashboard.style.right = isVisible ? "-250px" : "0";
};

// Function to hide the mini dashboard when clicking outside
const hideMiniDashboard = (event) => {
    const dashboard = document.getElementById("miniDashboard");
    const profileContainer = document.getElementById("profileContainer");

    if (
        !dashboard.contains(event.target) &&
        !profileContainer.contains(event.target)
    ) {
        dashboard.style.right = "-250px";
    }
};

// Redirect to profile page or dashboard
const goToProfile = () => {
    window.location.href = "/dashboard.html";
};

// Dummy function for settings (can be customized later)
const goToSettings = () => {
    alert("Settings clicked!");
};
// After successful registration
const successCard = document.getElementById('successCard');
successCard.classList.remove('d-none');
successCard.scrollIntoView({ behavior: 'smooth' });
form.reset();
document.getElementById('imagePreview').style.display = 'none'; // Hide image preview

// Update the navbar after registration
updateNavbar();