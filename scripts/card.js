import { likeCard, unlikeCard, deleteCard } from '../src/api.js';
import { openPopup } from './modal.js';

let cardToDelete = null; // глобальная переменная

// Лайк карточки
export function handleLike(likeButton, likeCount, cardId) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const action = isLiked ? unlikeCard : likeCard;

  action(cardId)
    .then((updatedCard) => {
      likeCount.textContent = updatedCard.likes.length;
      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch(err => console.error(`Ошибка лайка: ${err}`));
}

// Создание карточки
export function createCard(cardData, handleDelete, handleLike, handleImageClick, currentUserId) {
  const template = document.querySelector('#card-template').content;
  const cardElement = template.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Удаление только для своих карточек
  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => handleDelete(cardElement, cardData._id));
  }

  // Если пользователь лайкнул
  if (cardData.likes.some(user => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => handleLike(likeButton, likeCount, cardData._id));
  cardImage.addEventListener('click', () => handleImageClick(cardData.name, cardData.link));

  return cardElement;
}

// Обработка удаления карточки
export function handleDelete(cardElement, cardId) {
  cardToDelete = { element: cardElement, id: cardId };
  openPopup(document.querySelector('.popup_type_delete-card'));
}

// Функция для фактического удаления
export function confirmDelete() {
  if (cardToDelete) {
    deleteCard(cardToDelete.id)
      .then(() => {
        cardToDelete.element.remove();
        cardToDelete = null;
      })
      .catch(err => console.error(`Ошибка удаления: ${err}`));
  }
}





