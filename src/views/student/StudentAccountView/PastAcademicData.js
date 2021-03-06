import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, Typography} from '@material-ui/core';
import { useForm } from '../../../components/controls/useForm';
import Controls from "../../../components/controls/Controls";
import StudentService from '../../../services/StudentService';
import swal from 'sweetalert';  

const PostmatricItems = [
  { id: 'D', title: 'Diploma' },
  { id: 'T', title: '12th' },
]

const initialFValues = {
  tenthPercentage: 0.0,
  tenthBoardOfExamination: "",
  tenthYearOfPassing: 0,
  twelthPercentage: 0,
  twelfthBoardOfExamination: "",
  twelfthYearOfPassing: 0,
  isDiploma: false,
  diplomaPercentage: 0.0,
  diplomaBoardOfExamination: "",
  diplomaYearOfPassing: 0,
  EnggQualifyingExamYear: 0,
  EnggQualifyingExamScore: 0.0,
  createdAt: "",
  updatedAt: "",
  isDeleted: false,
  isVolunteer: true,
  isProfileComplete: true,
}
const PastAcademicData = ({ userData }) => {

  const [values, setValues] = useState({
    tenthPercentage: 0.0,
    tenthBoardOfExamination: "",
    tenthYearOfPassing: 0,
    twelthPercentage: 0,
    twelfthBoardOfExamination: "",
    twelfthYearOfPassing: 0,
    isDiploma: false,
    diplomaPercentage: 0.0,
    diplomaBoardOfExamination: "",
    diplomaYearOfPassing: 0,
    EnggQualifyingExamYear: 0,
    EnggQualifyingExamScore: 0.0,
    createdAt: "",
    updatedAt: "",
    isDeleted: false,
    isVolunteer: false,
    isProfileComplete: true,
  });

  const [diplomaValue, setDiplomaValue] = useState('T');
  const [volunteerValue, setvolunteerValue] = useState(false)

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('email' in fieldValues)
      temp.email = (/$^|.+@.+..+/).test(fieldValues.parentsEmail) ? "" : "Email is not valid."
    setErrors({
      ...temp
    })
    if (fieldValues === values)
      return Object.values(temp).every(x => x === "")
  }

  const {
    errors,
    setErrors,
  } = useForm(initialFValues, true, validate);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = e => {
    console.log(values);
    e.preventDefault()
    console.log("e", e);

    if (validate()) {
      const pastAcadData = {
        "studentProfile": {
        "tenthPercentage": values.tenthPercentage,
        "tenthBoardOfExamination": values.tenthBoardOfExamination,
        "tenthYearOfPassing": values.tenthYearOfPassing,

        "isDiploma": diplomaValue !== 'T' ? true : false,
        
        "twelthPercentage": diplomaValue === 'T' ? values.twelthPercentage: 0,
        "twelfthBoardOfExamination": diplomaValue === 'T' ? values.twelfthBoardOfExamination: "NA",
        "twelfthYearOfPassing": diplomaValue === 'T' ? values.twelfthYearOfPassing: "2016",
        
        "diplomaPercentage": diplomaValue === 'D' ? values.diplomaPercentage: 0,
        "diplomaBoardOfExamination": diplomaValue === 'D' ? values.diplomaBoardOfExamination: "NA",
        "diplomaYearOfPassing": diplomaValue === 'D' ? values.diplomaYearOfPassing: "2016",

        "EnggQualifyingExamYear": values.EnggQualifyingExamYear,
        "EnggQualifyingExamScore": values.EnggQualifyingExamScore,        
        "isDeleted": values.isDeleted,
        "isVolunteer": volunteerValue,
        "isProfileComplete": values.isProfileComplete,
      }
    }
    StudentService.updateStudent(pastAcadData)
        .then(res => {
          console.log("res", res);
          swal({
            title: "Thank You!",
            text: "Past Academic Data Updated!",
            icon: "success",
            button: "Close!",
            timer: 1500
          });
        }).catch(error => {
          console.log(error);
          swal({
            title: "Error Occured?",
            icon: "warning",
            button: "Close!",
            timer: 1500
          })
        });
    }
  }

  function Twelth(){
    return(
      <div>
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <Typography> Twelth </Typography> 
        <Divider style={{marginTop: "5px"}}/>               
      </Grid> 
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          type="number"
          label="Percentage"
          name="twelthPercentage"
          onChange={handleChange}
          required
          value={values.twelthPercentage}
          variant="outlined"
          
        />
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label="Examination Board"
          name="twelfthBoardOfExamination"
          onChange={handleChange}
          required
          value={values.twelfthBoardOfExamination}
          variant="outlined"
          key="rushikesh"
        />
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          label="Year of Passing"
          name="twelfthYearOfPassing"
          onChange={handleChange}
          required
          value={values.twelfthYearOfPassing}
          variant="outlined"
          key="rushikesh"
        />
      </Grid>
    </Grid>
</div>
    )
  }

  function Diploma(){
    return(
      <div>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
                <Typography> Diploma </Typography> 
                <Divider style={{marginTop: "5px"}}/>               
              </Grid> 
            <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Percentage"
                  name="diplomaPercentage"
                  onChange={handleChange}
                  required
                  value={values.diplomaPercentage}
                  variant="outlined"
                />
              </Grid>
            <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Examination Board"
                  name="diplomaBoardOfExamination"
                  onChange={handleChange}
                  required
                  value={values.diplomaBoardOfExamination}
                  variant="outlined"
                />
              </Grid>
            <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Year of Passing"
                  name="diplomaYearOfPassing"
                  onChange={handleChange}
                  required
                  value={values.diplomaYearOfPassing}
                  variant="outlined"
                />
              </Grid>                            
          </Grid>              
        </div>
    )
  }

  useEffect(() => {
    if (userData != null) {
      setValues({
        ...values,
        "tenthPercentage": userData && userData.tenthPercentage ? userData.tenthPercentage :"",
        "tenthBoardOfExamination": userData && userData.tenthBoardOfExamination ? userData.tenthBoardOfExamination: "",
        "tenthYearOfPassing": userData && userData.tenthYearOfPassing ? userData.tenthYearOfPassing: "",
        "twelthPercentage": userData && userData.twelthPercentage ? userData.twelthPercentage : 0,
        "twelfthBoardOfExamination": userData && userData.twelfthBoardOfExamination ? userData.twelfthBoardOfExamination: "",
        "twelfthYearOfPassing": userData && userData.twelfthYearOfPassing ? userData.twelfthYearOfPassing : "",
        "isDiploma": userData && userData.isDiploma ? userData.isDiploma: false,
        "diplomaPercentage": userData && userData.diplomaPercentage ? userData.diplomaPercentage: 0,
        "diplomaBoardOfExamination": userData && userData.diplomaBoardOfExamination ? userData.diplomaBoardOfExamination: "",
        "diplomaYearOfPassing": userData && userData.diplomaYearOfPassing ? userData.diplomaYearOfPassing: "",
        "EnggQualifyingExamYear": userData && userData.EnggQualifyingExamYear ? userData.EnggQualifyingExamYear: "",
        "EnggQualifyingExamScore": userData && userData.EnggQualifyingExamScore ? userData.EnggQualifyingExamScore: "",
        "isDeleted": userData && userData.isDeleted ? userData.isDeleted: "",
        "isVolunteer": userData && userData.isVolunteer ? userData.isVolunteer: false,
        "isProfileComplete": userData && userData.isProfileComplete ? userData.isProfileComplete: "",
      })
      setDiplomaValue(userData && userData.isDiploma ? 'D': 'T')
      console.log("diplomaValue",diplomaValue)
    }
  }, [userData])


  return (
    <div>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
      >
        <Card>
          <CardHeader
            subheader="The information can be edited"
            title="Student Profile"
          />
          <Divider />
          <CardContent>                    

            <Grid container spacing={3}>  
              <Grid item md={12} xs={12}>
                <Typography> Tenth </Typography> 
                <Divider style={{marginTop: "5px"}}/>               
              </Grid>         
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Percentage"
                  name="tenthPercentage"
                  onChange={handleChange}
                  required
                  value={values.tenthPercentage}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Examination Board"
                  name="tenthBoardOfExamination"
                  onChange={handleChange}
                  required
                  value={values.tenthBoardOfExamination}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Year of Passing"
                  name="tenthYearOfPassing"
                  onChange={handleChange}
                  required
                  value={values.tenthYearOfPassing}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Controls.RadioGroup
                  name="postmatric"
                  label="Post Matric"
                  value={diplomaValue}
                  onChange={(event)=>(setDiplomaValue(event.target.value))}                  
                  items={PostmatricItems}
                />
                <br/><br/>
                {diplomaValue !== 'D'? Twelth(): Diploma()}
              </Grid>                                        
              <Grid item md={12} xs={12}>
                <Typography> Engineering </Typography> 
                <Divider style={{marginTop: "5px"}}/>               
              </Grid> 
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Qualifying Exam Year"
                  name="EnggQualifyingExamYear"
                  onChange={handleChange}
                  required
                  value={values.EnggQualifyingExamYear}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Qualifying Exam Score"
                  name="EnggQualifyingExamScore"
                  onChange={handleChange}
                  required
                  value={values.EnggQualifyingExamScore}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Controls.Checkbox
                  name="isvolunteer"
                  label="Are you a Volunteer"
                  checked={volunteerValue}
                  onChange={(event)=>(setvolunteerValue(event.target.value))}
                />               
              </Grid>
            </Grid>
            <Divider style={{marginTop:10}} />
            <Box
              display="flex"
              justifyContent="flex-end"
              p={2}
            >
              <Button
                color="primary"
                variant="contained"
                type="submit"
              >
                Save details
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>

    </div>
  )
}

export default PastAcademicData;