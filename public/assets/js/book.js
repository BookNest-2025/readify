const container = document.querySelector(".book-container");
const urlParams = new URLSearchParams(window.location.search);

const id = urlParams.get("id");

const fetchBook = () => {
  connectBackEnd({
    backendUrl: `../backend/fetchBooks.php?id=${id}`,
    callback: (data) => {
      if (data.success) {
        showBook(data.books);
      }
    },
  });
};

const showBook = ({
  book_id,
  title,
  price,
  stock,
  image,
  description,
  category,
  authors,
  sold,
}) =>
  (container.innerHTML = `
      <div class="main">
          <div class="book-image">
            <img
              src="./uploads/${image}"
              alt="Book Cover" />
          </div>
          <div class="book-details">
            <div class="book-title">
              <h1>${title}</h1>
              <h3>by ${authors.join(" & ")}</h3>
            </div>
            <div class="price-section">
              <span class="current-price">$12.29</span>
              <span class="original-price">${price} LKR</span>
              <span class="discount">50% OFF</span>
              <span class="sold">${sold} sold</span>
            </div>
            <div class="book-about">
              <h2>About this book</h2>
              <p>
                ${description}
              </p>
            </div>
            <div class="book-button">
              <button class="btn add-cart" onclick="addToCart(${book_id})">Add to Cart</button>
              <button class="btn buy-now" onclick="buyNow(${book_id})">Buy Now</button>
            </div>
          </div>
        </div>
        
      </div>
    `);

fetchBook();
