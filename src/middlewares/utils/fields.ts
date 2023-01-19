/**
 * It is used for validate a nickname, it must not include these words
 * @param {String} nickname
 * @returns {Boolean} if nickname does not includes words, return true, else return false
 */
export function noBanWords(nickname: string): boolean {
  const banWords: string[] = [' ', 'admin', 'ducker', 'staff', 'moderator'];
  let isValid: boolean = true;

  banWords.forEach((word: string) => {
    if (nickname.toLowerCase().includes(word)) {
      isValid = false;
      return;
    }
  });
  return isValid;
}

/**
 * Checks the string and returns true if it does not have any special characters, otherwise returns false
 * @param {String} input
 * @returns {boolean} hasNoSpecialCharacters
 */
export function noSpecialCharacters(input: string): boolean {
  const validation = [...input.matchAll(/[A-Za-z0-9]/g)];
  if (validation.length < input.length) return false;
  return true;
}
// ü ï ää ë üëö Ä Ë Ï Ö Ü
/**
 * Checks the string and returns true if it does not have "{ }" characters, otherwise returns false
 * @param {string} input
 * @returns {boolean} hasNo{}Characters
 */
export function noSpecialCharactersContent(input: string): boolean {
  const validation = [...input.matchAll(/[{}]/g)];
  if (validation.length) return false;
  return true;
}
