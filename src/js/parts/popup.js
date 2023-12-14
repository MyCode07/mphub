import { lockPadding, unLockPadding } from "../utils/lockPadding.js";


document.addEventListener('click', function (e) {
    let targetEl = e.target;

    if (targetEl.hasAttribute('data-open-popup')) {
        e.preventDefault();
        const id = targetEl.getAttribute('data-id');
        const popup = document.querySelector(`.popup#${id}`);

        if (popup) {
            popup.classList.add('_open')
            lockPadding();
        }
    }

    if (targetEl.classList.contains('popup')) {
        targetEl.classList.remove('_open')


        if (!document.querySelector('.header nav._open'))
            unLockPadding();
    }

    if (targetEl.classList.contains('popup__close') || targetEl.hasAttribute('data-close-popup')) {
        const popup = targetEl.closest('.popup');
        popup.classList.remove('_open');

        if (!document.querySelector('.header nav._open'))
            unLockPadding();
    }
})