import React, { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Popup from '../../../components/controls/Popup';
import ProfileDetails from './ProfileDetails';
import { Card, makeStyles, Box, Button } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CompanyService from '../../../services/CompanyService';
import MaterialTable from 'material-table';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  delete: {
    backgroundColor: 'red',
    marginLeft: '5px'
  }
}));

const Results = ({ className, ...rest }) => {
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isEdited, setIsEdited] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const getAllCompanies = () => {
    CompanyService.getAllCompanies()
      .then(res => {
        setPosts(res.data);
        setIsDataLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(
    props => {
      if (isEdited) {
        getAllCompanies();
        setIsEdited(false);
      }
    },
    [isEdited, posts]
  );

  const deleteCompany = id => {
    console.log('Student in func : ' + id);
    CompanyService.deleteCompanies({ id: id })
      .then(res => {
        console.log('in Result  : ' + res.data);
        getAllCompanies();
      })
      .catch(err => {
        console.log(err);
      });
  };
  function openPopupWithExtraData(id) {
    console.log('Student in func : ' + id);
    CompanyService.getSingleCompany({ id: id })
      .then(res => {
        console.log('in Result  : ' + res.data);
        openInPopup(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const addOrEdit = (company, resetForm) => {
    if (company.id === 0) console.log('Inserted');
    else console.log('Edited');
    setIsEdited(true);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    console.log('From add or edit');
    getAllCompanies();
  };
  const openInPopup = item => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  return (
    <div>
      <Box display="flex" justifyContent="flex-end" marginBottom="2%">
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setOpenPopup(true);
            setIsUpdating(false);
          }}
        >
          Add Company
        </Button>
      </Box>      
      <Card>
        <PerfectScrollbar>
          <Card>
            <MaterialTable
            style={{
              fontSize: "14px"
            }}
              className={classes.table}
              title="Company Details"
              columns={[
                {
                  title: 'ID',
                  tableLayout: 'auto',
                  field: 'id',
                  filtering: false
                },
                { title: 'Name', field: 'name' },
                { title: 'Industry', field: 'industry' },
                { title: 'Website', field: 'website' },
                {
                  title: 'Actions',
                  field: 'action',
                  filtering: false,
                  render: rowData => (
                    <React.Fragment>
                      <Fab
                        size="small"
                        color="primary"
                        aria-label="edit"
                        onClick={() => {
                          openPopupWithExtraData(rowData.id);
                          setIsUpdating(true);
                        }}
                      >
                        <EditIcon />
                      </Fab>
                      <Fab
                        size="small"
                        color="secondary"
                        className={classes.delete}
                        aria-label="delete"
                        onClick={() => {
                          deleteCompany(rowData.id);
                        }}
                      >
                        <DeleteIcon />
                      </Fab>
                    </React.Fragment>
                  )
                }
              ]}
              data={posts}
              options={{
                emptyRowsWhenPaging: false,
                filtering: true,
                rowStyle: {
                  fontFamily: 'Roboto, Helvetica , Arial, sans-serif'
                }
              }}
              isLoading={isDataLoading}
            />
          </Card>
        </PerfectScrollbar>

        <Popup
          title="Company Form"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <ProfileDetails recordForEdit={recordForEdit} addOrEdit={addOrEdit} isUpdating={isUpdating} />
        </Popup>
      </Card>
    </div>
  );
};

export default Results;
