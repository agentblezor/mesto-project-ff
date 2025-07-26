function showInputError (formElement, inputElement, errorMessage) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
inputElement.classList.add('popup__input_type_error');
 errorElement.textContent = errorMessage;
   errorElement.classList.add('popup__input-error_active');
}

export function hideInputError (formElement, inputElement) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove('popup__input_type_error');
  errorElement.textContent = '';
   errorElement.classList.remove('popup__input-error_active');
}

function checkInputValidity(formElement, inputElement) {
  if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity('Вы пропустили это поле.');
  } else if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы');
  } else if (inputElement.validity.tooShort) {
    inputElement.setCustomValidity(`Минимальное количество символов: ${inputElement.minLength}. Длина текста сейчас ${inputElement.value.length} символ.`);
  } else if (inputElement.type === 'url' && inputElement.validity.typeMismatch) {
    inputElement.setCustomValidity('Введите адрес сайта.');
} else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
}




function toggleButtonState(inputList, buttonElement) {
  const hasInvalidInput = inputList.some(input => !input.validity.valid);
  if (hasInvalidInput) {
    buttonElement.disabled = true;
    buttonElement.classList.add('popup__button_inactive');
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove('popup__button_inactive');
  }
}

export function setEventListeners(formElement) {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');


  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
}




