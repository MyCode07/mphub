import { validateForm } from "./forms.js";

const data = delivery_data.routes;
const promocodes = delivery_data.promocodes;
console.log(delivery_data);

class Calculator {
    constructor(calculator) {
        this.calculator = calculator;
        this.minPrice = 0;
        this.price = 0;
        this.boxPrice = 0;
        this.palletPrice = 0;
        this.salePrice = 0;
        this.servicesPrice = 0;
        this.totalPrice = 0;
        this.salePercent = 0
        this.salePercentPromocode = null;

        if (this.calculator) {
            this.selectFrom = this.calculator.querySelector('select#from')
            this.selectTo = this.calculator.querySelector('select#to')
            this.next = this.calculator.querySelector('.next')
            this.prev = this.calculator.querySelector('.prev')
            this.wrapper = this.calculator.querySelector('.calculator-form__wrapper');
            this.pageWrapper = this.calculator.querySelector('.calculator-form')
            this.resultPage = this.calculator.querySelector('.page-calculator__result')
            this.allPages = this.calculator.querySelectorAll('.page-calculator')
            this.servicesBlock = this.calculator.querySelector('.more-fields .form__row');

            this.deliveryPriceElem = this.resultPage.querySelector('#delivery .amount');
            this.salePriceElem = this.resultPage.querySelector('#sale .amount');
            this.servicesPriceElem = this.resultPage.querySelector('#services .amount');
            this.totalPriceElem = this.resultPage.querySelector('#total .amount');
        }
    }

    start() {
        if (this.calculator) this.calculate()
    }

    calculate() {
        this.createSlider()
        this.calculateSizes()
    }

    createSlider() {
        this.sliderAutoHeight()
        this.nextSlide()
        this.prevSlide()
        this.goBack()
        this.createSelectFrom()
        this.createSelectTo()
        this.addDataToSelectedRout()
        this.changeSelectedMarket()
        this.salePromocode()
    }

    sliderAutoHeight() {
        const activeSlide = this.calculator.querySelector('.page-calculator._active');
        this.wrapper.style.maxHeight = activeSlide.getBoundingClientRect().height + 'px'
    }

    createSelectFrom() {
        if (data.length) {
            data.forEach((item, i) => {
                const option = `<option value="${item.from}" data-index=${i}>${item.from}</option>`
                this.selectFrom.insertAdjacentHTML('beforeend', option)
            })
        }
    }

    createSelectTo() {
        this.selectFrom.addEventListener('change', (e) => {
            const activeOption = this.selectFrom.selectedIndex;
            const activeMarket = this.getSelectedMarket();

            if (data[activeOption - 1]) {
                const routesTo = data[activeOption - 1].to;
                const routesTomarket = routesTo[activeMarket];

                if (routesTomarket.length) {
                    this.removeExistOptions();
                    routesTomarket.forEach((item, i) => {
                        const option = `<option value="${item.sklad}" 
                                            data-index="${i}" 
                                            data-price-min="${item.price_min}"
                                            data-price-cube="${item.price_cube}"
                                            data-price-pallet="${item.price_pallet}"
                                            data-services='${JSON.stringify(item.services)}'
                                        >${item.sklad}
                                        </option>`;
                        this.selectTo.insertAdjacentHTML('beforeend', option)
                    })
                }
            }
        })
    }

    getSelectedMarket() {
        const marketInputs = this.calculator.querySelectorAll('input[name="marketplace"]');
        let choosenMarketId = null;

        for (let i = 0; i < marketInputs.length; i++) {
            if (marketInputs[i].checked) {
                choosenMarketId = marketInputs[i].getAttribute('id');
                break;
            }
        };


        return choosenMarketId;
    }

    changeSelectedMarket() {
        const marketInputs = this.calculator.querySelectorAll('input[name="marketplace"]');
        if (marketInputs.length) {
            marketInputs.forEach(market => {
                market.addEventListener('change', (e) => {
                    this.removeExistOptions();
                    this.selectFrom.value = this.selectFrom.querySelector('option[disabled]').value;
                })
            })
        }
    }

    getSelectedRoutData(activeOption) {
        if (!activeOption) return;

        return {
            "sklad": activeOption.value,
            "price_min": activeOption.dataset.priceMin,
            "price_pallet": activeOption.dataset.pricePallet,
            "price_cube": activeOption.dataset.priceCube,
            "services": JSON.parse(activeOption.dataset.services),
        }
    }

