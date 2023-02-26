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




const root = document.getElementById('items')

const insertHtml = async () => {
  let products = await getAllProducts();
  for (let product of products) {
    let linkParent = createElement('a', null, null, null, `/home/ghost/Documents/projet5/P5-Dev-Web-Kanap/front/html/product.html?id=${product._id}`)
    let article = createElement('article')
    let image = createElement('img', null, null, product.imageUrl)
    let title = createElement('h3', 'productName',product.name)
    let text = createElement('p', 'productDescription', product.description)
    article.appendChild(image)
    article.appendChild(title)
    article.appendChild(text)
    linkParent.appendChild(article)
    root.appendChild(linkParent)
  }
}

const createElement = (type, className = false, innerHTML = false, src = false, href = false) => {
  const element = document.createElement(type);
  className && (element.className = className);
  innerHTML && (element.innerHTML = innerHTML);
  src && (element.src = src);
  href && (element.href = href)
  
  return element;
}

insertHtml()
