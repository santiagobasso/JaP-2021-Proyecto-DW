var cart = [];
let dollar = 40;
let buy = {};
let address ={};

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CART_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      cart = resultObj.data.articles;
      showCart(cart);
    }
  });
  document.getElementById("confirmPayment").addEventListener("click", function () {
      document.getElementsByTagName("form")[0].classList.add("was-validated");
      if (document.getElementsByTagName("form")[0].checkValidity() === true) {
        //Cargo DATOS A LA COMPRA
        address.street = document.getElementById("street").value;
        address.door = document.getElementById("door").value;
        address.corner = document.getElementById("corner").value;
        address.country = document.getElementById("country").value;
        buy.address = address;
        buy.items = cart;
        $("#paymentModal").modal("show");
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
                        <small style="font-family:Arial;">P/Unitario: ${
                          product.currency
                        } ${Intl.NumberFormat().format(
      product.unitCost
    )}</small>
                    </div>
                </div>
            </td>
            <td>
                <input class="quantity" onchange="update(this.dataset.iden, value)" type="number" data-iden="${i}" min="1" value=${
      product.count
    }>
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
  var deliveryType = "";
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
    deliveryType= "Estandar";
  } else if (document.getElementsByName("deliveryType")[1].checked) {
    deliveryCost = subtotal * 0.07;
    deliveryType= "Express";
  } else {
    deliveryCost = subtotal * 0.15;
    deliveryType= "Premium";
  }
  total = subtotal + deliveryCost;
  document.getElementById("subtotalCost").innerHTML = `${Intl.NumberFormat("es-UY",{ style: "currency", currency: selectedCurrency }).format(subtotal)}`;
  document.getElementById("deliveryCost").innerHTML = `${Intl.NumberFormat("es-UY",{ style: "currency", currency: selectedCurrency }).format(deliveryCost)}`;
  document.getElementById("totalCost").innerHTML = `${Intl.NumberFormat("es-UY",{ style: "currency", currency: selectedCurrency }).format(total)}`;
  //CARGO DATOS DE COSTE
  buy.details= { subtotal: subtotal, delivery: deliveryCost, total: total, currency: selectedCurrency, deliveryType: deliveryType};
}

function update(id, cant) {
  cart[id].count = cant;
  showCart(cart);
}

function dropItem(i) {
  cart.splice(i, 1);
  showCart(cart);
}

function enableInputs() {
  if (document.getElementsByName("paymentType")[0].checked) {
    document.getElementById("creditCardInput1").disabled = false;
    document.getElementById("MonthYear").disabled = false;
    document.getElementById("creditCardInput4").disabled = false;
    document.getElementById("bankAccountInput1").disabled = true;
    document.getElementById("confimationButton").disabled = false;
  } else {
    document.getElementById("creditCardInput1").disabled = true;
    document.getElementById("MonthYear").disabled = true;
    document.getElementById("creditCardInput4").disabled = true;
    document.getElementById("bankAccountInput1").disabled = false;
    document.getElementById("confimationButton").disabled = false;
  }
}

function confirmPayment() {
  if (document.getElementsByName("paymentType")[0].checked) {
    document.getElementsByTagName("form")[1].classList.add("was-validated");
    if (document.getElementsByTagName("form")[1].checkValidity() === true) {
      buy.paymentDetails={BankAccount: 72}
      confirmMessage();
    }else{
      alert("Llene los campos correctamente");
    }
  }else{
    document.getElementsByTagName("form")[2].classList.add("was-validated");
    if (document.getElementsByTagName("form")[2].checkValidity() === true) {
      confirmMessage();
    }else{
      alert("Llene los campos correctamente");
    }
  }
}

function confirmMessage(){

  // fetch('http://localhost:3000/confirmed_sale', {
  //   method: 'POST',
  //   headers: {
  //       'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //         buy      
  //   })
  // });
  $("#paymentModal").modal("hide");
      document.getElementById("confirmation").innerHTML = `<div class="alert alert-success alert-dismissible fade show" id="confirmation" role="alert">
                                                            <strong>Sus compra a sido realizada!</strong>
                                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                              <span aria-hidden="true">&times;</span>
                                                            </button>
                                                          </div>`;
}
