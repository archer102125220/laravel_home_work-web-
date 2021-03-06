import React, { Component } from 'react';
import { Route, Switch, routerRedux, withRouter, Redirect } from 'dva/router';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AppSwitch from './routes/AppSwitch';
import Login from './routes/Login';
import Register from './routes/Register';
import PostList from './routes/PostList';
const { ConnectedRouter } = routerRedux;

const routeComponent = [
  { key: 'root', path: '/login', exact: true, component: Login },
  { key: 'register', path: '/register', exact: true, component: Register },
  { key: 'post_list', path: '/post/list', exact: true, component: PostList },
];
const redirectComponent = [
  { key: 'root', exact: true, to: '/login', From: '/' },
  { key: 'post_root', exact: true, to: '/post/list', From: '/post' },
];

class Root extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    children: PropTypes.any
  };

  render() {
    const { children } = this.props;
    return children;
  }
}

const RouterRoot = withRouter(_.flow()(Root));

const renderRoutes = (r, props) => {
  const { key, exact, path, component: Component } = r;
  return (
    <Route
      {...props}
      key={`route-${key}`}
      exact={exact}
      path={path}
      render={(props) => <Component {...props} />}
    />
  );
}
const renderRedirects = (r, props) => {
  const { key, exact, to, From } = r;
  const strToken = window.localStorage["token"];
  return (
    <Redirect
      {...props}
      key={`redirect-${key}`}
      exact={exact}
      from={From}
      to={From === '/' && strToken !== undefined && strToken !== '' ? '/post' : to}
    />
  );
}

const router = props => {
  return (
    <ConnectedRouter {...props}>
      <RouterRoot {...props}>
        <Switch  {...props}>
          <AppSwitch  {...props}>
            {
              routeComponent.map(value => renderRoutes(value, props))
            }
            {
              redirectComponent.map(value => renderRedirects(value, props))
            }
          </AppSwitch>
        </Switch>
      </RouterRoot>
    </ConnectedRouter>
  );
};

export default router;