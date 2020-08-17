import React from 'react';
import { Card, Button, Grid } from 'semantic-ui-react';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import getCampaign from '../../ethereum/campaign';
import getWeb3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';

let web3;

class ShowCampaign extends React.Component {
  static async getInitialProps(props) {
    // this props objects its not the same props from the component, 
    // instead its a prop coming from the router
    const campaign = await getCampaign(props.query.address);
    const details = await campaign.methods.getDetails().call();

    return {
      address: props.query.address,
      minimumContribution: details[0],
      balance: details[1],
      requestsCount: details[2],
      approversCount: details[3],
      manager: details[4]
    };
  }

  async componentDidMount() {
    web3 = await getWeb3();
    this.forceUpdate();
  }

  renderCards = () => {
    if (!web3) return;

    const { minimumContribution, balance, requestsCount, approversCount, manager } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Addres of the Manager',
        description: 'The manager is who created this campaign and can create requests to withdraw money.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this amount of wei to become an approver.'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description: 'A request tries to withdraw money from the contract. A request must be approved by approvers.'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'An aprover is a person who have already donated to the campaing an amount greater than the minimum contribution.'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'The balance is how much money this campaign has left to spend.'
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Details</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button content="View Requests" primary />
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default ShowCampaign;