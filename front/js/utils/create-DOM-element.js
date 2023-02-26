const createElement = (type, elementAttribute = undefined, eventListener = undefined) => {
  const element = document.createElement(type);
  elementAttribute && Object.keys(elementAttribute).forEach(attribute => {
    element[attribute] = elementAttribute[attribute];
  });
  if (eventListener) {
    const { event, eventCallback } = eventListener 
    element.addEventListener(event, eventCallback)
  }

  return element;
}