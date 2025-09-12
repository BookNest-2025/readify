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

// NEW: Function to load books via AJAX
function loadBooks(containerId, type = 'new') {
  // Show loading state
  const container = document.getElementById(containerId);
  container.innerHTML = '<div class="loading">Loading books...</div>';
  
  console.log(`Loading ${type} books...`);
  
  // Create AJAX request - Updated path to match your folder structure
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `../../backend/get_books.php?type=${type}`, true);
  
  xhr.onload = function() {
    console.log(`Response received for ${type} books:`, this.status, this.responseText);
    
    if (this.status === 200) {
      try {
        const response = JSON.parse(this.responseText);
        
        if (response.success && response.books) {
          console.log(`Displaying ${response.books.length} ${type} books`);
          displayBooks(containerId, response.books);
        } else {
          console.error('Error from server:', response.message);
          showError(containerId, response.message || 'Failed to load books');
        }
      } catch (e) {
        console.error('Error parsing response:', e);
        showError(containerId, 'Error parsing response: ' + e.message);
      }
    } else {
      console.error('Request failed with status:', this.status);
      showError(containerId, 'Request failed with status: ' + this.status);
    }
  };
  
  xhr.onerror = function() {
    console.error('Request failed completely');
    showError(containerId, 'Request failed. Check console for details.');
  };
  
  xhr.send();
}

// Display books in the container
function displayBooks(containerId, books) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  if (books.length === 0) {
    container.innerHTML = '<div class="no-books">No books available in this category</div>';
    return;
  }
  
  books.forEach(book => {
    const bookCard = document.createElement('a');
    bookCard.href = '#'; // You can update this to link to book details page
    
    // Use the image path directly from the database (already corrected in PHP)
    let imagePath = book.image;
    
    bookCard.innerHTML = `
      <div class="book-card">
        <img src="${imagePath}" alt="${book.title}" onerror="this.src='assets/images/book_images/default.jpg'" />
        <h4><span>${book.title}</span></h4>
        <p><span class="author">${book.authors || 'Unknown Author'}</span></p>
        <p><span class="price">$${book.price}</span></p>
        <div class="buttons">
          <button class="btn">Add to Cart</button>
        </div>
      </div>
    `;
    
    container.appendChild(bookCard);
  });
}

// Show error message
function showError(containerId, message) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <p>Please try again later.</p>
    </div>
  `;
}

// Load books when page is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, fetching books...');
  loadBooks('book-container-new', 'new');
  loadBooks('book-container-featured', 'featured');
});