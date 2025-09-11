const fileInput = document.getElementById("profile-image");
      const preview = document.getElementById("preview");

      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          preview.src = URL.createObjectURL(file);
        }
      });