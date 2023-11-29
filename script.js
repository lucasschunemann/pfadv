function scrollToElement(elementSelector, instance = 0) {
    // Select all elements that match the given selector
    const elements = document.querySelectorAll(elementSelector);
    // Check if there are elements matching the selector and if the requested instance exists
    if (elements.length > instance) {
        // Scroll to the specified instance of the element
        elements[instance].scrollIntoView({ behavior: 'smooth' });
    }
}

window.addEventListener("scroll", function(){
    let headermotion = document.querySelector('#headermotion')
    headermotion.classList.toggle('rolagem', window.scrollY > 0)
})

const link1 = document.getElementById("link1");
const link2 = document.getElementById("link2");
const link3 = document.getElementById("link3");

link1.addEventListener('click', () => {
    scrollToElement('.header');
});

link2.addEventListener('click', () => {
    // Scroll to the second element with "header" class
    scrollToElement('.header', 1);
});

link3.addEventListener('click', () => {
    scrollToElement('.header', 2);
});

document.addEventListener('DOMContentLoaded', function () {
    const faqButtons = document.querySelectorAll('.faq .btn');

    faqButtons.forEach(button => {
        button.addEventListener('click', function () {
            const content = this.parentElement.querySelector('.content');
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
});