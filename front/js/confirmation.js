/** 
 * Insert the dynamic Html with Urlparams
 * @param { UrlParams: string }
 * @return  { void } 
**/

insertHtml = (UrlIdParams) => {
  document.getElementById('orderId').innerHTML = UrlIdParams;
}

/** 
 * End of the declarative code 
 * init the render with window.onload 
**/

window.onload = () => {
  const UrlIdParams = new URLSearchParams(location.search).get('paymentId');
  insertHtml(UrlIdParams);
  resetCart();
}