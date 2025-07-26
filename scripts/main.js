import { setDirection } from "./rtl";
import { scanTargets } from "./scan-targets";

const observerConfig = {
	childList: true,
	subtree: true
};

function applyScanners(parent, scanners) {
	for (const scanner of scanners) {
		if (typeof scanner === 'string') {
			parent.querySelectorAll?.(scanner).forEach(setDirection);
		} else if (typeof scanner === 'function') {
			scanner().forEach(setDirection);
		}
	}
}

function createObserverCallback(scanners) {
	return function (mutationsList) {
		for (const mutation of mutationsList) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;

				applyScanners(node, scanners);
			}
		}
	};
}

function scan() {
	for (const { getTarget, scanners } of scanTargets) {
		const target = getTarget();
		if (!target) continue;

		const observer = new MutationObserver(createObserverCallback(scanners));
		observer.observe(target, observerConfig);

		applyScanners(target, scanners);
	}
}

window.onload = (event) => {
	scan();
};

console.log("JiraRTL finished initializing");