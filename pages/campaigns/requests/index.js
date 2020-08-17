import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';

class RequestIndex extends React.Component {
  static async getInitialProps(props) {
    return { address: props.query.address }; 
  }

  render() {
    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button
              content="Add Request"
              icon="add circle"
              primary
            />
          </a>
        </Link>
      </Layout>
    );
  }
}

export default RequestIndex;