import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Icon, Collapse, Button, Form, Input, Popconfirm } from 'antd';
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
    DELETE_comment: (payload, callback) => dispatch({ type: 'comment/DELETE_comment', payload, callback }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    class PostList extends Component {
        constructor(props) {
            super(props);
            this.state = {
                GET_postAllLoading: true,
                postSubmitting: false,
                commentSubmitting: false,
                comment: '',
                post: '',
                title: '',
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
                this.setState({ commentSubmitting: bool, comment: '', }, handleGetPostAll);
            };
            await POST_newComment(payload, callback);
        }

        handlePostNewPost = async (payload) => {
            const { POST_newPost } = this.props;
            const callback = bool => {
                const handleGetPostAll = this.handleGetPostAll;
                this.setState({ postSubmitting: bool, post: '', title: '', }, handleGetPostAll);
            };
            await POST_newPost(payload, callback);
        }

        handleDeletePost = async (payload) => {
            const { DELETE_post } = this.props;
            await DELETE_post({ posts_id: payload }, this.handleGetPostAll);
        }

        handleDeleteComment = async (payload) => {
            const { DELETE_comment } = this.props;
            await DELETE_comment({ comment_id: payload }, this.handleGetPostAll);
        }

        handleSubmit = (submitType, posts_id) => {
            if (submitType === 'comment') {
                if (!this.state.comment || (this.state.comment || '').trim() === '') return;
                this.setState({
                    commentSubmitting: true,
                });
                this.handlePostNewComment({ content: this.state.comment, posts_id });
            } else if (submitType === 'post') {
                if (!this.state.post || (this.state.post || '').trim() === '' || !this.state.title || (this.state.title || '').trim() === '') return;
                this.setState({
                    postSubmitting: true,
                });
                this.handlePostNewPost({ content: this.state.post, title: this.state.title });
            }

        };

        componentDidMount = () => {
            this.handleGetPostAll();
        }

        render() {
            const { postAll } = this.props;
            const { GET_postAllLoading, postSubmitting, commentSubmitting, comment, title, post } = this.state;

            return (
                <div>
                    <div>
                        <Form.Item>
                            新文章標題：<Input onChange={e => this.setState({ title: e.target.value })} value={title} />
                            新文章：<TextArea rows={4} onChange={e => this.setState({ post: e.target.value })} value={post} />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType='submit' loading={postSubmitting} onClick={() => this.handleSubmit('post')} type='primary'>
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

                                                <Button style={{ marginRight: 8 }} ><Icon type='message' /></Button>,
                                                <Popconfirm
                                                    title={`您確定要刪除嗎?`}
                                                    onConfirm={() => this.handleDeletePost(item.posts_id)}
                                                    onCancel={null}
                                                    okText='是'
                                                    cancelText='否'
                                                >
                                                    <Button style={{ marginRight: 8 }} >
                                                        <Icon type='delete' />
                                                    </Button>
                                                </Popconfirm>,
                                                <Button onClick={() => console.log(123)} style={{ marginRight: 8 }} ><Icon type='edit' /></Button>,
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
                                                        <Popconfirm
                                                            title={`您確定要刪除嗎?`}
                                                            onConfirm={() => this.handleDeleteComment(val.comment_id)}
                                                            onCancel={null}
                                                            okText='是'
                                                            cancelText='否'
                                                        >
                                                            <Button style={{ marginLeft: 8 }} >
                                                                <Icon type='delete' />
                                                            </Button>
                                                        </Popconfirm>
                                                    </List.Item>)
                                            })
                                        }
                                        <div>
                                            <Form.Item>
                                                新增留言：<TextArea rows={4} onChange={e => this.setState({ comment: e.target.value })} value={comment} />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button htmlType='submit' loading={commentSubmitting} onClick={() => this.handleSubmit('comment', item.posts_id)} type='primary'>
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