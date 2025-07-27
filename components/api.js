// Конфигурация API
const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-42', // замени на свой cohort ID
  headers: {
    authorization: '5a4cbc3f-6184-4ebe-b963-dc0d76514d38', // замени на свой токен
    'Content-Type': 'application/json'
  }
};

// Проверка ответа от сервера
const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
   // если ошибка, отклоняем промис
  return Promise.reject(`Ошибка: ${res.status}`);
};

// 1. Получить данные пользователя
export function getUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  }).then(checkResponse);
}

// 2. Получить карточки
export function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(checkResponse);
}

// 3. Обновить информацию о пользователе
export function updateUserInfo(name, about) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  }).then(checkResponse);
}

// 4. Добавить новую карточку
export function addNewCard(name, link) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  }).then(checkResponse) 
   
}


// 5. Удалить карточку
export function deleteCard(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
}

// 6. Поставить лайк
export function likeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  }).then(checkResponse);
}

// 7. Убрать лайк
export function unlikeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
}

// 8. Обновить аватар пользователя
export function updateAvatar(avatarLink) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarLink })
  }).then(checkResponse);
}
