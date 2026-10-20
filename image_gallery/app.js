// Select HTML elements
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const imageCaption = document.getElementById("imageCaption");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Store currently visible gallery items
let visibleItems = [];
let currentIndex = 0;


// Update visible images based on the selected category
function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(item => {
        return !item.classList.contains("hide");
    });
}


// Filter Gallery
filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove("active"));

        // Activate clicked button
        button.classList.add("active");

        const category = button.dataset.category;

        galleryItems.forEach(item => {

            if (
                category === "all" ||
                item.dataset.category === category
            ) {
                item.classList.remove("hide");
            } else {
                item.classList.add("hide");
            }

        });

        updateVisibleItems();
    });
});


// Open Lightbox
function openLightbox(index) {
    updateVisibleItems();

    if (visibleItems.length === 0) {
        return;
    }

    currentIndex = index;

    showImage();

    lightbox.classList.add("show");
}


// Display Selected Image
function showImage() {
    const selectedItem = visibleItems[currentIndex];

    if (!selectedItem) {
        return;
    }

    const image = selectedItem.querySelector("img");
    const title = selectedItem.querySelector("h3").textContent;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    imageCaption.textContent = title;
}


// Add click event to each gallery image
galleryItems.forEach(item => {

    item.addEventListener("click", () => {

        updateVisibleItems();

        const index = visibleItems.indexOf(item);

        if (index !== -1) {
            openLightbox(index);
        }

    });

});


// Next Image
nextBtn.addEventListener("click", () => {

    if (visibleItems.length === 0) {
        return;
    }

    currentIndex = (currentIndex + 1) % visibleItems.length;

    showImage();

});


// Previous Image
prevBtn.addEventListener("click", () => {

    if (visibleItems.length === 0) {
        return;
    }

    currentIndex =
        (currentIndex - 1 + visibleItems.length) % visibleItems.length;

    showImage();

});


// Close Lightbox
function closeLightbox() {
    lightbox.classList.remove("show");
}

closeBtn.addEventListener("click", closeLightbox);


// Close when clicking outside the image
lightbox.addEventListener("click", event => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


// Keyboard Controls
document.addEventListener("keydown", event => {

    if (!lightbox.classList.contains("show")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        nextBtn.click();
    }

    if (event.key === "ArrowLeft") {
        prevBtn.click();
    }

});


// Initialize gallery
updateVisibleItems();