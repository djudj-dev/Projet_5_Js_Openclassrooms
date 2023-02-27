insertHtml = (UrlIdParams) => {
  document.getElementById('orderId').innerHTML = UrlIdParams
}

window.onload = () => {
  const UrlIdParams = new URLSearchParams(location.search).get('paymentId')
  insertHtml(UrlIdParams)
  resetCart();
}