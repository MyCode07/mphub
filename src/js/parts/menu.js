import { isMobile } from '../utils/isMobile.js';
import { lockPadding, unLockPadding } from '../utils/lockPadding.js';

const body = document.body;
const menu = document.querySelector('.header__menu');
const burger = document.querySelector('.header__burger');
const menuLinks = document.querySelectorAll('.header__menu li a');
const header = document.querySelector('.header');

if (burger) {
    burger.addEventListener('click', (е) => {
        burger.classList.toggle('_active');
        menu.classList.toggle('_open');
        document.body.classList.toggle('_noscroll');


        if (!header.classList.contains('_scrolled')) {
            // header.classList.toggle('_sticky');
        }

        if (menu.classList.contains('_open')) lockPadding();
        else unLockPadding();
    })
}



if (menuLinks.length) {
    menuLinks.forEach(link => {
        const li = link.closest('li');
        const submenu = li.querySelector('ul');

        link.addEventListener('click', (е) => {
            if (!isMobile.any()) {
                if (menu.classList.contains('_open')) unLockPadding();
                else lockPadding()
            }

            if (menu.classList.contains('_open')) {
                menu.classList.remove('_open');
                body.classList.remove('_noscroll');
                burger.classList.remove('_active');

                const openLi = document.querySelector('li[data-open]');
                if (openLi) {
                    openLi.removeAttribute('data-open')
                }
            }
        })

        if (!isMobile.any() && submenu) {
            li.addEventListener('mouseenter', (е) => {
                link.classList.add('hover-menu-item')
            })
            li.addEventListener('mouseleave', (е) => {
                link.classList.remove('hover-menu-item')
            })
        }
    })
}


const arrow = `<button><svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
<path d="M1.51059 0.445312C1.45906 0.398957 1.39845 0.362719 1.33222 0.338664C1.26598 0.31461 1.19542 0.303212 1.12456 0.30512C1.0537 0.307029 0.983925 0.322207 0.919224 0.349787C0.854524 0.377368 0.796163 0.416811 0.747474 0.465864C0.698785 0.514918 0.660721 0.572622 0.635455 0.635681C0.61019 0.69874 0.598217 0.765919 0.600222 0.833383C0.602226 0.900847 0.618168 0.967274 0.647138 1.02887C0.676108 1.09047 0.717537 1.14603 0.769061 1.19239L5.62621 5.55975C5.72641 5.64994 5.85908 5.7002 5.99697 5.7002C6.13487 5.7002 6.26753 5.64994 6.36774 5.55975L11.2254 1.19239C11.2781 1.14634 11.3206 1.09079 11.3505 1.02896C11.3804 0.967139 11.3971 0.900272 11.3997 0.832247C11.4022 0.764222 11.3905 0.696394 11.3653 0.632704C11.3401 0.569014 11.3018 0.510731 11.2527 0.461241C11.2036 0.411751 11.1447 0.37204 11.0794 0.344414C11.014 0.316789 10.9436 0.3018 10.8721 0.300318C10.8006 0.298836 10.7295 0.31089 10.663 0.335781C10.5964 0.360672 10.5357 0.397903 10.4844 0.445312L5.99697 4.47973L1.51059 0.445312Z" fill="#0E0E0E"/>
</svg></button>`;

const submenuList = document.querySelectorAll('nav ul li');
if (submenuList.length) {
    submenuList.forEach(li => {
        const submenu = li.querySelector('ul');
        const link = li.querySelector('a');

        if (submenu) {
            link.insertAdjacentHTML('afterend', arrow);
            const btn = li.querySelector('button');


            if (btn && isMobile.any()) {
                btn.addEventListener('click', function () {
                    toggleMenu(li)
                })
            }

            const btnArrow = li.querySelector('.menu-arrow');
            if (btnArrow && isMobile.any()) {
                btnArrow.addEventListener('click', function () {
                    toggleMenu(li)
                })
            }
        }
    })


    function toggleMenu(item) {
        const menu = item.closest('ul');
        const menuItems = menu.querySelectorAll('li');

        if (!item.hasAttribute('data-open')) {
            const openitem = menu.querySelector('li[data-open]');
            if (openitem) {
                openitem.removeAttribute('data-open')
            }

            menuItems.forEach(item => {
                item.removeAttribute('data-open')
            })

            item.setAttribute('data-open', 'open')
        }
        else {
            item.removeAttribute('data-open')
        }
    }

}

document.addEventListener('click', function (e) {
    let targetEl = e.target;

    if ((!targetEl.closest('.header__menu') || (targetEl.closest('header') && targetEl.tagName == 'NAV')) && window.innerWidth > 1024) {
        const activeMenuItems = document.querySelectorAll('nav li[data-open]');
        if (activeMenuItems.length)
            activeMenuItems.forEach(item => item.removeAttribute('data-open'))
    }
})