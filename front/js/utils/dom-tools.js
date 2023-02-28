/** 
 * Function for create DOM element dynamicly from type and object use in param 
 * @param { type: string }
 * @param { elementAttribute: attributeObject | [undefined] }
 * @param { eventListenerAttribute: eventListenerObject | [undefined] }
 * @return  { HTMLElement }
**/

const createElement = (type, elementAttribute = undefined, eventListenerAttribute = undefined) => {
  const element = document.createElement(type);
  elementAttribute && Object.keys(elementAttribute).forEach(attribute => {
    element[attribute] = elementAttribute[attribute];
  });

  if (eventListenerAttribute) {
    const { event, eventCallback } = eventListenerAttribute 
    element.addEventListener(event, (event) => eventCallback(event));
  }

  return element;
}

/** 
 * const use for format string in to EU price format 
 * @return  { Intl.NumberFormat }
**/

const priceFormat = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });