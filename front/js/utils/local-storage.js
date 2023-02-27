class LocalStorageManager {

  static localStorageCart = 'cart';
  static singleton;

  static initLocalStorage = () => {
    if (!localStorage.getItem(LocalStorageManager.localStorageCart)){
      localStorage.setItem(LocalStorageManager.localStorageCart, '[]');
    }
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

  resetCart = () => (
    localStorage.setItem(LocalStorageManager.localStorageCart, '[]')
  )

  getCart = () => {
    const result = () => JSON.parse(localStorage.getItem(LocalStorageManager.localStorageCart))
    if(!result()) {
      LocalStorageManager.initLocalStorage()
    }
    return result()
  }

  addToCart = (productsObject) => {

    const { findInCart, setToLocalStorage } = LocalStorageManager
    const actualCart = this.getCart();
    !actualCart && (LocalStorageManager.initLocalStorage);
    const {state} = findInCart(productsObject, actualCart);

    if (state){
      return this.incrementCartQuantity(productsObject, productsObject.quantity);
    } 
    const newCart = [...actualCart, productsObject];
    setToLocalStorage(newCart)
  }

  deleteFromCart = (productsObject) => {

    const actualCart = this.getCart()
    const newCart = actualCart.filter((element) => element.id !== productsObject);
    LocalStorageManager.setToLocalStorage(newCart)
  }

  incrementCartQuantity = (productObject, incrementCartQuantity = 1) => {

    const { findInCart, setToLocalStorage } = LocalStorageManager
    const actualCart = this.getCart();
    const { state, index } = findInCart(productObject,  actualCart);
    
    if (state) {
      actualCart[index].quantity += incrementCartQuantity;
      setToLocalStorage(actualCart);
    } else {
      throw new Error('product use for incrementCartQuantity() method of LocalStorageManager don\'t exist it cant be increment ')
    }
  }

  decrementCartQuantity = (productObject, decrementCartQuantity = 1) => {
    const { findInCart, setToLocalStorage } = LocalStorageManager
    const actualCart = this.getCart();
    const { state, index } = findInCart(productObject, actualCart);

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

  setQuantity = (productObject, quantity) => {
    const { findInCart, setToLocalStorage } = LocalStorageManager
    const actualCart = this.getCart();
    const { state, index } = findInCart(productObject, actualCart);

    if (state) {
      actualCart[index].quantity = parseInt(quantity);
      setToLocalStorage(actualCart);
    } else {
      throw new Error('product use for setCartQuantity method of LocalStorageManager don\'t exist it cant be increment ')
    }
  }
}

const {addToCart, getCart, deleteFromCart, incrementCartQuantity, decrementCartQuantity, setQuantity , resetCart} = LocalStorageManager.getSingleton()

