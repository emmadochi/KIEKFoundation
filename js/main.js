// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme or prefer dark mode as default for that premium feel
    // Or standard light mode based on NGO preference. Let's default to light.
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        if (htmlElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
    });

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    // We would create a mobile menu modal here (skipping full implementation for brevity, will add in next step)

    // GSAP Animations
    initAnimations();
    initCounters();
});

function initAnimations() {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('py-2');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.add('py-4');
            navbar.classList.remove('py-2');
        }
    });

    // Hero Slider Animations
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    let isAnimating = false;
    let slideInterval;

    function goToSlide(index) {
        if (isAnimating || index === currentSlide) return;
        isAnimating = true;

        const outgoing = slides[currentSlide];
        const incoming = slides[index];

        // Update dots
        dots[currentSlide].classList.replace('bg-brand-gold', 'bg-white/40');
        dots[index].classList.replace('bg-white/40', 'bg-brand-gold');

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
                currentSlide = index;
            }
        });

        // Outgoing slide animation
        tl.to(outgoing, { opacity: 0, duration: 0.8, ease: "power2.inOut", zIndex: 0 })
          .set(outgoing.querySelectorAll('.slide-text'), { y: 20, opacity: 0 });

        // Incoming slide animation
        tl.set(incoming, { zIndex: 10 }, "<")
          .to(incoming, { opacity: 1, duration: 0.8, ease: "power2.inOut" }, "<")
          .fromTo(incoming.querySelector('.slide-bg'), 
              { scale: 1.05 }, 
              { scale: 1, duration: 4, ease: "power1.out" }, "<")
          .to(incoming.querySelectorAll('.slide-text'), {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out"
          }, "-=0.4");
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        startAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        startAutoplay();
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(idx);
            startAutoplay();
        });
    });

    function startAutoplay() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    // Initial load animation for slide 1
    gsap.set(slides[0].querySelectorAll('.slide-text'), { y: 20, opacity: 0 });
    gsap.to(slides[0].querySelectorAll('.slide-text'), {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
    });
    
    gsap.to(".hero-stat", {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.8
    });

    startAutoplay();

    // Generic Scroll Animations for future sections
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    animateOnScrollElements.forEach((el) => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2.5,
                    snap: { innerHTML: 1 },
                    ease: "power1.out",
                    onUpdate: function() {
                        counter.innerHTML = Math.round(this.targets()[0].innerHTML).toLocaleString();
                    }
                });
            }
        });
    });
}
