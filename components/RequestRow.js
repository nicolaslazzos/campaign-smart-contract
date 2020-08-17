import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Router } from '../routes';
import getWeb3 from '../ethereum/web3';
import getCampaign from '../ethereum/campaign';

let web3;

class RequestRow extends React.Component {
  async componentDidMount() {
    web3 = await getWeb3();
    this.forceUpdate()
  }

  state = { loadingApprove: false, loadingFinalize: false }

  onApprove = async () => {
    this.setState({ loadingApprove: true });

    try {
      const campaign = await getCampaign(this.props.address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(this.props.id).send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ loadingApprove: false });
    }
  }

  onFinalize = async () => {
    this.setState({ loadingFinalize: true });

    try {
      const campaign = await getCampaign(this.props.address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.finalizeRequest(this.props.id).send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ loadingFinalize: false });
    }
  }

  render() {
    const { description, value, recipient, approvalsCount, complete } = this.props.request;
    const readyToFinalize = this.props.approversCount / 2 < approvalsCount;

    return (
      <Table.Row disabled={complete} positive={readyToFinalize && !complete}>
        <Table.Cell>{this.props.id}</Table.Cell>
        <Table.Cell>{description}</Table.Cell>
        <Table.Cell>{web3 ? web3.utils.fromWei(value, 'ether') : ''}</Table.Cell>
        <Table.Cell>{recipient}</Table.Cell>
        <Table.Cell>{approvalsCount}/{this.props.approversCount}</Table.Cell>
        <Table.Cell>
          {
            complete ? null :
              <Button
                content="Approve"
                color="green"
                onClick={this.onApprove}
                loading={this.state.loadingApprove}
              />
          }

        </Table.Cell>
        <Table.Cell>
          {
            complete ? null :
              <Button
                content="Finalize"
                color="red"
                onClick={this.onFinalize}
                loading={this.state.loadingFinalize}
              />
          }
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default RequestRow;