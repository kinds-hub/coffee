// --- BOILERPLATE & SETUP ---
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // --- HELPER: SPLIT TEXT ---
    // Splits by CHARACTERS
    function splitTextToChars(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const text = el.innerText;
            el.innerHTML = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '&nbsp;' : char;
                span.className = 'char';
                if (char === '\n') {
                    el.appendChild(document.createElement('br'));
                } else {
                    el.appendChild(span);
                }
            });
        });
    }

    // Splits by WORDS
    function splitTextToWords(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const text = el.innerText;
            const html = el.innerHTML;
            // Regex to wrap words in spans
            const newHtml = html.replace(/(?<!<[^>]*)\b(\w+)\b/g, '<span class="word inline-block opacity-0 translate-y-full">$1</span>');
            el.innerHTML = newHtml;
        });
    }

    // --- PARTICLE SYSTEM ---
    function initParticles() {
        const canvas = document.getElementById('particles-intro');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speedY: Math.random() * 0.5 + 0.1
        }));

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#D4AF37';
            particles.forEach(p => {
                p.y -= p.speedY;
                if (p.y < 0) p.y = canvas.height;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
    initParticles();


    // --- ANIMATIONS ---

    // 1. Cinematic Entrance & Hero Reveal
    const tl = gsap.timeline();

    // Animate brand name with golden glow
    tl.to("#brand-name", {
        opacity: 1,
        duration: 2,
        ease: "power4.out",
        delay: 0.5
    })
        // Lift overlay to reveal main site
        .to("#entrance", {
            yPercent: -100,
            duration: 1.5,
            ease: "expo.inOut",
            delay: 1,
            onComplete: () => {
                // Trigger Hero Animations after entrance
                gsap.from(".text-gradient-vertical", {
                    y: 100,
                    opacity: 0,
                    duration: 1.5,
                    ease: "power4.out"
                });
            }
        });


    // 2. Origins (Brand Narrative) - High-Fidelity Reveal Sequence

    ScrollTrigger.create({
        trigger: "#origins",
        start: "top 70%", // Precise 70% viewport trigger
        onEnter: () => {
            // A. Left-to-Right Revealing Mask with Zoom-Out
            const container = document.querySelector('.reveal-container-clip');
            const image = document.querySelector('.reveal-image');

            if (container && image) {
                // Revealing mask: left-to-right wipe
                gsap.fromTo(container,
                    { clipPath: 'inset(0 100% 0 0)' },
                    {
                        clipPath: 'inset(0 0% 0 0)',
                        duration: 1.5,
                        ease: "power4.out"
                    }
                );

                // Zoom-out effect inside mask
                gsap.fromTo(image,
                    { scale: 1.1 },
                    {
                        scale: 1.0,
                        duration: 1.5,
                        ease: "power4.out"
                    }
                );
            }

            // B. Word-based Headline Reveal (elegant stagger)
            const words = document.querySelectorAll('.origins-word');
            if (words.length > 0) {
                gsap.fromTo(words,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.12, // Stagger between words
                        ease: "power4.out"
                    }
                );
            }

            // C. Sub-Label: 20px Slide-Up Fade
            gsap.fromTo(".origin-label",
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power4.out"
                }
            );

            // D. Body Text
            gsap.fromTo(".origin-text",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    delay: 0.3,
                    ease: "power4.out"
                }
            );

            // E. CTA Link: Slide from Left (Behind Overflow Mask)
            gsap.fromTo(".origin-cta",
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    delay: 0.5,
                    ease: "power4.out"
                }
            );
        }
    });


    // 3. Product Showcase
    ScrollTrigger.create({
        trigger: "#showcase",
        start: "top 60%",
        end: "top 20%",
        scrub: true,
        onEnter: () => {
            gsap.to("#content-wrapper", { backgroundColor: "#3B2F2F", color: "#f8f5f2", duration: 1 });
            gsap.to("body", { backgroundColor: "#3B2F2F", duration: 1 });
        },
        onLeaveBack: () => {
            gsap.to("#content-wrapper", { backgroundColor: "#f8f5f2", color: "#3B2F2F", duration: 1 });
            gsap.to("body", { backgroundColor: "#f8f5f2", duration: 1 });
        }
    });

    // 3. Scroll Orchestrator: Origins -> Showcase -> Footer
    const sections = gsap.utils.toArray('section');

    // A. Background Color Interpolation & Parallax
    const orchestratorTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#showcase",
            start: "top bottom", // When showcase top hits viewport bottom
            end: "center center",
            scrub: true
        }
    });

    // Color Shift: Deep Espresso (#3B2F2F) -> Cream (#f8f5f2)
    orchestratorTl.to("body", { backgroundColor: "#f8f5f2", ease: "none" })
        .to("#content-wrapper", { backgroundColor: "#f8f5f2", color: "#3B2F2F", ease: "none" }, "<");

    // Origins Parallax Exit relative to Scroll
    gsap.to("#origins", {
        yPercent: 20, // Move slower than scroll (subtle depth)
        ease: "none",
        scrollTrigger: {
            trigger: "#origins",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // B. Staggered 'Rise' Entrance for Roasts
    const cards = document.querySelectorAll('.product-card');

    // Set initial state for cards (invisible & lower)
    gsap.set(cards, { y: 150, opacity: 0 });

    ScrollTrigger.create({
        trigger: "#showcase",
        start: "top 70%", // Start animation when showcase is 30% in view
        onEnter: () => {
            gsap.to(cards, {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: "power4.out"
            });
        },
        onLeaveBack: () => {
            // Optional: Reset if scrolling back up quickly, or keep revealed
            // gsap.to(cards, { y: 150, opacity: 0, duration: 0.5, ease: "power4.in" });
        }
    });

    // Advanced Magnetic Card Interactions with 3D Tilt
    cards.forEach(card => {
        const cardInner = card.querySelector('.card-inner');
        const blob = card.querySelector('.magnetic-blob');
        const productNumber = card.querySelector('.product-number');
        const productName = card.querySelector('.product-name');

        if (!cardInner || !blob) return;

        // Magnetic Blob: Mouse Follow with Lag
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Magnetic blob follows mouse with smooth lag
            gsap.to(blob, {
                left: x,
                top: y,
                opacity: 0.6, // Fade in on hover
                duration: 0.6,
                ease: "power4.out"
            });

            // 3D Tilt Logic: Rotate based on mouse distance from center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX; // Normalized -1 to 1
            const deltaY = (y - centerY) / centerY;

            // Apply 3D rotation (hardware-accelerated)
            const rotateX = deltaY * -10; // Invert Y for natural tilt
            const rotateY = deltaX * 10;

            gsap.to(cardInner, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: "power4.out"
            });
        });

        // Hover Enhancements
        card.addEventListener('mouseenter', () => {
            // Scale-up product number
            if (productNumber) {
                gsap.to(productNumber, {
                    scale: 1.1,
                    duration: 0.4,
                    ease: "power4.out"
                });
            }

            // Slide-up product name from overflow
            if (productName) {
                gsap.to(productName, {
                    y: -5,
                    duration: 0.4,
                    ease: "power4.out"
                });
            }
        });

        // Elastic Snap-Back on Mouse Leave
        card.addEventListener('mouseleave', () => {
            // Reset 3D tilt with elastic bounce
            gsap.to(cardInner, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.4)" // Elastic snap-back
            });

            // Fade out magnetic blob
            gsap.to(blob, {
                opacity: 0,
                duration: 0.4,
                ease: "power4.out"
            });

            // Reset product number
            if (productNumber) {
                gsap.to(productNumber, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power4.out"
                });
            }

            // Reset product name
            if (productName) {
                gsap.to(productName, {
                    y: 0,
                    duration: 0.4,
                    ease: "power4.out"
                });
            }
        });
    });


    // 4. Footer Logic
    // 4. Footer Logic
    function adjustFooterReveal() {
        const footer = document.getElementById('footer');
        const wrapper = document.getElementById('content-wrapper');

        // Mobile Fix: Remove "Gap" by not applying margin when footer is relative
        if (window.innerWidth < 768) {
            if (wrapper) wrapper.style.marginBottom = '0px';
            return;
        }

        if (footer && wrapper) {
            wrapper.style.marginBottom = footer.offsetHeight + 'px';
        }
    }
    window.addEventListener('resize', adjustFooterReveal);
    setTimeout(adjustFooterReveal, 100);

    // Liquid Scroll
    gsap.to("#footer-progress", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });

    // Magnetic Socals
    const magnets = document.querySelectorAll('.magnetic-icon');
    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(magnet, { x: x * 0.5, y: y * 0.5, duration: 0.3, ease: "power4.out" });
        });
        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        });
        magnet.addEventListener('mouseenter', () => {
            const svg = magnet.querySelector('svg');
            if (svg) gsap.to(svg, { rotation: 360, duration: 0.6, ease: "back.out(1.7)" });
        });
        magnet.addEventListener('mouseleave', () => {
            const svg = magnet.querySelector('svg');
            if (svg) gsap.set(svg, { rotation: 0 });
        });
    });

    /* Mobile Menu Animation - Smooth Dropdown */
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    if (menuBtn && mobileMenu) {
        // Toggle menu with smooth dropdown animation
        menuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;

            // Toggle button active state (X animation)
            menuBtn.classList.toggle('active', isMenuOpen);

            // Toggle menu open state
            mobileMenu.classList.toggle('open', isMenuOpen);

            // Animate links with stagger using GSAP
            if (isMenuOpen) {
                gsap.fromTo(mobileLinks,
                    { y: -20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.08,
                        duration: 0.4,
                        delay: 0.15,
                        ease: "power3.out"
                    }
                );
            } else {
                gsap.to(mobileLinks, {
                    y: -10,
                    opacity: 0,
                    stagger: 0.03,
                    duration: 0.2,
                    ease: "power2.in"
                });
            }
        });

        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    isMenuOpen = false;
                    menuBtn.classList.remove('active');
                    mobileMenu.classList.remove('open');
                    gsap.to(mobileLinks, {
                        y: -10,
                        opacity: 0,
                        stagger: 0.03,
                        duration: 0.2,
                        ease: "power2.in"
                    });
                }
            });
        });
    }

});
