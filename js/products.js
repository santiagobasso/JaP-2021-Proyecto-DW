var ProductsArray = [];
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_COST_DOWN = "desc.";
const ORDER_BY_COST_UP = "asc.";
const ORDER_BY_SOLD_DOWN = "sold.";
var currentSortCriteria = undefined;
var minPrice = undefined;
var maxPrice = undefined;
var search = undefined;

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_COST_DOWN) {
        result = array.sort(function (a, b) {
            let aPrice = parseInt(a.cost);
            let bPrice = parseInt(b.cost);

            if (aPrice > bPrice) { return -1; }
            if (aPrice < bPrice) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_COST_UP) {
        result = array.sort(function (a, b) {
            let aPrice = parseInt(a.cost);
            let bPrice = parseInt(b.cost);

            if (aPrice < bPrice) { return -1; }
            if (aPrice > bPrice) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_SOLD_DOWN) {
        result = array.sort(function (a, b) {
            let aSoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if (aSoldCount > bSoldCount) { return -1; }
            if (aSoldCount < bSoldCount) { return 1; }
            return 0;
        });
    }

    return result;
}

function showProductsList() {
    let htmlContentToAppend = "";
    for (let product of ProductsArray) {
        let price = product.cost;
        price = Intl.NumberFormat().format(price);
        if ((search == undefined) || (product.name.toLowerCase().includes(search)) || (product.description.toLowerCase().includes(search))) {
            if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
                ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))) {
                htmlContentToAppend += `
            <div class="col-md-4">
               <div class="card mb-4 shadow-sm">
                <a href="product-info.html" class="list-group-item-action" style="width: auto">
                  <img class="card-img-top" src="${product.imgSrc}" style="object-fit: contain">
                  <div class="card-body">
                    <h4 class="mb-1"> ${product.name} </h4>
                    <p class="card-text" style="height: 5rem; overflow: hidden">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <p> <b>Precio:</b> <span style="font-family: Arial">${price}</span>  ${product.currency}</p>
                      <small class="text-muted">${product.soldCount} vendidos</small>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
                     `
            }
        }
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
    hideSpinner();
}
function sortAndShowProducts(sortCriteria, proArray) {
    currentSortCriteria = sortCriteria;

    if (proArray != undefined) {
        ProductsArray = proArray;
    }

    ProductsArray = sortProducts(currentSortCriteria, ProductsArray);

    //Muestro las categor??as ordenadas
    showProductsList(ProductsArray);
}

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        showSpinner();
        if (resultObj.status === "ok") {
            ProductsArray = resultObj.data;
            sortAndShowProducts(ORDER_ASC_BY_NAME, ProductsArray);
        }
    });
    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByPriceDown").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_COST_DOWN);
    });

    document.getElementById("sortByPriceUp").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_COST_UP);
    });

    document.getElementById("sortByRelevancy").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_SOLD_DOWN);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterPriceMin").addEventListener("change", function () {
        pricefilter();
    });
    document.getElementById("rangeFilterPriceMax").addEventListener("change", function () {
        pricefilter();
    });
    document.getElementById("searchFilter").addEventListener("keyup", function () {
        searchFilter();
    });
})

function pricefilter() {
    //Obtengo el m??nimo y m??ximo de los intervalos para filtrar por cantidad
    //de productos por categor??a.
    minPrice = document.getElementById("rangeFilterPriceMin").value;
    maxPrice = document.getElementById("rangeFilterPriceMax").value;

    if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0) {
        minPrice = parseInt(minPrice);
    }
    else {
        minPrice = undefined;
    }

    if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0) {
        maxPrice = parseInt(maxPrice);
    }
    else {
        maxPrice = undefined;
    }

    showProductsList();
}

function searchFilter() {
    search = document.getElementById("searchFilter").value.toLowerCase();
    showProductsList();
}