// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

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

    // GSAP Scroll Animations
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
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Form Submission Logic
    const volunteerForm = document.getElementById('volunteer-form');
    const submitBtn = document.getElementById('submit-btn');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalContent = document.querySelector('.modal-content');

    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual submission
            
            // Basic UI loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            // Simulate network request
            setTimeout(() => {
                // Reset form and button
                volunteerForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                // Show Modal
                successModal.classList.remove('hidden');
                
                // GSAP Modal Animation
                gsap.to(successModal, { opacity: 1, duration: 0.3 });
                gsap.fromTo(modalContent, 
                    { scale: 0.8, y: 30, opacity: 0 },
                    { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
                );
            }, 1500); // 1.5 second simulated delay
        });
    }

    // Close Modal Logic
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    // Optional: Close modal on outside click
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }

    function closeModal() {
        gsap.to(modalContent, { scale: 0.8, y: 20, opacity: 0, duration: 0.3, ease: "power2.in" });
        gsap.to(successModal, { opacity: 0, duration: 0.3, delay: 0.1, onComplete: () => {
            successModal.classList.add('hidden');
        }});
    }

});
