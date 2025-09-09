const carousel = document.querySelector(".carousel");
const slider = document.querySelector(".carousel .slider");
const indicator = document.querySelector(".carousel .indicators");

const timeRunning = 600;
const autoNext = 8000;
let runTimeOut;
let runAutoNext = setTimeout(() => {
  showSlider("next");
}, autoNext);

const showSlider = (type) => {
  const sliderItems = document.querySelectorAll(".slider .item");
  const indicatorItems = document.querySelectorAll(".indicators .item");
  const contentItems = document.querySelectorAll(".slider .content");

  if (type === "next") {
    slider.appendChild(sliderItems[0]);
    slider;
    let positionLastItem = indicatorItems.length - 1;
    indicator.prepend(indicatorItems[positionLastItem]);
    carousel.classList.add("next");
  } else {
    let positionLastItem = sliderItems.length - 1;
    slider.prepend(sliderItems[positionLastItem]);
    indicator.appendChild(indicatorItems[0]);
    carousel.classList.add("prev");
  }

  clearTimeout(runTimeOut);
  runTimeOut = setTimeout(() => {
    carousel.classList.remove("next");
    carousel.classList.remove("prev");
  }, timeRunning);

  clearTimeout(runAutoNext);
  runAutoNext = setTimeout(() => {
    showSlider("next");
  }, autoNext);
};

carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

// Handle touch end
carousel.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  if (startX - endX > 50) {
    showSlider("next");
  } else if (endX - startX > 50) {
    showSlider("prev");
  }
}
