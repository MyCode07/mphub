const offersBtn = document.querySelectorAll('.offer-btn');
const offersbox = document.querySelectorAll('.offer-box');

if (offersBtn.length) {
    offersBtn.forEach(btn => {

        btn.addEventListener('click', (e) => {
            let targetEl = e.target;
            const id = targetEl.getAttribute('id');
            const offerbox = document.querySelector(`.offer-box[data-id=${id}]`);
            console.log(id);
            console.log(offerbox);

            offersBtn.forEach(btn => {
                offersbox.forEach(box => {
                    if (targetEl.classList.contains('_active')) {
                        btn.classList.remove('_active')
                        box.classList.remove('_active')
                    }

                    targetEl.classList.add('_active')
                    offerbox.classList.add('_active')
                });
            });
        })
    });
}
