import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';

export default ({ children }) => {
  return (
    <Container style={{ paddingTop: 10 }}>
      <Head>
        <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css" />
      </Head>
      <Header />
      {children}
    </Container>
  )
}