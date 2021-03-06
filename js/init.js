const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";
const CART_INFO_URL2 = "https://japdevdep.github.io/ecommerce-api/cart/654.json";

// const CATEGORIES_URL = "http://localhost:3000/category/list";
// const PUBLISH_PRODUCT_URL = "http://localhost:3000/product/car-msg";
// const CATEGORY_INFO_URL = "http://localhost:3000/category/cars";
// const PRODUCTS_URL = "http://localhost:3000/product/list";
// const PRODUCT_INFO_URL = "http://localhost:3000/product/car";
// const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/product/car-comments";
// const CART_INFO_URL = "http://localhost:3000/cart/one";
// const CART_BUY_URL = "http://localhost:3000/cart/cart-msg";
// const CART_INFO_URL2 = "http://localhost:3000/cart/two";



var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//Funci??n que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  if(document.getElementById("navigationBar")){
    navbar();
  }
  document.getElementById("logout").addEventListener('click',function(){
    location.href="logout.html";
  });
});

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  /*console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());*/

  // The ID token you need to pass to your backend:
  /*var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);*/
  let user = {};
  user.user = profile.getGivenName();
  localStorage.setItem('user',JSON.stringify(user));
  location.href="index.html";
}

function navbar(){
  let user = JSON.parse(localStorage.getItem("user"));
  let htmlContentToAppend = `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav_bar" aria-controls="nav_bar" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="nav_bar">
      <a class="navbar-brand" href="index.html">E-Mercado</a>
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0" style="padding-left: 25%;">
        <li class="nav-item" style="padding-left: 3%;">
          <a class="nav-link" href="index.html">Inicio</a>
        </li>
        <li class="nav-item" style="padding-left: 3%;">
          <a class="nav-link" href="categories.html">Categorias</a>
        </li>
        <li class="nav-item" style="padding-left: 3%;">
          <a class="nav-link" href="products.html">Productos</a>
        </li>
        <li class="nav-item" style="padding-left: 3%;">
          <a class="nav-link" href="sell.html">Vender</a>
        </li>
        <li class="dropdown" id="dropdownUser" style="list-style:none;float:right; padding-left: 3%;">`
        if(user == null || user == undefined){
          htmlContentToAppend +=`<button id="UserDropdown" class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Invitado
          </button>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <a class="dropdown-item" href="login.html">Iniciar Sesion</a>
            </ul>`
        }else{
          htmlContentToAppend += `<button id="UserDropdown" class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          ${user.user}
          </button>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <a class="dropdown-item" href="my-profile.html">Perfil</a>
              <a class="dropdown-item" href="cart.html">Carrito</a>
              <a class="dropdown-item" id="logout" href="logout.html">Cerrar sesi??n</a>
        `}
htmlContentToAppend +=`  </ul>
        </li>
      </ul>
    </div>
  </nav>`
document.getElementById("navigationBar").innerHTML = htmlContentToAppend;
}