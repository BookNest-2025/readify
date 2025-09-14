document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchResults = document.getElementById("searchResults");
    const bookDetails = document.getElementById("bookDetails");
    const activateBtn = document.getElementById("activateBtn");
    const deactivateBtn = document.getElementById("deactivateBtn");
    const messageDiv = document.getElementById("message");
    
    let currentBookId = null;
    let currentStatus = null;

    // Search for books
    searchBtn.addEventListener("click", searchBooks);
    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") searchBooks();
    });

    // Status change buttons
    activateBtn.addEventListener("click", function() {
        changeBookStatus(1);
    });
    
    deactivateBtn.addEventListener("click", function() {
        changeBookStatus(0);
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

        fetch("../backend/getBooks.php", {
            method: "POST",
            body: formData,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
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
            searchResults.innerHTML = '<div class="book-result">Error searching books</div>';
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
            const statusClass = book.status == 1 ? "active" : "inactive";
            const statusText = book.status == 1 ? "Active" : "Inactive";
            
            html += `
                <div class="book-result" data-id="${book.book_id}">
                    <strong>${book.title}</strong> by ${book.authors.join(", ")}<br>
                    <span class="status-badge ${statusClass}">${statusText}</span> | 
                    Price: Rs.${book.price} | Stock: ${book.stock}
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

        fetch("../backend/getBooks.php", {
            method: "POST",
            body: formData,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (data.success && data.data.length > 0) {
                const book = data.data[0];
                displayBookDetails(book);
                currentBookId = book.book_id;
                currentStatus = book.status;
                updateButtonStates();
                bookDetails.style.display = "block";
                bookDetails.scrollIntoView({ behavior: "smooth" });
            } else {
                alert("Error loading book data");
            }
        })
        .catch((error) => {
            alert("Error loading book data");
            console.error("Error:", error);
        });
    }

    function displayBookDetails(book) {
        document.getElementById("detailTitle").textContent = book.title;
        document.getElementById("detailAuthor").textContent = book.authors.join(", ");
        document.getElementById("detailPrice").textContent = `Rs.${book.price}`;
        document.getElementById("detailStock").textContent = book.stock;
        document.getElementById("detailSold").textContent = book.sold;
        document.getElementById("detailCategory").textContent = book.category;
        document.getElementById("detailDescription").textContent = book.description;
        
        const statusElement = document.getElementById("detailStatus");
        if (book.status == 1) {
            statusElement.textContent = "Active";
            statusElement.className = "status-badge active";
        } else {
            statusElement.textContent = "Inactive";
            statusElement.className = "status-badge inactive";
        }
    }

    function updateButtonStates() {
        if (currentStatus == 1) {
            activateBtn.disabled = true;
            deactivateBtn.disabled = false;
        } else {
            activateBtn.disabled = false;
            deactivateBtn.disabled = true;
        }
    }

    function changeBookStatus(newStatus) {
        if (!currentBookId) return;
        
        const formData = new FormData();
        formData.append("book_id", currentBookId);
        formData.append("status", newStatus);
        
        // Disable buttons during update
        activateBtn.disabled = true;
        deactivateBtn.disabled = true;
        
        messageDiv.className = "";
        messageDiv.style.display = "none";

        fetch("../backend/updateBookStatus.php", {
            method: "POST",
            body: formData,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                showMessage(data.message, "success");
                currentStatus = newStatus;
                updateButtonStates();
                
                // Update status display
                const statusElement = document.getElementById("detailStatus");
                if (newStatus == 1) {
                    statusElement.textContent = "Active";
                    statusElement.className = "status-badge active";
                } else {
                    statusElement.textContent = "Inactive";
                    statusElement.className = "status-badge inactive";
                }
                
                // Refresh the search results
                searchBooks();
            } else {
                showMessage(data.message, "error");
                updateButtonStates();
            }
        })
        .catch((error) => {
            showMessage("Error updating book status", "error");
            updateButtonStates();
            console.error("Error:", error);
        });
    }

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type;
        messageDiv.style.display = "block";
        messageDiv.scrollIntoView({ behavior: "smooth" });
    }
});