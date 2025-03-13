export function droppableImages(
	node: HTMLElement,
	onDropCallback: (event: DragEvent) => void | boolean | Promise<void | boolean>
) {
	const initialClasses = node.className;
	const preventDefault = (className: string) => (event: DragEvent) => {
		event.preventDefault();
		node.className = `${initialClasses} ${className}`;
		if (event.type === 'drop') return onDropCallback(event);
		return false;
	};

	node.addEventListener('dragstart', preventDefault('dragstart'));
	node.addEventListener('dragover', preventDefault('dragover'));
	node.addEventListener('dragenter', preventDefault('dragenter'));
	node.addEventListener('dragleave', preventDefault('dragleave'));
	node.addEventListener('drop', preventDefault('drop'));

	return {
		destroy() {
			node.removeEventListener('dragover', preventDefault('dragover'));
			node.removeEventListener('dragenter', preventDefault('dragenter'));
			node.removeEventListener('dragleave', preventDefault('dragleave'));
			node.removeEventListener('drop', preventDefault('drop'));
		}
	};
}
