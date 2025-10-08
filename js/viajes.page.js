// Interacciones para la página de viajes KayrosGo
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var steps = document.querySelectorAll('.process-step');

    function activate(step) {
      steps.forEach(function(item) {
        item.classList.remove('active');
      });
      step.classList.add('active');
    }

    steps.forEach(function(step) {
      step.addEventListener('mouseenter', function() {
        activate(step);
      });

      step.addEventListener('focusin', function() {
        activate(step);
      });

      step.addEventListener('mouseleave', function() {
        step.classList.remove('active');
      });

      step.addEventListener('focusout', function() {
        step.classList.remove('active');
      });
    });
  });
})();
