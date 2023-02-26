
const areNotNull = (elements) => {
  const isNotComplete = elements.every( element => !!element.value);
  return !!isNotComplete
}

const formatData = (id, target) => {
  const selectColor = document.getElementById('colors')
  const selectQuantity = document.getElementById('quantity')

  const { parentElement } = target;
  const completeMessageBox = document.getElementById('complete_form_message')

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
    const completeMessageText = 'veuillez choisir une couleur et une quantité avant d\'ajouter au panier'
    const completeMessageElement = createElement('p', { id: "complete_form_message", innerHTML: completeMessageText})
    parentElement.insertBefore(completeMessageElement, target)
  }
}

const insertHtml = async (id) => {  
  const product = await getProduct(id);
  
  const image = createElement('img',{ src: product.imageUrl, alt: product.altTxt });
  document.getElementsByClassName('item__img')[0].appendChild(image);
  
  document.getElementById('price').innerHTML = product.price;
  document.getElementById('title').innerHTML = product.name;
  document.getElementById('description').innerHTML = product.description;
  
  for (let color of product.colors) {
    let option = createElement('option', { innerHTML: color, value: color });
    document.getElementById('colors').appendChild(option);
  }
}

window.onload = () => {
  const UrlIdParams = new URLSearchParams(location.search).get('id')
  insertHtml(UrlIdParams)
  document.getElementById('addToCart').addEventListener('click', (event) => formatData(UrlIdParams, event.target))
}






