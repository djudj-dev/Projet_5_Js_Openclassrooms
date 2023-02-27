const insertHtml = async (root) => {
  const products = await getAllProducts();
  for (let product of products) {
    let link = createElement('a', {
      href : `/home/ghost/Documents/projet5/P5-Dev-Web-Kanap/front/html/product.html?id=${product._id}`
    });
    let article = createElement('article');
    let image = createElement('img', { src: product.imageUrl, alt: product.altTxt });
    let title = createElement('h3', { className: 'productName', innerHTML: product.name });
    let text = createElement('p', { className: 'productDescription', innerHTML: product.description });
    article.append(image, title, text);
    link.appendChild(article);
    root.appendChild(link);
  }
}

/* 
  ===========================
  | End of declarative code |
  |   start Onload init     |
  ===========================
*/

window.onload = () => insertHtml(document.getElementById('items'))
