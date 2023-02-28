/**
 * Insert the dynamic Html inside the root HTMLElement, from the result of API request 
 * @param { root: HTMLElement }
 * @return  { void }  
**/

const insertHtml = async (root) => {
  const { imageUrl, name, description, altTxt, _id} = await getAllProducts();

  for (let product of products) {
    let linkContainer = createElement('a', {
      href : `/home/ghost/Documents/projet5/P5-Dev-Web-Kanap/front/html/product.html?id=${_id}`
    });
    let article = createElement('article');
    let image = createElement('img', { src: imageUrl, alt: altTxt });
    let title = createElement('h3', { className: 'productName', innerHTML: name });
    let text = createElement('p', { className: 'productDescription', innerHTML: description });
    
    article.append(image, title, text);
    link.appendChild(article);
    root.appendChild(linkContainer);
  }
}

/** 
 * End of the declarative code 
 * init the render with window.onload 
**/

window.onload = () => insertHtml(document.getElementById('items'));
