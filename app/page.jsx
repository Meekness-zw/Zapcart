'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    let lenis;
    let cleanup;

    const init = async () => {
      const LenisModule = await import('lenis');
      const Lenis = LenisModule.default;
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      // Initialize Lenis for buttery smooth Awwwards momentum scroll
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

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

      // 1. Custom Hover Cursor
      const cursor = document.querySelector('.cursor');
      const follower = document.querySelector('.cursor-follower');

      const onMouseMove = (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.4, ease: 'power2.out' });
      };
      document.addEventListener('mousemove', onMouseMove);

      // Magnetic Link Interaction Engine
      const magneticItems = document.querySelectorAll('.magnetic-item');
      magneticItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
          cursor.classList.add('hover');
          follower.classList.add('hover');

          const rect = item.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const strength = parseFloat(item.dataset.strength) || 20;

          const x = ((mouseX / rect.width) - 0.5) * strength;
          const y = ((mouseY / rect.height) - 0.5) * strength;

          gsap.to(item, { x: x, y: y, duration: 0.5, ease: 'power3.out' });
        });

        item.addEventListener('mouseleave', () => {
          cursor.classList.remove('hover');
          follower.classList.remove('hover');
          gsap.to(item, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
        });
      });

      // 2. Playful 3D Tilt Cards
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
            rotateY: xPercent * 25,
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

      // 3. GSAP Timeline Orchestration

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
      .to('.stagger-text .line span', {
        y: '0%',
        stagger: 0.15,
        duration: 1.2,
        ease: 'power4.out'
      }, '-=0.6')
      .to('.hero-sub', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.8');

      // Scroll Background Parallax
      const parallaxBgs = document.querySelectorAll('.parallax-bg');
      parallaxBgs.forEach(bg => {
        gsap.to(bg, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: bg.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      // Content Fade Ups
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
            start: 'top 85%',
          }
        });
      });

      // Bouncy Scale Ins
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
            start: 'top 80%'
          }
        });
      });

      // Smooth scroll anchors hooked into Lenis
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;

          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, {
              offset: -50,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        });
      });

      // 4. Video Modal
      const playBtn = document.getElementById('playVideoBtn');
      const videoModal = document.getElementById('videoModal');
      const closeModal = document.getElementById('closeModal');
      const fullVideo = document.getElementById('fullVideo');

      if (playBtn && videoModal) {
        playBtn.addEventListener('click', () => {
          videoModal.classList.add('active');
          fullVideo.currentTime = 0;
          fullVideo.play();
          if (videoModal.requestFullscreen) videoModal.requestFullscreen();
          else if (videoModal.webkitRequestFullscreen) videoModal.webkitRequestFullscreen();
        });

        const closeAction = () => {
          videoModal.classList.remove('active');
          fullVideo.pause();
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.log(err));
          }
        };

        closeModal.addEventListener('click', closeAction);

        videoModal.addEventListener('click', (e) => {
          if (e.target === videoModal || e.target === videoModal.querySelector('.video-container-modal')) {
            closeAction();
          }
        });
      }

      // 5. Navbar Color Invert Trigger
      const lightSections = document.querySelectorAll('.light-bg');
      lightSections.forEach(sec => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 70px',
          end: 'bottom 70px',
          onEnter: () => document.getElementById('navbar').classList.add('light-bg-nav'),
          onLeave: () => document.getElementById('navbar').classList.remove('light-bg-nav'),
          onEnterBack: () => document.getElementById('navbar').classList.add('light-bg-nav'),
          onLeaveBack: () => document.getElementById('navbar').classList.remove('light-bg-nav'),
        });
      });

      cleanup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        ScrollTrigger.killAll();
        lenis.destroy();
      };
    };

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <>
      {/* Loading Preloader */}
      <div className="preloader">
        <div className="preloader-text">ZAPCART</div>
      </div>

      {/* Custom Canvas Cursor */}
      <div className="cursor"></div>
      <div className="cursor-follower"></div>

      <nav className="navbar magnetic" id="navbar">
        <div className="nav-container">
          <div className="logo magnetic-item" data-strength="20">
            <img src="/assets/transparent logo (1).png" alt="ZapCart Logo" />
          </div>
          <div className="nav-links">
            <a href="#hardware" className="magnetic-item" data-strength="20">How It Works</a>
            <a href="#stats" className="magnetic-item" data-strength="20">Performance</a>
            <a href="#pricing" className="magnetic-item" data-strength="20">Pricing</a>
            <a href="#fleet" className="magnetic-item" data-strength="20">Fleet</a>
            <a href="#pricing" className="btn-pill magnetic-item" data-strength="40">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Lenis Smooth Scroll Wrapper */}
      <main id="smooth-wrapper">
        <div id="smooth-content">

          {/* Hero */}
          <section className="hero-section" id="hero">
            <div className="hero-bg parallax-bg">
              <video autoPlay muted loop playsInline>
                <source src="/assets/ZapCart_Mobile_EV_Charging_Ad.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="stagger-text">
                <span className="line"><span>Power.</span></span>
                <span className="line"><span>Delivered.</span></span>
              </h1>
              <p className="hero-sub fade-up" style={{ maxWidth: '800px', margin: '2rem auto 0', lineHeight: 1.4 }}>
                Mobile EV charging that comes to you. Fast, reliable, and sustainable charging for the on-demand economy.
              </p>
            </div>
          </section>

          {/* Playful Intro */}
          <section className="playful-intro dark-bg">
            <div className="container text-center">
              <h2 className="massive-text scroll-scale" style={{ fontSize: '6vw' }}>Request Service.</h2>
              <p className="fade-up" style={{ marginTop: '2rem', fontSize: '1.5rem', color: '#888', maxWidth: '800px', margin: '2rem auto 0' }}>
                Open our app, enter your location, and schedule charging at your convenience. Real-time availability and instant booking.
              </p>
            </div>
          </section>

          {/* Hardware Section */}
          <section className="hardware-section light-bg" id="hardware">
            <div className="container">

              <div className="hardware-layout">
                <div className="hw-text">
                  <h2 className="fade-up">We Come<br />To You.</h2>
                  <p className="fade-up">Our mobile fast-charging unit arrives at your location. Track your service technician in real-time with live updates.</p>
                </div>
                <div className="hw-image tilt-container">
                  <div className="tilt-element">
                    <img src="/assets/zapcart_unit.png" alt="ZapCart Unit" />
                  </div>
                </div>
              </div>

              <div className="hardware-layout reverse" style={{ marginTop: '250px' }}>
                <div className="hw-text">
                  <h2 className="fade-up">Fast &amp;<br />Secure.</h2>
                  <p className="fade-up">Get up to 50kW DC fast charging while you work, shop, or relax. Professional technicians with certified equipment.</p>
                </div>
                <div className="hw-image tilt-container">
                  <div className="tilt-element">
                    <img src="/assets/charging_cable.png" alt="Charging Cable" />
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Fullscreen Video Modal */}
          <div className="video-modal" id="videoModal">
            <button className="close-modal" id="closeModal">&times;</button>
            <div className="video-container-modal">
              <video id="fullVideo" controls playsInline>
                <source src="/assets/Mobile_EV_Charging (1) (1).mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Video Showcase */}
          <section className="video-showcase" id="playVideoBtn" style={{ position: 'relative', cursor: 'pointer' }}>
            <div className="play-overlay fade-up">
              <div className="play-button magnetic-item" data-strength="30">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="white" style={{ marginLeft: '5px' }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3 style={{ marginTop: '1.5rem', color: '#fff', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 700 }}>Watch the Film</h3>
            </div>
            <div className="container" style={{ maxWidth: '100%', padding: 0, pointerEvents: 'none' }}>
              <div className="video-wrapper parallax-bg" style={{ borderRadius: 0 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 5 }}></div>
                <video autoPlay muted loop playsInline id="bgVideo" style={{ zIndex: 1, position: 'relative' }}>
                  <source src="/assets/Mobile_EV_Charging (1) (1).mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </section>

          {/* Bento Grid */}
          <section className="bento-section light-bg" id="stats">
            <div className="container">
              <div className="bento-grid">
                <div className="bento-box bento-large dark-box tilt-container">
                  <div className="tilt-element">
                    <h3>24/7 Availability.</h3>
                    <p>Round-the-clock service whenever you need power.</p>
                    <img src="/assets/zapcart image.png" alt="ZapCart App" style={{ marginTop: '40px', width: '100%', borderRadius: '12px', objectFit: 'contain', maxHeight: '350px' }} />
                  </div>
                </div>
                <div className="bento-box bento-small light-gray-box tilt-container">
                  <div className="tilt-element text-center">
                    <h1 style={{ fontSize: '4.5vw', color: '#0071e3', letterSpacing: '-1px' }}>98%</h1>
                    <p>On-time arrival rating.</p>
                  </div>
                </div>
                <div className="bento-box bento-small dark-box tilt-container">
                  <div className="tilt-element text-center">
                    <h1 style={{ fontSize: '4.5vw', color: '#00ff66', letterSpacing: '-1px' }}>100%</h1>
                    <p>Sustainable clean energy.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="pricing-section dark-bg" id="pricing">
            <div className="container text-center">
              <h2 className="massive-text glow-text fade-up" style={{ fontSize: '7vw' }}>Full Transparency.</h2>
              <p className="fade-up" style={{ margin: '2rem auto 4rem', fontSize: '1.5rem', color: '#888' }}>No hidden fees, predictable costs, flexible payment.</p>

              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '5rem' }} className="fade-up">

                {/* Individual Plan */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4rem', borderRadius: '24px', flex: 1, minWidth: '300px', maxWidth: '500px', textAlign: 'left' }} className="tilt-container">
                  <div className="tilt-element" style={{ background: 'transparent', boxShadow: 'none', transform: 'none' }}>
                    <h3>Individual</h3>
                    <h1 style={{ fontSize: '3.5rem', margin: '1rem 0' }}>$0 <span style={{ fontSize: '1rem', color: '#888' }}>/mo</span></h1>
                    <p style={{ color: '#bbb', lineHeight: 1.6, marginBottom: '2rem' }}>Pay-per-charge with no monthly commitment. 24/7 service availability, real-time tracking, carbon credit tracking.</p>
                    <a href="#" className="btn-pill magnetic-item" style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.1)' }} data-strength="20">Get Started</a>
                  </div>
                </div>

                {/* Premium Plan */}
                <div style={{ background: '#0071e3', padding: '4rem', borderRadius: '24px', flex: 1, minWidth: '300px', maxWidth: '500px', textAlign: 'left' }} className="tilt-container">
                  <div className="tilt-element" style={{ background: 'transparent', boxShadow: 'none', transform: 'none' }}>
                    <h3>Premium</h3>
                    <h1 style={{ fontSize: '3.5rem', margin: '1rem 0', color: '#fff' }}>$29 <span style={{ fontSize: '1rem', opacity: 0.8 }}>/mo</span></h1>
                    <p style={{ color: '#fff', lineHeight: 1.6, marginBottom: '2rem', fontWeight: 500 }}>Unlimited charging with priority service. All individual features plus 20% discount on all charges and priority dispatch.</p>
                    <a href="#" className="btn-massive magnetic-item" style={{ display: 'block', textAlign: 'center', padding: '15px', background: '#fff', color: '#000' }} data-strength="20">Subscribe Now</a>
                  </div>
                </div>

              </div>

              {/* Fleet */}
              <div id="fleet" className="fade-up" style={{ background: "url('/assets/zapcart image.png') center/cover", position: 'relative', borderRadius: '24px', overflow: 'hidden', padding: '4rem', textAlign: 'left' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1 }}></div>
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                  <div>
                    <h2 style={{ fontSize: '3rem' }}>Become a Partner.</h2>
                    <p style={{ fontSize: '1.25rem', color: '#ccc', maxWidth: '500px', marginTop: '1rem' }}>Join our network of mobile charging operators. 500+ Active partners, 85% Profit margin, 24h Setup time.</p>
                  </div>
                  <a href="#" className="btn-pill magnetic-item" style={{ padding: '15px 30px', fontSize: '1.25rem' }} data-strength="20">Join the Fleet</a>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer dark-bg" style={{ paddingBottom: '5vh', paddingTop: '10vh', position: 'relative', overflow: 'hidden' }}>
            <div className="parallax-bg" style={{ position: 'absolute', bottom: '-8%', left: '50%', transform: 'translateX(-50%)', width: '100%', textAlign: 'center', fontSize: '22vw', lineHeight: 0.8, fontWeight: 900, color: '#fff', opacity: 0.03, pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap' }}>ZAPCART</div>

            <div className="container">

              <div style={{ display: 'flex', gap: '4rem', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '4rem', textAlign: 'left', position: 'relative', zIndex: 10 }}>
                {/* Brand Info */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <img src="/assets/transparent logo (1).png" alt="ZapCart Logo" style={{ height: '32px', filter: 'brightness(0) invert(1)', marginBottom: '1.5rem' }} />
                  <p style={{ color: '#bbb', maxWidth: '300px', lineHeight: 1.6 }}>Power Delivered, Anytime, Anywhere. Sustainable mobile EV charging for the on-demand economy.</p>

                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                    <a href="#hardware" className="magnetic-item" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }} data-strength="10">How It Works</a>
                    <a href="#stats" className="magnetic-item" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }} data-strength="10">Performance</a>
                    <a href="#pricing" className="magnetic-item" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }} data-strength="10">Pricing</a>
                    <a href="#fleet" className="magnetic-item" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }} data-strength="10">Fleet</a>
                  </div>
                </div>

                {/* Footer Links Grid */}
                <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                  <div style={{ minWidth: '120px' }}>
                    <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Company</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#888'}>About Us</a>
                      <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#888'}>Careers</a>
                      <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#888'}>Press</a>
                    </div>
                  </div>

                  <div style={{ minWidth: '120px' }}>
                    <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Legal</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#888'}>Privacy Policy</a>
                      <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#888'}>Terms of Service</a>
                    </div>
                  </div>

                  <div style={{ minWidth: '120px' }}>
                    <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Contact</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#888'}>Support</a>
                      <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#888'}>Fleet Sales</a>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>&copy; 2026 ZapCart. All rights reserved.</p>
              </div>
            </div>
          </footer>

        </div>
      </main>
    </>
  );
}
