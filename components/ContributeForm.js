import React from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import getCampaign from '../ethereum/campaign';
import getWeb3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends React.Component {
  state = { contribution: '', errorMessage: '', loading: false };

  onSubmit = async e => {
    e.preventDefault();

    this.setState({ errorMessage: '', loading: true });

    try {
      const campaign = await getCampaign(this.props.address);
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei(this.state.contribution, 'ether') });

      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Amount to Contribute</label>
            <Input
              placeholder='1'
              label="ether"
              type="number"
              labelPosition="right"
              value={this.state.contribution}
              onChange={e => this.setState({ contribution: e.target.value })}
            />
          </Form.Field>
          <Message error header="Oops! Something went wrong" content={this.state.errorMessage} />
          <Button
            type='submit'
            primary
            loading={this.state.loading}
          >
            Contribute!
        </Button>
        </Form>
      </div>
    );
  }
}

export default ContributeForm;