document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const searchResults = document.getElementById("searchResults");
  const editSection = document.getElementById("editSection");
  const editBookForm = document.getElementById("editBookForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const messageDiv = document.getElementById("message");

  // Search for books
  searchBtn.addEventListener("click", searchBooks);
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") searchBooks();
  });

  // Cancel editing
  cancelBtn.addEventListener("click", function () {
    editSection.style.display = "none";
    searchResults.innerHTML = "";
    searchInput.value = "";
    messageDiv.className = "";
    messageDiv.style.display = "none";
  });

  // Submit form to update book
  editBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    updateBook();
  });

  function searchBooks() {
    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
      alert("Please enter a book title to search");
      return;
    }

    searchResults.innerHTML = '<div class="book-result">Searching...</div>';

    const formData = new FormData();
    formData.append("search", searchTerm);

    fetch("../backend/books_get_admin.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          displaySearchResults(data.data);
        } else {
          searchResults.innerHTML = `<div class="book-result">${data.message}</div>`;
        }
      })
      .catch((error) => {
        searchResults.innerHTML =
          '<div class="book-result">Error searching books</div>';
        console.error("Error:", error);
      });
  }

  function displaySearchResults(books) {
    if (books.length === 0) {
      searchResults.innerHTML = '<div class="book-result">No books found</div>';
      return;
    }

    let html = "";
    books.forEach((book) => {
      html += `
                <div class="book-result" data-id="${book.book_id}">
                    <strong>${book.title}</strong> by ${book.authors.join(
        ", "
      )}<br>
                    Price: $${book.price} | Stock: ${book.stock} | Sold: ${
        book.sold
      }
                </div>
            `;
    });

    searchResults.innerHTML = html;

    // Add click event to each result
    document.querySelectorAll(".book-result").forEach((item) => {
      item.addEventListener("click", function () {
        const bookId = this.getAttribute("data-id");
        loadBookData(bookId);
      });
    });
  }

  function loadBookData(bookId) {
    const formData = new FormData();
    formData.append("book_id", bookId);

    fetch("../backend/books_get_admin.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success && data.data.length > 0) {
          const book = data.data[0];
          populateForm(book);
          editSection.style.display = "block";
          editSection.scrollIntoView({ behavior: "smooth" });
        } else {
          alert("Error loading book data");
        }
      })
      .catch((error) => {
        alert("Error loading book data");
        console.error("Error:", error);
      });
  }

  function populateForm(book) {
    document.getElementById("bookId").value = book.book_id;
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.authors.join(", ");
    document.getElementById("price").value = book.price;
    document.getElementById("stock").value = book.stock;
    document.getElementById("category").value = book.category;
    document.getElementById("description").value = book.description;
  }

  function updateBook() {
    const formData = new FormData(editBookForm);
    const updateBtn = document.getElementById("updateBtn");

    updateBtn.disabled = true;
    updateBtn.textContent = "Updating...";

    fetch("../backend/books_update.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        updateBtn.disabled = false;
        updateBtn.textContent = "Update Book";

        if (data.success) {
          showMessage(data.message, "success");
          // Refresh the search results
          if (data.redirect) {
            redirect(data.redirect);
          }
        } else {
          showMessage(data.message, "error");
        }
      })
      .catch((error) => {
        updateBtn.disabled = false;
        updateBtn.textContent = "Update Book";
        showMessage("Error updating book", "error");
        console.error("Error:", error);
      });
  }

  function showMessage(message, type) {
    if (type === "success") {
      addAlert(message, false);
    } else {
      addAlert(message, true);
    }
  }
});
