document.addEventListener("DOMContentLoaded", function () {
        const slides = document.querySelectorAll(".slide");
        const dots = document.querySelectorAll(".slider-dot");
        const prevBtn = document.querySelector(".prev-btn");
        const nextBtn = document.querySelector(".next-btn");
        let currentSlide = 0;
        let slideInterval;

        // Function to show a specific slide
        function showSlide(n) {
          slides.forEach((slide) => slide.classList.remove("active"));
          dots.forEach((dot) => dot.classList.remove("active"));

          currentSlide = (n + slides.length) % slides.length;

          slides[currentSlide].classList.add("active");
          dots[currentSlide].classList.add("active");
        }

        // Next slide function
        function nextSlide() {
          showSlide(currentSlide + 1);
        }

        // Previous slide function
        function prevSlide() {
          showSlide(currentSlide - 1);
        }

        // Start autoplay
        function startSlideShow() {
          slideInterval = setInterval(nextSlide, 5000);
        }

        // Stop autoplay
        function stopSlideShow() {
          clearInterval(slideInterval);
        }

        // Event listeners
        nextBtn.addEventListener("click", () => {
          nextSlide();
          stopSlideShow();
          startSlideShow();
        });

        prevBtn.addEventListener("click", () => {
          prevSlide();
          stopSlideShow();
          startSlideShow();
        });

        dots.forEach((dot, index) => {
          dot.addEventListener("click", () => {
            showSlide(index);
            stopSlideShow();
            startSlideShow();
          });
        });

        // Pause autoplay when hovering over slider
        const slider = document.querySelector(".hero-slider");
        slider.addEventListener("mouseenter", stopSlideShow);
        slider.addEventListener("mouseleave", startSlideShow);

        // Start the slideshow
        startSlideShow();
      });