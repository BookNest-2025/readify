document.addEventListener("DOMContentLoaded", () => {
  const bookInput = document.getElementById("search-bookname");
  const authorInput = document.getElementById("search-author");
  const resultsContainer = document.querySelector(".book-grid");
  const sortSelect = document.getElementById("sort-select");
  const categoryCheckboxes = document.querySelectorAll(
    ".category-filter input[type='checkbox']"
  );

  // Helper: get URL params
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      type: params.get("type") || "",
      book: params.get("book") || "",
      author: params.get("author") || "",
      categories: params.getAll("categories[]") || [],
      sort: params.get("sort") || "",
    };
  }

  function getSelectedCategories() {
    return Array.from(categoryCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
  }

  function renderBooks(books) {
    resultsContainer.innerHTML = "";
    if (!books || books.length === 0) {
      resultsContainer.innerHTML = `<p style="text-align:center;color:#6b6b6b">No books found.</p>`;
      return;
    }
    books.forEach((b) => {
      const imgPath = `./uploads/${b.image}`;
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <a href="book.html?id=${encodeURIComponent(
          b.book_id
        )}" style="text-decoration:none;color:inherit;">
          <img src="${imgPath}" alt="${
        b.title
      }" onerror="this.onerror=null;this.src='./assets/images/book_images/placeholder.jpg'"/>
          <div style="padding:12px;">
            <h4>${b.title}</h4>
            <p class="author">${b.authors || ""}</p>
            <p class="price">${Number(b.price).toFixed(0)} LKR</p>
            <p style="font-size:13px;color:#666;margin-top:8px;line-height:1.2;max-height:3.6em;overflow:hidden">${
              b.description || ""
            }</p>
          </div>
        </a>
        <div class="buttons">
          <button class="btn" onclick="addToCart(${Number(
            b.book_id
          )})">Add to Cart</button>
        </div>
      `;
      resultsContainer.appendChild(card);
    });
  }

  function searchBooks(initialParams = null) {
    const book = initialParams?.book || bookInput.value.trim();
    const author = initialParams?.author || authorInput.value.trim();
    const sort = initialParams?.sort || sortSelect.value;
    const categories = initialParams?.categories.length
      ? initialParams.categories
      : getSelectedCategories();

    const params = new URLSearchParams();
    if (book) params.append("book", book);
    if (author) params.append("author", author);
    if (sort) params.append("sort", sort);
    categories.forEach((c) => params.append("categories[]", c));
    if (initialParams?.type) params.append("type", initialParams.type);

    resultsContainer.innerHTML = `<p style="text-align:center;color:#6b6b6b">Searching…</p>`;

    connectBackEnd({
      backendUrl: `../backend/books_search.php?${params.toString()}`,
      callback: (data) => {
        if (data.success) renderBooks(data.data);
        else
          resultsContainer.innerHTML = `<p style="text-align:center;color:#6b6b6b">${
            data.error || "No results"
          }</p>`;
      },
    });
  }

  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const debouncedSearch = debounce(() => searchBooks(), 500);

  // Event listeners
  [bookInput, authorInput].forEach((el) =>
    el?.addEventListener("input", debouncedSearch)
  );
  sortSelect?.addEventListener("change", debouncedSearch);
  categoryCheckboxes.forEach((cb) =>
    cb.addEventListener("change", debouncedSearch)
  );

  // ---------- Initial load ----------
  const urlParams = getUrlParams();
  searchBooks(urlParams);
});
