import React, { Component } from 'react';
import { Switch } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import PropTypes from 'prop-types';
import GlobalLayout from './../layouts/GlobalLayout';
const mapStateToProps = (state) => ({
  users: _.get(state, 'users.users', []),
});

const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(
  class AppSwitch extends Component {
    render() {
      const { props } = this;
      const { children, location } = props;
      const { pathname } = location;

      if (pathname.indexOf('/login') === 0) {
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
