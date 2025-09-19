const loginPrompt = document.getElementById("loginPrompt");
const noReviews = document.getElementById("noReviews");
const stars = document.querySelectorAll(".star-rating .star");
const reviewRating = document.getElementById("reviewRating");

let isLoggedIn = false;

// Check if user is logged in
const checkLoginStatus = () => {
  connectBackEnd({
    backendUrl: "../backend/auth_check_login.php",
    callback: (data) => {
      if (data.isLoggedIn) loginPrompt.style.display = "none";
    },
  });
};
checkLoginStatus();

function displayReviews(reviews) {
  if (reviews.length === 0) {
    noReviews.style.display = "block";
    reviewsContainer.innerHTML = "";
    return;
  }

  noReviews.style.display = "none";

  let html = "";
  reviews.forEach((review) => {
    const reviewDate = new Date(review.date).toLocaleDateString();
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += i <= review.rating ? "★" : "☆";
    }

    html += `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="reviewer-name">${review.name}</span>
                                <span class="profilepic"><img src="./uploads/${review.photo}" alt="${review.name}"></span>
                                <span class="review-date">${reviewDate}</span>
                            </div>
                            <div class="review-rating">${stars}</div>
                            <p class="review-content">${review.review}</p>
                        </div>
                    `;
  });

  reviewsContainer.innerHTML = html;
}

const fetchReviews = () => {
  connectBackEnd({
    backendUrl: "../backend/reviews_platform_get.php",
    callback: (data) => {
      if (data.success) {
        displayReviews(data.data);
      }
    },
  });
};

fetchReviews();

const starHighlighting = () => {
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = Number(star.dataset.value);

      reviewRating.value = value;

      stars.forEach((s) => {
        Number(s.dataset.value) <= value
          ? s.classList.add("active")
          : s.classList.remove("active");
      });
    });

    star.addEventListener("mouseover", () => {
      const hoverValue = Number(star.dataset.value);
      stars.forEach((s) => {
        Number(s.dataset.value) <= hoverValue
          ? s.classList.add("active")
          : s.classList.remove("active");
      });
    });

    star.addEventListener("mouseout", () => {
      const currentValue = Number(reviewRating.value || 0);
      stars.forEach((s) => {
        Number(s.dataset.value) <= currentValue
          ? s.classList.add("active")
          : s.classList.remove("active");
      });
    });
  });
};

starHighlighting();

connectBackEnd({
  backendUrl: "../backend/reviews_platform_submit.php",
  formId: "reviewForm",
  callback: (data) => {
    if (data.success) {
      if (data.message) addAlert(data.message, false);
      document.getElementById("reviewForm").reset();
      reviewRating.value = 0;
      stars.forEach((s) => s.classList.remove("active"));
      fetchReviews();
    }
    if (data.error) {
      addAlert(data.error);
    }
  },
});
