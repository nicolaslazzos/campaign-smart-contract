import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import getFactory from '../ethereum/factory';

class CampaignIndex extends React.Component {
  static async getInitialProps() {
    const factory = await getFactory();
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns = () => {
    const items = this.props.campaigns.map(address => ({
      header: address,
      description: <a>View Campaign</a>,
      fluid: true
    }));

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <Button
          floated="right"
          content="Create Campaign"
          icon="add circle"
          primary
        />
        {this.renderCampaigns()}
      </Layout>
    );
  }
}

export default CampaignIndex;