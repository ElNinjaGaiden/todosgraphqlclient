import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionCode from 'material-ui/svg-icons/action/code';

const AppBarComponent = () => (
    <AppBar
      title={
        <div className={"app-bar-title"}>
          RAGP Todos List <span>(React + Apollo + GraphQL + PostgreSQL)</span>
        </div>
      }
      iconElementLeft={<IconButton href="/"><ActionHome /></IconButton>}
      iconElementRight={<IconButton href="https://github.com/ElNinjaGaiden/todosgraphql" target="_blank"  ><ActionCode /></IconButton>}
    />
  );
  
  export default AppBarComponent;