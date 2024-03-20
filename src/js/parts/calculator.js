import { validateForm } from "./forms.js";

const data = delivery_data.routes;
const promocodes = delivery_data.promocodes;
const sales = delivery_data.sales
const defalutPromocode = delivery_data.defalut_promocode

class Calculator {
    constructor(calculator) {
        this.calculator = calculator;
        this.minimum = 850;
        this.minPrice = 0;
        this.price = 0;
        this.boxPrice = 0;
        this.palletPrice = 0;
        this.salePrice = 0;
        this.servicesPrice = 0;
        this.totalPrice = 0;
        this.saleFirstPercent = 0.1
        this.saleMaxtPercent = 0.2
        this.salePercent = 0.1
        this.salePercentPromocode = 0.1;
        this.defaultPromocode = defalutPromocode;
        this.promocode = defalutPromocode;

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
            this.servicesPriceElem = this.resultPage.querySelector('#all_services .amount');
            this.totalPriceElem = this.resultPage.querySelector('#total .amount');
            this.totalSaleElem = this.resultPage.querySelector('#sale-price .amount');

            this.saleFromCountElem = this.resultPage.querySelector('.sale-count');
            this.saleFromFisrtElem = this.resultPage.querySelector('.sale-first');
            this.saleFromPrmocodeElem = this.resultPage.querySelector('.sale-promocode');
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
        const existOptions = this.selectFrom.querySelectorAll('option[data-index]');
        if (existOptions.length) {
            this.selectFrom.value = this.selectFrom.querySelector('option[disabled]').value;
            existOptions.forEach(item => item.remove())
        }

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
            this.removeExistOptions();

            if (data[activeOption - 1]) {
                const routesTo = data[activeOption - 1].to;
                const routesTomarket = routesTo[activeMarket];

                if (routesTomarket.length) {
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
                else {
                    this.setNoRoutesSelectTo();
                }
            }
        })
    }

    setNoRoutesSelectTo() {
        this.selectTo.querySelector('option[disabled]').value = 'Нет маршрута доставки';
        this.selectTo.querySelector('option[disabled]').textContent = 'Нет маршрута доставки';
        this.selectTo.value = this.selectTo.querySelector('option[disabled]').value;
    }

    setDefalutSelectTo() {
        this.selectTo.querySelector('option[disabled]').value = 'Куда';
        this.selectTo.querySelector('option[disabled]').textContent = 'Куда';
        this.selectTo.value = this.selectTo.querySelector('option[disabled]').value;
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
        if (service.id === 'zabor_gruza') {
            if ((!service.price.box_price || service.price.box_price == 0) &&
                (!service.price.pallet_price || service.price.pallet_price == 0)) return;
        };

        let input = `<input type="checkbox" id="${service.id}" value="${service.name}" name="services" data-price="${service.price}">`;
        if (service.id == 'zabor_gruza') {
            input = `<input type="checkbox" id="${service.id}" value="${service.name}" name="services" 
            data-box-price="${service.price.box_price}" data-pallet-price="${service.price.pallet_price}"> `;
        }

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
                                ${input}
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

        this.setDefalutSelectTo();
    }

    showResulPage() {
        const activeSlide = this.calculator.querySelector('.page-calculator._active');
        activeSlide.classList.remove('_active')

        this.resultPage.classList.add('_active')
        this.pageWrapper.style.display = "none";
        this.resultPage.style.display = "flex";

        this.renderResults();
    }

    hideResulPage() {
        const activeSlide = this.calculator.querySelector('.page-calculator._active');
        activeSlide.classList.remove('_active')

        this.resultPage.classList.remove('_active')
        this.pageWrapper.style.display = "block";
        this.resultPage.style.display = "none";
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
                this.showResulPage();
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
        window.scrollTo(0, 0)
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

    resetCalculator() {
        this.hideResulPage();

        const firstSlide = this.allPages[0];
        firstSlide.classList.add('_active');

        this.prev.setAttribute('disabled', true);
        this.wrapper.style.transform = `translate(0, 0)`;

        this.sliderAutoHeight();
        this.resetPageNumber();
        this.removeExistOptions();
        this.createSelectFrom();
        this.hideHiddenBoxes();

        const marketInputs = this.calculator.querySelectorAll('input[name="marketplace"]');
        if (marketInputs.length) {
            marketInputs.forEach((market, i) => {
                if (i == 0) {
                    market.checked = true
                }
                else {
                    market.checked = false
                }
            })
        }

        const checkboxContainers = this.calculator.querySelectorAll('[data-checkbox-container]');
        if (checkboxContainers.length) {
            checkboxContainers.forEach(item => {
                item.querySelectorAll('input').forEach(input => {
                    input.checked = false
                })
            })
        }

        this.resetFields();
    }

    resetFields() {
        this.calculator.querySelector('input[name="length"]').value = this.calculator.querySelector('input[name="length"]').dataset.value;
        this.calculator.querySelector('input[name="width"]').value = this.calculator.querySelector('input[name="width"]').dataset.value;
        this.calculator.querySelector('input[name="height"]').value = this.calculator.querySelector('input[name="height"]').dataset.value;

        this.calculator.querySelector('input[name="count-box"]').value = 1;
        this.calculator.querySelector('input[name="count-pallet"]').value = 1;

        this.calculateSizes();
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

    resetPageNumber() {
        const allPages = document.querySelectorAll('.calculator-pages div');

        allPages.forEach((page, i) => {
            page.classList.remove('valid-page')
            page.classList.remove('current-page')

            if (i == 0) {
                page.classList.add('current-page')
            }
        });
    }

    validateInputs() {
        const activeSlide = this.calculator.querySelector('.page-calculator._active');
        const error = validateForm(activeSlide);

        return error;
    }

    calculateSizes() {
        const length = this.calculator.querySelector('input[name="length"]');
        const width = this.calculator.querySelector('input[name="width"]');
        const height = this.calculator.querySelector('input[name="height"]');
        const count = this.calculator.querySelector('input[name="count-box"]');
        const sizes = this.calculator.querySelector('input[name="volume"]');

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
                                item.classList.remove('_hide')
                                this.changerequiredFields(item)
                            }
                            else {
                                item.classList.add('_hide')
                                this.changerequiredFields(item, false)
                            }
                        })

                        this.resetFields();
                        this.sliderAutoHeight();
                    }
                })
            });
        }
    }

    hideHiddenBoxes() {
        const hiddenItems = this.calculator.querySelectorAll('.hidden-item');
        const moreFields = this.calculator.querySelector('.more-fields');

        if (hiddenItems.length) {
            hiddenItems.forEach(item => {
                item.classList.add('_hide')
            })
        }

        if (moreFields) {
            moreFields.classList.remove('_active')
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
        const srevices = { name: 'all_services', value: [], price: 0 }
        let transportingType = '';


        fields.forEach(field => {
            let name = field.name
            let value = field.value

            if (name == 'count-box') value += ' шт.'
            if (name == 'count-pallet') value += ' шт.'
            if (name == 'volume') value += ' м³'



            if ((field.getAttribute('type') === 'radio' || field.getAttribute('type') === 'checkbox')) {
                if (field.checked) {
                    if (name == 'transporting') {
                        if (value.includes('короб')) {
                            transportingType = 'box';
                        }
                        else {
                            transportingType = 'pallet';
                        }
                    }

                    if (name == 'services') {
                        if (field.id == 'zabor_gruza') {
                            if (transportingType == 'box') {
                                srevices.price += +field.dataset.boxPrice
                            }
                            else {
                                srevices.price += +field.dataset.palletPrice
                            }
                        }
                        else {
                            srevices.price += +field.dataset.price
                        }

                        srevices.value.push(value)

                        resultArray.push({ name: field.id, value: value })
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
        resultArray.push({ name: 'no_sale_price', value: this.totalPrice })
        resultArray.push({ name: 'total_price', value: this.price })

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
        let volume = 1;
        this.salePercent = this.saleFirstPercent

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

            if (item.name == 'volume') {
                volume = +item.value.replace(/[^0-9.]+/gi, '');
            }


            if (item.name == 'all_services') {
                if (item.price > 0) {
                    if (transportingType == 'box') {
                        this.servicesPrice = item.price * countBox
                    }
                    else {
                        this.servicesPrice = item.price * countPallet
                    }
                }
                else {
                    this.servicesPrice = 0
                }
            }

        })


        if (transportingType == 'box') {
            count = countBox;
            for (let i = 0; i < sales['box'].length; i++) {
                const sale = sales['box'][i];
                if (i != sales['box'].length - 1) {
                    if (volume >= +sale['diapason'][0] && volume <= +sale['diapason'][1]) {
                        this.salePercent += +sale['percent'] / 100
                    }
                    else {
                        this.salePercent = this.saleFirstPercent
                    }
                }
                else {
                    if (volume >= +sale['diapason'][0]) {
                        this.salePercent += +sale['percent'] / 100
                    }
                }
            }
            this.renderPrice(volume, this.boxPrice);
        }
        else {
            count = countPallet;
            for (let i = 0; i < sales['pallet'].length; i++) {
                const sale = sales['pallet'][i];
                if (i != sales['pallet'].length - 1) {
                    if (count >= +sale['diapason'][0] && count <= +sale['diapason'][1]) {
                        this.salePercent += +sale['percent'] / 100
                        break;
                    }
                    else {
                        this.salePercent = this.saleFirstPercent
                    }
                }
                else {
                    if (count >= +sale['diapason'][0]) {
                        this.salePercent += +sale['percent'] / 100
                    }
                }
            }

            this.renderPrice(count, this.palletPrice);
        }

        if (this.salePercentPromocode && this.promocode != this.defaultPromocode) {
            this.updatePrice(this.salePercentPromocode);
        }
        else {
            this.updatePrice(this.salePercent);
        }
    }

    renderPrice(count, price) {
        this.price = count * price;

        this.price = this.price > this.minPrice ? this.price : this.minPrice;
        this.salePrice = this.price > this.minPrice ? (this.price) * this.salePercent : 0;

        this.servicesPrice = this.servicesPrice
        this.totalPrice = this.price - this.salePrice + this.servicesPrice;

        this.price = Math.round(this.price);
        this.salePrice = Math.round(this.salePrice);
        this.servicesPrice = Math.round(this.servicesPrice);
        this.totalPrice = Math.round(this.totalPrice);


        this.deliveryPriceElem.textContent = this.price;
        this.servicesPriceElem.textContent = this.servicesPrice;

        let totalPriceWithoutSales = Math.round(this.totalPrice + this.salePrice);

        if (totalPriceWithoutSales > this.totalPrice) {
            this.totalSaleElem.closest('li').classList.add('_active')
        }
        else {
            this.totalSaleElem.closest('li').classList.remove('_active')
        }

        if (totalPriceWithoutSales < this.minimum) {
            totalPriceWithoutSales = this.minimum
        }

        this.totalPriceElem.textContent = totalPriceWithoutSales;
        this.totalSaleElem.textContent = this.totalPrice;

        this.updatePriceFieldsInForm();
    }

    updatePrice(perscent) {
        this.salePrice = this.price > this.minimum ? (this.price) * perscent : 0;
        this.totalPrice = this.price - this.salePrice + this.servicesPrice;

        this.salePrice = Math.round(this.salePrice);
        this.totalPrice = Math.round(this.totalPrice);

        const totalPriceWithoutSales = Math.round(this.totalPrice + this.salePrice);
        if (totalPriceWithoutSales > this.totalPrice) {
            this.totalSaleElem.closest('li').classList.add('_active')
        }
        else {
            this.totalSaleElem.closest('li').classList.remove('_active')
        }

        this.totalPriceElem.textContent = totalPriceWithoutSales;
        this.totalSaleElem.textContent = this.totalPrice;

        this.showDiferentSales();
        this.updatePriceFieldsInForm();
    }

    showDiferentSales() {
        console.log(132456789);
        if (this.salePercentPromocode && this.promocode != this.defaultPromocode) {
            this.saleFromCountElem.classList.add('_none')
            this.saleFromFisrtElem.classList.add('_none')
            this.saleFromPrmocodeElem.classList.remove('_none')
            this.saleFromPrmocodeElem.querySelector('.percent').textContent = this.salePercentPromocode * 100
            this.saleFromPrmocodeElem.querySelector('.amount').textContent = Math.round(this.price * this.salePercentPromocode)
        }
        else {
            this.saleFromPrmocodeElem.classList.add('_none')
            this.saleFromFisrtElem.classList.remove('_none')

            this.saleFromFisrtElem.querySelector('.percent').textContent = this.saleFirstPercent * 100
            this.saleFromFisrtElem.querySelector('.amount').textContent = Math.round(this.price * this.saleFirstPercent)

            let perc = this.salePercent;

            if (this.salePercent + this.saleFirstPercent > this.saleMaxtPercent) {
                perc = this.salePercent - this.saleFirstPercent;
            }

            if (this.salePercent != this.saleFirstPercent) {
                this.saleFromCountElem.classList.remove('_none')
                this.saleFromCountElem.querySelector('.percent').textContent = Math.round(perc * 100)
                this.saleFromCountElem.querySelector('.amount').textContent = Math.round(this.price * perc)
            }
        }
    }

    updatePriceFieldsInForm() {
        const formSalePriceField = this.resultPage.querySelector('.form-hidden-field input[name="no_sale_price"]');
        const formTotalPriceField = this.resultPage.querySelector('.form-hidden-field input[name="total_price"]');
        if (formSalePriceField) {
            formSalePriceField.value = this.price + this.servicesPrice;
        }
        if (formTotalPriceField) {
            formTotalPriceField.value = this.totalPrice;
        }
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
                        const code = promocodes[i].code.toLocaleLowerCase()
                        if (input.value == code) {
                            span.classList.add('_valid')
                            span.innerHTML = 'Применен';

                            this.salePercentPromocode = promocodes[i].sale / 100
                            this.promocode = code
                            this.updatePrice(this.salePercentPromocode)
                            break;
                        }
                        else {
                            if (span.classList.contains('_valid')) {
                                span.classList.remove('_valid')
                                span.innerHTML = '<i></i><i></i><i></i>';

                                this.salePercentPromocode = false
                                this.promocode = this.defaultPromocode
                                this.updatePrice(this.salePercent);
                            }
                        }
                    };
                }
                else {
                    span.classList.remove('_active')
                    this.salePercentPromocode = false
                    this.promocode = this.defaultPromocode
                    this.updatePrice(this.salePercent);
                }
            })
        }
    }
}

export const calculator = new Calculator(document.querySelector('.calculator'));