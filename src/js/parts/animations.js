import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import { TextPlugin } from 'gsap/TextPlugin.js';

gsap.registerPlugin(ScrollTrigger, TextPlugin);





const headlines = gsap.utils.toArray(".run .text-wrap li");
if (headlines.length) {
    headlines.forEach((elem, i) => {
        const height = elem.offsetHeight;
        const line = elem.querySelector('.line');
        const dot = elem.querySelector('.dot');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: elem,
                start: "top center",
                end: `+=${height}`,
                scrub: 0,
                onUpdate: self => {
                    line.style.height = self.progress * 100 + '%';
                },
                onEnter: () => {
                    elem.classList.add('_active')
                },
                onLeaveBack: () => {
                    elem.classList.remove('_active')
                }
            }
        });

    });
}

const advantagesCards = gsap.utils.toArray(".advantages .advantages-card");
if (advantagesCards.length && window.innerWidth > 1024) {
    const smallTimeline = gsap.timeline();

    ScrollTrigger.create({
        trigger: '.advantages .grid',
        start: "top center",
        end: `+=50%`,
        scrub: 0.75,
        animation: smallTimeline,
        onUpdate: self => {
        }
    })

    smallTimeline
        .to('.advantages-card__svg', {
            transform: [0, 0],
            top: 0,
            left: 0,
        }).to('.advantages-card__info', {
            opacity: 1,
        })
}


const supportLines = gsap.utils.toArray(".support .text-wrap li");
if (supportLines.length) {
    const line = document.querySelector('.support .line span');
    const list = document.querySelector('.support .text-wrap ol');
    const wrap = document.querySelector('.support .text-wrap');
    const icon = wrap.querySelector('.icon img');
    const smallTimeline = gsap.timeline();
    const listHeight = list.getBoundingClientRect().height;
    const wrapHeight = wrap.getBoundingClientRect().height;
    const deltaHeight = listHeight - wrapHeight

    console.log('deltaHeight ' + deltaHeight);
    ScrollTrigger.create({
        trigger: '.support',
        start: "top top",
        end: `+=${listHeight}`,
        scrub: 0.75,
        // markers: true,
        pin: true,
        animation: smallTimeline,
        onUpdate: self => {
            line.style.height = self.progress * 100 + '%';
            gsap.to(list, {
                y: self.progress * -deltaHeight + self.progress * -168,
            })
        }
    })

    supportLines.forEach((elem, i) => {
        const height = elem.offsetHeight;
        const img = elem.dataset.icon

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: elem,
                start: "center 60%",
                end: `+=${height}`,
                onEnter: () => {
                    icon.src = img
                },
                onLeaveBack: () => {
                    icon.src = img
                }
            }
        });

        tl.to(elem, {
            autoAlpha: 1
        })
    });
}





const aniamatedTitle = document.querySelector('.guarantee ._color');
if (aniamatedTitle) {
    const text = aniamatedTitle.textContent
    aniamatedTitle.innerHTML = text.split('').map(i => { return `<i>${i}</i>` }).join('');

    const svgs = document.querySelectorAll('.guarantee-card .circle');
    svgs.forEach(svg => {
        radialProgress(25, svg);
    })

    const tl = gsap.timeline();
    ScrollTrigger.create({
        trigger: "section.guarantee",
        start: "top 80px",
        end: "bottom",
        pin: true,
        scrub: 0.75,
        animation: tl,
        onEnterBack: () => {
            svgs.forEach(svg => {
                radialProgress(25, svg);
            })
        }
    })

    tl.to(aniamatedTitle.querySelectorAll('i'), {
        color: '#0e0e0e',
        stagger: 0.1,
        onComplete: () => {
            svgs.forEach(svg => {
                radialProgress(100, svg);
            })
        }
    })

    function radialProgress(update, svg) {
        let rd = svg.getAttribute("r");
        let i = 0;
        let a = 0;
        let x = rd * 2 * Math.PI;
        i = update;
        a = i / 100;
        let p = x * a;

        const totalLength = svg.getTotalLength();
        svg.style.strokeDasharray = p + ", " + x
    }
}










let threshold = 0;
const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animate(entry.target);
        }
    })
}, { threshold: threshold });


function animate(elem) {
    const delay = elem.dataset.delay ? elem.dataset.delay * 1000 : 0

    if (elem.hasAttribute('data-animate-left')) {
        setTimeout(() => {
            elem.removeAttribute('data-animate-left');
        }, delay);
    }
    if (elem.hasAttribute('data-animate-right')) {
        setTimeout(() => {
            elem.removeAttribute('data-animate-right');
        }, delay);
    }
    if (elem.hasAttribute('data-animate-top')) {
        setTimeout(() => {
            elem.removeAttribute('data-animate-top');
        }, delay);
    }
    if (elem.hasAttribute('data-animate-bottom')) {
        setTimeout(() => {
            elem.removeAttribute('data-animate-bottom');
        }, delay);
    }
    if (elem.hasAttribute('data-animate-opacity')) {
        setTimeout(() => {
            elem.removeAttribute('data-animate-opacity');
        }, delay);
    }
}

const animateElems = document.querySelectorAll('[data-animate]');
export const animateAction = () => {
    if (!animateElems.length) return;

    animateElems.forEach(elem => {
        observer.observe(elem);
    })
}



// stagger animations
const observerStagger = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStagger(entry.target.querySelectorAll('[data-animate-stagger]'))
        }
    })
}, { threshold: 0.3 });

function animateStagger(elem) {
    if (elem) {
        gsap.to(elem, {
            opacity: 1,
            duration: 0.3,
            x: 0,
            y: 0,
            ease: 'ease',
            stagger: 0.3
        });
    }
}

const animateElemsStagger = document.querySelectorAll('[data-animate-stagger]');
export const animateStaggerAction = () => {
    if (!animateElemsStagger.length) return

    animateElemsStagger.forEach(elem => {
        observerStagger.observe(elem.parentElement);
    })
}




const observerMap = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) animateMap();
    })
}, { threshold: 0.5 });

function animateMap() {
    mapIcons.forEach(elem => {
        gsap.to(elem, {
            opacity: 1,
            duration: 0.4,
            stagger: 0.3
        });
    })
}

const mapIcons = document.querySelectorAll('.map-svg a');
export const animateMapIcons = () => {
    if (!mapIcons.length) return
    const map = document.querySelector('.map-svg');
    observerMap.observe(map)
}

