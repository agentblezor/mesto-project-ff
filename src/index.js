
import '../pages/index.css';

import { initialCards } from '../scripts/cards.js';
import { createCard, handleDelete, handleLike } from '../scripts/card.js';
import { openPopup, closePopup } from '../scripts/modal.js';


import avatar from '../images/avatar.jpg';
import logo from '../images/logo.svg';

document.querySelector('.profile__image').style.backgroundImage = `url(${avatar})`;
document.querySelector('.logo').src = logo;


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

// Элементы профиля
const nameElement = document.querySelector('.profile__title');
const jobElement = document.querySelector('.profile__description');

// Формы
const formEdit = document.forms['edit-profile'];
const formAdd = document.forms['new-place'];

// Поля форм
const nameInput = formEdit.querySelector('.popup__input_type_name');
const jobInput = formEdit.querySelector('.popup__input_type_description');
const placeNameInput = formAdd.querySelector('.popup__input_type_card-name');
const urlInput = formAdd.querySelector('.popup__input_type_url');

// Открытие попапа редактирования
openButtonPopupEdit.addEventListener('click', () => {
  nameInput.value = nameElement.textContent;
  jobInput.value = jobElement.textContent;
  openPopup(popupEdit);
});

// Сохранение профиля
formEdit.addEventListener('submit', (evt) => {
  evt.preventDefault();
  nameElement.textContent = nameInput.value;
  jobElement.textContent = jobInput.value;
  closePopup(popupEdit);
});

// Открытие попапа новой карточки
openButtonPopupNewCard.addEventListener('click', () => {
  formAdd.reset();
  openPopup(popupNewCard);
});

// Добавление новой карточки
formAdd.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const cardData = { name: placeNameInput.value, link: urlInput.value };
  const newCard = createCard(cardData, handleDelete, handleLike, handleImageClick);
  document.querySelector('.places__list').prepend(newCard);
  closePopup(popupNewCard);
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

// Добавление карточек на страницу
initialCards.forEach((cardData) => {
  const card = createCard(cardData, handleDelete, handleLike, handleImageClick);
  document.querySelector('.places__list').append(card);
  
});
