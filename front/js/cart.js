/**
 * Function for display Imutable data Syncronized from :
 * - LocalStorage 'cart'
 * - API
 * At every value change cart the function :
 * - call her-self
 * - re-synchronise new data with api
 * - display all content with dynamics cart data needed
 * For have the best reactive ,syncronized and  non-compromized data
 * 
 * @INFO Elements are indented for help readability
 * 
 * @return { void }
**/

const cartItemComponent = ({ 
  color, 
  id, 
  quantity, 
  name, 
  price, 
  imageUrl, 
  altTxt }) => {
  const article = createElement('article', {className: 'cart__item'});

      const cartItemImg = createElement('div', { className: 'cart__item__img' });

        const img = createElement('img', {src: imageUrl, alt: altTxt});

      cartItemImg.append(img);

      const cartItemContent =  createElement('div', { className: 'cart__item__content' });

        const cartItemContentDescription = createElement('div', { className: 'cart__item__content_description' });

          const nameElement = createElement('h2', { textContent: name });
          const descritpionElement = createElement('p', { textContent: color });
          const descritpionPrice = createElement('p', { textContent: priceFormat.format(price) });

        cartItemContentDescription.append(nameElement, descritpionElement, descritpionPrice);
  
        const  cartItemContentSettings = createElement('div', { className: 'cart__item__content__settings' });
          
          const cartItemContentSettingsQuantity = createElement('div', { className: 'cart__item__content__settings__quantity' });

            const quantityElement = createElement('p', { textContent: 'Qté : '});
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
                  setQuantity({ color, id, quantity }, event.target.value);
                  cartRender();
                }
              });

          cartItemContentSettingsQuantity.append(quantityElement, itemQuantity);

          const cartItemContentSettingsDelete = createElement('div', { className: 'cart__item__content__settings__delete' })

            const deleteItem =  createElement('p', 
              { 
                className: 'deleteItem', 
                textContent: 'Supprimer'
              },
              { 
                event: 'click', 
                eventCallback: async () => {
                  deleteFromCart(id);
                  cartRender();
                }
              });

          cartItemContentSettingsDelete.append(deleteItem);

        cartItemContentSettings.append(cartItemContentSettingsQuantity, cartItemContentSettingsDelete);

      cartItemContent.append(cartItemContentDescription, cartItemContentSettings);

    article.append(cartItemImg, cartItemContent);

    return article;
}

const cartRender = async () => {
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

    const article = cartItemComponent({ color, id, quantity, name, price, imageUrl, altTxt });
    renderIncrement.articlesArray.push(article);
  }

  while (root.firstChild) {
    root.removeChild(root.lastChild);
  }

  document.getElementById('totalPrice').textContent = renderIncrement.totalPrice;
  document.getElementById('totalQuantity').textContent = renderIncrement.totalProducts;
  renderIncrement.articlesArray.forEach(article => root.appendChild(article));
}

/**
 * Function for check is form data is valid
 * check all the input with their regex
 * if all good return object with true status
 * else return status false display error message on input errorInput
 * @param { 
 *   formInputsObject :
 *    { 
 *      input: HTMLElement, 
 *      regex: Regex, 
 *      errorInput: HTMLElement
 *    }
 * }
 * @return { boolean }
**/

const isFormValid = (formInputsObject) => {
  let isFormValid = true;
  const invalidFieldText = 'champ invalide'
  const state = Object.values(formInputsObject).forEach(({input:{ value } , regex, errorInput}) => {
    const isValid = regex.test(value);
    errorInput.textContent = !isValid ? invalidFieldText : "";
    !isValid && (isFormValid = false);
  })

  return isFormValid;
}

/**
 * Function for format data for orderPost 
 * from inputs value & LocalStorage 'cart'
 * @param { 
 *  formInputsObject :
 *    { 
 *      input: HTMLElement, 
 *      regex: Regex, 
 *      errorInput: HTMLElement
 *    }
 * }
 * @return { 
 *   contact: { key: string }, 
 *   product: string[] 
 * }
**/

const formatPostData = (formInputsObject) => {
  const idArray = [];
  getCart().forEach( ({id, quantity}) => {
    if (quantity > 1) {
      for (let i = 0; i <= quantity; i++) {
        return idArray.push(id);
      }
    }

    return idArray.push(id);
  });

  let contact = {}; 
  Object.entries(formInputsObject).forEach(([key, { input : { value }}]) => contact[key] = value )
  const postObject = {
    contact,
    products: idArray
  }

  return postObject;
}

/**
 * Reducer of actions after for Submit 
 * if form is good return the data for post the order 
 * else display error message to customer & return undefined 
 * @param { 
 *  formInputsObject :
 *    { 
 *      input: HTMLElement, 
 *      regex: Regex, 
 *      errorInput: HTMLElement
 *    }
 * }
 * @return { void }
**/

const formReducer = async (formInputsObject) => {
  const areInputsValid = isFormValid(formInputsObject);

  if (areInputsValid) {  
    const postOrderData = formatPostData(formInputsObject);
    const { orderId } = await postOrder(postOrderData);

    return orderId ? (redirectPaymentConfirm(orderId)) : null;
  }
}

/**
 * Redirect user to confimation page with payementId URL in parameter 
 * @return { void }
**/

const redirectPaymentConfirm = (paymentId) => (
  location.href = link.paymentConfirm(paymentId)
)

/**
 * End of the declarative code
 * init the render & event with window.onload
**/
const nameRegex = /^[a-zA-Z]{2,30}$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const addressRegex = /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/;
const cityRegex = /^\w{3,40}$/;

const formInputsObject = {
  firstName: {
    input: document.getElementById('firstName'), 
    regex: nameRegex,
    errorInput: document.getElementById('firstNameErrorMsg')
  },
  lastName: {
    input: document.getElementById('lastName'),
    regex: nameRegex,
    errorInput: document.getElementById('lastNameErrorMsg')
  },
  address: {
    input: document.getElementById('address'),
    regex: addressRegex,
    errorInput: document.getElementById('addressErrorMsg')
  },
  city: {
    input: document.getElementById('city'),
    regex: cityRegex,
    errorInput: document.getElementById('cityErrorMsg')
  },
  email: {
    input: document.getElementById('email'),
    regex: emailRegex,
    errorInput: document.getElementById('emailErrorMsg')
  }
} 

window.onload = () => {
  cartRender();
  document.getElementById('order').addEventListener('click', async (event) => { 
    event.preventDefault();
    formReducer(formInputsObject);
  });
}