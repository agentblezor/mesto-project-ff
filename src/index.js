import '../pages/index.css';
import { hideInputError, setEventListeners } from './validation.js';
import { createCard, handleDelete, handleLike, confirmDelete } from '../scripts/card.js';
import { openPopup, closePopup } from '../scripts/modal.js';
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard,  updateAvatar } from './api.js';

import logo from '../images/logo.svg';
import editIcon from '../images/edit-icon.svg';

document.querySelector('.profile__image').style.setProperty(
  '--edit-icon',
  `url(${editIcon})`
);

// Элементы профиля
const nameElement = document.querySelector('.profile__title');
const jobElement = document.querySelector('.profile__description');
const avatarElement = document.querySelector('.profile__image');
const placesList = document.querySelector('.places__list');

// Логотип
document.querySelector('.logo').src = logo;

// функция UX
function renderLoading(isLoading, buttonElement, initialText = 'Сохранить') {
  if (isLoading) {
    buttonElement.textContent = 'Сохранение...';
  } else {
    buttonElement.textContent = initialText;
  }
}

// загрузка данных пользователя и карточек с сервера
let cardToDelete = null
let currentUserId = '';

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
     currentUserId = userData._id;
    nameElement.textContent = userData.name;
    jobElement.textContent = userData.about;
    avatarElement.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((cardData) => {
      const card = createCard(cardData, handleDelete, handleLike, handleImageClick, currentUserId);
      placesList.append(card);
    });
  })
  .catch((err) => {
    console.log(err); // выводим ошибку в консоль
  }); 



// Попапы
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

// Кнопки
const openButtonPopupEdit = document.querySelector('.profile__edit-button');
const openButtonPopupNewCard = document.querySelector('.profile__add-button');

// Закрывающие кнопки
popupEdit.querySelector('.popup__close').addEventListener('click', () => closePopup(popupEdit));
popupNewCard.querySelector('.popup__close').addEventListener('click', () => closePopup(popupNewCard));
popupImage.querySelector('.popup__close').addEventListener('click', () => closePopup(popupImage));

// Формы
const formEdit = document.forms['edit-profile'];
const formAdd = document.forms['new-place'];

// Поля форм
const nameInput = formEdit.querySelector('.popup__input_type_name');
const jobInput = formEdit.querySelector('.popup__input_type_description');
const placeNameInput = formAdd.querySelector('.popup__input_type_card-name');
const urlInput = formAdd.querySelector('.popup__input_type_url');

// Открытие попапа редактирования профиля
openButtonPopupEdit.addEventListener('click', () => {
  nameInput.value = nameElement.textContent;
  jobInput.value = jobElement.textContent;
  clearValidation(formEdit);
  openPopup(popupEdit);
});

// Сохранение профиля (PATCH-запрос)
formEdit.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const submitButton = formEdit.querySelector('.popup__button');
  renderLoading(true, submitButton);

  updateUserInfo(nameInput.value, jobInput.value)
    .then((userData) => {
      nameElement.textContent = userData.name;
      jobElement.textContent = userData.about;
      closePopup(popupEdit);
    })
    .catch((err) => {
    console.log(err); // выводим ошибку в консоль
  })
    .finally(() => {
      renderLoading(false, submitButton);
    });
});


// Открытие попапа новой карточки
openButtonPopupNewCard.addEventListener('click', () => {
  formAdd.reset();
  clearValidation(formAdd);
  openPopup(popupNewCard);
});

// Добавление новой карточки (POST-запрос)
formAdd.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const submitButton = formAdd.querySelector('.popup__button');
  renderLoading(true, submitButton);

  addNewCard(placeNameInput.value, urlInput.value)
    .then((cardData) => {
      const newCard = createCard(cardData, handleDelete, handleLike, handleImageClick, currentUserId);
      placesList.prepend(newCard);
      closePopup(popupNewCard);
    })
    .catch((err) => {
    console.log(err); // выводим ошибку в консоль
  })
    .finally(() => {
      renderLoading(false, submitButton);
    });
});


// Просмотр изображения
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

function handleImageClick(name, link) {
  popupImageElement.src = link;
  popupImageElement.alt = name;
  popupCaption.textContent = name;
  openPopup(popupImage);
}

// Очистка ошибок валидации
function clearValidation(formElement) {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement);
    inputElement.setCustomValidity('');
  });
}

// Валидация
function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => evt.preventDefault());
    setEventListeners(formElement, config);
  });
}

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);

// Попап и форма
const popupAvatar = document.querySelector('.popup_type_avatar');
popupAvatar.querySelector('.popup__close')
  .addEventListener('click', () => closePopup(popupAvatar));

const avatarForm = document.forms['update-avatar'];
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar-link');



// Открытие попапа
avatarElement.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm);
  openPopup(popupAvatar);
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const submitButton = avatarForm.querySelector('.popup__button'); // <-- исправлено
  renderLoading(true, submitButton);

  const avatarUrl = avatarInput.value;
  
  updateAvatar(avatarUrl)
    .then((userData) => {
      avatarElement.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(popupAvatar);
    })
    .catch((err) =>{
    console.log(err); // выводим ошибку в консоль
  })
    .finally(() => {
      renderLoading(false, submitButton); // Возвращаем текст кнопки
    });
});
const popupDeleteCard = document.querySelector('.popup_type_delete-card');
const deleteCardForm = popupDeleteCard.querySelector('.popup__form');
const closeDeletePopupButton = popupDeleteCard.querySelector('.popup__close');

// Закрытие попапа удаления
closeDeletePopupButton.addEventListener('click', () => closePopup(popupDeleteCard));

// Подтверждение удаления
deleteCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  confirmDelete();
  closePopup(popupDeleteCard);
});