// Bro its 3:11 in the morning and I'm not even sure if I'm doing this right
window.addEventListener("scroll", function () {
    if (window.scrollY == 0) {
        // make the transition smooth

        document.querySelector(".headContainer").classList.remove("scrolled");
    } else {
        document.querySelector(".headContainer").classList.add("scrolled");
    }
});