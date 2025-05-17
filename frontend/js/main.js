// main.js - ZenGoSoft JavaScript Dosyası

// =====================================================================
// YENİ EKLENEN BÖLÜM: Sayfa yenilendiğinde en üste git (window.onload ile)
// =====================================================================
window.onload = function() {
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual'; // Tarayıcının otomatik scroll'unu iptal et
    }
    window.scrollTo(0, 0); // Sayfayı en üste kaydır
};
// =====================================================================

document.addEventListener('DOMContentLoaded', function() {
    // ÖNEMLİ: Yukarıda window.onload kullandığımız için
    // aşağıdaki satırlar YORUM SATIRI haline getirildi veya SİLİNDİ.
    /*
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    */

    // Header Scroll Efekti
    const header = document.getElementById('header');
    const scrollTopButton = document.getElementById('scrollTop'); 
    
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        if (scrollTopButton) { 
            if (window.scrollY > 50) {
                scrollTopButton.classList.add('active');
            } else {
                scrollTopButton.classList.remove('active');
            }
        }
    });
    
    // Mobil Menü
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Sayfa İçi Bağlantılar
    const pageAnchors = document.querySelectorAll('a[href^="#"]');
    pageAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    if (navLinks && navLinks.classList.contains('active') && hamburger) {
                        navLinks.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            } catch (error) {
                console.warn("Geçersiz hedef ID veya element bulunamadı:", targetId, error);
            }
        });
    });
    
    // Testimonial Slider
    const testimonialSlider = document.getElementById('testimonials-slider');
    if (testimonialSlider) {
        const testimonialCards = testimonialSlider.querySelectorAll('.testimonial-card');
        if (testimonialCards && testimonialCards.length > 0) {
            let currentIndex = 0;
            
            function showTestimonial(index) {
               const cardWidth = testimonialCards[0].offsetWidth + 30;
               testimonialSlider.scrollTo({
                   left: index * cardWidth,
                   behavior: 'smooth'
               });
           }
           
           function nextTestimonial() {
               currentIndex = (currentIndex + 1) % testimonialCards.length;
               showTestimonial(currentIndex);
           }
           
           let testimonialInterval = setInterval(nextTestimonial, 5000);
           
           testimonialSlider.addEventListener('mouseenter', () => {
               clearInterval(testimonialInterval);
           });
           
           testimonialSlider.addEventListener('mouseleave', () => {
               testimonialInterval = setInterval(nextTestimonial, 5000);
           });
           
           let touchStartX = 0;
           let touchEndX = 0;
           
           testimonialSlider.addEventListener('touchstart', (e) => {
               touchStartX = e.changedTouches[0].screenX;
               clearInterval(testimonialInterval);
           });
           
           testimonialSlider.addEventListener('touchend', (e) => {
               touchEndX = e.changedTouches[0].screenX;
               handleSwipe();
               testimonialInterval = setInterval(nextTestimonial, 5000);
           });
           
           function handleSwipe() {
               if (touchEndX < touchStartX) {
                   currentIndex = (currentIndex + 1) % testimonialCards.length;
               } else if (touchEndX > touchStartX) {
                   currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
               }
               showTestimonial(currentIndex);
           }
        }
    }
   
    // Scroll to Top Butonu
    if (scrollTopButton) { 
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
   
    // Form Gönderimi
    const contactForm = document.getElementById('contact-form');
    if (contactForm) { 
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
                alert('Lütfen tüm alanları doldurun.');
                return;
            }
            
            const formData = {
                name: nameInput.value,
                email: emailInput.value,
                subject: subjectInput.value,
                message: messageInput.value
            };
            
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.message || 'Sunucu hatası');
                    }).catch(() => {
                        throw new Error(`Sunucu hatası: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
                    this.reset();
                } else {
                    alert('Mesaj gönderilirken bir hata oluştu: ' + (data.message || 'Bilinmeyen hata'));
                }
            })
            .catch(error => {
                console.error('Form gönderim hatası:', error);
                alert('Bir hata oluştu: ' + error.message);
            });
        });
    }

    // API durumunu kontrol et
    checkApiStatus();
});

// API durumunu kontrol eden fonksiyon
async function checkApiStatus() {
   try {
       const response = await fetch('/api/status');
       if (!response.ok) {
           throw new Error('API yanıt vermiyor');
       }
       const data = await response.json();
       console.log('API Durumu:', data);
       
       if (data.database && data.database !== "Veritabanı bağlantısı başarılı!") {
           console.error('Veritabanı bağlantı hatası:', data.database);
       }
   } catch (error) {
       console.error('API bağlantı hatası:', error);
   }
}