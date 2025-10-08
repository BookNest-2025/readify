document.addEventListener("DOMContentLoaded", () => {
  const bookInput = document.getElementById("search-bookname");
  const authorInput = document.getElementById("search-author");
  const resultsContainer = document.querySelector(".book-container");
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
    showBookCards(books, "results-container");
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

  //uses to see changes after user stops typing for 500ms
  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const debouncedSearch = debounce(() => searchBooks(), 500);

  [bookInput, authorInput].forEach((el) =>
    el?.addEventListener("input", debouncedSearch)
  );
  sortSelect?.addEventListener("change", debouncedSearch);
  categoryCheckboxes.forEach((cb) =>
    cb.addEventListener("change", debouncedSearch)
  );

  const urlParams = getUrlParams();
  searchBooks(urlParams);
});
