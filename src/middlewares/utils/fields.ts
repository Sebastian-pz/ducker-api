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

export function noSpecialCharacters(input: string): boolean {
	const validation = [...input.matchAll(/[A-Za-z0-9]/g)];
	if (validation.length < input.length) return false;
	return true;
}
// ü ï ää ë üëö Ä Ë Ï Ö Ü
export function noSpecialCharactersContent(input: string): boolean {
	const validation = [...input.matchAll(/[{}]/g)];
	if (validation.length) return false;
	return true;
}
