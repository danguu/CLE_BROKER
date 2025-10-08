// Interacciones para talleres y educación
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var faqQuestions = document.querySelectorAll('.mini-faq .faq-question');

    faqQuestions.forEach(function(question) {
      question.addEventListener('click', function() {
        var isExpanded = question.getAttribute('aria-expanded') === 'true';

        faqQuestions.forEach(function(q) {
          q.classList.remove('active');
          q.setAttribute('aria-expanded', 'false');
          var answer = q.nextElementSibling;
          if (answer) {
            answer.classList.remove('show');
          }
        });

        if (!isExpanded) {
          question.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
          var selectedAnswer = question.nextElementSibling;
          if (selectedAnswer) {
            selectedAnswer.classList.add('show');
          }
        }
      });
    });
  });
})();
