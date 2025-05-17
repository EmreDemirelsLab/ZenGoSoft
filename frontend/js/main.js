// main.js - ZenGoSoft JavaScript Dosyası

document.addEventListener('DOMContentLoaded', function() {
    // =====================================================================
    // YENİ EKLENEN BÖLÜM: Sayfa yenilendiğinde en üste git
    // =====================================================================
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual'; // Tarayıcının otomatik scroll'unu iptal et
    }
    window.scrollTo(0, 0); // Sayfayı en üste kaydır
    // =====================================================================

    // Header Scroll Efekti
    const header = document.getElementById('header');
    // DEĞİŞİKLİK: scrollTop değişken adı scrollTopButton olarak değiştirildi ve null kontrolü eklendi
    const scrollTopButton = document.getElementById('scrollTop'); 
    
    window.addEventListener('scroll', function() {
        if (header) { // header elementi varsa işlem yap
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        // DEĞİŞİKLİK: scrollTopButton için null kontrolü eklendi
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
    
    if (hamburger && navLinks) { // Elementlerin varlığını kontrol et
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Sayfa İçi Bağlantılar
    const pageAnchors = document.querySelectorAll('a[href^="#"]');
    pageAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return; // Sadece '#' olan linkler için bir şey yapma
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Header yüksekliği kadar offset
                        behavior: 'smooth'
                    });
                    
                    // Mobil menü açıksa kapat
                    if (navLinks && navLinks.classList.contains('active') && hamburger) {
                        navLinks.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            } catch (error) {
                // Hedef ID geçerli bir CSS seçici değilse (örn: href="#") hata oluşabilir, yakala.
                console.warn("Geçersiz hedef ID veya element bulunamadı:", targetId, error);
            }
        });
    });
    
    // Testimonial Slider
    const testimonialSlider = document.getElementById('testimonials-slider');
    if (testimonialSlider) { // testimonialSlider elementi varsa işlem yap
        const testimonialCards = testimonialSlider.querySelectorAll('.testimonial-card');
        if (testimonialCards && testimonialCards.length > 0) { // Kartlar varsa devam et
            let currentIndex = 0;
            
            function showTestimonial(index) {
               const cardWidth = testimonialCards[0].offsetWidth + 30; // +30 for margins
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
    // DEĞİŞİKLİK: scrollTopButton değişkeni zaten yukarıda tanımlanmıştı, null kontrolü eklendi
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
    // DEĞİŞİKLİK: contactForm için null kontrolü eklendi
    if (contactForm) { 
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            // Basit bir ön kontrol (isteğe bağlı, daha kapsamlı yapılabilir)
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
                    // Sunucudan gelen JSON mesajını almaya çalış
                    return response.json().then(errData => {
                        throw new Error(errData.message || 'Sunucu hatası');
                    }).catch(() => {
                        // JSON parse edilemezse genel bir hata fırlat
                        throw new Error(`Sunucu hatası: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
                    this.reset(); // Formu sıfırla
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

    // MongoDB bağlantısını test et (API durumunu kontrol et)
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