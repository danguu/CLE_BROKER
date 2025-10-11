(() => {
  function initPropertiesCarousel() {
    if (!window.jQuery) {
      return;
    }

    window.jQuery(($) => {
      const $carousel = $(".properties-carousel");
      if (!$carousel.length || typeof $carousel.owlCarousel !== "function") {
        return;
      }

      $carousel.owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
          0: {
            items: 1,
          },
          768: {
            items: 1,
          },
          992: {
            items: 2,
          },
        },
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initPropertiesCarousel();
  });
})();
