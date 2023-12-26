import { validateForm } from "./forms.js";

class Calculator {

    constructor(calculator) {
        this.calculator = calculator;

        if (this.calculator) {
            this.next = this.calculator.querySelector('.next')
            this.prev = this.calculator.querySelector('.prev')
            this.wrapper = this.calculator.querySelector('.calculator-form__wrapper');
            this.pageWrapper = this.calculator.querySelector('.calculator-form')
            this.resultPage = this.calculator.querySelector('.page-calculator__result')
            this.allPages = this.calculator.querySelectorAll('.page-calculator')

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
        this.goBack();
    }

    sliderAutoHeight() {
        const activeSlide = this.calculator.querySelector('.page-calculator._active');
        this.wrapper.style.maxHeight = activeSlide.getBoundingClientRect().height + 'px'
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
                console.log('end');
                this.showresulPage();
            }
        }
        else {
            if (prevSlide) {
                prevSlide.classList.add('_active');

                activeSlide.classList.remove('_active');

                if (page == 2) {
                    console.log('start');
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

            console.log('error ' + error);

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
        const count = this.calculator.querySelector('[data-required] [name="count"]');
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
        const fields = this.wrapper.querySelectorAll('input');
        const resultArray = []
        const sizes = []
        const srevices = { name: 'services', value: '' }
        fields.forEach(field => {
            let name = field.name
            let value = field.value

            if (name == 'count') value += ' шт.'
            if (name == 'volume') value += ' м³'

            if ((field.getAttribute('type') === 'radio' || field.getAttribute('type') === 'checkbox')) {
                if (field.checked) {
                    if (name == 'services') {
                        srevices.value += value
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

        console.log(srevices);
        resultArray.push(srevices)


        let sizesString = sizes.join('x')
        sizesString += ' см';

        resultArray.push({ name: 'sizes', value: sizesString })

        this.renderResultsForm(resultArray);
        this.renderResultsHtml(resultArray);
    }

    renderResultsHtml(array) {
        array.forEach(item => {
            const outputelem = this.resultPage.querySelector(`[data-id="${item.name}"]`)
            if (outputelem) {
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
}

export const calculator = new Calculator(document.querySelector('.calculator'));