/**
 * @Class For manage API calls
 * @static methods / propeties are usefull only for instance methods thats why i separate like that 
 * @instance methods / propeties are usefull for common use in the rest of code-base   
**/

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

/**
 * Create const for copy use full method for code-base of ApiCalls class
**/

const { postOrder, getAllProducts, getProduct } = ApiCalls.getSingleton();