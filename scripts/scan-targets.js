export const scanTargets = [
	// Opening a Jira issue directly
	{
		getTarget: () => document.body,
		//getTarget: () => document.querySelector('[data-testid="issue.views.issue-details.issue-layout.issue-layout"]'),
		scanners: [
			'[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"] p',
			'[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"] li',

			'[data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"]',

			'[data-testid^="issue-comment-base.ui.comment.ak-comment."][data-testid$="-body"] p',
			'[data-testid^="issue-comment-base.ui.comment.ak-comment."][data-testid$="-body"] li',
		]
	},

	// Opening a Jira issue through a pop-up modal
	{
		getTarget: () => document.body,
		//getTarget: () => document.querySelector('[data-testid="issue.views.issue-details.issue-modal.modal-dialog"]'),
		scanners: [
			'[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"] p',
			'[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"] li',

			'[data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"]',

			'[data-testid^="issue-comment-base.ui.comment.ak-comment."][data-testid$="-body"] p',
			'[data-testid^="issue-comment-base.ui.comment.ak-comment."][data-testid$="-body"] li',
		]
	},

	// Cards in Sprint or Kanban views
	{
		getTarget: () => document.body,
		scanners: [
			'[data-component-selector="platform-card.ui.card.card-content.content-section"]',
		]
	},

	// Editing any input field
	{
		getTarget: () => document.body,
		scanners: [
			'[contenteditable="true"]',
		]
	},

	// Tooltips
	{
		getTarget: () => document.body,
		//getTarget: () => document.querySelector('.atlaskit-portal-container'),
		scanners: [
			'[role="tooltip"]',
		]
	}
];

