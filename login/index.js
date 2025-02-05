const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

registerLink.onclick = () => { 
    wrapper.classList.add('active');  
}
loginLink.onclick = () => { 
    wrapper.classList.remove('active');  
}

function logout() {
    window.sessionStorage.clone();
}



// login fetch
const login = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost/sewa_app/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        if (result.status === "success") {
            // alert("Login successful. Token: " + result.token);
            window.sessionStorage.setItem("user_token", result.token);
            window.sessionStorage.setItem("isLogin", "true");
            window.history.back();
            window.refresh;
            // تنفيذ إجراء بعد تسجيل الدخول بنجاح
        } else {
            alert("Login failed: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error.message);
        alert("An error occurred while logging in.");
    }
};

// register fetch

const register = async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("r-name").value;
    const email = document.getElementById("r-email").value;
    const phone = document.getElementById("r-phone").value;
    const password = document.getElementById("r-password").value;

    try {
        const response = await fetch("http://localhost/sewa_app/register.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email, phone, password }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        if (result.status === "success") {
            alert("signup successful, please login!");
            // تنفيذ إجراء بعد تسجيل الدخول بنجاح
        } else {
            alert("signup failed: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error.message);
        alert("An error occurred while sign up.");
    }
};


