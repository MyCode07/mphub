"use strict"

import { lockPadding, unLockPadding } from "../utils/lockPadding.js";
import { calculator } from "./calculator.js";

const url = adminajaxurl.ajaxurl;

document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('form')

    if (forms.length) {
        forms.forEach(form => {
            if (form.classList.contains('custom-form')) {
                form.addEventListener('submit', async function (e) {
                    e.preventDefault();
                    // calculator.resetCalculator();

                    let error = validateForm(form)

                    let formData = new FormData(form);
                    formData.append('action', 'send_form');


                    if (formFile && formFile.files[0]) {
                        formData.append('file', formFile.files[0]);
                    }

                    if (error === 0) {
                        form.classList.add('_sending');

                        jQuery.ajax({
                            url: url,
                            type: 'POST',
                            data: formData,
                            contentType: false,
                            processData: false,
                            cache: false,
                            success: function (data) {
                                data = JSON.parse(data);
                                console.log(data);
                                if (data.result) {
                                    sentMessage()
                                    form.reset();
                                    form.classList.remove('_sending');

                                    setTimeout(() => {
                                        resetForm(form)
                                    }, 5000);

                                    if (form.closest('.calculator')) {
                                        calculator.resetCalculator();
                                    }
                                }
                                else {
                                    failMessage()
                                    form.classList.remove('_sending');

                                    setTimeout(() => {
                                        resetForm(form)
                                    }, 5000);
                                }
                            },
                            complete: function () {
                                form.classList.remove('_sending');
                            },
                        });
                    }

                    else {
                        fillAllFields(form)

                        form.classList.remove('_sending');
                        setTimeout(() => {
                            resetForm(form)
                        }, 5000);
                    }
                })
            }
        })
    }
});

export function validateForm(form) {
    let error = 0;
    const formReq =
        [...form.querySelectorAll('[data-required] input')]
            .concat([...form.querySelectorAll('[data-required] textarea')])
            .concat([...form.querySelectorAll('[data-required] select')])

    for (let i = 0; i < formReq.length; i++) {
        const input = formReq[i]

        formRemoveError(input);
        validateInput()

        input.addEventListener('input', function () {
            formRemoveError(input);
            validateInput()
        })

        function validateInput() {
            if (input.tagName === 'SELECT') {
                const options = input.querySelectorAll('option[data-index]');

                if (options.length) {
                    const selectedoption = [...options].map(item => {
                        if (item.selected) {
                            return item;
                        }
                    }).filter(item => item != undefined);

                    if (!selectedoption.length) {
                        formAddError(input);
                        error++;
                    }
                }
                else {
                    formAddError(input);
                    error++;
                }
            }
            else {
                if (input.getAttribute('type') === 'email') {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                }
                else {
                    if (input.getAttribute('name') === 'phone') {
                        if (/[_]/.test(input.value) || input.value.length < 18) {
                            formAddError(input);
                            error++;
                        }

                    }
                    else {
                        if (input.getAttribute('type') === 'number' && input.getAttribute('name') !== "volume") {
                            if (input.value < 0) {
                                formAddError(input);
                                error++;
                            }
                        }

                        if (input.value.length < 1) {
                            formAddError(input);
                            error++;
                        }
                    }
                }
            }
        }
    }

    const checkBoxContainers = form.querySelectorAll('[data-checkbox-container]')
    let checkedArr = [];
    for (let i = 0; i < checkBoxContainers.length; i++) {
        const checkBoxes = [...checkBoxContainers[i].querySelectorAll('input')]

        checkBoxes.forEach(input => {

            input.addEventListener('input', function () {
                input.closest('[data-checkbox-container]').classList.remove('_error')
                resetForm(form)
            })
        })

        checkedArr.push(checkBoxes.some(input => {
            formRemoveError(input);
            if (!input.checked) input.closest('[data-checkbox-container]').classList.add('_error')
            else input.closest('[data-checkbox-container]').classList.remove('_error')
            return input.checked
        }))
    }

    const checked = checkedArr.every(check => { return check == true })
    if (!checked === true) error++

    return error;
}

function formAddError(input) {
    input.closest('.form__item').classList.add('_error');
}

function formRemoveError(input) {
    input.closest('.form__item').classList.remove('_error');
}

function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

const thanksPopup = document.querySelector('.popup#thanks');
const failPopup = document.querySelector('.popup#fail');
function sentMessage() {
    const activePopup = document.querySelector('.popup._open');
    if (activePopup) activePopup.classList.remove('_open');

    thanksPopup.classList.add('_open')
    lockPadding();
}

function failMessage() {
    failPopup.classList.add('_open')
    lockPadding();
}

function fillAllFields(form) {
}

function resetForm(form) {
}


const formFile = document.querySelector('input[name="file"]');
if (formFile) {
    formFile.addEventListener('change', () => {
        uploadFile(formFile.files[0]);
    });

    function uploadFile(file) {
        if (!['application/msword', 'application/pdf', 'application/vnd.ms-powerpoint', 'text/plain'].includes(file.type)) {
            alert('Разрешены только текстовые документы.');
            document.querySelector('#filename').innerHTML = '';
            formFile.value = '';
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('Файл должен быть менее 2 МБ.');
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            document.querySelector('#filename').innerHTML = file.name;
        };

        reader.onerror = function (e) {
            alert('Ошибка');
        };

        reader.readAsDataURL(file);
    }
}