import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Avatar, Icon, Collapse, Button, Form, Input, Popconfirm } from 'antd';
import _ from 'lodash';

const { TextArea } = Input;

const { Panel } = Collapse;

const mapStateToProps = (state) => ({
    postAll: _.get(state, 'post.postAll', []),
});

const mapDispatchToProps = (dispatch) => ({
    GET_postAll: (callback) => dispatch({ type: 'post/GET_postAll', callback }),
    POST_newComment: (payload, callback) => dispatch({ type: 'comment/POST_newComment', payload, callback }),
    POST_newPost: (payload, callback) => dispatch({ type: 'post/POST_newPost', payload, callback }),
    DELETE_post: (payload, callback) => dispatch({ type: 'post/DELETE_post', payload, callback }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    class PostList extends Component {
        constructor(props) {
            super(props);
            this.state = {
                GET_postAllLoading: true,
                submitting: false,
                comment: '',
                post: '',
            }
        }

        handleGetPostAll = async () => {
            const { GET_postAll } = this.props;
            const loading = bool => this.setState({ GET_postAllLoading: bool });
            await GET_postAll(loading);
        }

        handlePostNewComment = async (payload) => {
            const { POST_newComment } = this.props;
            const callback = bool => {
                const handleGetPostAll = this.handleGetPostAll;
                this.setState({ submitting: bool, }, handleGetPostAll);
            };
            await POST_newComment(payload, callback);
        }

        handlePostNewPost = async (payload) => {
            const { POST_newPost } = this.props;
            const callback = bool => {
                const handleGetPostAll = this.handleGetPostAll;
                this.setState({ submitting: bool, }, handleGetPostAll);
            };
            await POST_newPost(payload, callback);
        }

        handleDeletePost = async (payload) => {
            const { DELETE_post } = this.props;
            const callback = bool => {
                const handleGetPostAll = this.handleGetPostAll;
                this.setState({ submitting: bool, }, handleGetPostAll);
            };
            await DELETE_post({ posts_id: payload }, callback);
        }

        handleSubmit = (submitType, posts_id) => {
            if (submitType === 'comment') {
                if (!this.state.comment || (this.state.comment || '').trim() === '') return;
                this.setState({
                    submitting: true,
                });
                this.handlePostNewComment({ content: this.state.comment, posts_id });
            } else if (submitType === 'post') {
                if (!this.state.post || (this.state.post || '').trim() === '' || !this.state.title || (this.state.title || '').trim() === '') return;
                this.setState({
                    submitting: true,
                });
                this.handlePostNewPost({ content: this.state.post, title: this.state.title });
            }

        };

        componentDidMount = () => {
            this.handleGetPostAll();
        }

        render() {
            const { postAll } = this.props;
            const { GET_postAllLoading, submitting, comment, title, post } = this.state;

            return (
                <div>
                    <div>
                        <Form.Item>
                            新文章標題：<Input onChange={e => this.setState({ title: e.target.value })} value={title} />
                            新文章：<TextArea rows={4} onChange={e => this.setState({ post: e.target.value })} value={post} />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType='submit' loading={submitting} onClick={() => this.handleSubmit('post')} type='primary'>
                                送出文章
                            </Button>
                        </Form.Item>
                    </div>
                    <List
                        itemLayout='vertical'
                        size='large'
                        pagination={{
                            pageSize: 3,
                        }}
                        dataSource={postAll}
                        loading={GET_postAllLoading}
                        renderItem={item => {
                            return (
                                <Collapse showArrow={false} bordered={false} >
                                    <Panel header={
                                        <List.Item
                                            key={item.posts_id}
                                            actions={[

                                                <Icon type='message' style={{ marginRight: 8 }} />,
                                                <Popconfirm
                                                    title={`您確定要刪除嗎?`}
                                                    onConfirm={() => this.handleDeletePost(item.posts_id)}
                                                    onCancel={null}
                                                    okText='是'
                                                    cancelText='否'
                                                >
                                                    <Icon type='delete' style={{ marginRight: 8 }} />
                                                </Popconfirm>,
                                            ]}
                                        >
                                            <div>{item.name}：{item.title}</div>
                                            {item.content}
                                        </List.Item>
                                    }>

                                        {
                                            ((item.comment || [])[0] || []).map(val => {
                                                return (
                                                    <List.Item key={`${val.posts_id}_${val.comment_id}`} >
                                                        匿名回覆：{val.comment}
                                                    </List.Item>)
                                            })
                                        }
                                        <div>
                                            <Form.Item>
                                                新增留言：<TextArea rows={4} onChange={e => this.setState({ comment: e.target.value })} value={comment} />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button htmlType='submit' loading={submitting} onClick={() => this.handleSubmit('comment', item.posts_id)} type='primary'>
                                                    送出留言
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    </Panel>
                                </Collapse>
                            )
                        }}
                    />
                </div>
            );
        }
    })