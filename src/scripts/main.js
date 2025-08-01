//import "./compatibility";
import { loadSettings } from "./settings";
import { setDirection, resetRTL } from "./rtl";
import { scanTargets } from "./scan-targets";

const activeObservers = new Set();

function applyScanners(parent, scanners, applyRtlOnParent) {
	for (const scanner of scanners) {
		if (typeof scanner === 'string') {
			parent.querySelectorAll?.(scanner).forEach((el) => {
				if (applyRtlOnParent) {
					setDirection(el.parentNode);
				}
				else {
					setDirection(el);
				}
			});
		} else if (typeof scanner === 'function') {
			scanner().forEach(setDirection);
		}
	}
}

function applyScannersToParent(node, scanners) {
	for (const scanner of scanners) {
		const el = node.closest(scanner);
		if (el) {
			setDirection(el);
		}
	}
}

function createObserverCallback(scanners, applyRtlOnParent) {
	return function (mutationsList) {
		for (const mutation of mutationsList) {
			//console.log("mutation:", mutation);

			if (mutation.type === "childList") {
				for (const node of mutation.addedNodes) {
					if (!(node instanceof HTMLElement)) continue;

					applyScanners(node, scanners, applyRtlOnParent);
				}
			}

			if (mutation.type === "characterData") {
				const node = mutation.target.parentNode;
				if (!(node instanceof HTMLElement)) continue;

				applyScannersToParent(node, scanners);
			}
		}
	};
}

function scan() {
	for (const { getTarget, scanners, detectTextTyping, applyRtlOnParent } of scanTargets) {
		const target = getTarget();
		console.log("Target: ", target);
		if (!target) continue;

		const observer = new MutationObserver(createObserverCallback(scanners, applyRtlOnParent));

		const observerConfig = {
			childList: true,
			subtree: true,
			characterData: !!detectTextTyping
		};

		observer.observe(target, observerConfig);

		activeObservers.add(observer);

		applyScanners(target, scanners, applyRtlOnParent);
	}

	// Attach input handlers
	for (const inputTarget of editableInputTargets) {
		document.querySelectorAll(inputTarget).forEach((inputEl) => {
			if (activeInputListeners.has(inputEl)) return; // already attached

			const inputHandler = (event) => {
				setDirection(event.target);
			};

			inputEl.addEventListener('input', inputHandler);
			activeInputListeners.set(inputEl, inputHandler);
		});

	}
}

function cleanup() {
	for (const observer of activeObservers) {
		observer.disconnect();
	}
	activeObservers.clear();

	document.querySelectorAll('[data-rtl-applied="true"]').forEach(resetRTL);
}

window.onload = (event) => {
	loadSettings((settings) => {
		console.log("initial settings:", settings);
		if (settings.enabled) {
			console.log("JiraRTL - starting a new scan - page load");
			scan();
		}
	});
};

// Handle runtime messages
chrome.runtime.onMessage.addListener((msg) => {
	if (msg.from !== "JiraRTL_popup") return;

	switch (msg.type) {
		case "JiraRTL_enable":
			console.log("JiraRTL - starting a new scan");
			scan();
			break;
		case "JiraRTL_disable":
			console.log("JiraRTL - starting a cleanup");
			cleanup();
			break;
	}
});

console.log("JiraRTL finished initializing");