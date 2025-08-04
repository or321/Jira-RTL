/**
 * Enum representing behavior type for matching elements
 * 
 * @readonly
 * @enum {string}
 */
export const Behavior = {
	/** For general text elements */
	DEFAULT: 'default',
	/** For input and textarea elements */
	INPUT: 'input',
	/** For elements with content editor */
	CONTENT_EDITABLE: 'content_editable',
};