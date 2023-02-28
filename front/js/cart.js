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
  const root = document.getElementById('cart__items');
  const renderIncrement = {
    articlesArray: [],
    totalPrice: 0,
    totalProducts: 0,
  }

  for (product of actualCart) {
    const { color, id, quantity } =  product;
    const { name, price, imageUrl, altTxt } = await getProduct(product.id);
    renderIncrement.totalPrice += (price * quantity);
    renderIncrement.totalProducts += quantity;

    const article = createElement('article', {className: 'cart__item'});

      const cartItemImg = createElement('div', { className: 'cart__item__img' });

        const img = createElement('img', {src: imageUrl, alt: altTxt});

      cartItemImg.append(img);

      const cartItemContent =  createElement('div', { className: 'cart__item__content' });

        const cartItemContentDescription = createElement('div', { className: 'cart__item__content_description' });

          const nameElement = createElement('h2', { innerHTML: name });
          const descritpionElement = createElement('p', { innerHTML: color });
          const descritpionPrice = createElement('p', { innerHTML: priceFormat.format(price) });

        cartItemContentDescription.append(nameElement, descritpionElement, descritpionPrice);
  
        const  cartItemContentSettings = createElement('div', { className: 'cart__item__content__settings' });
          
          const cartItemContentSettingsQuantity = createElement('div', { className: 'cart__item__content__settings__quantity' });

            const quantityElement = createElement('p', { innerHTML: 'Qté : '});
            const itemQuantity =  createElement('input', 
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
              });

          cartItemContentSettingsQuantity.append(quantityElement, itemQuantity);

          const cartItemContentSettingsDelete = createElement('div', { className: 'cart__item__content__settings__delete' })

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
              });

          cartItemContentSettingsDelete.append(deleteItem);

        cartItemContentSettings.append(cartItemContentSettingsQuantity, cartItemContentSettingsDelete);

      cartItemContent.append(cartItemContentDescription, cartItemContentSettings);

    article.append(cartItemImg, cartItemContent);
    renderIncrement.articlesArray.push(article);
  }

  while (root.firstChild) {
    root.removeChild(root.lastChild);
  }

  document.getElementById('totalPrice').innerHTML = renderIncrement.totalPrice;
  document.getElementById('totalQuantity').innerHTML = renderIncrement.totalProducts;
  renderIncrement.articlesArray.forEach( article => root.appendChild(article));
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
  
  const inputWrong = [];
  const state = Object.values(testInputsObject).forEach(({input, regex, inputName}) => {
    const isValid = regex.test(input);
    !isValid && (inputWrong.push(inputName));
  })

  const returnObject = { status: (inputWrong.length === 0) };
  !state && (returnObject.inputs = inputWrong);

  return returnObject;
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
    const postObject = formatPostData();

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

const redirectPaymentConfirm = (paymentId) => (
  location.href = `file:///home/ghost/Documents/projet5/P5-Dev-Web-Kanap/front/html/confirmation.html?paymentId=${paymentId}`
)

/**
 * End of the declarative code
 * init the render & event with window.onload
**/

window.onload = () => {
  cartRender();
  document.getElementById('order').addEventListener('click', async (event) => { 
    event.preventDefault();
    const postData = formReducer();
    const postResult = postData ? await postOrder(postData) : null;
    postResult && (redirectPaymentConfirm(postResult.orderId));
  });
}