import { setDirection, removeRTL, JIRA_RTL_APPLIED_SELECTOR } from "./rtlUtils";
import { observerRules, combinedSelector } from './observerRules';
import { Behavior } from "./enums/Behavior";

let observer = null;
const activeInputListeners = new Map();

function processMatchingElement(el) {
	for (const observerRule of observerRules) {
		if (el.matches(observerRule.compiledSelector)) {
			processElement(el, observerRule);
			break;
		}
	}
}

function processCreatedNode(node) {
	if (node.matches(combinedSelector)) {
		processMatchingElement(node);
		return;
	}

	node.querySelectorAll(combinedSelector).forEach(processMatchingElement);
}

function processTextMutation(el) {
	if (!el) return;

	let parentEl = el.parentElement;

	while (parentEl) {
		if (parentEl.matches(combinedSelector)) {
			for (const observerRule of observerRules) {
				if (observerRule.behavior === Behavior.CONTENT_EDITABLE
					&&
					parentEl.matches(observerRule.compiledSelector)
				) {
					processElement(parentEl, observerRule);
					return;
				}
			}
		}

		parentEl = parentEl.parentElement;
	}
}

function handleMutations(mutations) {
	for (const mutation of mutations) {
		//console.log(mutation);

		if (mutation.type === 'childList') {
			mutation.addedNodes.forEach(node => {
				if (!(node instanceof Element || node instanceof Text)) return;

				if (node instanceof Element) {
					processCreatedNode(node);
				}
				else if (node instanceof Text) {
					processTextMutation(node);
				}
			});
		}

		else if (mutation.type === 'characterData') {
			processTextMutation(mutation.target);
		}
	}
}

function processElement(el, observerRule) {
	let text;

	switch (observerRule.behavior) {
		case Behavior.DEFAULT:
		case Behavior.CONTENT_EDITABLE:
			const target = observerRule.resolveTarget(el);
			text = observerRule.resolveText(target);
			setDirection(target, text);

			break;

		case Behavior.INPUT:

			if (activeInputListeners.has(el)) return; // already attached

			const inputHandler = (event) => {
				setDirection(event.target, observerRule.resolveText(event.target));
			};

			el.addEventListener('input', inputHandler);
			activeInputListeners.set(el, inputHandler);

			text = observerRule.resolveText(el);
			setDirection(el, text);

			break;

		default:
			break;
	}
}

function runScan() {
	setTimeout(() => {
		observerRules.forEach((observerRule) => {
			observerRule.selectors.forEach(selector => {
				document.querySelectorAll(selector).forEach(el =>
					processElement(el, observerRule));
			});
		});
	}, 0);
}

function initialize() {
	if (observer) return; // already initialized

	observer = new MutationObserver((mutations) => {
		setTimeout(() => handleMutations(mutations), 0);
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		characterData: true,
	});

	// Initial pass for existing nodes
	runScan();
}

function cleanup() {
	if (observer) {
		observer.disconnect();
		observer = null;
	}

	// Detach input handlers
	for (const [el, handler] of activeInputListeners.entries()) {
		el.removeEventListener('input', handler);
	}
	activeInputListeners.clear();

	document.querySelectorAll(JIRA_RTL_APPLIED_SELECTOR).forEach(removeRTL);
}

export const rtlObserver = {
	initialize,
	cleanup,
	runScan,
};
