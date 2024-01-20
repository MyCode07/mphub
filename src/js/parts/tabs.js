document.addEventListener('click', function (e) {
    let targetEl = e.target;

    if (targetEl.closest('.delivery-tabs') && !targetEl.hasAttribute('disabled') && !targetEl.classList.contains('_active')) {
        e.preventDefault();

        const tabId = targetEl.dataset.id;

        const allTabs = document.querySelectorAll('.delivery-tabs li');
        const allTabsContnet = document.querySelectorAll('.delivery-tabs__content-item');

        allTabsContnet.forEach(contnet => {
            if (contnet.dataset.id == tabId)
                contnet.classList.add('_active')
            else
                contnet.classList.remove('_active')
        })

        allTabs.forEach(tab => {
            if (tab.dataset.id == tabId)
                tab.classList.add('_active')
            else
                tab.classList.remove('_active')
        })

        const titleCity = document.querySelector('.delivery .subtitle .city');

        titleCity.textContent = targetEl.textContent

        const top = document.querySelector('.delivery').offsetTop;
        window.scrollTo(0, top - 100)
    }

})

function toggleElem(elem, selector) {
    selector.forEach(item => {
        item.classList.remove('_active')
    })
    elem.classList.add('_active');
}