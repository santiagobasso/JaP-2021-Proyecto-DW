//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    
    if(localStorage.getItem('user')!=null || localStorage.getItem('user')!=undefined){
        location.href='index.html';
    }

    document.getElementById("login").addEventListener('click',function(){
        log();
    });
});

function log(){
    let usuario = {};
    usuario.correo = document.getElementById("email").value.trim();
    usuario.pwd = document.getElementById("pass").value.trim();
    if(usuario.pwd=="" || usuario.correo==""){
        if(usuario.correo==""){
            document.getElementById("email-input").setAttribute("style","border-color:red");
            document.getElementById("check-email").removeAttribute('hidden');
        }else{
            document.getElementById("pass-input").setAttribute("style","border-color:red");
            document.getElementById("check-pass").removeAttribute('hidden');
        }
    }else{
        localStorage.setItem('user',JSON.stringify(usuario));
        location.href="index.html";
    }
}
