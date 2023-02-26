class ApiCalls {

  static singleton;
  static method = {GET: "GET", POST: "POST"};
  static apiUrl = 'http://localhost:3000/api/products';

  static apiEndpoints = {
    getAllProducts : {
      url: `${this.apiUrl}/`,
      method: this.method.GET
    },
    getProduct: (ProductId) => (
      {
        url: `${this.apiUrl}/${ProductId}`,
        method: this.method.GET
      }
    ),
    postOrder: (postContent) => (
      {
        url: `${this.apiUrl}/order`,
        method: this.method.POST,
        body: JSON.stringify(postContent)
      }
    )
  }

  static getSingleton = () => {
    if (!ApiCalls.singleton) {
      ApiCalls.singleton = new ApiCalls
    }

    return ApiCalls.singleton
  }

  static fetchApi = async (UrlRequest, fetchObject) => {  
    let result;

    try {
      result = await fetch(UrlRequest, fetchObject)
      result = result.json();
    } catch (error) {
      throw new Error('Error on method fetchApi() of ApiCalls instance :',error);
    }
    if (result.status > 299 || result.status < 200) {
      throw new Error('method fetchApi() of ApiCalls return a bad status something wrong with Api');
    }

    return result
  }

  static createFetchRequestObject = (endPointObject) => {
    
    const fetchRequestObject = {
      method: endPointObject.method,
      mode: "cors",
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json' 
      }
    }

    endPointObject.method === ApiCalls.method.POST && endPointObject.body && (fetchRequestObject.body = endPointObject.body);

    return fetchRequestObject;
  }
  
  getAllProducts = async () => {
    let fetchResult;
    const {apiEndpoints: { getAllProducts } } = ApiCalls;
    const fetchRequestObject = ApiCalls.createFetchRequestObject(getAllProducts);

    try {
      fetchResult = await ApiCalls.fetchApi(getAllProducts.url, fetchRequestObject);
    } catch (error) {
      console.error('Error on method getAllProducts() of ApiCalls instance :',error);
    }

    return fetchResult;
  }

  getProduct = async (ProductId) => {
    let fetchResult;
    const {apiEndpoints: { getProduct } } = ApiCalls;
    const endPointObject = getProduct(ProductId);
    const fetchRequestObject = ApiCalls.createFetchRequestObject(endPointObject);

    try {
      fetchResult = await ApiCalls.fetchApi(endPointObject.url, fetchRequestObject);
    } catch (error) {
      console.error('Error on method getProduct() of ApiCalls instance :',error);
    }

    return fetchResult;
  }

  postOrder = async (postContent) => {
    let fetchResult;
    const {apiEndpoints: { postOrder } } = ApiCalls;
    const endPointObject = postOrder(postContent);
    const fetchRequestObject = ApiCalls.createFetchRequestObject(endPointObject);

    try {
      fetchResult = await ApiCalls.fetchApi(endPointObject.url, fetchRequestObject);
    } catch (error) {
      console.error('Error on method postOrder() of ApiCalls instance :',error);
    }

    return fetchResult;
  }
}

const { postOrder, getAllProducts, getProduct } = ApiCalls.getSingleton();


/*
  ===============================================
              End of Api Calls class
  ===============================================
*/


class LocalStorageManager {

  static localStorageCart = 'cart';
  static singleton;

  constructor () {
    LocalStorageManager.initLocalStorage()
  }

  static initLocalStorage = () => {
    localStorage.setItem(LocalStorageManager.localStorageCart, '[]');
  }

  static setToLocalStorage = (cartArray) => {
    localStorage.setItem(LocalStorageManager.localStorageCart, JSON.stringify(cartArray))
  }

  static findInCart = (productsObject, actualCart) => {

    if (actualCart?.length) {  
      for (let element in actualCart) {
        if (actualCart[element].id === productsObject.id && actualCart[element].color === productsObject.color) {

          return { state: true, index: element }
        }
      }
    }

    return { state: false };
  }

  static getSingleton = () => {
    if (!LocalStorageManager.singleton) {
      LocalStorageManager.singleton = new LocalStorageManager;
    }

    return LocalStorageManager.singleton
  }

  getCart = () => (
    JSON.parse(localStorage.getItem(LocalStorageManager.localStorageCart))
  )

  addToCart = (productsObject) => {

    const { findInCart, setToLocalStorage } = LocalStorageManager
    const actualCart = this.getCart();
    const {state} = findInCart(productsObject, actualCart);

    if (state){
      return this.incrementCartQuantity(productsObject, productsObject.quantity);
    } 
    const newCart = [...actualCart, productsObject];
    setToLocalStorage(newCart)
  }

  deleteFromCart = (productsObjectId) => {

    const actualCart = this.getCart()
    const newCart = actualCart.filter((element) => element.id !== productsObjectId);
    LocalStorageManager.setToLocalStorage(newCart)
  }

  incrementCartQuantity = (productsObject, incrementCartQuantity = 1) => {

    const { findInCart, setToLocalStorage } = LocalStorageManager
    const actualCart = this.getCart();
    const { state, index } = findInCart(productsObject,  actualCart);

    if (state) {
      actualCart[index].quantity += incrementCartQuantity;
      setToLocalStorage(actualCart);
    } else {
      throw new Error('product use for incrementCartQuantity() method of LocalStorageManager don\'t exist it cant be increment ')
    }
  }

  decrementCartQuantity = (productsObject, decrementCartQuantity = 1) => {
    const { findInCart, setToLocalStorage } = LocalStorageManager
    const actualCart = this.getCart();
    const { state, index } = findInCart(productsObject, actualCart);

    if (state) {
      if (actualCart[index].quantity <= 1 ){

        return this.deleteFromCart(productsObject)
      }

      actualCart[index].quantity -= decrementCartQuantity;
      setToLocalStorage(actualCart);
    } else {
      throw new Error('product use for decrementCartQuantity method of LocalStorageManager don\'t exist it cant be increment ')
    }
  }
}

const {addToCart, getCart, deleteFromCart, incrementCartQuantity, decrementCartQuantity } = LocalStorageManager.getSingleton()



/*
  ===============================================
            End of LocalStorage class
  ===============================================
*/





const createElement = (type, className = false, innerHTML = false, src = false, href = false, value = null) => {
  const element = document.createElement(type);
  className && (element.className = className);
  innerHTML && (element.innerHTML = innerHTML);
  src && (element.src = src);
  href && (element.href = href)
  value && (element.value = value)
  return element;
}



let params = new URLSearchParams(location.search).get('id') 
console.log(params)

const insertHtml = async () => {
  const product = await getProduct(params);

  let image = createElement('img', null, null, product.imageUrl);
  document.getElementById('price').innerHTML = product.price
  document.getElementsByClassName('item__img')[0].appendChild(image)
  document.getElementById('title').innerHTML = product.name;
  document.getElementById('description').innerHTML = product.description;
  for (let color of product.colors) {
    let option = createElement('option', null, color, null, null, color);
    document.getElementById('colors').appendChild(option);
  }
}

insertHtml()

const submitForm = () => {
  const selectValue = document.getElementById('colors').value
  const selectQauntity = document.getElementById('quantity').value
  let result = {
    id : params,
    color: selectValue,
    quantity: selectQauntity
  }
  console.log(result)
  return result
}

document.getElementById('addToCart').addEventListener('click', () => addToCart(submitForm()))

