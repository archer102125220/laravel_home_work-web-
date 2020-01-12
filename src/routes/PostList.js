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
    PUT_post: (payload, posts_id, callback) => dispatch({ type: 'post/PUT_post', payload, posts_id, callback }),
    PUT_comment: (payload, comment_id, callback) => dispatch({ type: 'comment/PUT_comment', payload, comment_id, callback }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    class PostList extends Component {
        constructor(props) {
            super(props);
            this.state = {
                GET_postAllLoading: true,
                postSubmitting: false,
                postEditSubmitting: false,
                commentSubmitting: false,
                commentEditSubmitting: false,
                editPost: false,
                editComment: false,
                comment: '',
                post: '',
                title: '',
                editPostTitle: '',
                editPostContent: '',
                editCommentContent: '',
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

        handlePostEditComment = async (payload, comment_id) => {
            const { PUT_comment } = this.props;
            const callback = () => {
                const handleGetPostAll = this.handleGetPostAll;
                this.setState({ commentSubmitting: false, editComment: false, editCommentContent: '', }, handleGetPostAll);
            };
            await PUT_comment(payload, comment_id, callback);
        }

        handlePostEditPost = async (payload, posts_id) => {
            const { PUT_post } = this.props;
            const callback = () => {
                const handleGetPostAll = this.handleGetPostAll;
                this.setState({ postEditSubmitting: false, editPost: false, editPostContent: '', editPostTitle: '', }, handleGetPostAll);
            };
            await PUT_post(payload, posts_id, callback);
        }

        handleDeletePost = async (payload) => {
            const { DELETE_post } = this.props;
            await DELETE_post({ posts_id: payload }, this.handleGetPostAll);
        }

        handleDeleteComment = async (payload) => {
            const { DELETE_comment } = this.props;
            await DELETE_comment({ comment_id: payload }, this.handleGetPostAll);
        }

        handleSubmit = (submitType, newOrEdit, id) => {
            const { posts_id, comment_id } = (id || {});
            const { comment, title, post, editPostTitle, editPostContent, editCommentContent } = this.state;
            if (submitType === 'comment') {
                if (newOrEdit === 'new') {
                    if (!comment && (comment || '').trim() === '') return;
                    this.setState({
                        commentSubmitting: true,
                    });
                    this.handlePostNewComment({ content: comment, posts_id });
                } else if (newOrEdit === 'edit') {
                    if (!editCommentContent && (editCommentContent || '').trim() === '') return;
                    this.setState({
                        commentEditSubmitting: true,
                    });
                    this.handlePostEditComment({ content: editCommentContent }, comment_id);
                }
            } else if (submitType === 'post') {
                if (newOrEdit === 'new') {
                    if (!post && (post || '').trim() === '' && !title && (title || '').trim() === '') return;
                    this.setState({
                        postSubmitting: true,
                    });
                    this.handlePostNewPost({ content: post, title });
                } else if (newOrEdit === 'edit') {
                    if (!editPostContent && (editPostContent || '').trim() === '' && !editPostTitle && (editPostTitle || '').trim() === '') return;
                    this.setState({
                        postEditSubmitting: true,
                    });
                    this.handlePostEditPost({ content: editPostContent, title: editPostTitle }, posts_id);
                }
            }

        };

        componentDidMount = () => {
            this.handleGetPostAll();
        }

        render() {
            const { postAll } = this.props;
            const {
                GET_postAllLoading,
                postSubmitting,
                commentSubmitting,
                comment,
                title,
                post,
                editPost,
                editPostTitle,
                editPostContent,
                editComment,
                editCommentContent,
                commentEditSubmitting,
                postEditSubmitting,
            } = this.state;

            return (
                <div>
                    <div>
                        <Form.Item>
                            新文章標題：<Input onChange={e => this.setState({ title: e.target.value })} value={title} />
                            新文章：<TextArea rows={4} onChange={e => this.setState({ post: e.target.value })} value={post} />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType='submit' loading={postSubmitting} onClick={() => this.handleSubmit('post', 'new')} type='primary'>
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
                                            actions={editPost === false ?
                                                [

                                                    <Button style={{ marginRight: 8 }} ><Icon type='message' /></Button>,
                                                    <Popconfirm
                                                        title={`您確定要刪除嗎?`}
                                                        onConfirm={() => this.handleDeletePost(item.posts_id)}
                                                        onCancel={null}
                                                        okText='是'
                                                        cancelText='否'
                                                    >
                                                        <Button type="danger" style={{ marginRight: 8 }} >
                                                            <Icon type='delete' />
                                                        </Button>
                                                    </Popconfirm>,
                                                    <Button onClick={() => this.setState({ editPost: true, editPostTitle: item.title, editPostContent: item.content })} style={{ marginRight: 8 }} ><Icon type='edit' /></Button>,
                                                ] :
                                                []
                                            }
                                        >
                                            {editPost === false ?
                                                <span>
                                                    <div>{item.name}：{item.title}</div>
                                                    {item.content}
                                                </span> :
                                                <div>
                                                    <Form.Item>
                                                        文章標題：<Input onChange={e => this.setState({ editPostTitle: e.target.value })} value={editPostTitle} />
                                                        文章：<TextArea rows={4} onChange={e => this.setState({ editPostContent: e.target.value })} value={editPostContent} />
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <Button htmlType='submit' loading={postEditSubmitting} onClick={() => this.handleSubmit('post', 'edit', { posts_id: item.posts_id })} type='primary'>
                                                            完成編輯
                                                        </Button>
                                                        <Button onClick={() => this.setState({ editPost: false })} style={{ marginLeft: 8 }} >
                                                            <Icon type='close' />取消
                                                        </Button>
                                                    </Form.Item>
                                                </div>
                                            }

                                        </List.Item>
                                    }>

                                        {
                                            ((item.comment || [])).map(val => {
                                                return (
                                                    <List.Item key={`${val.posts_id}_${val.comment_id}`} >
                                                        {editComment === false ?
                                                            <span>
                                                                匿名回覆：{val.comment}
                                                                <Popconfirm
                                                                    title={`您確定要刪除嗎?`}
                                                                    onConfirm={() => this.handleDeleteComment(val.comment_id)}
                                                                    onCancel={null}
                                                                    okText='是'
                                                                    cancelText='否'
                                                                >
                                                                    <Button type="danger" style={{ marginLeft: 8 }} >
                                                                        <Icon type='delete' />
                                                                    </Button>
                                                                </Popconfirm>
                                                                <Button onClick={() => this.setState({ editComment: true, editCommentContent: val.comment })} style={{ marginLeft: 8 }} ><Icon type='edit' /></Button>
                                                            </span> :
                                                            <div>
                                                                <Form.Item>
                                                                    留言：<TextArea rows={4} onChange={e => this.setState({ editCommentContent: e.target.value })} value={editCommentContent} />
                                                                </Form.Item>
                                                                <Form.Item>
                                                                    <Button htmlType='submit' loading={commentEditSubmitting} onClick={() => this.handleSubmit('comment', 'edit', { comment_id: val.comment_id })} type='primary'>
                                                                        完成修改
                                                                    </Button>
                                                                    <Button onClick={() => this.setState({ editComment: false })} style={{ marginLeft: 8 }} >
                                                                        <Icon type='close' />取消
                                                                    </Button>
                                                                </Form.Item>
                                                            </div>
                                                        }
                                                    </List.Item>)
                                            })
                                        }
                                        <div>
                                            <Form.Item>
                                                新增留言：<TextArea rows={4} onChange={e => this.setState({ comment: e.target.value })} value={comment} />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button htmlType='submit' loading={commentSubmitting} onClick={() => this.handleSubmit('comment', 'new', { posts_id: item.posts_id })} type='primary'>
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