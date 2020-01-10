import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Avatar, Icon, Collapse, Button } from 'antd';
import _ from 'lodash';

const { Panel } = Collapse;

const mapStateToProps = (state) => ({
    postAll: _.get(state, 'post.postAll', []),
});

const mapDispatchToProps = (dispatch) => ({
    GET_postAll: (callback) => dispatch({ type: 'post/GET_postAll', callback }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    class PostList extends Component {
        constructor(props) {
            super(props);
            this.state = {
                GET_postAllLoading: true,
            }
        }

        handleGetPostAll = async () => {
            const { GET_postAll } = this.props;
            const loading = bool => this.setState({ GET_postAllLoading: bool });
            await GET_postAll(loading);
        }

        componentDidMount = () => {
            this.handleGetPostAll();
        }

        render() {
            const { postAll } = this.props;
            const { GET_postAllLoading } = this.state;
            // const listData = [];
            // for (let i = 0; i < 23; i++) {
            //     listData.push({
            //         title: `ant design part ${i}`,
            //         avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            //         description:
            //             'Ant Design, a design language for background applications, is refined by Ant UED Team.',
            //         content:
            //             'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            //     });
            // }

            const IconText = ({ type, text }) => (
                <Button>
                    <Icon type={type} style={{ marginRight: 8 }} />
                    {text}
                </Button>
            );

            return (
                <div>
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            // onChange: page => {
                            //     console.log(page);
                            // },
                            pageSize: 3,
                        }}
                        dataSource={postAll}
                        loading={GET_postAllLoading}
                        // footer={
                        //     <div>
                        //         <b>ant design</b> footer part
                        //     </div>
                        // }
                        renderItem={item => {
                            console.log(item);
                            return (
                                <Collapse showArrow={false} bordered={false} >
                                    <Panel header={
                                        <List.Item
                                            key={item.posts_id}
                                        actions={[
                                            // <IconText type="star-o" text="156" key="list-vertical-star-o" />,
                                            // <IconText type="like-o" text="156" key="list-vertical-like-o" />,
                                            <IconText type="message" key="list-vertical-message" />,
                                        ]}
                                        // extra={
                                        //     <img
                                        //         width={272}
                                        //         alt="logo"
                                        //         src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                        //     />
                                        // }
                                        >
                                            {/* <List.Item.Meta
                                                avatar={<Avatar src={item.avatar} />}
                                                title={`${item.name}：${item.title}`}
                                            /> */}
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

                                    </Panel>
                                </Collapse>
                            )
                        }}
                    />
                </div>
            );
        }
    })