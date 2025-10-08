// JS extraído de servicios.html

// Inicializar el carrusel de propiedades
    $(document).ready(function(){
      $(".properties-carousel").owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
          0: {
            items: 1
          },
          768: {
            items: 1
          },
          992: {
            items: 2
          }
        }
      });
    });