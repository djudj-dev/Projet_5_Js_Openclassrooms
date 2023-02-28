/**
 * Insert the dynamic Html with UrlId from the result of API request
 * @param { id: string }
 * @return  { void }
**/

const insertHtml = async (id) => {
  const product = await getProduct(id);
  const image = createElement('img',{ src: product.imageUrl, alt: product.altTxt });

  document.getElementsByClassName('item__img')[0].appendChild(image);
  document.getElementById('price').innerHTML = priceFormat.format(product.price);
  document.getElementById('title').innerHTML = product.name;
  document.getElementById('description').innerHTML = product.description;

  for (let color of product.colors) {
    let option = createElement('option', { innerHTML: color, value: color });
    document.getElementById('colors').appendChild(option);
  }

  document.getElementById('colors').value = "";
  document.getElementById('quantity').value = "0";
}

/**
 * Verify HmtlNode Array property value does not equal to value of [nullValue] initialized inside the function
 * @param { elements: HTMLElement[] }
 * @return { boolean }
**/

const areNotNull = (elements) => {
  const nullValue = ['', '0'];
  const isNotComplete = elements.every( element => (
    !nullValue.some( nullState => element.value === nullState)
  ));

  return isNotComplete;
}

/**
 * Verify data target value
 * if it's good and format data & send to cart
 * else display error message to user
 * @param { id: string }
 * @param { target: HTMLElement }
 * @return { void }
**/

const formDataChecker = (id, target) => {
  const selectColor = document.getElementById('colors');
  const selectQuantity = document.getElementById('quantity');

  const { parentElement } = target;
  const completeMessageBox = document.getElementById('complete_form_message');

  if (areNotNull([selectQuantity, selectColor])) {
    completeMessageBox && completeMessageBox.remove();
    const data =  {
      id : id,
      color: selectColor.value,
      quantity: parseInt(selectQuantity.value)
    }
    selectColor.value = "";
    selectQuantity.value = 0;

    return addToCart(data);
  }
  
  if (!completeMessageBox) {
    const completeMessageText = 'veuillez choisir une couleur et une quantité avant d\'ajouter au panier';
    const completeMessageElement = createElement('p', { id: "complete_form_message", innerHTML: completeMessageText});
    parentElement.insertBefore(completeMessageElement, target);
  }
}

/**
 * End of the declarative code
 * init the render & event with window.onload
**/

window.onload = () => {
  const UrlIdParams = new URLSearchParams(location.search).get('id');
  console.log(UrlIdParams);
  insertHtml(UrlIdParams);
  document.getElementById('addToCart').addEventListener('click', (event) => formDataChecker(UrlIdParams, event.target));
}


