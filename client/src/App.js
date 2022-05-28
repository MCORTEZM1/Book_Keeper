import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// establish link to graphql server. 
const httpLink = createHttpLink({
  uri:'/graphql'
});

// middleware that will retrieve token and combine it with the httplink headers to access User authorization
const authLink = setContext((_, {headers }) => {
  // retrieve token from localStorage
  const token = localStorage.getItem('id_token');

  // return updated httpLink headers 
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
});

// initiate apolloClient instance and create connection to API endpoint
const client = new ApolloClient({
  // combine auth link with httpLink so every request retrieves the token and sets request headers.
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
