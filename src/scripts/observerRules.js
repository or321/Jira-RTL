import { Behavior } from "./enums/Behavior";
import { ResolveTarget } from "./enums/ResolveTarget";
import { ResolveText } from "./enums/ResolveText";

/**
 * Configuration of rules for matching elements to apply RTL on, and their associated behavior strategy.
 * 
 * @type {Array<{ selectors: string[], compiledSelector: string, behavior: Behavior, resolveTarget: ResolveTarget, resolveText: ResolveText }>}
 */
export const observerRules = [
	{
		selectors: [
			/* Jira issue view (page or modal) */
			'[data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"]',

			'[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"] .ak-renderer-document p',
			'[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"] .ak-renderer-document li',

			'[data-testid^="issue-comment-base.ui.comment.ak-comment."][data-testid$="-body"] .ak-renderer-document p',
			'[data-testid^="issue-comment-base.ui.comment.ak-comment."][data-testid$="-body"] .ak-renderer-document li',

			/* Cards in Sprint or Kanban board view */
			'[data-component-selector="platform-card.ui.card.card-content.content-section"]',

			/* Tooltips */
			'.atlaskit-portal-container [role="tooltip"]',
		],
		behavior: Behavior.DEFAULT,
		resolveTarget: ResolveTarget.SELF,
		resolveText: ResolveText.INNER_TEXT
	},

	{
		selectors: [
			/* Issue table view */
			'table[data-vc="issue-table"] [data-testid="native-issue-table.common.ui.issue-cells.issue-summary.issue-summary-cell"]'
		],
		behavior: Behavior.DEFAULT,
		resolveTarget: el => el.closest('[data-testid="issue-field-inline-edit-read-view-container.ui.container"]'),
		resolveText: ResolveText.INNER_TEXT
	},

	// Editable Fields with content editor
	{
		selectors: [
			'[contenteditable="true"]',
			'.ak-editor-content-area'
		],
		behavior: Behavior.CONTENT_EDITABLE,
		resolveTarget: ResolveTarget.SELF,
		resolveText: ResolveText.INNER_TEXT
	},

	// Input fields
	{
		selectors: [
			'input#summary-field',
			'[data-testid="issue.views.issue-base.foundation.summary.heading.writeable"] textarea',
		],
		behavior: Behavior.INPUT,
		resolveTarget: ResolveTarget.SELF,
		resolveText: ResolveText.VALUE
	},
];

// Build a combined css selector for each individual observer rule
observerRules.forEach(rule => {
	rule.compiledSelector = rule.selectors.join(',');
});

/**
 * Combined css selector for all the observer rules items.
 * Used as fast check to decide if an element is matched, before processing it.
 */
export const combinedSelector = observerRules
	.flatMap(target => target.selectors)
	.join(', ');