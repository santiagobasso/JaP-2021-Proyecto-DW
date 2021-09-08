var product = {};

function showImagesGallery(array){

    let htmlContentToAppend = "";

    for(let i = 0; i < array.length; i++){
        let imageSrc = array[i];

        htmlContentToAppend += `
        <div class="col-lg-4 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `

        document.getElementById("productImages").innerHTML = htmlContentToAppend;
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            product = resultObj.data;

            let productName  = document.getElementById("productName");
            let productDescription = document.getElementById("productDescription");
            let productCost = document.getElementById("productCost");
            let productSoldCount = document.getElementById("productSoldCount");
        
            productName.innerHTML = product.name;
            productDescription.innerHTML = product.description;
            productCost.innerHTML = product.cost + " " + product.currency;
            productSoldCount.innerHTML = product.soldCount;



            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images);
        }
    });
});
