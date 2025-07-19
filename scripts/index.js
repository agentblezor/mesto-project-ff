const cardList = document.querySelector('.places__list');
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

const openButtonPopupEdit = document.querySelector('.profile__edit-button');
const closeButtonPopupEdit = popupEdit.querySelector('.popup__close');
const openButtonPopupNewCard = document.querySelector('.profile__add-button');
const closeButtonPopupNewCard = popupNewCard.querySelector('.popup__close');
const closeButtonPopupImage = popupImage.querySelector('.popup__close');

const formEdit = document.forms['edit-profile'];
const nameInput = formEdit.querySelector('.popup__input_type_name');
const jobInput = formEdit.querySelector('.popup__input_type_description');
const nameElement = document.querySelector('.profile__title');
const jobElement = document.querySelector('.profile__description');

const formAdd = document.forms['new-place'];
const placeNameInput = formAdd.querySelector('.popup__input_type_card-name');
const urlInput = formAdd.querySelector('.popup__input_type_url');

const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');


function openPopup(popup) {
  popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscClose);
}
function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscClose);
}
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) closePopup(openedPopup);
  }
}


function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  nameElement.textContent = nameInput.value;
  jobElement.textContent = jobInput.value;
  closePopup(popupEdit);
}
formEdit.addEventListener('submit', handleProfileFormSubmit);


function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const cardData = {
    name: placeNameInput.value,
    link: urlInput.value
  };
  const newCard = createCard(cardData, handleDelete, handleLike, handleImageClick);
  cardList.prepend(newCard);
  formAdd.reset();
  closePopup(popupNewCard);
}
formAdd.addEventListener('submit', handleCardFormSubmit);


openButtonPopupEdit.addEventListener('click', () => openPopup(popupEdit));
closeButtonPopupEdit.addEventListener('click', () => closePopup(popupEdit));

openButtonPopupNewCard.addEventListener('click', () => openPopup(popupNewCard));
closeButtonPopupNewCard.addEventListener('click', () => closePopup(popupNewCard));

closeButtonPopupImage.addEventListener('click', () => closePopup(popupImage));


function handleDelete(card) {
  card.remove();
}
function handleLike(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}
function handleImageClick(name, link) {
  popupImageElement.src = link;
  popupImageElement.alt = name;
  popupCaption.textContent = name;
  openPopup(popupImage);
}


function createCard(cardData, handleDelete, handleLike, handleImageClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => handleDelete(cardElement));
  likeButton.addEventListener('click', handleLike);
  cardImage.addEventListener('click', () => handleImageClick(cardData.name, cardData.link));

  return cardElement;
}

initialCards.forEach((cardData) => {
  const card = createCard(cardData, handleDelete, handleLike, handleImageClick);
  cardList.append(card);
});
// ------ ЗАКРЫТИЕ ПОПАПОВ ПО ОВЕРЛЕЮ ------
document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('mousedown', function (evt) {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});