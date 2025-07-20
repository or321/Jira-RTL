export const scanTargets = [
	{
		getTarget: () => document.body,
		scanners: [
			'[data-component-selector="platform-card.ui.card.card-content.content-section"]',
			'[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"]',
			'[data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"]',
			'[data-testid^="issue-comment-base.ui.comment.ak-comment."][data-testid$="-body"]',
			'[contenteditable="true"]'
		]
	},
	{
		getTarget: () => document.body,
		//getTarget: () => document.querySelector('.atlaskit-portal-container'),
		scanners: ['[role="tooltip"]']
	}
];