    createMoreFields(services) {
        const existFiedls = this.servicesBlock.querySelectorAll('.form__item');
        if (existFiedls.length) {
            existFiedls.forEach(item => item.remove())
        }

        if (services.length) {
            services.forEach(item => {
                this.addFormItem(item)
            })
        }
    }

    addFormItem(service) {
        if (!service.price || service.price == 0) return;

        const item = `<div class="form__item">
                            <label class="checkbox" for="${service.id}">
                                <span>
                                    <i class="before">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                            <path d="M1.5 3.9998L4.5 6.6998L10.5 1.2998" stroke="#0E0E0E" stroke-width="1.5"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </i>
                                    ${service.name}
                                </span>
                                <input type="checkbox" id="${service.id}" value="${service.name}" name="services" data-price="${service.price}">
                            </label>
                        </div>`;

        this.servicesBlock.insertAdjacentHTML('beforeend', item)
    }

    addDataToSelectedRout() {
        this.selectTo.addEventListener('change', (e) => {
            const activeOption = this.selectTo.querySelectorAll('option')[this.selectTo.selectedIndex];

            const data = this.getSelectedRoutData(activeOption);
            this.createMoreFields(data.services)

            this.minPrice = +data.price_min
            this.boxPrice = +data.price_cube
            this.palletPrice = +data.price_pallet
        })
    }

    removeExistOptions() {
        const existOptions = this.selectTo.querySelectorAll('option[data-index]');
        if (existOptions.length) {
            this.selectTo.value = this.selectTo.querySelector('option[disabled]').value;
            existOptions.forEach(item => item.remove())
        }
    }

    showresulPage() {
        const activeSlide = this.calculator.querySelector('.page-calculator._active');
        activeSlide.classList.remove('_active')

        this.resultPage.classList.add('_active')
        this.pageWrapper.style.display = "none";
        this.resultPage.style.display = "flex";

        this.renderResults();
    }

    slide(direction) {
        let activeSlide = this.calculator.querySelector('.page-calculator._active');
        let page = +activeSlide.dataset.page;
        const gap = 40;

        const nextSlide = this.allPages[page];
        const prevSlide = this.allPages[page - 2];

        if (direction == -1) {
            if (page !== this.allPages.length - 1) {
                nextSlide.classList.add('_active');
                activeSlide.classList.remove('_active');
            }
            else {
                this.showresulPage();
            }
        }
        else {
            if (prevSlide) {
                prevSlide.classList.add('_active');

                activeSlide.classList.remove('_active');

                if (page == 2) {
                    this.prev.setAttribute('disabled', true);
                }

                page -= 2
            }
        }

        this.wrapper.style.transform = `translate(calc(${page * -100}% - ${page * gap}px), 0)`;

        this.showHiddenBoxes();
        this.sliderAutoHeight();
    }

    nextSlide() {
        this.next.addEventListener('click', () => {
            const activeSlide = this.calculator.querySelector('.page-calculator._active');
            const error = validateForm(activeSlide);

            if (error === 0) {
                this.slide(-1)
                this.changePageNumber(-1);
                this.prev.removeAttribute('disabled');
            }
        })
    }

    prevSlide() {
        this.prev.addEventListener('click', () => {
            this.slide(1)
            this.changePageNumber(1);
        })
    }

    changePageNumber(direction) {
        const curretnPage = document.querySelector('.current-page');
        const nextPage = curretnPage.nextElementSibling;
        const prevPage = curretnPage.previousElementSibling;

        if (direction == -1) {
            if (nextPage) {
                nextPage.classList.add('current-page');
                curretnPage.classList.remove('current-page');
                curretnPage.classList.add('valid-page');
            }
        }
        else {
            if (prevPage) {
                prevPage.classList.add('current-page');
                curretnPage.classList.remove('current-page');
            }
        }
    }

    validateInputs() {
        const activeSlide = this.calculator.querySelector('.page-calculator._active');
        const error = validateForm(activeSlide);

        return error;
    }

