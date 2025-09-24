// script.js (updated)

// ------------------ Slider functionality ------------------
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".nav-btn.left");
const nextBtn = document.querySelector(".nav-btn.right");
let currentIndex = 0;
let autoSlide;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === index) slide.classList.add("active");
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
}

function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 5000); // 5s
}

const sliderEl = document.querySelector(".slider");
if (sliderEl) {
    sliderEl.addEventListener("mouseenter", () => clearInterval(autoSlide));
    sliderEl.addEventListener("mouseleave", startAutoSlide);
}

if (prevBtn) prevBtn.addEventListener("click", prevSlide);
if (nextBtn) nextBtn.addEventListener("click", nextSlide);

showSlide(currentIndex);
startAutoSlide();


// ------------------ Carousels (projects + services) with nav buttons and dots ------------------
(function() {
    const wrappers = document.querySelectorAll('.projects-wrapper');
    wrappers.forEach((wrapper) => {
        const carousel = wrapper.querySelector('.projects-carousel');
        const prev = wrapper.querySelector('.proj-nav-btn.left');
        const next = wrapper.querySelector('.proj-nav-btn.right');
        if (!carousel || !prev || !next) return;

        const dir = getComputedStyle(carousel).direction || document.documentElement.dir || 'ltr';
        const directionMultiplier = (dir === 'rtl') ? -1 : 1;
        const getAmount = () => Math.floor(carousel.clientWidth * 0.9);

        prev.addEventListener('click', () => {
            carousel.scrollBy({ left: -directionMultiplier * getAmount(), behavior: 'smooth' });
        });
        next.addEventListener('click', () => {
            carousel.scrollBy({ left: directionMultiplier * getAmount(), behavior: 'smooth' });
        });

        // Build dots dynamically and wire up precise navigation
        const items = carousel ? Array.from(carousel.children) : [];
        let dotsContainer = wrapper.querySelector('.carousel-dots');
        if (!dotsContainer) {
            dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel-dots';
            wrapper.appendChild(dotsContainer);
        }
        // Sync dots count with items
        dotsContainer.innerHTML = '';
        items.forEach((_, i) => {
            const b = document.createElement('button');
            b.setAttribute('aria-label', `slide ${i+1}`);
            if (i === 0) b.classList.add('active');
            dotsContainer.appendChild(b);
        });
        const dots = Array.from(dotsContainer.querySelectorAll('button'));

        function updateDotsByIndex(index) {
            dots.forEach((d, i) => { d.classList.toggle('active', i === index); });
        }

        function getClosestIndex() {
            if (!items.length) return 0;
            const scrollLeft = carousel.scrollLeft;
            let closest = 0,
                min = Infinity;
            items.forEach((el, i) => {
                const dist = Math.abs(el.offsetLeft - scrollLeft);
                if (dist < min) {
                    min = dist;
                    closest = i;
                }
            });
            return closest;
        }

        function scrollToIndex(i) {
            const target = items[i];
            if (!target) return;
            // Handle RTL scrollLeft normalization
            const isRTL = (dir === 'rtl');
            let left = target.offsetLeft;
            if (isRTL) {
                left = target.offsetLeft - (carousel.scrollWidth - carousel.clientWidth);
            }
            carousel.scrollTo({ left, behavior: 'smooth' });
            updateDotsByIndex(i);
        }

        carousel.addEventListener('scroll', () => {
            updateDotsByIndex(getClosestIndex());
        });

        dots.forEach((btn, i) => {
            btn.addEventListener('click', () => scrollToIndex(i));
        });
    });

    // Drag/Swipe for all such carousels
    document.querySelectorAll('.projects-carousel').forEach((carousel) => {
        let isDown = false;
        let lastX = 0;
        const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);

        const start = (e) => {
            isDown = true;
            lastX = getX(e);
            carousel.classList.add('dragging');
        };
        const move = (e) => {
            if (!isDown) return;
            const x = getX(e);
            const delta = x - lastX;
            carousel.scrollBy({ left: -delta, behavior: 'auto' });
            lastX = x;
            if (e.cancelable) e.preventDefault();
        };
        const end = () => {
            isDown = false;
            carousel.classList.remove('dragging');
        };

        carousel.addEventListener('mousedown', start);
        carousel.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
        carousel.addEventListener('touchstart', start, { passive: true });
        carousel.addEventListener('touchmove', move, { passive: false });
        document.addEventListener('touchend', end);
    });
})();


// (handled above for all instances)


