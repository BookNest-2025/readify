const fileInput = document.getElementById("profile-image");
const preview = document.getElementById("preview");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
  }
});

const profileImage = document.getElementById("profile-image");
const name = document.getElementById("name");
const phone = document.getElementById("phone");
const address = document.getElementById("address");

const fetchUserData = () => {
  connectBackEnd({
    backendUrl: "../backend/user_get.php",
    callback: (data) => {
      if (data.success) {
        name.value = data.data.name;
        phone.value = data.data.telno;
        address.value = data.data.address;
        if (data.data.photo) {
          preview.src = `./uploads/${data.data.photo}`;
        }
      }
      if (data.error) addAlert(data.error);
      if (data.redirect) redirect(data.redirect);
    },
  });
};

fetchUserData();

connectBackEnd({
  backendUrl: "../backend/user_update.php",
  formId: "edit-profile-form",
  callback: (data) => {
    if (data.success) addAlert(data.message, false);
    if (data.error) addAlert(data.error);
    if (data.redirect) redirect(data.redirect);
  },
});
