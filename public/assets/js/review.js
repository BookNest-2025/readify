document.addEventListener("DOMContentLoaded", function () {
            const reviewForm = document.getElementById("reviewForm");
            const loginPrompt = document.getElementById("loginPrompt");
            const reviewsContainer = document.getElementById("reviewsContainer");
            const noReviews = document.getElementById("noReviews");
            const stars = document.querySelectorAll(".star");
            const reviewRating = document.getElementById("reviewRating");
            const submitBtn = document.getElementById("submitBtn");
            const messageDiv = document.getElementById("message");
            
            let isLoggedIn = false;
            let customerId = null;
            
            // Check if user is logged in
            checkLoginStatus();
            
            // Event listeners
            reviewForm.addEventListener("submit", submitReview);
            
            // Star rating functionality
            stars.forEach(star => {
                star.addEventListener("click", function() {
                    if (!isLoggedIn) {
                        showMessage("Please sign in to rate our platform.", "error");
                        return;
                    }
                    
                    const value = parseInt(this.getAttribute("data-value"));
                    setRating(value);
                });
            });
            
            // Functions
            function checkLoginStatus() {
                // Check if user is logged in by making a request to the server
                fetch("../backend/checkAuth.php")
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.logged_in) {
                        isLoggedIn = true;
                        customerId = data.customer_id;
                        loginPrompt.style.display = "none";
                    } else {
                        isLoggedIn = false;
                        customerId = null;
                        loginPrompt.style.display = "block";
                        reviewForm.querySelectorAll('input, textarea, button').forEach(el => {
                            el.disabled = true;
                        });
                    }
                    
                    // Load reviews
                    loadReviews();
                })
                .catch(error => {
                    console.error("Error checking auth status:", error);
                    isLoggedIn = false;
                    loginPrompt.style.display = "block";
                    reviewForm.querySelectorAll('input, textarea, button').forEach(el => {
                        el.disabled = true;
                    });
                    loadReviews();
                });
            }
            
            function loadReviews() {
                // Show loading state
                reviewsContainer.innerHTML = '<div class="review-item">Loading reviews...</div>';
                
                fetch("../backend/getPlatformReviews.php")
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        displayReviews(data.reviews);
                    } else {
                        reviewsContainer.innerHTML = `<div class="review-item">${data.message}</div>`;
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
                
                let html = "";
                reviews.forEach(review => {
                    const reviewDate = new Date(review.date).toLocaleDateString();
                    let stars = "";
                    for (let i = 1; i <= 5; i++) {
                        stars += i <= review.rating ? "★" : "☆";
                    }
                    
                    html += `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="reviewer-name">Customer #${review.customer_id}</span>
                                <span class="review-date">${reviewDate}</span>
                            </div>
                            <div class="review-rating">${stars}</div>
                            <p class="review-content">${review.review}</p>
                        </div>
                    `;
                });
                
                reviewsContainer.innerHTML = html;
            }
            
            function submitReview(e) {
                e.preventDefault();
                
                if (!isLoggedIn) {
                    showMessage("Please sign in to submit a review.", "error");
                    return;
                }
                
                if (!reviewRating.value) {
                    showMessage("Please select a rating.", "error");
                    return;
                }
                
                const formData = new FormData(reviewForm);
                formData.append("customer_id", customerId);
                
                submitBtn.disabled = true;
                submitBtn.textContent = "Submitting...";
                
                fetch("../backend/submitPlatformReview.php", {
                    method: "POST",
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Submit Review";
                    
                    if (data.success) {
                        showMessage("Thank you for your review!", "success");
                        reviewForm.reset();
                        resetStars();
                        loadReviews();
                    } else {
                        showMessage("Error: " + data.message, "error");
                    }
                })
                .catch(error => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Submit Review";
                    showMessage("Error submitting review", "error");
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
                    } else {
                        star.classList.remove("active");
                    }
                });
            }
            
            function resetStars() {
                reviewRating.value = "";
                stars.forEach(star => {
                    star.classList.remove("active");
                });
            }
            
            function showMessage(message, type) {
                messageDiv.textContent = message;
                messageDiv.className = `message ${type}`;
                setTimeout(() => {
                    messageDiv.className = "message";
                    messageDiv.textContent = "";
                }, 5000);
            }
        });