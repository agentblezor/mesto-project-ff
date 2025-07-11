// @todo: Темплейт карточки
const cardList = document.querySelector('.places__list');
// @todo: DOM узлы

// @todo: Функция создания карточки
function createCard(cardData, handleDelete) {
     const cardTemplate = document.querySelector('#card-template').content;
     const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
     const cardImage = cardElement.querySelector('.card__image');
     const cardTitle = cardElement.querySelector('.card__title');
     const deleteButton = cardElement.querySelector('.card__delete-button');

       cardImage.src = cardData.link;
       cardImage.alt = cardData.name;
       cardTitle.textContent = cardData.name;

// @todo: Функция удаления карточки
 deleteButton.addEventListener('click', function () {
    handleDelete(cardElement);
  });
  return cardElement;
}
function handleDelete(card) {
  card.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (cardData) {
  const card = createCard(cardData, handleDelete);
  cardList.append(card);
});
