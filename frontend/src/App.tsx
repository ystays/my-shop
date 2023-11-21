import React from 'react';
import Header from './components/Header';

import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';

const App = () => {
  return (
    <>
    <Header />
    <main className='py-3'>
      <Container>
        <Outlet />
      </Container>
    </main>
    <Footer />
    </>
  )
}

export default App