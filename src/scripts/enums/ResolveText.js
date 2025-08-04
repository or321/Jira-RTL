/**
 * Enum representing strategies for determining the text content for which to check RTL
 * 
 * @readonly
 * @enum {(el: HTMLElement) => string | null}
 */
export const ResolveText = {
	/**
	 * Check RTL on element inner text
	 * @param {HTMLElement} el
	 * @returns {string}
	 */
	INNER_TEXT: el => el.innerText,

	/**
	 * Check RTL on element value
	 * @param {HTMLElement} el
	 * @returns {string}
	 */
	VALUE: el => el.value
};