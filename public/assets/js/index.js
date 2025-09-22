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
        showBookCards(data.books, "featured-books");
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
