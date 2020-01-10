import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, Input, Button } from 'antd';
import './Register.less';
const FormItem = Form.Item;

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  Register: (payload, callback) => dispatch({ type: 'auth/Register', payload, callback }),
  goToRoute: (path) => dispatch(routerRedux.push(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  class Register extends Component {

    render() {
      const { props } = this;
      return (
        <div>
          <div className='registerBackground'></div>
          <div className='backgroundCover'></div>
          <div className='registerFormBlock'>
            <div style={{ textAlign: 'center' }}>
              <h1>註冊</h1>
            </div>
            <RegisterForm {...props} />
          </div>
        </div>
      );
    }
  }
);

const RegisterForm = Form.create()(
  class extends React.Component {

    handleSubmit = e => {
      const { form, Register, goToRoute } = this.props;
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          const { account, password, name } = values;
          Register({ account, password, name }, () => goToRoute('/'));
        }
      });
    };

    render() {
      const { form, goToRoute } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={this.handleSubmit} className='register-form'>
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
          <span>姓名</span>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '請輸入你的姓名!' }]
            })(
              <Input
                prefix={<Icon type='user' style={{ fontSize: 13 }} />}
                placeholder='姓名'
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
            <Button
              type='primary'
              htmlType='submit'
              className='register-form-button'
              style={{
                marginRight: ' 60px',
              }}
            // block
            >
              註冊
            </Button>
            <Button
              type='primary'
              className='register-form-button'
              onClick={() => goToRoute('/login')}
            // block
            >
              回登入頁
            </Button>
          </FormItem>
        </Form>
      );
    }
  }
);
