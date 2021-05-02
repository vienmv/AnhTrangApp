import React, { Component } from 'react';
import { ActivityIndicator, TouchableOpacity, Alert, FlatList, Image, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { AddFloatingButton, api, Authentication, InputSearch, RenderProcessing, styles } from '../Base';

class ListNews extends Component {
    searchDTO = {
        length: 12,
        start: 0,
        search: {
            value: ""
        },
        columns: [{ data: "id" }],
        order: [
            {
                column: 0,
                dir: "desc"
            }
        ]

    };
    constructor(props) {
        super(props);
        this.state = {
            news: [],
            isLoading: false,
            processing: false,
            refresh: false,
            hasMore: false,
            user: {
                roles: []
            }
        };
    }

    componentDidMount() {
        this.getLoginUser()
    }

    componentWillReceiveProps() {
        this.getLoginUser()
    }

    async getLoginUser() {
        const user = await Authentication.loginUser();
        this.setState({ user: user });
        if (!user.roles.includes("ROLE_ADMIN")) {
            this.searchDTO.userId = user.id
        }
        this.refresh()
    }

    async loadData() {
        this.setState({ isLoading: true });

        api.authFetch("/api/member/news", "post", this.searchDTO,
            (response) => {
                response.json().then(responseJson => {
                    let news = this.state.news
                    if (this.state.refresh) {
                        news = []
                    }
                    //prevent duplicated
                    news = news.concat(responseJson.data)
                    news = news.filter((item, index, self) =>
                        index === self.findIndex((t) => (
                            t.id === item.id
                        ))
                    )
                    this.setState({
                        news: news,
                        isLoading: false,
                        refresh: false,
                        hasMore: responseJson.data.length == this.searchDTO.length
                    });
                })
            })
    }

    async delete(news) {
        Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xoá tin: ' + news.title + ' ?',
            [
                {
                    text: 'OK', onPress: () => {
                        this.setState({ processing: true })
                        api.authFetch("/api/admin/news/delete/" + news.id, "delete", {},
                            (response) => {
                                this.setState({ processing: false })
                                this.refresh()
                            }, status => {
                                this.setState({ processing: false })
                            })
                    }
                },
                {
                    text: 'Không', onPress: () => { },
                    style: 'cancel'
                },
            ]
        )
    }

    refresh = () => {
        this.setState({ refresh: true });
        this.searchDTO.start = 0;
        this.loadData();
    }

    _onEndReached() {
        if (this.state.hasMore) {
            this.searchDTO.start = this.searchDTO.start + this.searchDTO.length;
            this.loadData();
        }
    }

    setKeyword = (text) => {
        this.searchDTO.search.value = text;
        this.refresh();
    }

    edit(news) {
        Actions.updateNews({ news: news })
    }

    renderRowItem = ({ item }) => {
        return (
            <TouchableOpacity >
                <View style={styles.item}>
                    <View style={styles.itemHead}>
                        <Text style={styles.itemHeadText}>{item.title}</Text>
                        <View style={[styles.hContainer, { justifyContent: "flex-end" }]} >
                            {this.state.user.roles.includes("ROLE_ADMIN") ?
                                <TouchableOpacity onPress={() => this.edit(item)} >
                                    <Image
                                        source={require("../assets/edit.png")}
                                        style={styles.iconStyle}
                                    />
                                </TouchableOpacity> : null}
                            {this.state.user.roles.includes("ROLE_ADMIN") ?
                                <TouchableOpacity onPress={() => this.delete(item)} >
                                    <Image
                                        source={require("../assets/trash.png")}
                                        style={styles.iconStyle}
                                    />
                                </TouchableOpacity>
                                : null}
                        </View>
                    </View>

                    <View style={styles.itemBody}>
                        <View style={styles.vContainer}>
                            <View style={styles.vContainer}>
                                <Text style={[styles.info]}>{item.content}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.itemFoot}>
                        <View style={[styles.hContainer]}>
                            <Text style={styles.info}>ID: {item.id}</Text>
                        </View>
                        <View style={[styles.hContainer, { justifyContent: "flex-end" }]}>
                            <Text style={[styles.info, { textAlign: 'right', fontStyle: 'italic' }]}> {item.createdDate}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    renderSearchSection = () => {
        return (
            <View>
                <InputSearch placeholder="Tìm kiếm.…" changeText={this.setKeyword} />
            </View>
        );
    };

    renderProcessing = () => {
        if (this.state.processing) {
            return (<RenderProcessing />)
        }
        return null;
    }

    renderNoDataComponent = () => {
        if (this.state.news.length == 0 && this.state.isLoading == false) {
            return (
                <Text style={{ flex: 1, textAlign: 'center' }}>Không có tin  nào!</Text>
            )
        }
        return null;
    }

    renderLoadMore = () => {
        if (this.state.hasMore) {
            return (<ActivityIndicator size="small" color="#000" />)
        }
        return null
    }

    renderData() {
        return (
            <FlatList
                refreshing={this.state.isLoading}
                onRefresh={() => this.refresh()}
                data={this.state.news}
                renderItem={this.renderRowItem}
                onEndReachedThreshold={1}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={() => {
                    this._onEndReached();
                }}
                ListEmptyComponent={this.renderNoDataComponent}
                ListFooterComponent={this.renderLoadMore}
            />
        );
    }


    renderAddButton = () => (
        <AddFloatingButton action={() => {
            Actions.addNews();
        }} />
    )

    render() {
        return (
            <View style={styles.vContainer}>
                {this.renderProcessing()}
                {this.renderSearchSection()}
                {this.renderData()}
                {this.state.user.roles.includes("ROLE_ADMIN") ? this.renderAddButton() : null}
            </View>
        )
    }
}

export default ListNews;


