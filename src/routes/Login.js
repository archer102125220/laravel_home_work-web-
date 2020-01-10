import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './Login.less';
const FormItem = Form.Item;

if (window.localStorage["remember"] !== true && window.localStorage["remember"] !== 'true') {
  window.localStorage["account"] = '';
  window.localStorage["password"] = '';
  window.localStorage["remember"] = false;
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  Login: (payload, callback) => dispatch({ type: 'auth/Login', payload, callback }),
  goToRoute: (path) => dispatch(routerRedux.push(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  class Login extends Component {

    render() {
      const { props } = this;
      return (
        <div>
          <div className='loginBackground'></div>
          <div className='backgroundCover'></div>
          <div className='loginFormBlock'>
            <div style={{ textAlign: 'center' }}>
              <h1>laravel_home_work</h1>
            </div>
            <LoginForm {...props} />
          </div>
        </div>
      );
    }
  }
);

const LoginForm = Form.create()(
  class extends React.Component {
    componentDidMount = () => {
      if (window.localStorage["remember"] === true || window.localStorage["remember"] === 'true') {
        this.props.form.setFieldsValue({
          account: window.localStorage["account"],
          password: window.localStorage["password"],
          remember: true,
        });
      }
    }

    handleSubmit = e => {
      const { form, Login, goToRoute } = this.props;
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          const { account, password, remember } = values;
          if (remember === true) {
            window.localStorage["account"] = account;
            window.localStorage["password"] = password;
            window.localStorage["remember"] = true;
          } else {
            window.localStorage["account"] = '';
            window.localStorage["password"] = '';
            window.localStorage["remember"] = false;
          }
          Login({ account, password }, () => goToRoute('/post'));
        }
      });
    };

    render() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={this.handleSubmit} className='login-form'>
          <span>帳號</span>
          <FormItem>
            {getFieldDecorator('account', {
              rules: [{ required: true, message: '請輸入你的帳號!' }]
            })(
              <Input
                prefix={<Icon type='user' style={{ fontSize: 13 }} />}
                placeholder='帳號'
              />
            )}
          </FormItem>
          <span>密碼</span>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '請輸入你的密碼!' }]
            })(
              <Input
                prefix={<Icon type='lock' style={{ fontSize: 13 }} />}
                type='password'
                placeholder='密碼'
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: false
            })(<Checkbox>記住我</Checkbox>)}
            <Link className='login-form-forgot' to='/register'>還沒有帳號?</Link>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              block
            >
              登入
            </Button>
          </FormItem>
        </Form>
      );
    }
  }
);
