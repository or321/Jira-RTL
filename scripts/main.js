import { isRTL } from "./rtl";

function applyRTL(el) {
	el.style.direction = "rtl";
	el.style.textAlign = "right";
	el.dataset.rtlApplied = "true";
}

function resetRTL(el) {
	el.style.direction = "";
	el.style.textAlign = "";
	el.dataset.rtlApplied = "";
}

function setDirection(el) {
	if (el && !el.dataset.rtlApplied && isRTL(el.innerText)) {
		applyRTL(el);
	}
	else if (el && el.dataset.rtlApplied && !isRTL(el.innerText)) {
		resetRTL(el)
	}
}

function getCommentBodyElements() {
	return Array.from(document.querySelectorAll('[data-testid^="issue-comment-base.ui.comment.ak-comment."]')).filter(el => {
		const id = el.getAttribute('data-testid');
		return id.endsWith('-body');
	});
}

function scan() {
	const selectors = [
		'[data-component-selector="platform-card.ui.card.card-content.content-section"]',
		'[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"]',
		'[data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"]',
		'[contenteditable="true"]'
	];

	selectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(setDirection);
	});

	getCommentBodyElements().forEach(setDirection);
}

function main() {
	// Initial run
	scan();

	const observerConfig = {
		childList: true,
		subtree: true
	};

	// Observe changes (e.g. editor loads, field expands)
	const observer = new MutationObserver(scan);
	observer.observe(document.body, observerConfig);

	const tooltipObserver = new MutationObserver(mutations => {
		mutations.forEach(m => {
			m.addedNodes.forEach(node => {
				if (node.nodeType !== Node.ELEMENT_NODE) return;

				// Check node and all descendants for tooltips
				const tooltips = node.querySelectorAll('[role="tooltip"]');
				if (node.getAttribute('role') === 'tooltip') {
					setDirection(node);
				}
				tooltips.forEach(setDirection);
			});
		});
	});

	tooltipObserver.observe(document.body, observerConfig);

	console.log("JiraRTL finished initializing");
}

main();