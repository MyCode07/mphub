import { isMobile } from "./isMobile.js";
if (!isMobile.any()) {

    const cursor = document.querySelector('.cursor');
    const cursorCircle = cursor.querySelector('.cursor__circle');

    const cursorLinks = [...document.querySelectorAll('a')].concat([...document.querySelectorAll('button')].concat([...document.querySelectorAll('.tab__label')]));

    const mouse = { x: -100, y: -100 }; 
    const pos = { x: 0, y: 0 }; 
    const speed = 0.5; 

    const updateCoordinates = e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }

    for (let i = 0; i < cursorLinks.length; i++) {
        const element = cursorLinks[i];
        element.addEventListener('mousemove', function () {
            cursor.classList.add('_hover')
        })
        element.addEventListener('mouseleave', function () {
            cursor.classList.remove('_hover')
        })
    }

    window.addEventListener('mousemove', updateCoordinates)

    function getAngle(diffX, diffY) {
        return Math.atan2(diffY, diffX) * 180 / Math.PI;
    }

    function getSqueeze(diffX, diffY) {
        const distance = Math.sqrt(
            Math.pow(diffX, 2) + Math.pow(diffY, 2)
        );
        const maxSqueeze = 1;
        const accelerator = 250;
        return Math.min(distance / accelerator, maxSqueeze);
    }


    const updateCursor = () => {
        const diffX = Math.round(mouse.x - pos.x);
        const diffY = Math.round(mouse.y - pos.y);

        pos.x += diffX * speed;
        pos.y += diffY * speed;

        const angle = getAngle(diffX, diffY);
        const squeeze = getSqueeze(diffX, diffY);


        const scale = 'scale(' + (1 + squeeze) + ', ' + (1 - squeeze) + ')';

        const rotate = 'rotate(' + angle + 'deg)';
        const translate = 'translate3d(' + (pos.x - 32) + 'px ,' + (pos.y - 32) + 'px, 0)';

        cursor.style.transform = translate;
        cursorCircle.style.transform = rotate + scale;
    };

    function loop() {
        updateCursor();
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);


    const cursorModifiers = document.querySelectorAll('[cursor-class]');

    cursorModifiers.forEach(curosrModifier => {
        curosrModifier.addEventListener('mouseenter', function () {
            const className = this.getAttribute('cursor-class');
            cursor.classList.add(className);
        });

        curosrModifier.addEventListener('mouseleave', function () {
            const className = this.getAttribute('cursor-class');
            cursor.classList.remove(className);
        });
    });
}