insertHtml = (UrlIdParams) => {
  document.getElementById('orderId').innerHTML = UrlIdParams
}

/* 
  ===========================
  | End of declarative code |
  |   start Onload init     |
  ===========================
*/

window.onload = () => {
  const UrlIdParams = new URLSearchParams(location.search).get('paymentId')
  insertHtml(UrlIdParams)
  resetCart();
}