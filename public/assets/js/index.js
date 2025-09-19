// Carousel functionality
const slider = document.getElementById("slider");
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

let index = 0;

function nextSlide() {
  index++;
  slider.style.transition = "transform 0.8s ease-in-out";
  slider.style.transform = `translateX(-${index * 100}%)`;

  if (index === totalSlides - 1) {
    setTimeout(() => {
      slider.style.transition = "none";
      slider.style.transform = "translateX(0)";
      index = 0;
    }, 800);
  }
}

setInterval(nextSlide, 9000);

const fetchLeatestBooks = () => {
  connectBackEnd({
    backendUrl: "../backend/books_get.php?param=new-arrived",
    callback: (data) => {
      if (data.success) {
        showBookCards(data.books, "new-arrivals");
      }
      if (data.error) console.log(data.error);
    },
  });
};

const fetchPopulerBooks = () => {
  connectBackEnd({
    backendUrl: "../backend/books_get.php?param=populer",
    callback: (data) => {
      if (data.success) {
        showBookCards(data.books, "populer-books");
      }
      if (data.error) console.log(data.error);
    },
  });
};

fetchLeatestBooks();
fetchPopulerBooks();

const fetchReviews = () => {
  connectBackEnd({
    backendUrl: "../backend/reviews_platform_get.php?limit=3&order_by=rating",
    callback: (data) => {
      if (data.success) {
        showReviews(data.data, ".review-slider");
      }
    },
  });
};

showReviews = (reviews, container) => {
  if (reviews.length === 0) {
    return;
  }
  let html = "";

  reviews.forEach((review) => {
    let stars = "";
    for (let i = 0; i < review.rating; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    html += `
        <div class="box">
          <img
            src="./uploads/${review.photo}" />
          <p>
            "${review.review}"
          </p>
          <h3>${review.name}</h3>
          <div class="stars">
            ${stars}
          </div>
        </div>
    `;
  });

  document.querySelector(container).innerHTML = html;
};

fetchReviews();
