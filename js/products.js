var ProductsArray = [];
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_COST_DOWN = "desc.";
const ORDER_BY_COST_UP = "asc.";
var currentSortCriteria = undefined;
var minPrice = undefined;
var maxPrice = undefined;

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_COST_DOWN){
        result = array.sort(function(a, b) {
            let aPrice = parseInt(a.cost);
            let bPrice = parseInt(b.cost);

            if ( aPrice > bPrice ){ return -1; }
            if ( aPrice < bPrice ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_COST_UP){
        result = array.sort(function(a, b) {
            let aPrice = parseInt(a.cost);
            let bPrice = parseInt(b.cost);

            if ( aPrice < bPrice ){ return -1; }
            if ( aPrice > bPrice ){ return 1; }
            return 0;
        });
    }

    return result;
}

function showProductsList(products){
    let htmlContentToAppend = "";
    for(let i = 0; i < products.length; i++){
        let product = products[i];
        let price = product.cost;
        price = Intl.NumberFormat().format(price);
        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))){    
        htmlContentToAppend += `
        <a href="product-info.html" class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src=" ${product.imgSrc} " alt=" ${product.name} " class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1"> ${product.name} </h4>
                        <small class="text-muted"> ${product.soldCount} vendidos</small>
                    </div>
                    <p class="mb-1"> ${product.description} </p>
                    <br>
                    <p> <b>Precio:</b> <span style="font-family: serif">${price}</span>  ${product.currency}</p>
                </div>
            </div>
        </div>
        `
       
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    
        }
    }
    hideSpinner();
}

function sortAndShowProducts(sortCriteria, proArray){
    currentSortCriteria = sortCriteria;

    if(proArray != undefined){
        ProductsArray = proArray;
    }

    ProductsArray = sortProducts(currentSortCriteria, ProductsArray);

    //Muestro las categorías ordenadas
    showProductsList(ProductsArray);
}

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        showSpinner();
        if (resultObj.status === "ok"){
            ProductsArray = resultObj.data;
            sortAndShowProducts(ORDER_ASC_BY_NAME, ProductsArray);
        }
    });
    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_NAME,ProductsArray);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_NAME,ProductsArray);
    });

    document.getElementById("sortByPriceDown").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_COST_DOWN,ProductsArray);
    });

    document.getElementById("sortByPriceUp").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_COST_UP,ProductsArray);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;

        showProductsList(ProductsArray);
    });
    
    document.getElementById("rangeFilterPriceMin").addEventListener("input", function(){
        pricefilter();
    });
    document.getElementById("rangeFilterPriceMax").addEventListener("input", function(){
        pricefilter();
    });
});

function pricefilter(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;

        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
            minPrice = parseInt(minPrice);
        }
        else{
            minPrice = undefined;
        }

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
            maxPrice = parseInt(maxPrice);
        }
        else{
            maxPrice = undefined;
        }

        showProductsList(ProductsArray);
}