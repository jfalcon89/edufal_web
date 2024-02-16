$(document).ready(function() {
    // Función para animar el conteo
    function animateCount(target, element) {
        let count = 0;
        const speed = 900; // Velocidad de la animación en milisegundos
        const inc = target / speed;

        const interval = setInterval(function() {
            count += inc;
            element.text(Math.ceil(count));
            if (count >= target) {
                clearInterval(interval);
                element.text(target);
            }
        }, 1);
    }

    // Función para verificar si la sección está visible en la pantalla
    function isScrolledIntoView(elem) {
        const docViewTop = $(window).scrollTop();
        const docViewBottom = docViewTop + $(window).height();
        const elemTop = $(elem).offset().top;

        return (elemTop <= docViewBottom && elemTop >= docViewTop);
    }

    // Animar conteo cuando la sección es visible
    $(window).scroll(function() {
        $('.count-section').each(function() {
            if (isScrolledIntoView(this) && !$(this).hasClass('active')) {
                $(this).addClass('active');
                const countElement = $(this).find('.count');
                const target = parseInt(countElement.attr('data-target'));
                animateCount(target, countElement);
            }
        });
    });
});