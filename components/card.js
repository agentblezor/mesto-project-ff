import { likeCard, unlikeCard, deleteCard } from './api.js';

// Лайк карточки
export function handleLike(likeButton, likeCount, cardId) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const action = isLiked ? unlikeCard : likeCard;

  return action(cardId)
    .then((updatedCard) => {
      likeCount.textContent = updatedCard.likes.length;
      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch((err) => console.error(`Ошибка лайка: ${err}`));
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

  // Кнопка удаления только для своих карточек
  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => handleDelete(cardElement, cardData._id));
  }

  // Если пользователь уже лайкнул
  if (cardData.likes.some(user => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => handleLike(likeButton, likeCount, cardData._id));
  cardImage.addEventListener('click', () => handleImageClick(cardData.name, cardData.link));

  return cardElement;
}

// Удаление карточки (возвращает промис)
export function confirmDelete(cardId) {
  return deleteCard(cardId);
}










