import bcrypt from 'bcrypt';

export const generatePass = (fullname: string): string => {
  let password: string = '';

  const [name, lastname] = fullname.trim().split(' ');

  while (password.length < 8) {
    let charA = name[Math.floor(Math.random() * name.length - 1)];
    let charB = name[Math.floor(Math.random() * lastname.length - 1)];

    password += charA;
    password += charB;
  }
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

export const generateNickname = (fullname: string): string => {
  const [name, lastname] = fullname.trim().split(' ');
  const max = 10000;
  return `@${name}${lastname[0]}${lastname[lastname.length - 1]}${Math.floor(
    Math.random() * max
  )}`.toLowerCase();
};
