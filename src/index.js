import '../pages/index.css';
import { clearValidation, enableValidation } from '../components/validation.js';
import { createCard, handleLike, confirmDelete } from '../components/card.js';
import { openPopup, closePopup } from '../components/modal.js';
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, updateAvatar } from '../components/api.js';

import logo from '../images/logo.svg';
import editIcon from '../images/edit-icon.svg';

// Устанавливаем иконку редактирования аватара
document.querySelector('.profile__image').style.setProperty(
  '--edit-icon',
  `url(${editIcon})`
);




let cardToDelete = null; // переменная для хранения удаляемой карточки

// Обработчик удаления (открывает модальное окно)
function handleDeleteClick(cardElement, cardId) {
  cardToDelete = { element: cardElement, id: cardId };
  openPopup(document.querySelector('.popup_type_delete-card'));
}

// Элементы профиля
const nameElement = document.querySelector('.profile__title');
const jobElement = document.querySelector('.profile__description');
const avatarElement = document.querySelector('.profile__image');
const placesList = document.querySelector('.places__list');

// Логотип
document.querySelector('.logo').src = logo;

// функция UX
function renderLoading(isLoading, buttonElement, initialText = 'Сохранить') {
  buttonElement.textContent = isLoading ? 'Сохранение...' : initialText;
}

// загрузка данных пользователя и карточек с сервера
let currentUserId = '';

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    nameElement.textContent = userData.name;
    jobElement.textContent = userData.about;
    avatarElement.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((cardData) => {
      const card = createCard(cardData, handleDeleteClick, handleLike, handleImageClick, currentUserId);
      placesList.append(card);
    });
  })
  .catch((err) => console.error(err));

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
  clearValidation(formEdit, validationConfig);
  openPopup(popupEdit);
});

// Сохранение профиля (PATCH-запрос)
formEdit.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);

  updateUserInfo(nameInput.value, jobInput.value)
    .then((userData) => {
      nameElement.textContent = userData.name;
      jobElement.textContent = userData.about;
      closePopup(popupEdit);
    })
    .catch((err) => console.error(err))
    .finally(() => renderLoading(false, submitButton));
});

// Открытие попапа новой карточки
openButtonPopupNewCard.addEventListener('click', () => {
  formAdd.reset();
  clearValidation(formAdd, validationConfig);
  openPopup(popupNewCard);
});

// Добавление новой карточки
formAdd.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);

  addNewCard(placeNameInput.value, urlInput.value)
    .then((cardData) => {
      const newCard = createCard(cardData, handleDeleteClick, handleLike, handleImageClick, currentUserId);
      placesList.prepend(newCard);
      closePopup(popupNewCard);
    })
    .catch((err) => console.error(err))
    .finally(() => renderLoading(false, submitButton));
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

// Попап аватара
const popupAvatar = document.querySelector('.popup_type_avatar');
popupAvatar.querySelector('.popup__close').addEventListener('click', () => closePopup(popupAvatar));

const avatarForm = document.forms['update-avatar'];
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar-link');

// Открытие попапа аватара
avatarElement.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openPopup(popupAvatar);
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);

  updateAvatar(avatarInput.value)
    .then((userData) => {
      avatarElement.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(popupAvatar);
    })
    .catch((err) => console.error(err))
    .finally(() => renderLoading(false, submitButton));
});

// Попап удаления карточки
const popupDeleteCard = document.querySelector('.popup_type_delete-card');
const deleteCardForm = popupDeleteCard.querySelector('.popup__form');

deleteCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (cardToDelete) {
    confirmDelete(cardToDelete.id)
      .then(() => {
        cardToDelete.element.remove();
        cardToDelete = null;
        closePopup(popupDeleteCard);
      })
      .catch((err) => console.error(`Ошибка удаления: ${err}`));
  }
});

// Закрытие попапа кликом по оверлею
document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

// Конфиг валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active'
};

enableValidation(validationConfig);
