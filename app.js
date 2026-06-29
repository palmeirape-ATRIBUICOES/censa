/* 
=========================================
  CENSA - Centro Educacional Nossa Senhora Aparecida
  Interactive Features (Premium Aesthetics & Visual Effects)
=========================================
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Menu Toggle ---
  const navHamburger = document.getElementById('nav-hamburger');
  const navMenuList = document.getElementById('nav-menu-list');
  const navMenuLinks = document.querySelectorAll('.nav-menu-link');
  const toggleIcon = navHamburger ? navHamburger.querySelector('i') : null;

  if (navHamburger && navMenuList) {
    navHamburger.addEventListener('click', () => {
      navMenuList.classList.toggle('active');
      
      // Toggle icon
      if (toggleIcon) {
        if (navMenuList.classList.contains('active')) {
          toggleIcon.className = 'fa-solid fa-xmark';
        } else {
          toggleIcon.className = 'fa-solid fa-bars';
        }
      }
    });

    // Close mobile menu when link clicked
    navMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenuList.classList.remove('active');
        if (toggleIcon) {
          toggleIcon.className = 'fa-solid fa-bars';
        }
      });
    });
  }


  // --- 2. Active Link Highlight on Scroll ---
  const sections = document.querySelectorAll('section[id], div[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // offset for nav bar height
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu-link[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navMenuLinks.forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  });


  // --- 3. Interactive Gallery Filter ---
  const filterButtons = document.querySelectorAll('.filter-btn-simple');
  const galleryItems = document.querySelectorAll('.gallery-simple-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.transition = 'all 0.3s ease';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  // --- 4. Contact Form Submission (Simulated) ---
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-contact-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';

      setTimeout(() => {
        submitBtn.style.backgroundColor = 'var(--green-accent)';
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Mensagem Enviada!';

        alert(`Obrigado, ${name}! Sua mensagem sobre "${subject}" foi enviada. Entraremos em contato o mais breve possível pelo e-mail: ${email}`);

        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.innerHTML = 'Enviar Mensagem';
        }, 3000);

      }, 1500);
    });
  }


  // --- 5. Portal do Aluno Login & Mock Dashboard (Redirects to portal.html) ---
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (password !== '123456') {
        alert("Senha incorreta! Use a senha de demonstração padrão: 123456");
        return;
      }

      let role = 'aluno';
      let name = 'Thiago Alves de Souza';

      if (username.toLowerCase() === 'admin') {
        role = 'admin';
        name = 'Secretaria Escolar (Admin)';
      } else if (username.toLowerCase() === 'prof1') {
        role = 'professor';
        name = 'Prof. Marcos Silva';
      } else {
        // Fetch students list from localStorage
        const students = JSON.parse(localStorage.getItem('censa_students')) || [];
        const student = students.find(s => s.id === username);
        if (student) {
          role = 'aluno';
          name = student.name;
        } else {
          alert("Matrícula de aluno não encontrada! Use 202601, 202602 ou as contas 'admin' / 'prof1'.");
          return;
        }
      }

      // Save session and redirect
      const sessionData = { role, username, name };
      sessionStorage.setItem('censa_session', JSON.stringify(sessionData));
      window.location.href = 'portal.html';
    });
  }

  // --- 6. Load dynamic banners from admin settings ---
  const homePromoTitle = document.getElementById('home-promo-title');
  const homePhoneVal = document.getElementById('home-phone-val');
  const homeWhatsappVal = document.getElementById('home-whatsapp-val');

  try {
    const savedBanners = JSON.parse(localStorage.getItem('censa_banners'));
    if (savedBanners) {
      if (homePromoTitle) homePromoTitle.textContent = savedBanners.promoText;
      if (homePhoneVal) homePhoneVal.textContent = savedBanners.phone;
      if (homeWhatsappVal) homeWhatsappVal.textContent = savedBanners.whatsapp;
    }
  } catch (err) {
    console.error("Error loading banners: ", err);
  }


  // --- 7. Scroll Reveal Animation Logic ---
  const revealSections = document.querySelectorAll('.reveal-section');
  
  if (revealSections.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Animates only once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });
    
    revealSections.forEach(section => {
      revealObserver.observe(section);
    });
  }


  // --- 8. Back to Top Button Interaction ---
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // --- 9. Dynamic Banner Carousel simulation ---
  const dots = document.querySelectorAll('.slider-dots .dot');
  let currentSlide = 0;
  
  if (dots.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        currentSlide = index;
        
        // Dynamic banner copy rotation on dot clicks
        if (homePromoTitle) {
          const bannersDB = JSON.parse(localStorage.getItem('censa_banners')) || {};
          const defaultPromoText = bannersDB.promoText || "MATRÍCULAS E INSCRIÇÕES ABERTAS!";
          
          if (index === 0) {
            homePromoTitle.textContent = defaultPromoText;
          } else if (index === 1) {
            homePromoTitle.textContent = "EDUCAÇÃO HUMANIZADA E VALORES GUANELLIANOS!";
          } else if (index === 2) {
            homePromoTitle.textContent = "INFRAESTRUTURA COMPLETA E SEGURA PARA SEU FILHO!";
          }
        }
      });
    });

    // Auto rotate every 6 seconds
    setInterval(() => {
      currentSlide = (currentSlide + 1) % dots.length;
      dots[currentSlide].click();
    }, 6000);
  }

  // --- 10. 3D Mouse Tilt Effect for Premium Cards ---
  const tiltElements = document.querySelectorAll('.tilt-3d');
  
  if (tiltElements.length > 0) {
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left; // cursor x inside element
        const y = e.clientY - rect.top;  // cursor y inside element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Tilt math: max angle 12 degrees
        const tiltX = ((centerY - y) / centerY) * 12;
        const tiltY = ((x - centerX) / centerX) * 12;
        
        el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.02)`;
        el.style.boxShadow = '0 15px 35px rgba(0, 68, 204, 0.15), 0 0 20px rgba(0, 68, 204, 0.1)';
        el.style.transition = 'none';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        el.style.boxShadow = '';
        el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease';
      });
    });
  }

});
