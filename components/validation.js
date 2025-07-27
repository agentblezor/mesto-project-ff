// Показать сообщение об ошибке
function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }
}

// Скрыть сообщение об ошибке
export function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
}

// Проверка валидности поля
function checkInputValidity(formElement, inputElement, config) {
  if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity('Вы пропустили это поле.');
  } else if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(
      'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.'
    );
  } else if (inputElement.validity.tooShort) {
    inputElement.setCustomValidity(
      `Минимальное количество символов: ${inputElement.minLength} . Длина текста сейчас: ${inputElement.value.length}символ.`
    );
  } else if (inputElement.type === 'url' && inputElement.validity.typeMismatch) {
    inputElement.setCustomValidity('Введите адрес сайта.');
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
}

// Переключение состояния кнопки
function toggleButtonState(inputList, buttonElement, config) {
  const hasInvalidInput = inputList.some(input => !input.validity.valid);
  if (hasInvalidInput) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
}

// Установка слушателей событий на форму
export function setEventListeners(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

// Очистка ошибок при повторном открытии формы
export function clearValidation(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach(inputElement => {
    hideInputError(formElement, inputElement, config);
    inputElement.setCustomValidity('');
  });

  toggleButtonState(inputList, buttonElement, config);
}

// Включение валидации для всех форм
export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach(formElement => {
    formElement.setAttribute('novalidate', true);
    setEventListeners(formElement, config);
  });
}
