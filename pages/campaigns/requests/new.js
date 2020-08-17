import React from 'react';
import { Button, Form, Message, Input } from 'semantic-ui-react';
import { Router, Link } from '../../../routes';
import Layout from '../../../components/Layout';
import getCampaign from '../../../ethereum/campaign';
import getWeb3 from '../../../ethereum/web3';

class NewRequest extends React.Component {
  static async getInitialProps(props) {
    return { address: props.query.address };
  }

  state = {
    description: '',
    value: '',
    recipient: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async e => {
    e.preventDefault();

    this.setState({ errorMessage: '', loading: true });

    try {
      const campaign = await getCampaign(this.props.address);
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      const { description, value, recipient } = this.state;

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>{"< Back"}</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              placeholder='buy batteries'
              type="text"
              value={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Value</label>
            <Input
              placeholder='10'
              label="ether"
              type="number"
              labelPosition="right"
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              placeholder='0x3b3BAb4d5d26E8ba3aBc584F32a03194789c0464'
              type="text"
              value={this.state.recipient}
              onChange={e => this.setState({ recipient: e.target.value })}
            />
          </Form.Field>
          <Message error header="Oops! Something went wrong" content={this.state.errorMessage} />
          <Button
            type='submit'
            primary
            loading={this.state.loading}
          >
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default NewRequest;