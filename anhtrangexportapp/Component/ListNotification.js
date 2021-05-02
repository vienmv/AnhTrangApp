import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View, TouchableOpacity } from 'react-native';

import { api, Authentication, InputSearch, RenderProcessing, styles } from '../Base';
import { Linking } from 'expo';
import { Actions } from 'react-native-router-flux';

class ListNotification extends Component {

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
            notifications: [],
            isLoading: false,
            processing: false,
            refresh: false,
            hasMore: false,
            user: {}
        };
    }

    componentDidMount() {
        this.getLoginUser()
    }

    async getLoginUser() {
        const user = await Authentication.loginUser();
        this.setState({ user: user });
        this.refresh()
    }

    async loadData() {
        this.setState({ isLoading: true });
        api.authFetch("/api/member/notifications", "post", this.searchDTO,
            (response) => {
                response.json().then(responseJson => {
                    let notifications = this.state.notifications
                    if (this.state.refresh) {
                        notifications = []
                    }
                    this.setState({
                        notifications: notifications.concat(responseJson.data),
                        isLoading: false,
                        refresh: false,
                        hasMore: responseJson.data.length == this.searchDTO.length
                    });
                  
                })
            })

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
        this.refresh()
    }

    updateRead = (item) => {
        const notifications = this.state.notifications

        for (var i = 0; i < notifications.length; i++) {
            if (notifications[i].id == item.id) {
                notifications[i].readerIds.push(this.state.user.id)
                break;
            }
        }

        this.setState({ notifications: notifications })
        //ban len server
        api.authFetch("/api/member/notification", "put", item, () => {
        })
        //call action
        if (item.type == 'REMINDER') {
            Linking.openURL('tel:' + item.item)
        } else if (item.type == 'ORDER') {
            Actions.inforOrder({ orderId: item.item })
        }
    }

    renderRowItem = ({ item }) => {
        let check = item.readerIds.indexOf(this.state.user.id) != -1;
        return (
            <TouchableOpacity style={[styles.item, { backgroundColor: check ? '#f2f2f2' : '#d9d9d9' }]} onPress={() => {
                if (!check) {
                    this.updateRead(item)
                } else {
                    if (item.type == 'REMINDER') {
                        Linking.openURL('tel:' + item.item)
                    } else if (item.type == 'ORDER') {
                        Actions.inforOrder({ orderId: item.item })
                    }
                }
            }}>
                <View style={styles.itemHead}>
                    <Text style={styles.itemHeadText}>{item.title}</Text>
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
            </TouchableOpacity>
        )
    }

    renderSearchSection = () => {
        return (
            <View>
                <InputSearch placeholder="Tìm kiếm.…" changeText={this.setKeyword} search={this.refresh} />
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
        if (this.state.notifications.length == 0 && this.state.isLoading == false) {
            return (
                <Text style={{ flex: 1, textAlign: 'center' }}>Không có thông báo nào!</Text>
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
                data={this.state.notifications}
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

    render() {
        return (
            <View style={styles.vContainer}>
                {this.renderProcessing()}
                {this.renderSearchSection()}
                {this.renderData()}
            </View>
        )
    }
}

export default ListNotification;


