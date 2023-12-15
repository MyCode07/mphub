import { replaceDomElements } from "./static/replace.js";
import { maskInputs } from "./static/inputmask.js";
import { animateAction, animateStaggerAction } from "./parts/animations.js";
import { accordeon } from "./static/accordeon.js";

import "./parts/tabs.js";
import "./parts/popup.js";
import "./parts/animations.js";
import "./parts/menu.js";
import "./parts/sliders.js";
import "./parts/offers.js";
import { stickyHeader } from "./parts/header.js";
import { calculator } from "./parts/calculator.js";

accordeon();
animateAction()
maskInputs('+7 (999) 999-99-99', '._mask-phone')
replaceDomElements();
stickyHeader();
animateStaggerAction();
calculator.start();

document.addEventListener('click', function (e) {
    let targetEl = e.target;
    if (targetEl.classList.contains('pages-close')) {
        document.querySelector('.pages').classList.toggle('_hide');
    }
})

import { Fancybox } from "@fancyapps/ui";

Fancybox.bind("[data-fancybox]", {
});