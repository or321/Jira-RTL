import { Behavior } from "./enums/Behavior";
import { ResolveTarget } from "./enums/ResolveTarget";
import { ResolveText } from "./enums/ResolveText";

/**
 * Configuration of rules for matching elements to apply RTL on, and their associated behavior strategy.
 * 
 * @type {Array<{ selectors: string[], compiledSelector: string, behavior: Behavior, resolveTarget: ResolveTarget, resolveText: ResolveText }>}
 */
export const observerRules = [
	/* Simple elements where RTL is applied directly */
	{
		selectors: [
			// Issue view - the issue summary
			'[data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"]',

			// Elements which on click turn to editable with the Jira text editor.
			// This includes jira issue description, comments in the issue activity section, and more
			'.ak-renderer-document p',
			'.ak-renderer-document li',

			// Cards in Sprint or Kanban board view
			'[data-component-selector="platform-card.ui.card.card-content.content-section"]',

			// Versions/releases table view
			'[data-testid="project-directories.versions.main.table.table-container"] table > tbody > tr > td',

			// Work items table view for a specific version/release
			'[data-testid="software-releases-version-detail-issue-list.ui.issues.issue-card"] div:first-child > div[role="presentation"]',

			// Issue description inside an issue-relationship table
			'[data-testid="issue-field-summary.ui.inline-read.link-item--primitive--container"]',

			// Recent work items in a user profile view
			'[data-testid="profile-work-list"] li[data-testid="work-item"]',

			// Items in the "your-work" page (accessible by clicking on the "For you" option in the main menu)
			'[id^="your-work-page-tabs"] [data-test-id^="global-pages.home.ui.tab-container.tab.item-list.item-link"]',

			// Issues table inside dashboard gadgets
			'.search-results-dashboard-item-issue-table table.issue-table td.summary',

			// Items in sidebar modal dialogs
			'.atlaskit-portal-container span',

			// Tooltips
			'.atlaskit-portal-container [role="tooltip"]',
		],
		behavior: Behavior.DEFAULT,
		resolveTarget: ResolveTarget.SELF,
		resolveText: ResolveText.INNER_TEXT
	},

	/* Issues table view - the cells containing the issues summary */
	{
		selectors: [
			'table[data-vc="issue-table"] [data-testid="native-issue-table.common.ui.issue-cells.issue-summary.issue-summary-cell"]'
		],
		behavior: Behavior.DEFAULT,
		resolveTarget: el => el.closest('[data-testid="issue-field-inline-edit-read-view-container.ui.container"]'),
		resolveText: ResolveText.INNER_TEXT
	},

	/* Header of an issue-relationship table */
	{
		selectors: [
			'[data-testid="issue.issue-view.views.issue-base.content.issue-links.issue-links-view.relationship-heading"]'
		],
		behavior: Behavior.DEFAULT,
		resolveTarget: ResolveTarget.PARENT,
		resolveText: ResolveText.INNER_TEXT
	},

	/* Title of issues in the modal dialog of search results */
	{
		selectors: [
			'[data-test-id="search-dialog-dialog-wrapper"] [data-vc="search-result-section"] .SearchDialogResultTitle'
		],
		behavior: Behavior.DEFAULT,
		resolveTarget: ResolveTarget.PARENT,
		resolveText: ResolveText.INNER_TEXT
	},

	/* Title of issue in a hover-card */
	{
		selectors: [
			'[data-testid="hover-card"] [data-smart-element="Title"]'
		],
		behavior: Behavior.DEFAULT,
		resolveTarget: el => el.closest('[data-testid="smart-element-group"]'),
		resolveText: ResolveText.INNER_TEXT
	},

	/* Description of issue in a hover-card */
	{
		selectors: [
			'[data-testid="hover-card"] [data-testid="smart-element-text"]'
		],
		behavior: Behavior.DEFAULT,
		resolveTarget: ResolveTarget.PARENT,
		resolveText: ResolveText.INNER_TEXT
	},

	/* Issues in the "Work" page of a user */
	{
		selectors: [
			'[data-testid="recent-work-component"] [data-testid="objectName"]'
		],
		behavior: Behavior.DEFAULT,
		resolveTarget: ResolveTarget.PARENT,
		resolveText: ResolveText.INNER_TEXT
	},

	/* Editable Fields with content editor */
	{
		selectors: [
			'[contenteditable="true"]',
			'.ak-editor-content-area',
		],
		behavior: Behavior.CONTENT_EDITABLE,
		resolveTarget: ResolveTarget.SELF,
		resolveText: ResolveText.INNER_TEXT
	},

	/* Input fields */
	{
		selectors: [
			// A generic search field
			'input[data-testid="searchfield"]',

			// The "summary" field in the modal for creating new issues
			'input#summary-field',

			// Issue view - the issue summary (in editable state)
			'[data-testid="issue.views.issue-base.foundation.summary.heading.writeable"] textarea',

			// The main search input at the top of the page
			'input[data-test-id="search-dialog-input"]',

			// Filter field in the "Work" page of a user
			'[data-testid="recent-work-component"] [data-testid="recent-work_search-input"]',

			// Filter fields in sidebar modal dialogs
			'.atlaskit-portal-container input[data-ds--text-field--input="true"]',
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