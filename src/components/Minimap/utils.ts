
export function log(...data: unknown[]) {
  console.log(...data, "@", new Date().toLocaleTimeString())
}

/**
 * Observes the DOM for the addition or removal of an element with a specific ID.
 *
 * @param elementId - The ID of the element to observe.
 * @param onElementAdd - Callback function to be called when the element is added to the DOM.
 * @param onElementRemove - Callback function to be called when the element is removed from the DOM.
 * @returns A MutationObserver instance that is observing the DOM.
 */
export function elementObserver(
  elementId: string,
  onElementAdd: CallableFunction,
  onElementRemove: CallableFunction
): MutationObserver {
  const observer = new MutationObserver((mutationsList, ) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check for added nodes
        mutation.addedNodes.forEach((node) => {
          if ((node as HTMLElement).id === elementId) {
            console.log(`Element with ID ${elementId} was added to the DOM.`);
            onElementAdd(elementId)
          }
        });

        // Check for removed nodes
        mutation.removedNodes.forEach(node => {
          if ((node as HTMLElement).id === elementId) {
            console.log(`Element with ID ${elementId} was removed from the DOM.`);
            onElementRemove()
          }
        });
      }
    }
  });

  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });
  return observer
}
