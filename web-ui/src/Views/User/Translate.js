function TranslateRole(nameRole){
    var answer=""
    switch (nameRole) {
        case "AuntUser":
            answer="Tia"
            break;
        case "AdminUser":
            answer="Administrador"
            break;
        case "Cordinator":
            answer="Cordinador"
        case "Soporte":
            answer="Soporte"
            break;
        default:
            answer="Rol No definido"
            //answer="----"
            break;
    }
    return answer
}
export default TranslateRole