const maleAvatarPlaceholder = require('./img/avatar1.png');
const femaleAvatarPlaceholder = require('./img/avatar2.png');

export function getAvatarPlaceholder(gender = 'male') {
  return gender === 'male' ? maleAvatarPlaceholder : femaleAvatarPlaceholder;
}

export function getWallPlaceholder() {
  return require('./img/wall.jpg');
}

export function hidePhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  return phoneNumber.split('').map((item, index) => {
    if (index < 4) {
      return '*';
    }
    return item;
  }).join('');
}
