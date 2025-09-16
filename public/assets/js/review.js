document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const bookSearch = document.getElementById("bookSearch");
    const searchBtn = document.getElementById("searchBtn");
    const bookResults = document.getElementById("bookResults");
    const selectedBookSection = document.getElementById("selectedBookSection");
    const selectedBookTitle = document.getElementById("selectedBookTitle");
    const selectedBookAuthor = document.getElementById("selectedBookAuthor");
    const averageRating = document.getElementById("averageRating");
    const reviewCount = document.getElementById("reviewCount");
    const writeReviewBtn = document.getElementById("writeReviewBtn");
    const reviewFormContainer = document.getElementById("reviewFormContainer");
    const loginPrompt = document.getElementById("loginPrompt");
    const reviewForm = document.getElementById("reviewForm");
    const cancelReview = document.getElementById("cancelReview");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const reviewsContainer = document.getElementById("reviewsContainer");
    const noReviews = document.getElementById("noReviews");
    const sortReviews = document.getElementById("sortReviews");
    const stars = document.querySelectorAll(".star");
    const reviewRating = document.getElementById("reviewRating");
    
    let currentBookId = null;
    let isLoggedIn = false;
    let sortNewest = true;
    
    // Check if user is logged in (this would typically come from your authentication system)
    checkLoginStatus();
    
    // Event Listeners
    searchBtn.addEventListener("click", searchBooks);
    bookSearch.addEventListener("keypress", function(e) {
        if (e.key === "Enter") searchBooks();
    });
    
    writeReviewBtn.addEventListener("click", function() {
        if (isLoggedIn) {
            reviewFormContainer.style.display = "block";
        } else {
            loginPrompt.style.display = "block";
        }
    });
    
    cancelReview.addEventListener("click", function() {
        reviewFormContainer.style.display = "none";
        reviewForm.reset();
        resetStars();
    });
    
    loginBtn.addEventListener("click", function() {
        // Redirect to login page
        window.location.href = "login.html";
    });
    
    registerBtn.addEventListener("click", function() {
        // Redirect to register page
        window.location.href = "register.html";
    });
    
    reviewForm.addEventListener("submit", submitReview);
    
    sortReviews.addEventListener("click", function() {
        sortNewest = !sortNewest;
        sortReviews.textContent = sortNewest ? "Sort by: Latest" : "Sort by: Oldest";
        if (currentBookId) {
            loadReviews(currentBookId);
        }
    });
    
    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener("click", function() {
            const value = parseInt(this.getAttribute("data-value"));
            setRating(value);
        });
        
        star.addEventListener("mouseover", function() {
            const value = parseInt(this.getAttribute("data-value"));
            highlightStars(value);
        });
        
        star.addEventListener("mouseout", function() {
            const currentRating = parseInt(reviewRating.value) || 0;
            highlightStars(currentRating);
        });
    });
    
    // Functions
    function checkLoginStatus() {
        // This would typically check cookies, local storage, or make an API call
        // For demo purposes, we'll set it to false
        isLoggedIn = false;
    }
    
    function searchBooks() {
        const searchTerm = bookSearch.value.trim();
        
        if (searchTerm === "") {
            alert("Please enter a book title to search");
            return;
        }
        
        bookResults.innerHTML = '<div class="book-item">Searching...</div>';
        
        const formData = new FormData();
        formData.append("search", searchTerm);
        
        fetch("../backend/getBooks.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayBookResults(data.data);
            } else {
                bookResults.innerHTML = `<div class="book-item">${data.message}</div>`;
            }
        })
        .catch(error => {
            bookResults.innerHTML = '<div class="book-item">Error searching books</div>';
            console.error("Error:", error);
        });
    }
    
    function displayBookResults(books) {
        if (books.length === 0) {
            bookResults.innerHTML = '<div class="book-item">No books found</div>';
            return;
        }
        
        let html = "";
        books.forEach(book => {
            html += `
                <div class="book-item" data-id="${book.book_id}">
                    <h3>${book.title}</h3>
                    <p>by ${book.authors.join(", ")}</p>
                </div>
            `;
        });
        
        bookResults.innerHTML = html;
        
        // Add click event to each book result
        document.querySelectorAll(".book-item").forEach(item => {
            item.addEventListener("click", function() {
                const bookId = this.getAttribute("data-id");
                selectBook(bookId, books);
            });
        });
    }
    
    function selectBook(bookId, books) {
        const book = books.find(b => b.book_id == bookId);
        if (!book) return;
        
        currentBookId = bookId;
        selectedBookTitle.textContent = book.title;
        selectedBookAuthor.textContent = book.authors.join(", ");
        selectedBookSection.style.display = "block";
        
        // Load reviews for this book
        loadReviews(bookId);
        
        // Scroll to the selected book section
        selectedBookSection.scrollIntoView({ behavior: "smooth" });
    }
    
    function loadReviews(bookId) {
        const formData = new FormData();
        formData.append("book_id", bookId);
        
        fetch("../backend/getReviews.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayReviews(data.reviews);
                updateReviewStats(data.stats);
            } else {
                reviewsContainer.innerHTML = `<div class="review-item">${data.message}</div>`;
                noReviews.style.display = "block";
            }
        })
        .catch(error => {
            reviewsContainer.innerHTML = '<div class="review-item">Error loading reviews</div>';
            console.error("Error:", error);
        });
    }
    
    function displayReviews(reviews) {
        if (reviews.length === 0) {
            noReviews.style.display = "block";
            reviewsContainer.innerHTML = "";
            return;
        }
        
        noReviews.style.display = "none";
        
        // Sort reviews
        if (sortNewest) {
            reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else {
            reviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        
        let html = "";
        reviews.forEach(review => {
            const reviewDate = new Date(review.created_at).toLocaleDateString();
            let stars = "";
            for (let i = 1; i <= 5; i++) {
                stars += i <= review.rating ? "★" : "☆";
            }
            
            html += `
                <div class="review-item">
                    <div class="review-header">
                        <span class="reviewer-name">${review.user_name}</span>
                        <span class="review-date">${reviewDate}</span>
                    </div>
                    <div class="review-rating">${stars}</div>
                    <h4 class="review-title">${review.title}</h4>
                    <p class="review-content">${review.content}</p>
                </div>
            `;
        });
        
        reviewsContainer.innerHTML = html;
    }
    
    function updateReviewStats(stats) {
        averageRating.textContent = stats.average_rating || "0";
        reviewCount.textContent = stats.total_reviews || "0";
    }
    
    function submitReview(e) {
        e.preventDefault();
        
        if (!currentBookId) {
            alert("Please select a book first");
            return;
        }
        
        const formData = new FormData(reviewForm);
        formData.append("book_id", currentBookId);
        
        fetch("../backend/submitReview.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Review submitted successfully!");
                reviewForm.reset();
                resetStars();
                reviewFormContainer.style.display = "none";
                loadReviews(currentBookId);
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => {
            alert("Error submitting review");
            console.error("Error:", error);
        });
    }
    
    function setRating(value) {
        reviewRating.value = value;
        highlightStars(value);
    }
    
    function highlightStars(value) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute("data-value"));
            if (starValue <= value) {
                star.classList.add("active");
                star.textContent = "★";
            } else {
                star.classList.remove("active");
                star.textContent = "☆";
            }
        });
    }
    
    function resetStars() {
        reviewRating.value = "";
        stars.forEach(star => {
            star.classList.remove("active");
            star.textContent = "☆";
        });
    }
});