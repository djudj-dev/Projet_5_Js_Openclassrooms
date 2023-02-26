cartRender = async () => {
  const actualCart = getCart();
  const container = document.getElementById('cart__items')
  let articlesArray = []
  let totalPrice = 0;
  let totalProduct = 0;
  for (product of actualCart) {
    const { color, id, quantity } =  product;
    const { name, price, imageUrl, altTxt } = await getProduct(product.id);
    totalPrice += (price * quantity);
    totalProduct += quantity;

    const article = createElement('article', {className: 'cart__item'});

      const cart__item__img = createElement('div', { className: 'cart__item__img' });

        const img = createElement('img', {src: imageUrl, alt: altTxt});
      cart__item__img.append(img);

      const cart__item__content =  createElement('div', { className: 'cart__item__content' });
  

        const cart__item__content_description = createElement('div', { className: 'cart__item__content_description' });

          const name__element = createElement('h2', { innerHTML: name });
          const descritpion__element = createElement('p', { innerHTML: color });
          const descritpion__price = createElement('p', { innerHTML: price });
        cart__item__content_description.append(name__element, descritpion__element, descritpion__price);
  
        const  cart__item__content__settings = createElement('div', { className: 'cart__item__content__settings' })
          
          const cart__item__content__settings__quantity = createElement('div', { className: 'cart__item__content__settings__quantity' })

            const quantity__element = createElement('p', { innerHTML: 'Qté : '})
            const item_quantity =  createElement('input', 
              { 
                type: 'number',
                className: 'itemQuantity',
                name: 'itemQuantity',
                min: 1,
                max: 100,
                value: quantity
              },
              {
                event: 'change',
                eventCallback: async (event) => {
                  setQuantity({ color, id, quantity }, event.target.value)
                  await cartRender();
                }
              })
          cart__item__content__settings__quantity.append(quantity__element, item_quantity)

        const cart__item__content__settings__delete = createElement('div', { className: 'cart__item__content__settings__delete' })

          const deleteItem =  createElement('p', 
            { 
              className: 'deleteItem', 
              innerHTML: 'Supprimer'
            },
            { 
              event: 'click', 
              eventCallback: async () => {
                deleteFromCart(id) 
                await cartRender();
              }
            })
        cart__item__content__settings__delete.append(deleteItem)
    
      cart__item__content__settings.append(cart__item__content__settings__quantity, cart__item__content__settings__delete)
      cart__item__content.append(cart__item__content_description, cart__item__content__settings)
    article.append(cart__item__img, cart__item__content)

    articlesArray = [...articlesArray, article]
  }

  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
  document.getElementById('totalPrice').innerHTML = totalPrice;
  document.getElementById('totalQuantity').innerHTML = totalProduct;
  articlesArray.forEach( article => container.appendChild(article));
}

const nameRegex = /^[a-zA-Z]{2,30}$/
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const cityRegex = /^\w{3,40}$/

const order = document.getElementById('order').addEventListener('click', (event) => { 
  event.preventDefault()
  console.log(onSubmit())
});

const onSubmit = () => {
  
  const status = {
    firstName: nameRegex.test(document.getElementById('firstName').value), 
    lastName: nameRegex.test(document.getElementById('lastName').value),
    email: emailRegex.test(document.getElementById('email').value),
    city: cityRegex.test(document.getElementById('city').value)
  }
  
  isVerified = Object.values(status).every(element => !!element) 
  
  if (isVerified) {
    const idArray = [];
  
    getCart().forEach( element => (
      idArray.push(element.id)
    )); 

    const postObject = {
      contact : {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        city: document.getElementById('city').value
      },
      product: idArray
    }

    return { state: true, payload: postObject };
  }

  let errorString = `veillez renseigner les champs : `;
  !status.firstName && (errorString += '- Prénom '); 
  !status.lastName && (errorString += '- Nom ');
  !status.city && (errorString += '- Ville ');
  !status.email && (errorString += '- Email ');

  return { state: false, payload: errorString };
} 




window.onload = cartRender();