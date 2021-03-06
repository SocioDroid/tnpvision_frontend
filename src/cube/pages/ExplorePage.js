import React, { useState } from 'react';
import { Alert, Button, Spin } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import ExploreQueryBuilder from '../components/QueryBuilder/ExploreQueryBuilder';
import { GET_DASHBOARD_ITEM } from '../graphql/queries';
import { useParams, useLocation } from 'react-router-dom';

import TitleModal from '../components/TitleModal.js';

const ExplorePage = props => {
  const [addingToDashboard, setAddingToDashboard] = useState(false);
  const location = useLocation();
  // console.log(location, 'Location');
  console.log('history', props);
  const params = useParams()
  const itemId = params.id;
  const { loading, error, data } = useQuery(GET_DASHBOARD_ITEM, {
    variables: {
      id: itemId
    },
    skip: !itemId
  });
  console.log('loading', loading)
  const [vizState, setVizState] = useState(null);
  const finalVizState =
    vizState ||
    (itemId && !loading && data && JSON.parse(data.dashboardItem.vizState)) ||
    {};
  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [title, setTitle] = useState(null);
  const finalTitle =
    title != null
      ? title
      : (itemId && !loading && data && data.dashboardItem.name) || 'New Chart';

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert type="error" message={error.toString()} />;
  }

  return (
    <div>
      
      <TitleModal
        history={props.history}
        itemId={itemId}
        titleModalVisible={titleModalVisible}
        setTitleModalVisible={setTitleModalVisible}
        setAddingToDashboard={setAddingToDashboard}
        finalVizState={finalVizState}
        setTitle={setTitle}
        finalTitle={finalTitle}
      />
      <ExploreQueryBuilder
        vizState={finalVizState}
        setVizState={setVizState}
        chartExtra={[
          <Button
            key="button"
            type="primary"
            loading={addingToDashboard}
            onClick={() => setTitleModalVisible(true)}
          >
            {itemId ? 'Update' : 'Add to Dashboard'}
          </Button>
        ]}
      />
      {console.log("honey explore test", finalVizState)}
    </div>
  );
};
export default ExplorePage;
