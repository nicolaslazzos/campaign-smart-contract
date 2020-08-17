import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import getFactory from '../ethereum/factory';
import { Link } from '../routes';

class CampaignIndex extends React.Component {
  static async getInitialProps() {
    const factory = await getFactory();
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns = () => {
    const items = this.props.campaigns.map(address => ({
      header: address,
      description: (
        <Link route={`/campaigns/${address}`}>
          <a>View Campaign</a>
        </Link>
      ),
      fluid: true,
      style: { marginLeft: 0 }
    }));

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <Link route="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>
        {this.renderCampaigns()}
      </Layout>
    );
  }
}

export default CampaignIndex;