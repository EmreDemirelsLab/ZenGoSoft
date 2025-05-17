// main.js - ZenGoSoft JavaScript Dosyası

document.addEventListener('DOMContentLoaded', function() {
    // Header Scroll Efekti
    const header = document.getElementById('header');
    const scrollTop = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            scrollTop.classList.add('active');
        } else {
            header.classList.remove('scrolled');
            scrollTop.classList.remove('active');
        }
    });
    
    // Mobil Menü
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Sayfa İçi Bağlantılar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Mobil menüyü kapat
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
    
    // Testimonial Slider
    const testimonialSlider = document.getElementById('testimonials-slider');
    const testimonialCards = testimonialSlider.querySelectorAll('.testimonial-card');
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
   
   // Otomatik slider başlat
   let testimonialInterval = setInterval(nextTestimonial, 5000);
   
   // Kullanıcı etkileşiminde interval'i sıfırla
   testimonialSlider.addEventListener('mouseenter', () => {
       clearInterval(testimonialInterval);
   });
   
   testimonialSlider.addEventListener('mouseleave', () => {
       testimonialInterval = setInterval(nextTestimonial, 5000);
   });
   
   // Touch slide için
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
           // Sola kaydırma
           currentIndex = (currentIndex + 1) % testimonialCards.length;
       } else if (touchEndX > touchStartX) {
           // Sağa kaydırma
           currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
       }
       showTestimonial(currentIndex);
   }
   
   // Scroll to Top
   document.getElementById('scrollTop').addEventListener('click', () => {
       window.scrollTo({
           top: 0,
           behavior: 'smooth'
       });
   });
   
   // Form Gönderimi
   const contactForm = document.getElementById('contact-form');
   
   contactForm.addEventListener('submit', function(e) {
       e.preventDefault();
       
       // Form verilerini al
       const name = document.getElementById('name').value;
       const email = document.getElementById('email').value;
       const subject = document.getElementById('subject').value;
       const message = document.getElementById('message').value;
       
       // API'ye gönder (MongoDB'ye kaydetmek için)
       fetch('/api/contact', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({ name, email, subject, message })
       })
       .then(response => {
           if (!response.ok) {
               throw new Error('Sunucu hatası');
           }
           return response.json();
       })
       .then(data => {
           if (data.success) {
               alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
               // Formu sıfırla
               this.reset();
           } else {
               alert('Mesaj gönderilirken bir hata oluştu: ' + data.message);
           }
       })
       .catch(error => {
           console.error('Hata:', error);
           alert('Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
       });
   });

   // MongoDB bağlantısını test et
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
       
       // Veritabanı bağlantısı başarısızsa, kullanıcıya bildir
       if (data.database && data.database !== "Veritabanı bağlantısı başarılı!") {
           console.error('Veritabanı bağlantı hatası:', data.database);
       }
   } catch (error) {
       console.error('API bağlantı hatası:', error);
   }
}