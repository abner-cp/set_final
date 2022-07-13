const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'http://localhost:8080/api/auth/';

let usuario= null;
let socket= null;

//validar token del localStorage
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';
    if( token.length <= 10 ){
        window.location= 'index.html';  // redirecciona al index
        throw new Error('No hay token en el servidor');
    };

    const resp = await fetch( url, { //petición al server para renovar token
        headers: { 'x-token': token } 
    });
    
    const { usuario: userDB, token: tokenDB } = await resp.json(); //se rescata la respuesta del servidor
    //console.log(userDB, tokenDB);
    localStorage.setItem('token', tokenDB); // se reemplaza x el nuevo token en la localstorage
    usuario = userDB;
    document.title= usuario.nombre;

    await conectarSocket();

};


const conectarSocket= async() => {
    const socket = io({  //conectar el socket y enviar el token hacia el controller
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

};


const main = async () =>{

    await validarJWT();

}

main();




 