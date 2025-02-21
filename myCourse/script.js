const getMyCourseData = async () => {
  let result;
  let card;
  const token = window.sessionStorage.getItem("user_token");

  await fetch("http://localhost/sewa_app/my_course.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        result = data.data;
        result.forEach((course) => {
          card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
              <div class="cardinner">
                <div class="cardfront">
                  <img src="../src/image/images.jpeg" alt="" width="350">
                  <div class="text">
                    <p class="hidden course-id">${course.course_id}</p>
                    <h2>${course.course_name}</h2>
                    <p><strong>Duration:</strong> ${course.duration}</p>
                    <p><strong>Fees:</strong> $${course.fees}</p>
                  </div>
                </div>
                <div class="cardback">
                  <p>${course.description}</p>
                  <button class="button removebtn" data-course-id="${course.course_id}">
                    Remove
                  </button>
                </div>
              </div>`;

          let cards = document.querySelector(".course-container");
          cards.innerHTML = "";
          cards.appendChild(card);
        });

        document.querySelectorAll(".removebtn").forEach((button) => {
          button.addEventListener("click", async function () {
            const courseId = this.getAttribute("data-course-id");
            await removeCourse(courseId);
          });
        });
      }
    });
};

const removeCourse = async (courseId) => {
  const token = window.sessionStorage.getItem("user_token");

  try {
    const response = await fetch(
      "http://localhost/sewa_app/delete_course.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, courseId }),
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      window.location.reload();
      showNotification("Course removed successfully", "success");
      console.log("Course removed successfully");
    } else {
      showNotification("Failed to Remove Course, Try Again!", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showNotification("Failed to fetch Data, Try Again", "error");
  }
};

getMyCourseData();
