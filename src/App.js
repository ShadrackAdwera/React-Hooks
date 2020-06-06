import React, {useContext} from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth'
import { AuthContext } from './components/Context/auth-context'

const App = props => {

  let content = <Auth/> 
  const authContext = useContext(AuthContext)
  if(authContext.isAuth) {
    content = <Ingredients />
  }

  return content;
};

export default App;