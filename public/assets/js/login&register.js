const passBtn = document.getElementById("passBtn");
const passIn = document.getElementById("passIn");

const passBtnC = document.getElementById("passBtnC");
const passInC = document.getElementById("passInC");

const toggleView = () => {
  if (passIn.getAttribute("type") === "password") {
    passIn.setAttribute("type", "text");
    passBtn.innerHTML = `<i class="bx bxs-eye"></i>`;
  } else {
    passIn.setAttribute("type", "password");
    passBtn.innerHTML = `<i class="bx bxs-eye-slash"></i>`;
  }
};

const toggleViewC = () => {
  if (passInC.getAttribute("type") === "password") {
    passInC.setAttribute("type", "text");
    passBtnC.innerHTML = `<i class="bx bxs-eye"></i>`;
  } else {
    passInC.setAttribute("type", "password");
    passBtnC.innerHTML = `<i class="bx bxs-eye-slash"></i>`;
  }
};

const advanceUser = document.getElementById("advance-user");
const advanceUsers = document.querySelector(".advance-users");

advanceUser?.addEventListener("click", () => {
  if (advanceUser.checked) {
    advanceUsers.style.maxHeight = advanceUsers.scrollHeight + 10 + "px";
  } else {
    advanceUsers.style.maxHeight = "0px";
  }
});
