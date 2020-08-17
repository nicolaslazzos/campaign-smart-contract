import React from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import getFactory from '../../ethereum/factory';
import getWeb3 from '../../ethereum/web3';

let factory;
let web3;

class NewCampaign extends React.Component {
  state = { minimumContribution: '', errorMessage: '', loading: false };

  onSubmit = async e => {
    e.preventDefault();

    this.setState({ errorMessage: '', loading: true });

    try {
      factory = await getFactory();
      web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] });
    } catch (error) {
      this.setState({ errorMessage: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Layout>
        <h3>Create a New Campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              placeholder='100'
              label="wei"
              type="number"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={e => this.setState({ minimumContribution: e.target.value })}
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

export default NewCampaign;