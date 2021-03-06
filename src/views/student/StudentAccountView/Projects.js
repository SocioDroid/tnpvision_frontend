import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import { Box, Button, List, ListSubheader, ListItem, ListItemText, Divider, Grid, Typography, makeStyles } from '@material-ui/core';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import { KeyboardDatePicker } from 'formik-material-ui-pickers';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import StudentService from '../../../services/StudentService';
import swal from 'sweetalert';

const useStyles = makeStyles(theme => ({
    divider: {
        margin: '10px'
    },
    typography: {
        marginLeft: 10
    },
    root: {
        width: '100%',
        backgroundColor: "#f5f5f5",
        position: 'relative',
        overflow: 'auto',
        maxHeight: 220,
        marginBottom: 20
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    listItem: {
        paddingBottom: '0px',
        paddingTop: '0px'
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
    add: {
        backgroundColor: 'primary',
    },
}));

const Extraproject = () => {
    const classes = useStyles();
    const [projectData, setProjectData] = useState([])
    const [open, setOpen] = useState(false);
    const [popupData, setPopupData] = useState({})
    const [selectedStartDate, handleStartDateChange] = useState([]);
    const [selectedEndDate, handleEndDateChange] = useState([]);
    const [selectedPopUpStartDate, handlePopUpStartDateChange] = useState(new Date("2018-03-02"));
    const [selectedPopUpEndDate, handlePopUpEndDateChange] = useState(new Date("2018-03-02"));

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        StudentService.getProject()
            .then(res => {
                console.log("setProjectData data", res);
                setProjectData(res.data)
                
            })
            .catch(error => {
                console.log(error);
                
            })
    }, [])

    const handleChange=(e) =>{
        setPopupData({
            ...popupData,
            [e.target.name]: e.target.value
          });
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                    <Typography variant="h4" className={classes.typography}> Project </Typography>
                    <Divider className={classes.divider} />
                </Grid>
            </Grid>
            <List className={classes.root} subheader={<li />}>
                {projectData.map((data, index) => {
                    return (
                        <li key={`section-${index}`} className={classes.listSection}>
                            <ul className={classes.ul}>
                                <Grid container direction="row">
                                    <Grid item md={10} xs={10}>
                                        <ListSubheader style={{ fontSize: "18px" }}>{`Project Name: ${data.name}`}</ListSubheader>
                                    </Grid>
                                    <Grid item md={1} xs={1} style={{ textAlign: 'end', alignSelf: 'flex-end' }}>
                                        <Fab size="small" color="secondary"
                                            onClick={() => {
                                                setOpen(true);
                                                setPopupData({...data, index: index })
                                            }}
                                        >
                                            <EditIcon />
                                        </Fab >
                                    </Grid>
                                </Grid>
                                <ListItem key={`${index}`} className={classes.listItem}>
                                    <ListItemText primary={`Start Date: ${data.startDate} End Date: ${data.endDate}`} />
                                </ListItem>
                                {/* <ListItem className={classes.listItem}>
                                    <ListItemText primary={`End Date: ${data.endDate}`} />
                                </ListItem> */}
                                <ListItem className={classes.listItem}>
                                    <ListItemText primary={`Description: ${data.description}`} />
                                </ListItem>
                                <ListItem className={classes.listItem}>
                                    <ListItemText primary={`Group Members: ${data.groupCount}`} />
                                </ListItem>
                                <ListItem className={classes.listItem}>
                                    <ListItemText primary={`Project Url: ${data.url}`} />
                                </ListItem>
                                <Divider style={{ margin: 5 }} />
                            </ul>
                        </li>
                    )
                })}
            </List>
            <Formik
                initialValues={{
                    project: [{
                        index: 1,
                        name: "",
                        startDate: "",
                        endDate: "",
                        url: "",
                        groupCount: "",
                        description: "",
                    }]

                }}
                onSubmit={async values => {
                    values.project.map((_, index) => ( 
                        values.project[index].startDate = new Date(selectedStartDate[index]).toISOString().split('T')[0]
                    ))
                    values.project.map((_, index) => ( 
                        values.project[index].endDate = new Date(selectedEndDate[index]).toISOString().split('T')[0]
                    ))
                    StudentService.updateProject([...projectData, ...values.project])
                        .then(res => {
                            console.log("res", res);
                            setProjectData(res.data)
                            swal({
                                title: "Thank You!",
                                text: "Project Added Successfully!",
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
                }}
            >
                {({ values, errors }) => (
                    <Form autoComplete="off">
                        <Box margin={1} paddingBottom={2}>
                            <FieldArray name="project">
                                {({ push, remove }) => (
                                    <React.Fragment>
                                        {values.project.map((_, index) => (
                                            <div key={index}>
                                                <Grid container item spacing={3}>
                                                    <Grid item md={5} xs={10}>
                                                        <Field
                                                            fullWidth
                                                            name={`project[${index}].name`}
                                                            component={TextField}
                                                            label="Project Name"
                                                            variant="outlined"
                                                        />
                                                    </Grid>
                                                    <Grid item md={5} xs={10}>
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <Field
                                                            variant="outlined"
                                                            component={KeyboardDatePicker}
                                                            name={`project[${index}].startDate`}
                                                            value={selectedStartDate[index]}
                                                            onChange=
                                                                {(event, newValue) => {
                                                                    let tech = [...selectedStartDate];
                                                                    tech[index] = newValue;
                                                                    handleStartDateChange([...tech]);
                                                                    console.log("date",selectedStartDate);
                                                                    
                                                                  }}
                                                            label="Start Date"
                                                            format="yyyy-MM-dd"
                                                            fullWidth
                                                            />
                                                        </MuiPickersUtilsProvider>
                                                    </Grid>
                                                    <Grid item md={5} xs={10}>
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <Field
                                                            variant="outlined"
                                                            component={KeyboardDatePicker}
                                                            name={`project[${index}].endDate`}
                                                            value={selectedEndDate[index]}
                                                            onChange=
                                                                {(event, newValue) => {
                                                                    let tech = [...selectedEndDate];
                                                                    tech[index] = newValue;
                                                                    handleEndDateChange([...tech]);
                                                                    console.log("date",selectedEndDate);
                                                                    
                                                                  }}
                                                            label="End Date"
                                                            format="yyyy-MM-dd"
                                                            fullWidth
                                                            />
                                                        </MuiPickersUtilsProvider>
                                                    </Grid>
                                                    <Grid item md={5} xs={10}>
                                                        <Field
                                                            component={TextField}
                                                            fullWidth
                                                            name={`project[${index}].url`}
                                                            label="Url"
                                                            variant="outlined"
                                                        />
                                                    </Grid>
                                                    <Grid item md={5} xs={10}>
                                                        <Field
                                                            component={TextField}
                                                            fullWidth
                                                            name={`project[${index}].groupCount`}
                                                            label="Group Members"
                                                            variant="outlined"
                                                        />
                                                    </Grid>
                                                    <Grid item md={5} xs={10}>
                                                        <Field
                                                            component={TextField}
                                                            fullWidth
                                                            name={`project[${index}].description`}
                                                            label="Description"
                                                            variant="outlined"
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Fab
                                                            size="small"
                                                            color="secondary"
                                                            className={classes.delete}
                                                            aria-label="delete"
                                                            onClick={() => {
                                                                remove(index);
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </Fab>
                                                    </Grid>
                                                </Grid>
                                                <Divider className={classes.divider} />
                                            </div>
                                        ))}

                                        <Grid container item spacing={3}>
                                            <Grid item>
                                                <br />
                                                <Fab
                                                    size="small"
                                                    color="secondary"
                                                    className={classes.add}
                                                    aria-label="add"
                                                    onClick={() =>
                                                        push({
                                                            index: values.project.length + 1,
                                                            name: '',
                                                            startDate: "",
                                                            endDate: "",
                                                            url: "",
                                                            groupCount: "",
                                                            description: "",
                                                        })
                                                    }
                                                >
                                                    <AddCircleOutlineIcon />
                                                </Fab>
                                            </Grid>
                                        </Grid>
                                    </React.Fragment>
                                )}
                            </FieldArray>
                        </Box>

                        <Divider style={{ marginTop: 10 }} />
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
                    </Form>
                )}
            </Formik>
            
            
            <Formik
                initialValues={{
                    index: 0,
                    name: popupData.name,
                    startDate: popupData.startDate,
                    endDate: popupData.endDate,
                    url: popupData.url,
                    groupCount: popupData.groupCount,
                    description: popupData.description,
                }}
                
                onSubmit={async values => {
                    popupData.startDate = new Date(selectedPopUpStartDate).toISOString().split('T')[0]
                    popupData.endDate = new Date(selectedPopUpEndDate).toISOString().split('T')[0]
                    StudentService.updateIndividualProject(popupData)
                        .then(res => {
                            console.log("res", res);
                            setProjectData(res.data)
                            setOpen(false);
                        }).catch(error => {
                            console.log(error);
                        });
                }}
            >
                
                {({ values, errors }) => (
                    
                    <Form autoComplete="off">
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Project</DialogTitle>
                            <Divider className={classes.divider}/>
                            <DialogContent>
                                <form
                                    autoComplete="off"
                                    noValidate
                                >
                                    <Grid container spacing={3}>
                                        <Grid item md={6} xs={12}>
                                                <Field
                                                    fullWidth
                                                    variant="outlined"
                                                    component={TextField}
                                                    name="name"
                                                    label="Project Name"
                                                    value={popupData.name}
                                                    onChange={handleChange}
                                                />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <Field
                                                    variant="outlined"
                                                    component={KeyboardDatePicker}
                                                    name="startDate"
                                                    value={popupData.startDate && selectedPopUpStartDate}
                                                    onChange={handlePopUpStartDateChange}
                                                    label="Start Date"
                                                    format="yyyy-MM-dd"
                                                    fullWidth
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <Field
                                                    variant="outlined"
                                                    component={KeyboardDatePicker}
                                                    name="startDate"
                                                    value={popupData.endDate && selectedPopUpEndDate}
                                                    onChange={handlePopUpEndDateChange}
                                                    label="End Date"
                                                    format="yyyy-MM-dd"
                                                    fullWidth
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                                <Field
                                                    fullWidth
                                                    variant="outlined"
                                                    component={TextField}
                                                    name="url"
                                                    label="Url"
                                                    value={popupData.url}
                                                    onChange={handleChange}
                                                />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                                <Field
                                                    fullWidth
                                                    variant="outlined"
                                                    component={TextField}
                                                    name="groupCount"
                                                    label="Group Members"
                                                    value={popupData.groupCount}
                                                    onChange={handleChange}
                                                />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                                <Field
                                                    fullWidth
                                                    variant="outlined"
                                                    component={TextField}
                                                    name="description"
                                                    label="project Description"
                                                    value={popupData.description}
                                                    onChange={handleChange}
                                                />
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginTop: 10 }} />
                                    <Box
                                        display="flex"
                                        justifyContent="flex-end"
                                        p={2}
                                        
                                    >
                                        <Button
                                            color="primary"
                                            type="submit"
                                            style={{marginRight: 5}}
                                        >
                                            Save details
                                        </Button>
                                        <Button onClick={handleClose} color="primary">
                                            Cancel
                                        </Button>
                                    </Box>
                                </form>

                            </DialogContent>
                        </Dialog>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Extraproject;
