const isLogin = window.sessionStorage.getItem("isLogin");
const login_btn = document.getElementById("login-ptn");
const logout_btn = document.getElementById("logout");
const profile_nav = document.getElementById("profile-nav");
const edit_profile = document.getElementById("edit-profile");
const color_section = document.getElementById("color");
const close_profile = document.getElementById("close");
const close_register = document.querySelector(".modal-content .close");
const register_form = document.getElementById("registrationForm");
const profile_icon = document.getElementById("profile-icon");
const course_paragraph = document.querySelector(".courses-p");
const profile_btn = document.getElementById("profileItem");
const color_btn = document.getElementById("colorItem");


// log out
logout.onclick = () => {
  window.sessionStorage.clear();
  profile_nav.classList.remove("active");
  edit_profile.classList.remove("active");
  color_section.classList.remove("active");
  location.reload();
};

// close profile icon (X)
close_profile.onclick = () => {
  profile_nav.classList.remove("active");
  edit_profile.classList.remove("active");
  color_section.classList.remove("active");
};

// close register form icon (x)
close_register.onclick = () => {
  register_form.style.display = "none";
};

if (isLogin) {
  login_btn.style.display = "none";
  profile_icon.style.display = "inline-block";
  course_paragraph.style.display = "none";
} else {
  profile_icon.style.display = "none";
  login_btn.style.display = "inline-block";
  course_paragraph.style.display = "flex";
}

if (profile_icon.style.display === "inline-block") {
  profile_icon.onclick = () => {
    profile_nav.classList.toggle("active");
    edit_profile.classList.remove("active");
    color_section.classList.remove("active");
  };
}

profile_btn.onclick = () => {
  edit_profile.classList.toggle("active");
};

color_btn.onclick = () => {
  color_section.classList.toggle("active");
};

let profileItem = document.querySelectorAll(".item-tap");
profileItem.onclick = (e) => {
  profileItem.classList.remove("active");
  e.toggle.classList.add("active");
};

if (isLogin) {
  const root = document.documentElement;
  let inputColor = document.getElementById("color");
  const defaultColorBtn = document.getElementById("defaultColor");

  let mainColor = window.localStorage.getItem("main-color") || "#13cad5";
  root.style.setProperty("--main-color", mainColor);
  inputColor.value = mainColor;

  inputColor.onchange = (e) => {
    const newColor = e.target.value;
    window.localStorage.setItem("main-color", newColor);
    root.style.setProperty("--main-color", newColor);
    console.log(newColor);
  };

  defaultColorBtn.onclick = () => {
    window.localStorage.removeItem("main-color");
    root.style.setProperty("--main-color", "#13cad5");
  };
}

// Get Available Courses
const getCourseData = async () => {
  let cards = document.querySelector(".cards");
  cards.innerHTML = ""; 

  if (isLogin) {
    try {
      let response = await fetch("http://localhost/sewa_app/courses.php", {
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      let data = await response.json();

      if (data.status !== "success") {
        throw new Error("Invalid response from server");
      }

      let result = data.courses;

      result.forEach((course) => {
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="cardinner">
            <div class="cardfront">
              <img src="./image/images.jpeg" alt="" width="350">
              <div class="text">
                <p class="hidden">${course.course_id}</p>
                <h2>${course.course_name}</h2>
                <p><strong>Duration:</strong> ${course.duration}</p>
                <p><strong>Fees:</strong> $${course.fees}</p>
                <p><strong>Student:</strong> ${course.current_students}/${
          course.max_students
        }</p>
              </div>
            </div>
            <div class="cardback">
              <p>${course.description}</p>
              <button class="button registerbtn" href="#registrationForm"
                ${
                  course.current_students >= course.max_students
                    ? "disabled"
                    : ""
                }>
                ${
                  course.current_students >= course.max_students
                    ? "Full"
                    : "Register"
                }
              </button>
            </div>
          </div>`;

        cards.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      cards.innerHTML =
        "<p style='color: red;'>Failed to load courses. Please try again later.</p>";
    }
  }
};
getCourseData();

// registeration form
document.addEventListener("click", async (e) => {
  // e.preventDefault()
  if (e.target.classList.contains("registerbtn")) {
    const courseCard = e.target.closest(".card");
    const courseId = courseCard.querySelector(".text p").textContent;
    const courseName = courseCard.querySelector(".text h2").textContent;
    const token = window.sessionStorage.getItem("user_token");

    if (!token) {
      alert("User not logged in.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/sewa_app/get_user_data.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        console.log("User Data:", result.data);

        const modal = document.getElementById("registrationForm");
        document.getElementById("courseId").value = courseId;
        document.getElementById("courseName").value = courseName;
        document.getElementById("userName").value = result.data.full_name;
        document.getElementById("userEmail").value = result.data.email;

        modal.style.display = "block";
      } else {
        console.log(result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to fetch user data.");
    }
  }
});

// register course
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("registerCourse")) {
    const token = window.sessionStorage.getItem("user_token");
    const course_id = document.querySelector(
      "#registrationForm #courseId"
    ).value;
    console.log(token);
    console.log(course_id);

    if (!token) {
      alert("User not logged in.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/sewa_app/register_course.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, course_id }),
        }
      );

      if (!response.ok) {
        return new Error(`esponse status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        console.log("registration successful: ", result.message);
        console.log("Registration Successful");
        alert("Registration Successful");

      } else {
        console.log(result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to register in course.");
    }
  }
});

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("registrationForm").style.display = "none";
});

// contact us form
const contactUs = async (e) => {
  e.preventDefault();

  const token = window.sessionStorage.getItem("user_token");
  const name = document.querySelector("#contactName").value;
  const email = document.querySelector("#contactEmail").value;
  const message = document.querySelector("#contactMessage").value;

  if (!token) {
    alert("user not logged in");
  }
  try {
    const response = await fetch("http://localhost/sewa_app/inquiry.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, name, email, message }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    if (result.status === "success") {
      alert("Inquiry submitted successfully");
    } else {
      alert("failed: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
    alert("An error occurred while send message.");
  }
};

//edit profile form
const editProfile = async (e) => {
  e.preventDefault();
  const token = window.sessionStorage.getItem("user_token");
  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const fullName = firstName + " " + lastName;
  const phone = document.getElementById("phone").value;

  if (!token) {
    alert("user not logged in");
  }

  try {
    const response = await fetch(
      "http://localhost/sewa_app/update_profile.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, fullName, phone }),
      }
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    if (result.status === "success") {
      alert("Update Profile Successfuly.");
    } else {
      alert("failed: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
    alert("An error occurred while Update Profile.");
  }
};
