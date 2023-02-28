/**
 * @Class For manage API calls
 * @static methods / propeties are usefull only for instance methods thats why i separate like that 
 * @instance methods / propeties are usefull for common use in the rest of code-base   
**/

class ApiCalls {

  static method = { GET: "GET", POST: "POST" };
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

  static productTypeGuard = {
    colors: 'object',
    _id: 'string',
    name:'string',
    price: 'number',
    imageUrl: 'string',
    description: 'string',
    altTxt: 'string'
  }

  static orderTypeGuard = {
    contact: 'object',
    products: 'object',
    orderId: 'string'
  }

  static typeVerificator = (typeGuardObject, ObjectToVerify) => (
    Object.entries(typeGuardObject).every(([key, value]) => typeof(ObjectToVerify[key]) === value)
  )

  static fetchApi = async (UrlRequest, fetchObject) => {  
    let result;

    try {
      result = await fetch(UrlRequest, fetchObject);
      result = result.json();
    } catch (error) {
      throw new Error('Error on method fetchApi() of ApiCalls instance | Error from =>', error);
    }
    if (result.status > 299 || result.status < 200) {
      throw new Error(`method fetchApi() of ApiCalls return a bad status something wrong with Api | status : ${result.status}`);
    }

    return result;
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
    const {apiEndpoints: { getAllProducts }, typeVerificator, productTypeGuard } = ApiCalls;
    const fetchRequestObject = ApiCalls.createFetchRequestObject(getAllProducts);

    try {
      fetchResult = await ApiCalls.fetchApi(getAllProducts.url, fetchRequestObject);
    } catch (error) {
      console.error('Error on method getAllProducts() of ApiCalls instance | Error from =>', error);
    }
    Object.values(fetchResult).forEach(() => {
      if (typeVerificator(productTypeGuard)) {
        throw new Error('return of method getAllProducts() of ApiCalls instance don\'t have the good type');
      }
    });

    return fetchResult;
  }

  getProduct = async (ProductId) => {
    let fetchResult;
    const {apiEndpoints: { getProduct }, typeVerificator, productTypeGuard } = ApiCalls;
    const endPointObject = getProduct(ProductId);
    const fetchRequestObject = ApiCalls.createFetchRequestObject(getProduct(ProductId));

    try {
      fetchResult = await ApiCalls.fetchApi(endPointObject.url, fetchRequestObject);
    } catch (error) {
      console.error('Error on method getProduct() of ApiCalls instance | Error from =>', error);
    }
    if (typeVerificator(productTypeGuard)) {
      throw new Error('return of method getProduct() of ApiCalls instance don\'t have the good type');
    }

    return fetchResult;
  }

  postOrder = async (postContent) => {
    let fetchResult;
    const {apiEndpoints: { postOrder }, typeVerificator, orderTypeGuard } = ApiCalls;
    const endPointObject = postOrder(postContent);
    const fetchRequestObject = ApiCalls.createFetchRequestObject(endPointObject);

    try {
      fetchResult = await ApiCalls.fetchApi(endPointObject.url, fetchRequestObject);
    } catch (error) {
      console.error('Error on method postOrder() of ApiCalls instance | Error from =>', error);
    }
    if (typeVerificator(orderTypeGuard)) {
      throw new Error('return of method getProduct() of ApiCalls instance don\'t have the good type');
    }

    return fetchResult;
  }
}

/**
 * Create const for copy use full method for code-base of ApiCalls class
**/

const { postOrder, getAllProducts, getProduct } = new ApiCalls;