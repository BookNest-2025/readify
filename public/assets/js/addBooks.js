checkAdmin();
const bookPoster = document.getElementById("bookPoster");
const preview = document.getElementById("preview");

connectBackEnd({
  backendUrl: "../backend/books_add.php",
  formId: "addBookForm",
  callback: (data) => {
    if (data.success) addAlert(data.message, false);
    if (data.error) addAlert(data.error);
    if (data.redirect) redirect(data.redirect);
  },
});

bookPoster.addEventListener("change", () => {
  const file = bookPoster.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});
