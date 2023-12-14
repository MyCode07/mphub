import { CookieManager } from "../utils/cookie.js";

let allowClick = false;
document.addEventListener('click', function (e) {
    let targetEl = e.target;
    const notice = document.querySelector('.notice');

    if (allowClick == true) {
        if (targetEl.classList.contains('notice__close')) {
            notice.classList.remove('_open')
            CookieManager.set('accept', 'accepted');
        }
        if (targetEl.classList.contains('accept')) {
            notice.classList.remove('_open')
            CookieManager.set('accept', 'accepted');
        }

        if (!targetEl.closest('.notice') && notice.classList.contains('_open')) {
            notice.classList.remove('_open')
            CookieManager.set('accept', 'accepted');
        }
    }
})

export function notice() {
    const notice = document.querySelector('.notice');
    const accept = CookieManager.get('accept');
    if (!accept) {
        setTimeout(() => {
            notice.classList.add('_open')
            allowClick = true
        }, 5000);
    }
}