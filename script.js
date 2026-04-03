// Initialize Lenis for that buttery smooth Awwwards momentum scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

// Bind Lenis strictly to browser AnimationFrames
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Initialize GSAP and tie ScrollTrigger natively into Lenis
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// Bootup Interactions
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Custom Hover Cursor (Bruno Simon / Awwwards)
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        // Fast snap for dot, trailing smooth catch for follower bubble
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.4, ease: 'power2.out' });
    });

    // Magnetic Link Interaction Engine
    const magneticItems = document.querySelectorAll('.magnetic-item');
    magneticItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            cursor.classList.add('hover');
            follower.classList.add('hover');

            const rect = item.getBoundingClientRect();
            // Calculate mouse distance from dead center of element
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const strength = parseFloat(item.dataset.strength) || 20;
            
            // Generate physics offset
            const x = ((mouseX / rect.width) - 0.5) * strength;
            const y = ((mouseY / rect.height) - 0.5) * strength;

            // Animate object toward mouse
            gsap.to(item, { x: x, y: y, duration: 0.5, ease: 'power3.out' });
        });

        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
            // Elastic snap back to origin
            gsap.to(item, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
        });
    });

    // 2. Playful 3D Tilt Cards (Bruno Simon Hover Vibe)
    const tiltContainers = document.querySelectorAll('.tilt-container');
    tiltContainers.forEach(container => {
        const element = container.querySelector('.tilt-element');
        
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width - 0.5);
            const yPercent = (y / rect.height - 0.5);
            
            gsap.to(element, {
                rotateY: xPercent * 25,  // Rotate relative to mouse position
                rotateX: -yPercent * 25,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        container.addEventListener('mouseleave', () => {
            gsap.to(element, {
                rotateY: 0,
                rotateX: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // 3. The GSAP Timeline Orchestration
    
    // Intro Preloader Sequence
    const introTl = gsap.timeline();
    introTl.to('.preloader-text', {
        color: '#fff',
        duration: 1,
        ease: 'power2.inOut',
        delay: 0.3
    })
    .to('.preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut'
    })
    // Kinetic Typography Reveal Sequence
    .to('.stagger-text .line span', {
        y: '0%',
        stagger: 0.15,
        duration: 1.2,
        ease: 'power4.out'
    }, "-=0.6")
    .to('.hero-sub', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
    }, "-=0.8");

    // Scroll Background Parallax
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    parallaxBgs.forEach(bg => {
        gsap.to(bg, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: bg.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Content Fade Ups (ScrollTrigger)
    const fadeUps = document.querySelectorAll('.fade-up');
    fadeUps.forEach(elem => {
        gsap.fromTo(elem, {
            opacity: 0,
            y: 60
        }, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: elem,
                start: "top 85%", // Trigger right as it enters view
            }
        });
    });

    // Bouncy Scale Ins (Bruno Style Headers)
    const scalers = document.querySelectorAll('.scroll-scale');
    scalers.forEach(elem => {
        gsap.fromTo(elem, {
            scale: 0.7,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
                trigger: elem,
                start: "top 80%"
            }
        });
    });

    // Smooth scroll for all anchor tags hooked directly into Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === "#") return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                // Pass to Lenis for mathematically perfect smooth scrolling instead of native jumps
                lenis.scrollTo(target, { 
                    offset: -50, 
                    duration: 1.5, 
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
                });
            }
        });
    });

    // 4. Video Modal Play Cinematic Actions
    const playBtn = document.getElementById('playVideoBtn');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const fullVideo = document.getElementById('fullVideo');

    if (playBtn && videoModal) {
        playBtn.addEventListener('click', () => {
            videoModal.classList.add('active');
            fullVideo.currentTime = 0;
            fullVideo.play();
            // Fullscreen the MODAL, not the video directly, so the custom X button isn't buried under native API wrappers
            if (videoModal.requestFullscreen) videoModal.requestFullscreen();
            else if (videoModal.webkitRequestFullscreen) videoModal.webkitRequestFullscreen();
        });

        const closeAction = () => {
            videoModal.classList.remove('active');
            fullVideo.pause();
            if(document.fullscreenElement) {
                document.exitFullscreen().catch(err => console.log(err));
            }
        };

        // Explicit Close Button Binding
        closeModal.addEventListener('click', closeAction);

        // Responsive 'Click-Away' Binding: Tap the black void to aggressively close it instantly
        videoModal.addEventListener('click', (e) => {
            if(e.target === videoModal || e.target === videoModal.querySelector('.video-container-modal')) {
                closeAction();
            }
        });
    }

    // 5. Navbar Color Invert Trigger
    // Instantly binds to light backgrounds entering view to flip navbar colors
    const lightSections = document.querySelectorAll('.light-bg');
    lightSections.forEach(sec => {
        ScrollTrigger.create({
            trigger: sec,
            start: "top 70px",
            end: "bottom 70px",
            onEnter: () => document.getElementById('navbar').classList.add('light-bg-nav'),
            onLeave: () => document.getElementById('navbar').classList.remove('light-bg-nav'),
            onEnterBack: () => document.getElementById('navbar').classList.add('light-bg-nav'),
            onLeaveBack: () => document.getElementById('navbar').classList.remove('light-bg-nav'),
        });
    });
});
