import React from 'react';
import {Button, MenuItem} from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import axios from 'axios';


const roles = [
    {
      value: 'none',
      label: 'None',
    },
    {
        value: 'student',
        label: 'Student',
    },
    {
        value: 'employee',
        label: 'Employee',
    },
    // {
        //   value: 'tnpofficer',
    //   label: 'TnP Officer',
    // },
];
class RegisterContent extends React.Component {
    constructor() {
        super();
        this.state = {
          name: "React",
          type:'',
          showHideGender: false,
          showHideCollege: false,
          user: {
            firstname: '',
            middlename: '',
            lastname: '',
            email: '',
            password: '',
            repeatPassword: '',
            gender: '',
            college: '',
        },
          
        };
        this.hideComponent = this.hideComponent.bind(this);
      }

    
    componentDidMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.user.password) {
                return false;
            }
            return true;
        });
    }
    handleSelect = (event) => {
        console.log(event.target.value);
        this.state.type = event.target.value;
        this.hideComponent(event.target.value);
    }
    hideComponent(name) {
        console.log(name);
        switch (name) {
          case "student":
            this.setState({ showHideGender: true });
            this.setState({ showHideCollege: false });
            break;
          case "faculty":
            this.setState({ showHideGender: false });
            this.setState({ showHideCollege: true });
            break;
        }
      }
    handleChange = (event) => {
        const { user } = this.state;
        user[event.target.name] = event.target.value;
        this.setState({ user });
    }
    
   
    handleSubmit = () => {
        const { user } = this.state
        const data = 
        {
            "username": user.email,
            "email": user.email,
            "password": user.password,
        }
        axios.post("https://cors-anywhere.herokuapp.com/http://tnpvision-auth.herokuapp.com/api/register/", data)
        .then((result) => {    
            console.log(result);
            alert("Registration Successfull, Please login");
        });

    }

    handleRegister = () =>{
        const {user} = this.state;
        
        const selectedRole = user.role;
        
        if(selectedRole==='student'){
            const {history} = this.props;
            history.push('/StudentRegistration')
        }
        else if(selectedRole==='employee'){
            const {history} = this.props;
            history.push('/FacultyRegistration') 
        }
        // else if(selectedRole==='tnpofficer'){
            //     const {history} = this.props;
            //     history.push('/TPORegistration')
            // }
        }
        
        render() {
            const { user } = this.state;
            return (
                <ValidatorForm onSubmit={this.handleRegister}>
                <FormLabel component="legend">Register As:</FormLabel>
                <RadioGroup aria-label="type" name="type" >
                    <FormControlLabel value="student" control={<Radio />} label="Student" onClick={this.handleSelect}/>
                    <FormControlLabel value="faculty" control={<Radio />} label="Faculty" onClick={this.handleSelect}/>
                </RadioGroup>
                <TextValidator
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="First Name"
                    onChange={this.handleChange}
                    name="firstname"
                    type="text"
                    validators={['required']}
                    errorMessages={['This field is required']}
                    value={user.firstname}
                />
                <br/>
                <TextValidator
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Last Name"
                    onChange={this.handleChange}
                    name="lastname"
                    type="text"
                    validators={['required']}
                    errorMessages={['This field is required']}
                    value={user.lastname}
                />
                <br/>
                <TextValidator
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Email Address"
                    onChange={this.handleChange}
                    name="email"
                    type="email"
                    validators={['isEmail','required']}
                    errorMessages={['Invalid Email Address','This field is required']}
                    value={user.email}
                />
                <br/>
                <TextValidator
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Password"
                    onChange={this.handleChange}
                    name="password"
                    type="password"
                    validators={['required']}
                    errorMessages={['This field is required']}
                    value={user.password}
                />
                <br/>
                <TextValidator
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Repeat password"
                    onChange={this.handleChange}
                    name="repeatPassword"
                    type="password"
                    validators={['isPasswordMatch', 'required']}
                    errorMessages={['Password mismatch', 'This field is required']}
                    value={user.repeatPassword}
                />
                <br/>
                
                {this.state.showHideGender && 
                <div > 
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup aria-label="gender" name="gender" onChange={this.handleChange} >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup><br/> </div>}
                
                {this.state.showHideCollege &&
                <div>
                <TextValidator
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="College"
                    onChange={this.handleChange}
                    name="college"
                    type="text"
                    validators={['isPasswordMatch', 'required']}
                    errorMessages={['Password mismatch', 'This field is required']}
                    value={user.repeatPassword}
                />
                <br/>
                </div>
                }
                <Button color="primary" variant="contained" type="submit" onClick={this.handleSubmit}>Proceed</Button>
                <br/>
            </ValidatorForm>
        );
    }
}

export default RegisterContent;