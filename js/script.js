// Slider flowers first block and gallery
function smallSlider (sliderInner, sliderNext, sliderPrev) {
    const wrapper = document.querySelector(sliderInner);
    const btnNext = document.querySelector(sliderNext);
    const btnPrev = document.querySelector(sliderPrev);
    const slides = wrapper.querySelectorAll('div');
    const [firstSlide] = slides;
    const widthSlide = Number(window.getComputedStyle(firstSlide).width.replace("px", ""));
    let moving = 0;

    const altWidth = (slides.length * widthSlide) - (6 * widthSlide);

    const widthWrapper = altWidth;

    const shift = pixels => (wrapper.style.left = -pixels + 'px');

    shift(0);

    btnNext.addEventListener('click', () => {
        moving += widthSlide;
    
            if (moving > widthWrapper) {
                moving = 0;
            }

        shift(moving);
    });
    btnPrev.addEventListener('click', () => {
        moving -= widthSlide;
    
        if (moving < 0) {
            moving = widthWrapper;
        }
    
        shift(moving);
    });
}
smallSlider('.hero .slider-inner', '.hero .slider-next', '.hero .slider-prev');
smallSlider('.gallery-slider-inner', '.gallery-slider-next', '.gallery-slider-prev');

// Slider reviews
const reviews = document.querySelector('.reviews');
const slides = reviews.querySelectorAll('.slide');
const next = reviews.querySelector('.slider-next');
const prev = reviews.querySelector('.slider-prev');
const slidesWrapper = reviews.querySelector('.slider-wrapper');
const slidesField = reviews.querySelector('.slider-inner');
let slideIndex = 1;
let offset = 0;
let width;

const draw = () => {
    width = window.getComputedStyle(slidesWrapper).width;
    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slides.forEach(slide => {
        slide.style.width = width;
    });
};
draw();

window.addEventListener('resize', draw);

next.addEventListener('click', () => {
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
        offset = 0;
    } else {
        offset += +width.slice(0, width.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if(slideIndex == slides.length) {
        slideIndex = 1;
    } else {
        slideIndex++;
    }
});

prev.addEventListener('click', () => {
    if (offset == 0) {
        offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
        offset -= +width.slice(0, width.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if(slideIndex == 1) {
        slideIndex = slides.length;
    } else {
        slideIndex--;
    }
});



// Modal
function closeModal (modalSelector) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function openModal (modalSelector) {
    const modal = document.querySelector(modalSelector); 

    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

function modal(triggerSelector, modalSelector) {
    const modalTrigger = document.querySelectorAll(triggerSelector);
    const modal = document.querySelector(modalSelector);

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {            
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });
}

modal('[data-modal]', '.modal');
modal('[data-gallery]', '.modal.gallery');


// Gallery
function changeFullImage() {
    const imgsPreview = document.querySelectorAll('.img-wrapper');
    const imgFull = document.querySelector('.full-img img');

    imgsPreview.forEach(imgPreview => {
        imgPreview.addEventListener('click', (e) => {
            let target = e.target;
            imgFull.src = target.src;
        });
    });
}
changeFullImage();



// Forms
function forms(formSelector) {
    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            function showMessage(text) {
                const statusMessage = document.createElement('div');
                statusMessage.textContent = text;
                statusMessage.style.cssText = `
                    margin-top: 20px;
                    text-align: center;
                    color: red;
                `;
                form.append(statusMessage);
            
                return function () {
                    return statusMessage.remove();
                };
            }

            const pattern = /\d/g;
            const phone = e.target.querySelector('input[name="phone"]');
            if (!pattern.test(phone.value)) {
                const hideMessage = showMessage(message.failure);
                setTimeout(hideMessage, 5000);
                return;
            }

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key) {
                object[key] = value;
            });
            const json = JSON.stringify(object);
            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    // statusMessage.remove();
                    showThanksModal(message.success);
                    form.reset();
                } else {
                    showThanksModal(message.failure);
                }
            });
        });
    }


    // Message to user
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal-dialog');

        prevModalDialog.classList.add('hide');
        openModal('.modal');

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal-dialog');
        thanksModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-close" data-close>×</div>
                <div class="modal-title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            closeModal('.modal');
        }, 4000);
    };
}
forms('form');



// Сounter for cart
function counterFlower(cardSelector, inputSelector, btnPlusSelector, btnMinusSelector) {
    const inputs = document.querySelectorAll(inputSelector);
    const btnsPlus = document.querySelectorAll(btnPlusSelector);
    const btnsMinus = document.querySelectorAll(btnMinusSelector);
    const cards = document.querySelectorAll(cardSelector);

    function btnHandler(btnsSelector, countingFunc) {
        const btns = document.querySelectorAll(btnsSelector);

        btns.forEach(btn => {
            btn.addEventListener('click', e => {
                const parent = btn.closest(".flower-quantity");
                const targetInput = parent.querySelector("input");

                const newValue = countingFunc(targetInput);
                targetInput.value = newValue;
            })
        })
    }
    btnHandler('.counter-button.minus', subtraction);
    btnHandler('.counter-button.plus', addition);

    // вычитание
    function subtraction(input) {
        if (input.value <= 1) {
            return 1;
        }
        return +input.value-1;
    }

    // прибавление
    function addition(input) {
        return Number(input.value)+1;
    }
}
counterFlower('.card', 'input[name="counter"]', '.counter-button.plus', '.counter-button.minus');