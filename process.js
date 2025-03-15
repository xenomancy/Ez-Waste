document.addEventListener("scroll", function() {
    let steps = document.querySelectorAll(".step");
    let screenPosition = window.innerHeight / 1.2;

    steps.forEach((step) => {
        let position = step.getBoundingClientRect().top;
        if (position < screenPosition) {
            step.style.opacity = "1";
            step.style.transform = "translateY(0)";
        }
    });
});
