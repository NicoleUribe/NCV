import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import ErrorPage from '../../Components/ErrorPage'
import FormContainer from '../../Components/FormContainer'
import InputText from '../../Components/InputText'
import Navbar from '../../Components/NavBar'
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import ButtonPrimary, { ButtonSecondary } from '../../Components/MUI-Button';
import getFromApi from '../../Components/GetFromApi'
import Dropdown from '../../Components/Dropdown'
import axios from 'axios';
import {getFixedAssets} from '../../Components/GetFromApi'

export default function UpdateFixedAssetForm() {
    const { fixedAssetId } = useParams()
    const url = `https://ncv-api.herokuapp.com/api/fixedAssets/${fixedAssetId}`
    const urlProgramHouses = 'https://ncv-api.herokuapp.com/api/programHouses'
    const urlCategories = 'https://ncv-api.herokuapp.com/api/assetCategories'
    const urlStates = 'https://ncv-api.herokuapp.com/api/assetStates'
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(null)
    const [formErrors,setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)
    const assetsCodes = []
    let programCode = ''
    let categoryCode = ''
    const navigate = useNavigate()
    const [data, setData] = useState([])

    const fetchBasicData = () => {
        const responseData = axios(url);
        axios.all([responseData]).then(
            axios.spread((...allData) => {
                setData(allData[0].data)
                console.log(allData[0].data)
            }))
    }

    useEffect(()=>{
        fetchBasicData();
        if (Object.keys(formErrors).length === 0 && isSubmit){
            console.log(data);
        }
    },[formErrors]);

    //programHouses
    const [programHouseSelectedValue, setProgramHouseSelectedValue] = useState(null)
    const { apiData:programHouses, error:errorProgramHouses } = getFromApi(urlProgramHouses)
    //categories
    const [categorySelectedValue, setCategorySelectedValue] = useState([])
    const { apiData:categories, error:errorCategory } = getFromApi(urlCategories) 
    //states
    const [stateSelectedValue, setStateSelectedValue] = useState(null)
    const { apiData:states, error:errorStates } = getFromApi(urlStates) 

    // program Houses Options for DROPDOWN
    if(errorProgramHouses){
        return ErrorPage(errorProgramHouses)
    }
    if (!programHouses) return null
    let programHousesList = programHouses.map( programHouse =>  { return {
        label: programHouse.acronym,
        value: programHouse.id
    }})
    const programHousesOptions = programHousesList
    // categories options for DROPDOWN
    if(errorCategory){
        return ErrorPage(errorCategory)
    }
    if (!categories) return null        
    let categoriesList = categories.map( category =>  { return {
        label: category.category,
        value: category.id
    }})
    const categoriesOptions = categoriesList
    //states options for DROPDOWN
    if(errorStates){
        return ErrorPage(errorStates)
    }
    if (!states) return null 
    let statesList = states.map( state =>  { return{
        label: state.state,
        value: state.id      
    }})
    const stateOptions = statesList 
    
    function handle(e) {
        setOpen(false)
        setData(e.target.value)
    }

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }
    
    function checkError(){
        if(error){
            //setOpen(true)
            return ErrorPage(error)
        }
    }
    function hasFormErrors(errorsFromForm){
        console.log('form errors',errorsFromForm)
        let hasErrors=true
        if(!errorsFromForm.name && !errorsFromForm.description && !errorsFromForm.price && !errorsFromForm.quantity && !errorsFromForm.programHouseId && !errorsFromForm.assetCategoryId && !errorsFromForm.features && !errorsFromForm.code && !errorsFromForm.assetStateId){
            hasErrors = false
        }
        return hasErrors
    }
    function getAssetsCodes(){
        const url = 'https://ncv-api.herokuapp.com/api/fixedAssets/'
        getFixedAssets(url).then(
            response => {
                if(response.name != "AxiosError"){
                    response.data.map((el)=>{
                        var splitCode = el.code.split("-")
                        assetsCodes.push(splitCode[splitCode.length-1]);
                        return response;
                    })
                }
            }
        )
    }
    function getProgramCode(programValue){
        let programCode = ''
        programHousesOptions.forEach(function (program){
            if(programValue == program.value){
                programCode = program.label
            }
        });
        return programCode
    }
    function getCategoryCode(categoryValue){
        let categoryCode = ''
        switch (categoryValue){
            case 1:
                categoryCode = 'HER'
            case 2:
                categoryCode = 'MUE'
            case 3:
                categoryCode = 'MAQ'
            case 4:
                categoryCode = 'VEH'
            case 6:
                categoryCode = 'EC' 
        }
        return categoryCode
    }
    function submit() {
        programCode = getProgramCode(programHouseSelectedValue)
        categoryCode = getCategoryCode(categorySelectedValue)
        const errorsFromForm= validate(data);
        setFormErrors(errorsFromForm)
        setIsSubmit(true)
        if(!hasFormErrors(errorsFromForm)){
            axios.put(url, {
                Name: data.name,
                Description: data.description==''? null:data.description, // string
                EntryDate: data.entryDate==''? null:data.entryDate.split('T')[0], // dateTime
                Price: data.price==''? null:parseFloat(data.price).toFixed(2), // decimal
                Features: data.features==''? null:data.features, // string
                ProgramHouseId : programHouseSelectedValue,
                AssetCategoryId : categorySelectedValue,
                AssetStateId: stateSelectedValue, //string
                Code: "F-" + programCode + "-" + categoryCode + "-" + data.code, //string
            }).then((res) => {
                if (res.status == 200) {               
                    navigate(`/activos-fijos`,{state:{showAlert:true,alertMessage:"Activo Fijo actualizado exitosamente"}})
                }            
            }).catch ((apiError) => {
                setError(apiError) 
                checkError()                    
            })
        }
    }

    const validate = (datas) => {        
        const errors = {}
        const regexNumber = /^[0-9]+([.][0-9]+)?$/;
        if(!datas.name){
            errors.name="El Nombre del Activo Fijo es requerido!";
        }else if(datas.name.length>60){
            errors.name="El campo Nombre del Activo Fijo debe ser menor o igual a 60 caracteres!";
        }
        if(!datas.code){
            errors.code="El Código del Activo Fijo es requerido!";
        } else if(assetsCodes.includes(datas.code)){
            errors.code="El Código del Activo Fijo ya existe!";
        }
        if(datas.description.length>1000){
            errors.description="El campo Descripción del Activo Fijo debe ser menor o igual a 1000 caracteres!";
        }
        if(!datas.price){
            errors.price= "El Precio del Activo Fijo es requerido!";
        }else if(datas.price < 0){
            errors.price= "El Precio del Activo Fijo debe ser un número positivo!";
        }else if(!regexNumber.test(datas.price)){
            errors.price= "El Precio del Activo Fijo debe ser ingresado en formato decimal!";
        }
        if(!programHouseSelectedValue){
            errors.programHouseId= "El programa del Activo Fijo es requerido!";
        }
        if(!categorySelectedValue){
            errors.assetCategoryId= "La categoría del Activo Fijo es requerida!";
        }
        if(datas.features.length>1000){
            errors.features= "El campo de Características del Activo Fijo debe ser menor o igual a 1000 caracteres!";
        }
        if(!stateSelectedValue){
            errors.assetStateId= "El Estado del Activo Fijo es requerida!";
        }
        console.log('errs',errors)
        return errors
    }
    //debugger;
    if(error){
        //setOpen(true)
        return ErrorPage(error)
    }
    return (
        <><Navbar />
        <div style={{display:'flex', justifyContent:'center', marginTop: '3em'}}>
            <FormContainer title="Editar activo fijo">
                <InputText
                    required
                    id="Name"
                    name="Name"
                    value={data.name}
                    label="Nombre"
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handle(e)}
                />
                {formErrors.name? <Alert  sx={{ width: 1, pt: 1 }} severity="error"> 
                    {formErrors.name}                   
                </Alert>:<p></p> }
                <Dropdown 
                    name={"Categoría"} 
                    id="category-drop" 
                    options={categoriesOptions} 
                    helperText = "Seleccione una categoría" 
                    selectedValue={categorySelectedValue == '' ? data.assetCategoryId : categorySelectedValue}
                    setSelectedValue = {setCategorySelectedValue}
                    InputLabelProps={{ shrink: true }}
                    required
                    >                                        
                </Dropdown> 
                {formErrors.assetCategoryId? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.assetCategoryId}  </Alert>:<p></p> }             
                <InputText
                    onChange={(e) => handle(e)}
                    id="Description"
                    value={data.description}
                    label="Descripción"
                    type="text"
                    InputLabelProps={{ shrink: true }}
                />
                {formErrors.description? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.description} </Alert>:<p></p> }
                <InputText
                    onChange={(e) => handle(e)}
                    id="EntryDate"
                    value={data.entryDate == null ? data.entryDate : data.entryDate.split('T')[0]}
                    label="Fecha de Entrada"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                />
                <InputText
                    required
                    id="Price"
                    value={data.price}
                    label="Precio"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handle(e)}
                />
                {formErrors.price? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.price}  </Alert>:<p></p> }
                <Dropdown 
                    name={"Programa"} 
                    id="programa-drop" 
                    options={programHousesOptions} 
                    helperText = "Seleccione un programa" 
                    selectedValue={programHouseSelectedValue == null ? data.programHouseId : programHouseSelectedValue}
                    setSelectedValue = {setProgramHouseSelectedValue}
                    InputLabelProps={{ shrink: true }}
                    required
                    >                                        
                </Dropdown>   
                {formErrors.programHouseId? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.programHouseId}  </Alert>:<p></p> }                 
                <Dropdown 
                    name={"Estado"} 
                    id="estado-drop" 
                    options={stateOptions}                                         
                    selectedValue={stateSelectedValue == null ? data.assetStateId : stateSelectedValue}
                    setSelectedValue = {setStateSelectedValue}
                    helperText = "Seleccione un estado"
                    InputLabelProps={{ shrink: true }}
                    required                    
                    >                                        
                </Dropdown>   
                {formErrors.assetStateId? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.assetStateId}  </Alert>:<p></p> }
                <InputText
                    onChange={(e) => handle(e)}
                    id="Features"
                    value={data.features}
                    label="Características"
                    type="text"
                    InputLabelProps={{ shrink: true }}
                />
                 {formErrors.features? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.features} </Alert>:<p></p> }
                <InputText
                    required
                    id="Code"
                    name="Code"
                    value={data.code == null ? data.code : data.code.split('-').pop()}
                    label="Código"
                    type="text"
                    onChange={(e) => { handle(e) }}
                    InputLabelProps={{ shrink: true }}
                />
                {formErrors.code? <Alert  sx={{ width: 1, pt: 1 }} severity="error"> 
                    {formErrors.code}                   
                </Alert>:<p></p> }
                <Box sx={{display: 'inline'}}>
                    <ButtonSecondary label="Cancelar" onClick={handleClose}></ButtonSecondary>
                    <ButtonPrimary label={"Guardar"} onClick={submit}></ButtonPrimary>
                </Box>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                </Snackbar>
            </FormContainer>
        </div>
        </>
    )
}