/**
 * Function for display Imutable data Syncronized from :
 * - LocalStorage 'cart'
 * - API
 * At every value change cart the function :
 * - call her-self
 * - re-synchronise new data with api
 * - display all content with dynamics cart data needed
 * For have the best reactive ,syncronized and  non-compromized data
 * @return { void }
**/

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
          const descritpion__price = createElement('p', { innerHTML: priceFormat.format(price) });
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

/**
 * Function for check is form data is valid
 * check all the input with their regex
 * if all good return object with true status
 * else return status false & input(s) invalid 
 * @return { state: booleans, inputs?: string[] }
**/


const isFormValid = () => {
  const nameRegex = /^[a-zA-Z]{2,30}$/;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const cityRegex = /^\w{3,40}$/;

  const testInputsObject = {
    firstName: {
      input: document.getElementById('firstName').value, 
      regex: nameRegex,
      inputName: 'Prénom'
    },
    lastName: {
      input: document.getElementById('lastName').value,
      regex: nameRegex,
      inputName: 'Nom'
    },
    email: {
      input: document.getElementById('email').value,
      regex: emailRegex,
      inputName: 'Email'
    },
    city: {
      input: document.getElementById('city').value,
      regex: cityRegex,
      inputName: 'Ville'
    }
  } 
  
  let inputWrong = [];
  const state = Object.values(testInputsObject).forEach(({input, regex, inputName}) => {
    const isValid = regex.test(input)
    !isValid && (inputWrong = [...inputWrong, inputName])
  })

  const returnObject = { status: (inputWrong.length === 0) };
  !state && (returnObject.inputs = inputWrong)

  return returnObject
}

/**
 * Function for format data for orderPost 
 * from inputs value & LocalStorage 'cart'
 * @return { state: booleans, inputs?: string[] }
**/

const formatPostData = () => {
  const idArray = [];
  getCart().forEach( ({id, quantity}) => {
    if (quantity > 1) {
      for (let i = 0; i <= quantity; i++) {
        return idArray.push(id);
      }
    }

    return idArray.push(id);
  });

  const postObject = {
    contact : {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      address: document.getElementById('address').value,
      email: document.getElementById('email').value,
      city: document.getElementById('city').value
    },
    products: idArray
  }

  return postObject;
}

/**
 * Reducer of actions after for Submit 
 * if form is good return the data for post the order 
 * else display error message to customer & return undefined  
 * @return { {contact:{ customerInfoData }, product: string[] } | undefined }
**/

const formReducer = () => {
  const warnigText = document.getElementById('warning_message');
  warnigTextContainer = warnigText;

  const areInputsValid = isFormValid();

  if (areInputsValid.status) {  
    warnigText.setAttribute('hidden',true)
    const postObject = formatPostData()

    return postObject;
  }

  let errorString = `veuillez renseigner le(s) champ(s) : `;
  areInputsValid.inputs.forEach((element => (
    errorString += `- ${element} `
  )));

  warnigText.innerHTML = errorString;
  warnigText.removeAttribute('hidden');
}


/**
 * Redirect user to confimation page with payementId URL in parameter 
 * @return { void }
**/

const redirectPaymentConfirm = (paymentId) => {
  location.href = `file:///home/ghost/Documents/projet5/P5-Dev-Web-Kanap/front/html/confirmation.html?paymentId=${paymentId}`
}

/**
 * End of the declarative code
 * init the render & event with window.onload
**/

window.onload = () => {
  cartRender()
  document.getElementById('order').addEventListener('click', async (event) => { 
    event.preventDefault();
    const postData = formReducer();
    const postResult = postData ? await postOrder(postData) : null;
    postResult && (redirectPaymentConfirm(postResult.orderId));
  });
}