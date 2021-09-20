var product = {};
var comments = [];
var newComments = [];
var allComments = [];

function showImagesGallery(array) {

    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
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
document.addEventListener("DOMContentLoaded", function (e) {
    if (sessionStorage.getItem("newComment")) {
        newComments = JSON.parse(sessionStorage.getItem("newComment"));
    }
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;
            price = Intl.NumberFormat().format(product.cost);

            let productName = document.getElementById("productName");
            let productDescription = document.getElementById("productDescription");
            let productSoldCount = document.getElementById("productSoldCount");

            productName.innerHTML = product.name + `<span style="font-family:'Times New Roman', Times, serif; font-size: 24px"> - ${price}  ${product.currency}</span>`;
            productDescription.innerHTML = product.description;
            productSoldCount.innerHTML = product.soldCount;


            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images);
        }
    });
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            comments = resultObj.data;
            comments = comments.concat(newComments);
            sortComments(comments);
        }
    });
    document.getElementById("comment").addEventListener("click", function () {

        if (!document.getElementById('message').value) {
            alert("Debe llenar los campos para publicar el comentario");
            return false;
        }

        var stars;
        let text = document.getElementById("message").value;
        var flag = false;
        var count = 5;
        let now = new Date();
        let dateTime = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

        while (!flag && count > 0) {
            if (document.getElementById(count).checked) {
                stars = count;
                flag = true;
            } else {
                count = count - 1;
            }
        }
        if (count <= 0) {
            alert("Debe ingresar la calificacion para comentar");
            return false;
        }

        let comment = {
            score: stars,
            description: text,
            user: JSON.parse(localStorage.getItem('user')).nombre,
            dateTime: dateTime,
        }

        newComments.push(comment);
        sessionStorage.setItem('newComment', JSON.stringify(newComments));
        document.getElementById("message").value = "";
        document.getElementById(count).checked = false;
        comments = comments.concat(comment);
        sortComments(comments);
    });

});

function showComments() {
    htmlContentToAppend = "";
    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i];
        const commentdate = new Date(comment.dateTime);
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
                        <h7 class="ml-2"> <b>${comment.user}</b></h7>     
                        <small class="text-muted ml-2 fas fa-clock"> ${commentdate.getDate()}/${commentdate.getMonth() + 1}/${commentdate.getFullYear()}</small>              
                        <hr class="my-3">
                        <div class="col-12">
                        <p class="col-12">${comment.description}</p>
                        <hr class="my-3">
                        <span class="ml-3">Calificacion</span>
        `
        for (let i = 1; i <= comment.score; i++) {
            htmlContentToAppend += `<span class="fa fa-star checked"></span>`;
        };

        for (let i = comment.score + 1; i <= 5; i++) {
            htmlContentToAppend += `<span class="fa fa-star unchecked"></span>`;
        }

        htmlContentToAppend +=
            `
                    </div>
                </div>
        </div>
        `
    }
    document.getElementById("comments-container").innerHTML = htmlContentToAppend;

}

function sortComments(array) {
    let result = [];
    result = array.sort(function (a, b) {
        if (a.dateTime > b.dateTime) { return -1; }
        if (a.dateTime < b.dateTime) { return 1; }
        return 0;
    });
    showComments();
}