    calculateSizes() {
        const length = this.calculator.querySelector('[data-required] [name="length"]');
        const width = this.calculator.querySelector('[data-required] [name="width"]');
        const height = this.calculator.querySelector('[data-required] [name="height"]');
        const count = this.calculator.querySelector('[data-required] [name="count-box"]');
        const sizes = this.calculator.querySelector('[data-required] [name="volume"]');

        let value = +count.value * (+length.value / 100 * +width.value / 100 * +height.value / 100);
        sizes.value = isNaN(value) ? 0 : value.toFixed(3)

        Array.from([length, width, height, count]).forEach(input => {
            input.addEventListener('input', () => {
                value = +count.value * (+length.value / 100 * +width.value / 100 * +height.value / 100);
                sizes.value = isNaN(value) ? 0 : value.toFixed(3)
            })
        });
    }

    showHiddenBoxes() {
        const activeSlide = this.calculator.querySelector('.page-calculator._active');
        const checboxes = activeSlide.querySelectorAll('.show-items input');
        const hiddenItems = activeSlide.querySelectorAll('.hidden-item');
        const moreFields = activeSlide.querySelector('.more-fields');

        if (checboxes.length) {
            checboxes.forEach(input => {
                const id = input.id;

                input.addEventListener('input', () => {
                    if (input.checked) {

                        if (moreFields) {
                            moreFields.classList.add('_active')
                        }

                        hiddenItems.forEach(item => {
                            if (item.dataset.id == id) {
                                item.classList.remove('hidden-item')
                                this.changerequiredFields(item)
                            }
                            else {
                                item.classList.add('hidden-item')
                                this.changerequiredFields(item, false)
                            }
                        })

                        this.sliderAutoHeight();
                    }
                })
            });
        }
    }

    changerequiredFields(block, set = true) {
        const requiredFields = block.querySelectorAll('.form__item');
        if (!requiredFields.length) return;

        requiredFields.forEach(field => {
            if (set) {
                field.setAttribute('data-required', true)
            }
            else {
                if (field.hasAttribute('data-required')) {
                    field.removeAttribute('data-required')
                    field.classList.remove('_error')
                }
            }
        })
    }

