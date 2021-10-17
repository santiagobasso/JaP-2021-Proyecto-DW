var cart = [];
let dollar = 40;

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CART_INFO_URL2).then(function (resultObj) {
    if (resultObj.status === "ok") {
      cart = resultObj.data.articles;
      showCart(cart);
    }
  });    
});

function showCart(cart) {
  let htmlContentToAppend = ` 
                            <table class="cart-table center">
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th colspan="2" style="padding: 0px; text-align: center">Precio</th>
                                    <th style="padding: 0px; text-align: center">Eliminar</th>
                                </tr>`;
  for (let i = 0; i < cart.length; i++) {
    let product = cart[i];
    htmlContentToAppend += `
        <tr>
            <td>
                <div class="cart-info">
                    <img src="${product.src}" alt="${product.src}">
                    <div>
                        <p>${product.name}</p>
                        <small style="font-family:Arial;">P/Unitario: ${product.currency} ${Intl.NumberFormat().format(product.unitCost)}</small>
                    </div>
                </div>
            </td>
            <td>
                <input class="quantity" onchange="update(this.dataset.iden, value)" type="number" data-iden="${i}" min="1" value=${product.count}>
            </td>
            <td style="width: 40px;">
                ${product.currency} 
            </td>
            <td style="text-align: right; width: 55px;font-family:Arial;">
                ${Intl.NumberFormat().format(product.count * product.unitCost)}
            </td>
            <td>
                <button type="button" class="btn btn-danger" style="margin:auto; display:block;" onclick=dropItem(${i})><i class="fas fa-trash-alt"></i>
            </button>
            </td>
        </tr>
            `;
  }
  document.getElementById("product-container").innerHTML =
    htmlContentToAppend + `</table>`;
  calculateTotal(cart);
}

function calculateTotal(cart) {
  var subtotal = 0;
  var deliveryCost = 0;
  var total = 0;
  let selectedCurrency = "";

  if (document.getElementsByName("currency")[0].checked) {
    selectedCurrency = "UYU";
  } else {
    selectedCurrency = "USD";
  }

  for (let i = 0; i < cart.length; i++) {
    let product = cart[i];
    if (selectedCurrency == "UYU") {
      if (product.currency == "UYU") {
        subtotal += product.unitCost * product.count;
      } else {
        subtotal += product.unitCost * product.count * dollar;
      }
    } else {
      if (product.currency == "USD") {
        subtotal += product.unitCost * product.count;
      } else {
        subtotal += (product.unitCost * product.count) / dollar;
      }
    }
  }
  if (document.getElementsByName("deliveryType")[0].checked) {
    deliveryCost = subtotal * 0.05;
  } else if (document.getElementsByName("deliveryType")[1].checked) {
    deliveryCost = subtotal * 0.07;
  } else {
    deliveryCost = subtotal * 0.15;
  }
  total = subtotal + deliveryCost;
  document.getElementById("subtotalCost").innerHTML = `${Intl.NumberFormat().format(subtotal)} ${selectedCurrency}`;
  document.getElementById("deliveryCost").innerHTML = `${Intl.NumberFormat().format(deliveryCost)} ${selectedCurrency} `;
  document.getElementById("totalCost").innerHTML = `${Intl.NumberFormat().format(total)} ${selectedCurrency} `;
}

function update(id, cant){
    cart[id].count = cant;
    showCart(cart);
}

function dropItem(i){
  cart.splice(i,1);
  showCart(cart);
}