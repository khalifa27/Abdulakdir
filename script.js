// Minimal JS for enhanced interactions if needed
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.classList.add('hovering');
        });

        link.addEventListener('mouseleave', () => {
            link.classList.remove('hovering');
        });
    });
});
