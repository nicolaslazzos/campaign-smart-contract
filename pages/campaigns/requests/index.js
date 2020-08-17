import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import getCampaign from '../../../ethereum/campaign';

class RequestIndex extends React.Component {
  static async getInitialProps(props) {
    const address = props.query.address;

    const campaign = await getCampaign(address);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestsCount)).fill().map((item, index) => campaign.methods.requests(index).call())
    );

    return { address, requests, approversCount, requestsCount };
  }

  renderRows = () => {
    return this.props.requests.map((request, index) => (
      <RequestRow
        key={index.toString()}
        id={index}
        request={request}
        approversCount={this.props.approversCount}
        address={this.props.address}
      />
    ));
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

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount (ether)</Table.HeaderCell>
              <Table.HeaderCell>Recipient</Table.HeaderCell>
              <Table.HeaderCell>Approvals Count</Table.HeaderCell>
              <Table.HeaderCell>Approve</Table.HeaderCell>
              <Table.HeaderCell>Finalize</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.renderRows()}
          </Table.Body>
        </Table>

        <div>Found {this.props.requestsCount} requests</div>
      </Layout>
    );
  }
}

export default RequestIndex;