document.addEventListener('DOMContentLoaded', function() {
    // Sticky navbar (JS-only, no CSS changes)
    (function() {
        const nav = document.querySelector('.navbar');
        if (!nav) return;
        let isSticky = false;
        const navHeight = () => nav.getBoundingClientRect().height;
        const applySticky = () => {
            if (window.scrollY > 0 && !isSticky) {
                isSticky = true;
                document.body.style.paddingTop = navHeight() + 'px';
                nav.style.position = 'fixed';
                nav.style.top = '0';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.width = '100%';
                nav.style.zIndex = '1000';
            } else if (window.scrollY === 0 && isSticky) {
                isSticky = false;
                document.body.style.paddingTop = '';
                nav.style.position = '';
                nav.style.top = '';
                nav.style.left = '';
                nav.style.right = '';
                nav.style.width = '';
                nav.style.zIndex = '';
            }
        };
        window.addEventListener('scroll', applySticky, { passive: true });
        window.addEventListener('resize', () => { if (isSticky) document.body.style.paddingTop = navHeight() + 'px'; });
        applySticky();
    })();

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            console.log('Search clicked');
        });
    }

    // ------------------ requests carousel navigation ------------------
    (function() {
        const carousel = document.querySelector('.requests-carousel');
        const prev = document.querySelector('.requests-nav-btn.left');
        const next = document.querySelector('.requests-nav-btn.right');
        if (!carousel || !prev || !next) return;

        const dir = getComputedStyle(carousel).direction || document.documentElement.dir || 'ltr';
        const directionMultiplier = (dir === 'rtl') ? -1 : 1;
        const getAmount = () => Math.floor(carousel.clientWidth * 0.9);

        prev.addEventListener('click', () => {
            carousel.scrollBy({ left: -directionMultiplier * getAmount(), behavior: 'smooth' });
        });
        next.addEventListener('click', () => {
            carousel.scrollBy({ left: directionMultiplier * getAmount(), behavior: 'smooth' });
        });

        // Drag/Swipe
        let isDown = false;
        let lastX = 0;
        const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);
        const start = (e) => {
            isDown = true;
            lastX = getX(e);
        };
        const move = (e) => {
            if (!isDown) return;
            const x = getX(e);
            const delta = x - lastX;
            carousel.scrollBy({ left: -delta, behavior: 'auto' });
            lastX = x;
            if (e.cancelable) e.preventDefault();
        };
        const end = () => { isDown = false; };

        carousel.addEventListener('mousedown', start);
        carousel.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
        carousel.addEventListener('touchstart', start, { passive: true });
        carousel.addEventListener('touchmove', move, { passive: false });
        document.addEventListener('touchend', end);
    })();

    // Like/unlike for project cards
    document.querySelectorAll('.like-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const liked = btn.getAttribute('aria-pressed') === 'true';
            btn.setAttribute('aria-pressed', String(!liked));
            btn.textContent = liked ? '♡' : '❤';
        });
    });
});

// ------------------ services carousel navigation ------------------
document.addEventListener('DOMContentLoaded', function() {
    (function() {
        const carousel = document.querySelector('.services-carousel');
        const prev = document.querySelector('.serv-nav-btn.left');
        const next = document.querySelector('.serv-nav-btn.right');
        if (!carousel || !prev || !next) return;

        const dir = getComputedStyle(carousel).direction || document.documentElement.dir || 'ltr';
        const directionMultiplier = (dir === 'rtl') ? -1 : 1;
        const getAmount = () => Math.floor(carousel.clientWidth * 0.9);

        prev.addEventListener('click', () => {
            carousel.scrollBy({ left: -directionMultiplier * getAmount(), behavior: 'smooth' });
        });
        next.addEventListener('click', () => {
            carousel.scrollBy({ left: directionMultiplier * getAmount(), behavior: 'smooth' });
        });

        // Drag/Swipe
        let isDown = false;
        let lastX = 0;
        const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);
        const start = (e) => {
            isDown = true;
            lastX = getX(e);
        };
        const move = (e) => {
            if (!isDown) return;
            const x = getX(e);
            const delta = x - lastX;
            carousel.scrollBy({ left: -delta, behavior: 'auto' });
            lastX = x;
            if (e.cancelable) e.preventDefault();
        };
        const end = () => { isDown = false; };

        carousel.addEventListener('mousedown', start);
        carousel.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
        carousel.addEventListener('touchstart', start, { passive: true });
        carousel.addEventListener('touchmove', move, { passive: false });
        document.addEventListener('touchend', end);
    })();
})()