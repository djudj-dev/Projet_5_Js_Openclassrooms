/**
 * @Class For manage LocalStorage cart properties
 * @static methods / propeties are usefull only for instance methods thats why i separate like that 
 * @instance methods / propeties are usefull for common use in the rest of code-base   
**/

class LocalStorageCartManager {

  constructor () {
    LocalStorageCartManager.initLocalStorage()
  }

  static cartIndex = 'cart';

  static initLocalStorage = () => (
    !localStorage.getItem(LocalStorageCartManager.cartIndex) && localStorage.setItem(LocalStorageCartManager.cartIndex, '[]')
  )

  static setToLocalStorage = (cartArray) => (
    localStorage.setItem(LocalStorageCartManager.cartIndex, JSON.stringify(cartArray))
  )

  static findInCart = (productsObject, actualCart) => {
    if (actualCart?.length) {  
      for (let element in actualCart) {
        if (actualCart[element].id === productsObject.id && actualCart[element].color === productsObject.color) {

          return { state: true, index: element };
        }
      }
    }

    return { state: false };
  }

  resetCart = () => (
    localStorage.setItem(LocalStorageCartManager.cartIndex, '[]')
  )

  getCart = () => {
    const result = () => JSON.parse(localStorage.getItem(LocalStorageCartManager.cartIndex))
    if(!result()) {
      LocalStorageCartManager.initLocalStorage();
    }

    return result();
  }

  addToCart = (productsObject) => {
    const { findInCart, setToLocalStorage } = LocalStorageCartManager
    const actualCart = this.getCart();
    const {state} = findInCart(productsObject, actualCart);

    if (state){
      return this.incrementCartQuantity(productsObject, productsObject.quantity);
    } 
    const newCart = [...actualCart, productsObject];

    return setToLocalStorage(newCart);
  }

  deleteFromCart = (productsObject) => {
    const actualCart = this.getCart();
    const newCart = actualCart.filter((element) => element.id !== productsObject);

    return LocalStorageCartManager.setToLocalStorage(newCart);
  }

  incrementCartQuantity = (productObject, incrementCartQuantity = 1) => {
    const { findInCart, setToLocalStorage } = LocalStorageCartManager;
    const actualCart = this.getCart();
    const { state, index } = findInCart(productObject, actualCart);
    
    if (state) {
      actualCart[index].quantity += incrementCartQuantity;

      return setToLocalStorage(actualCart);
    } else {
      throw new Error('product use for incrementCartQuantity() method of LocalStorageCartManager don\'t exist it cant be increment ');
    }
  }

  decrementCartQuantity = (productObject, decrementCartQuantity = 1) => {
    const { findInCart, setToLocalStorage } = LocalStorageCartManager;
    const actualCart = this.getCart();
    const { state, index } = findInCart(productObject, actualCart);

    if (state) {
      if (actualCart[index].quantity <= 1 ){

        return this.deleteFromCart(productsObject);
      }
      actualCart[index].quantity -= decrementCartQuantity;

      return setToLocalStorage(actualCart);
    } else {
      throw new Error('product use for decrementCartQuantity method of LocalStorageCartManager don\'t exist it cant be increment ');
    }
  }

  setQuantity = (productObject, quantity) => {
    const { findInCart, setToLocalStorage } = LocalStorageCartManager;
    const actualCart = this.getCart();
    const { state, index } = findInCart(productObject, actualCart);

    if (state) {
      actualCart[index].quantity = parseInt(quantity);

      return setToLocalStorage(actualCart);
    } else {
      throw new Error('product use for setCartQuantity method of LocalStorageCartManager don\'t exist it cant be increment ');
    }
  }
}

/**
 * Create const for copy use full method for code-base of LocalStorageCartManager class
**/

const {addToCart, getCart, deleteFromCart, incrementCartQuantity, decrementCartQuantity, setQuantity , resetCart} = new LocalStorageCartManager