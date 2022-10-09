
import {makeStyles} from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import {Formik} from "formik";
import {string, object} from 'yup';
import Button from '@material-ui/core//Button';
import { Link } from "react-router-dom";
import { IconButton, InputAdornment } from "@material-ui/core";
import { useState } from "react";
import {AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Toast from "../Component/Toast";

const Login = ()=>{
    const classes = useStyles();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [submitLoader, setSubmitLoader] = useState(false);

    const initialValues = {
        email:undefined,
        password:undefined,
    }
    const validationSchema = object().shape({
        email:string().email("invalid email address").required('Required Field'),
        password:string().min(8, 'must be 8 character or more').required('Required Field'),
    })

    const onFormSubmit=async(values)=>{
        console.log("values", values);
        setSubmitLoader(true)
        console.log("values", values);
        try{
            const config = {
                headers:{"content-type":"application/json"}
            }
            const {data} = await axios.post("http://localhost:1000/api/user/login", values, config);
            localStorage.setItem("chatAppToken", data?.token );
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate('/');
            window.location.reload();
            setSubmitLoader(false);
        Toast('single', 'success', '', 'Logged In Successfully');

        }catch(error){
            setSubmitLoader(false);
            Toast('single', 'error', '', 'Invalid Credentials');

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
                                 {console.log("error", errors)}
                                <TextField 
                                    classes={ classes.textField }
                                    id="formemail"
                                    error={touched.email && !!errors.email}
                                    name="email"
                                    label = " Email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    helperText = {touched.email ? errors.email : false}
                                    variant = "outlined"
                                    fullWidth
                                    color="primary"                                
                                />

                                <TextField 
                                classes={classes.textField }
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
                                <div>
                                    <p className = {classes.signupText}>Don't have an account ? <Link to ='/register'> Sign Up </Link></p>
                                </div>
                                <Button variant="contained" type="submit">Login</Button>
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
export default Login;

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

        },
        "& input::placeholder":{
            fontFamily:'cursive'
        }
    },
    signupText:{
        fontSize:'16px',
        textAlign:'end'
    },
    textField: {
        "& input::placeholder": {
          color: "red",
          fontFamily:'cursive !important'
        }
      },
      input: {
        '&::placeholder': {
          textOverflow: 'ellipsis !important',
          color: 'blue'
        }
      }
   
}))