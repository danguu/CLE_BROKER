// JS extraído de faq.html

// FAQ toggle functionality
    document.addEventListener('DOMContentLoaded', function() {
      const faqQuestions = document.querySelectorAll('.faq-question');
      
      faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
          const answer = this.nextElementSibling;
          const isActive = this.classList.contains('active');
          
          // Close all answers
          document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.classList.remove('show');
          });
          document.querySelectorAll('.faq-question').forEach(q => {
            q.classList.remove('active');
          });
          
          // Open clicked answer if it was closed
          if (!isActive) {
            this.classList.add('active');
            answer.classList.add('show');
          }
        });
      });

      // Search functionality
      const searchInput = document.querySelector('.search-input');
      searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
          const question = item.querySelector('.faq-question').textContent.toLowerCase();
          const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
          
          if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
            // Open the answer if it matches search
            if (answer.includes(searchTerm)) {
              item.querySelector('.faq-question').classList.add('active');
              item.querySelector('.faq-answer').classList.add('show');
            }
          } else {
            item.style.display = 'none';
          }
        });
      });
    });