    goBack() {
        const backBtn = this.calculator.querySelector('.back');

        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();


                this.pageWrapper.style.display = "block";
                this.resultPage.style.display = "none";

                this.slide(1)
                this.changePageNumber(1);
            })
        }
    }

    renderResults() {
        const fields = [...this.wrapper.querySelectorAll('input')]
            .concat([...this.wrapper.querySelectorAll('select')])

        const resultArray = []
        const sizes = []
        const srevices = { name: 'services', value: [], price: 0 }

        fields.forEach(field => {
            let name = field.name
            let value = field.value

            if (name == 'count-box') value += ' шт.'
            if (name == 'count-pallet') value += ' шт.'
            if (name == 'volume') value += ' м³'

            if ((field.getAttribute('type') === 'radio' || field.getAttribute('type') === 'checkbox')) {
                if (field.checked) {
                    if (name == 'services') {
                        srevices.price += +field.dataset.price
                        srevices.value.push(value)
                    }
                    else {
                        resultArray.push({ name: name, value: value })
                    }
                }
            }
            else {
                if (field.value != '') {

                    resultArray.push({ name: name, value: value })

                    if (name == 'length') sizes.push(value)
                    if (name == 'width') sizes.push(value)
                    if (name == 'height') sizes.push(value)
                }
            }
        })

        const sizesString = sizes.join('x') + ' см'
        srevices.value = srevices.value.join(', ')

        resultArray.push(srevices)
        resultArray.push({ name: 'sizes', value: sizesString })

        this.renderResultsForm(resultArray);
        this.renderResultsHtml(resultArray);
        this.calculatePrice(resultArray);
    }

    renderResultsHtml(array) {
        array.forEach(item => {
            const outputelem = this.resultPage.querySelector(`[data-id="${item.name}"]`)
            if (outputelem) {
                if (item.name == 'transporting') {
                    if (item.value.includes('короб')) {
                        this.resultPage.classList.remove('show-pallet')
                    }
                    else {
                        this.resultPage.classList.add('show-pallet')
                    }
                }
                outputelem.querySelector('span').innerHTML = item.value
            }
        })
    }

    renderResultsForm(array) {
        const formFieldsWrapper = this.resultPage.querySelector('.form-hidden-field');
        const existfields = formFieldsWrapper.querySelectorAll('input');

        if (existfields.length) {
            existfields.forEach(f => f.remove())
        }

        array.forEach(item => {
            const inp = document.createElement('input')
            inp.setAttribute('type', 'hidden')
            inp.setAttribute('name', item.name)
            inp.setAttribute('value', item.value)

            formFieldsWrapper.append(inp)
        })
    }

    calculatePrice(array) {
        let transportingType = '';
        let count = 1;
        let countBox = 1;
        let countPallet = 1;


        array.forEach(item => {
            if (item.name == 'transporting') {
                if (item.value.includes('короб')) {
                    transportingType = 'box';
                }
                else {
                    transportingType = 'pallet';
                }
            }
            if (item.name == 'count-box') {
                countBox = +item.value.replace(/[^0-9]+/gi, '');
            }
            if (item.name == 'count-pallet') {
                countPallet = +item.value.replace(/[^0-9]+/gi, '');
            }

            if (item.name == 'services') {
                if (item.price > 0) {
                    this.servicesPrice = item.price
                }
                else {
                    this.servicesPrice = 0
                }
            }

        })


        if (transportingType == 'box') {
            count = countBox;
            switch (true) {
                case (count >= 4 && count < 8):
                    this.salePercent = 0.1;
                    break;
                case (count >= 8):
                    this.salePercent = 0.2;
                    break;
                default:
                    this.salePercent = 0;
                    break;
            }

            this.renderPrice(count, this.boxPrice);
        }
        else {
            count = countPallet;
            switch (true) {
                case (count >= 2 && count <= 3):
                    this.salePercent = 0.05;
                    break;
                case (count >= 4 && count <= 7):
                    this.salePercent = 0.06;
                    break;
                case (count >= 8 && count <= 12):
                    this.salePercent = 0.07;
                    break;
                case (count >= 13):
                    this.salePercent = 0.08;
                    break;
                default:
                    this.salePercent = 0;
                    break;
            }

            this.renderPrice(count, this.palletPrice);
        }

        if (this.salePercentPromocode) {
            this.updatePrice(this.salePercentPromocode);
        }
        else {
            this.updatePrice(this.salePercent);
        }
    }

    renderPrice(count, price) {
        this.price = count * price;

        this.price = this.price > this.minPrice ? this.price : this.minPrice;
        this.salePrice = this.price > this.minPrice ? (this.price + this.servicesPrice) * this.salePercent : 0;

        this.servicesPrice = this.servicesPrice
        this.totalPrice = this.price - this.salePrice + this.servicesPrice;

        this.price = Math.round(this.price);
        this.salePrice = Math.round(this.salePrice);
        this.servicesPrice = Math.round(this.servicesPrice);
        this.totalPrice = Math.round(this.totalPrice);

        this.deliveryPriceElem.textContent = this.price;
        this.salePriceElem.textContent = this.salePrice;
        this.servicesPriceElem.textContent = this.servicesPrice;
        this.totalPriceElem.textContent = this.totalPrice;

    }

    updatePrice(perscent) {

        this.salePrice = this.price > this.minPrice ? (this.price + this.servicesPrice) * perscent : 0;
        this.totalPrice = this.price - this.salePrice + this.servicesPrice;

        this.salePrice = Math.round(this.salePrice);
        this.totalPrice = Math.round(this.totalPrice);

        this.salePriceElem.textContent = this.salePrice;
        this.totalPriceElem.textContent = this.totalPrice;
    }

    salePromocode() {
        const promocodeBlock = this.resultPage.querySelector('.promocode');
        const input = promocodeBlock.querySelector('input[name="promocode"]');
        const span = promocodeBlock.querySelector('span');

        if (input && promocodes.length) {
            input.addEventListener('input', () => {
                if (input.value != '') {
                    span.classList.add('_active')

                    for (let i = 0; i < promocodes.length; i++) {
                        if (input.value == promocodes[i].code) {
                            span.classList.add('_valid')
                            span.innerHTML = 'Применен';

                            this.salePercentPromocode = promocodes[i].sale / 100
                            this.updatePrice(this.salePercentPromocode)
                            break;
                        }
                        else {
                            if (span.classList.contains('_valid')) {
                                span.classList.remove('_valid')
                                span.innerHTML = '<i></i><i></i><i></i>';

                                this.salePercentPromocode = false
                                this.updatePrice(this.salePercent);
                            }
                        }
                    };
                }
                else {
                    span.classList.remove('_active')
                    this.salePercentPromocode = false
                    this.updatePrice(this.salePercent);
                }
            })
        }
    }
}

export const calculator = new Calculator(document.querySelector('.calculator'));