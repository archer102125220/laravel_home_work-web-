import React, { Component } from 'react';
import { Switch } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import PropTypes from 'prop-types';
import GlobalLayout from './../layouts/GlobalLayout';

const mapStateToProps = (state) => ({
  token: _.get(state, 'auth.token', []),
});

const mapDispatchToProps = (dispatch) => ({
  reLogin: (payload) => dispatch({ type: 'auth/reLogin', payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(
  class AppSwitch extends Component {
    render() {
      const { props } = this;
      const { children, location } = props;
      const { pathname } = location;
      // if (window.localStorage["token"] !== undefined) {
      //   const strToken = window.localStorage["token"];
      //   const token = strToken.substring(1, strToken.length - 1);
      //   this.props.reLogin(token);
      // }
      if (pathname.indexOf('/login') === 0 || pathname.indexOf('/register') === 0 ) {
        return (
          <Switch {...props}>
            {children}
          </Switch>
        );
      } else {
        return (
          <GlobalLayout {...props}>
            <Switch {...props}>11{children}</Switch>
          </GlobalLayout>
        );
      }
    }
    static propTypes = {
      children: PropTypes.any
    };
  }
);
