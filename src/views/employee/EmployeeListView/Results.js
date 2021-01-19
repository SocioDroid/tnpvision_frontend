import React, { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import getInitials from '../../../utils/getInitials';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, customers, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = customers.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const[ posts, setPosts] = useState([]);
    useEffect((props) => {
      axios.get("https://tnpvision-cors.herokuapp.com/https://tnpvisionapi.herokuapp.com/api/employees/")
      .then(res => {
          console.log(res);
          setPosts(res.data);
      })
      .catch( err => {
          console.log(err);
      })
    }, [])

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      {/*<ul>
                {posts.map(post1 =>(
                    <li key={post1.id}>{post1.id} {post1.user.email} {post1.user.first_name} {post1.user.last_name} {post1.college}</li>
                ))}
      </ul>
      */}
      
        <PerfectScrollbar>
          <Box minWidth={1050}>
          
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Full Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  College
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {posts.map((employee) => (
                <TableRow
                  //hover
                  key={employee.id}
                  //selected={selectedemployeeIds.indexOf(employee.id) !== -1}
                >
                  <TableCell>
                       {`${employee.user.first_name} ${employee.user.last_name}`}
                  </TableCell>
                  <TableCell>
                    {employee.user.email}
                  </TableCell>
                  <TableCell>
                    {employee.college}
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>

        </Box>
        </PerfectScrollbar>

      <TablePagination
        component="div"
        count={customers.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
