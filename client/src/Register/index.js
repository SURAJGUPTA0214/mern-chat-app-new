
import {makeStyles} from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import {Formik} from "formik";
import {string, object} from 'yup';
import * as Yup from 'yup';
import Button from '@material-ui/core//Button';
import { Link } from "react-router-dom";
import { IconButton, InputAdornment } from "@material-ui/core";
import { useState } from "react";
import {AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Toast from "../Component/Toast";

const Register = ()=>{
    const classes = useStyles();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [submitLoader, setSubmitLoader] = useState(false);


    const initialValues = {
        name:undefined,
        email:undefined,
        password:undefined,
        confirmpassword:undefined,
    }
    const validationSchema = object().shape({
        name:string().required('Required Field'),
        email:string().email("invalid email address").required('Required Field'),
        password:string().min(8, 'must be 8 character or more').required('Required Field'),
        confirmpassword:string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required Field'),
    })

    const onFormSubmit=async(values)=>{
        setSubmitLoader(true)
        delete values.confirmpassword
        console.log("values", values);
        try{
            const config = {
                headers:{"content-type":"application/json"}
            }
            const {data} = await axios.post("http://localhost:1000/api/user", values, config);
            localStorage.setItem("userInfo", JSON.stringify(data));
            localStorage.setItem("chatAppToken", data?.token );
            navigate('/');
            window.location.reload();
            setSubmitLoader(false);
        }catch(error){
            setSubmitLoader(false);
            Toast('single', 'error', '', 'Something Wrong !');


        }

    }


const handleClick = () => {
  setShowPassword(prev => !prev);
}
    return(
        <>
            <div className={classes.container}>
                <div className={classes.form}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onFormSubmit}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            errors
                        })=>(
                            <form autoComplete="off" onSubmit={handleSubmit}>
                                 <TextField 
                                    error={touched.name && !!errors.name}
                                    name="name"
                                    label = "name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    helperText = {touched.name ? errors.name : false}
                                    variant = "outlined"
                                    fullWidth
                                    color="primary"                                
                                />
                                <TextField 
                                    error={touched.email && !!errors.email}
                                    name="email"
                                    label = "Email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    helperText = {touched.email ? errors.email : false}
                                    variant = "outlined"
                                    fullWidth
                                    color="primary"                                
                                />

                                <TextField 
                                    error={touched.password && !!errors.password}
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    label = "Password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    helperText = {touched.password ? errors.password : false}
                                    variant = "outlined"
                                    fullWidth
                                    color="primary" 
                                    className="text"
                                    InputProps={{ // <-- This is where the toggle button is added.
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <IconButton
                                              aria-label="toggle password visibility"
                                              onClick={handleClick}
                                             
                                            >
                                              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                                            </IconButton>
                                          </InputAdornment>
                                        )
                                      }}                               
                                />
                                 <TextField 
                                    error={touched.confirmpassword && !!errors.confirmpassword}
                                    name="confirmpassword"
                                    type="confirmpassword"
                                    label = "Confirm Password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmpassword}
                                    helperText = {touched.confirmpassword ? errors.confirmpassword : false}
                                    variant = "outlined"
                                    fullWidth
                                    color="primary"                                
                                />
                                <div>
                                    <p className = {classes.signupText}>Have an account ? <Link to="/"> Login </Link></p>
                                </div>
                                <Button variant="contained" type="submit" disabled={submitLoader}>Register</Button>
                            </form>
                        )
                        }

                    </Formik>

                </div>
            </div>
            <style>{`
            .MuiInputLabel-formControl {
                font-family:cursive !important;
            }
            `}</style>
        </>
    )
}
export default Register;

const useStyles = makeStyles((theme)=>({
    container:{
        width: '100vw',
        height: '100vh',
        background: '#343a40',
    },
    form:{
        width: '30rem',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign:'left',
        border: '2px solid white',
        padding: '4rem',
        borderRadius:'1rem',
        fontSize:'2rem',
        background: '#fff',
        "& .MuiTextField-root":{
            margin:'1rem 0',
        },
        "& .MuiButtonBase-root":{
            width:'10rem',

        }
    },
    signupText:{
        fontSize:'16px',
        textAlign:'end'
    }
}))