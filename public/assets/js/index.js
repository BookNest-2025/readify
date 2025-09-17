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
