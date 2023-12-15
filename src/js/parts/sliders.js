import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';

const sliders = document.querySelectorAll('.swiper');
if (sliders.length) {
    sliders.forEach(slider => {
        const section = slider.closest('section');
        const prev = section.querySelector('.prev')
        const next = section.querySelector('.next')
        const scrollbar = section.querySelector('.swiper-scrollbar')
        const pagination = section.querySelector('.pagination')

        if (section.classList.contains('hero')) {
            new Swiper(slider, {
                modules: [Pagination, Autoplay],
                slidesPerView: 'auto',
                spaceBetween: 20,
                centeredSlides: true,
                initialSlide: 1,
                autoplay: {
                    delay: 2000,
                    pauseOnMouseEnter: true,
                },
                pagination: {
                    el: pagination,
                    clickable: true,
                },
            })
        }
        else if (section.classList.contains('how')) {
            new Swiper(slider, {
                modules: [
                    Navigation
                ],
                slidesPerView: 'auto',
                spaceBetween: 20,
                centeredSlides: true,

                navigation: {
                    prevEl: prev,
                    nextEl: next,
                },

            })
        }
        else if (section.classList.contains('reviews')) {
            new Swiper(slider, {
                modules: [
                    Navigation, Pagination, Scrollbar
                ],
                loop: true,
                slidesPerView: 'auto',
                spaceBetween: 20,

                navigation: {
                    prevEl: prev,
                    nextEl: next,
                },

                scrollbar: {
                    el: scrollbar,
                    hide: false,
                },
            })
        }
        else if (section.classList.contains('delivery-swiper') && (window.innerWidth < 992)) {
            new Swiper(slider, {
                modules: [
                    Pagination
                ],
                slidesPerView: 'auto',
                spaceBetween: 20,

                pagination: {
                    el: pagination,
                },

            })
        }
        else if (section.classList.contains('pricing') && (window.innerWidth < 992)) {
            new Swiper(slider, {
                modules: [
                    Pagination
                ],
                slidesPerView: 'auto',

                pagination: {
                    el: pagination,
                },

            })
        }

    })
}

import { Fancybox } from "@fancyapps/ui";

Fancybox.bind("[data-fancybox]", {
    beforeClose: function (instance, slide) {
        console.log(slide)
    }
});