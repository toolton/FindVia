// FindVia App Foundation

document.addEventListener("DOMContentLoaded", function () {
  console.log("FindVia app loaded successfully.");

  const languageButtons = document.querySelectorAll(
    ".language-switcher button"
  );

  languageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedLanguage = button.textContent.trim();

      if (selectedLanguage === "हिन्दी") {
        alert("हिन्दी भाषा जल्द उपलब्ध होगी।");
      } else {
        alert("English language selected.");
      }
    });
  });
});
