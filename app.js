let auth0Client = null;

const fetchAuthConfig = () => fetch("auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();

    auth0Client = await auth0.createAuth0Client({
        domain: config.domain,
        clientId: config.clientId,
        cacheLocation: "localstorage",
        useRefreshTokens: true,
        authorizationParams: {
            redirect_uri: config.redirectUri // Ensure proper redirect URI
        }
    });
};

const checkAuthAndRedirect = async (occupation) => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
        window.location.href = `service.html?occupation=${occupation}`;
    } else {
        login();
    }
};

window.onload = async () => {
    await configureClient();
    const isAuthenticated = await auth0Client.isAuthenticated();

    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        try {
            await auth0Client.handleRedirectCallback();
        } catch (error) {
            console.error("Error handling redirect callback:", error);
        }
        window.history.replaceState({}, document.title, "/");
    }

    if (isAuthenticated) {
        updateUI();
    } else {
        document.getElementById("loginButton").style.display = "block";
        document.getElementById("profileContainer").style.display = "none";
    }
};

const login = async () => {
    try {
        await auth0Client.loginWithRedirect({
            authorizationParams: {
                redirect_uri: "https://piyush-gupta-01.github.io/FindForMeApp/index.html"
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
    }
};

const logout = async () => {
    await auth0Client.logout({
        logoutParams: {
            returnTo: "https://piyush-gupta-01.github.io/FindForMeApp/index.html"
        }
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
    } else {
        document.getElementById("loginButton").style.display = "block";
        document.getElementById("profileContainer").style.display = "none";
    }
};
