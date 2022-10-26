import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from 'react-router-dom'
import HomePageForm from './Views/HomePage/HomePageForm'
import LoginForm from './Views/Login/LoginForm'
import CreateUser from './Views/User/CreateUser'
import { EditUser } from './Views/User/EditUser'

import CreateFixedAssetForm from './Views/FixedAssets/CreateFixedAssetForm'
import ShowFixedAssets from './Views/FixedAssets/ShowFixedAssets'
import { ShowFixedAsset } from './Views/FixedAssets/ShowOneFixedAsset'

import AddHealthReport from './Views/KidsFiles/AddHealthReport'
import { ShowKidsFiles } from './Views/KidsFiles/ShowKidsFiles'
import { ShowOneKidFile } from './Views/KidsFiles/ShowOneKidFile'
import DataHealth from './Views/KidsFiles/DataHealth'
import AddKid from './Views/KidsFiles/AddKid'
import EditKid from './Views/KidsFiles/EditKid'

<<<<<<< HEAD
import NavBar from './Components/NavBar'
import ListUsers from './Views/User/ListUsers'
var Rol = sessionStorage.getItem('Role')
=======
>>>>>>> 17ef19e (Cambios en control de seguridad)

import ListUsers from './Views/User/ListUsers'
function App() {
<<<<<<< HEAD
    if (Rol == 'Soporte' || Rol == 'AdminUser' || Rol == 'AuntUser') {
=======
    if(sessionStorage.getItem("Access") != "null"){
>>>>>>> 17ef19e (Cambios en control de seguridad)
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={<LoginForm />}></Route>
<<<<<<< HEAD
                    <Route
                        path="/inicio-ncv"
                        element={<HomePageForm />}
                    ></Route>
                    <Route
                        path="/registrarse-ncv"
                        element={<CreateUser />}
                    ></Route>
                    <Route
                        path="/vista-usuarios"
                        element={<ListUsers />}
                    ></Route>
=======
                    <Route path="/inicio-ncv" element={<HomePageForm />}></Route>
                    
                    <Route path="/registrarse-ncv" element={<CreateUser />}></Route>
                    <Route path="/vista-usuarios" element={<ListUsers />}></Route>
>>>>>>> 17ef19e (Cambios en control de seguridad)
                    <Route path="/registrar-nino" element={<AddKid />}></Route>
                    <Route
                        path="/crear-activo-fijo"
                        element={<CreateFixedAssetForm />}
                    ></Route>

                    <Route
                        path="/activos-fijos"
                        element={<ShowFixedAssets />}
                    ></Route>

                    <Route
                        path="/activos-fijos/:fixedAssetId"
                        element={<ShowFixedAsset />}
                    ></Route>
                    <Route
                        path="/vista-usuarios/:userId"
                        element={<EditUser />}
                    ></Route>
                    <Route path="/ninos" element={<ShowKidsFiles />}></Route>
                    <Route
                        path="/ninos/:kidId"
                        element={<ShowOneKidFile />}
                    ></Route>
                    <Route
                        path="ninos/:kidId/crear-reporte/"
                        //element={<><NavBar/><AddHealthReport/></>}
                        element={<AddHealthReport />}
                    ></Route>
                    <Route
                        path="ninos/:kidId/editar-nino"
                        element={<EditKid />}
                    ></Route>
                    <Route path="/kidHealth/:id" element={<DataHealth />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
            </Router>
        )
    } else {
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={<LoginForm />}></Route>
                    <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
            </Router>
        )
    }
}

export default App
