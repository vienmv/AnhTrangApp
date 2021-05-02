import * as MediaLibrary from 'expo-media-library';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import { CameraImage } from '../Base';
import ImageTile from './ImageTile';

const { width } = Dimensions.get('window')

export default class ImageBrowser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      photos: [],
      selected: [],
      after: null,
      hasNextPage: true,
      isLoading: true
    }
  }

  componentDidMount() {
    this.getPhotos()
    this.setState({ badgeColor: this.props.badgeColor ? this.props.badgeColor : '#007aff' })
  }

  selectImage = (index) => {
    let newSelected = Array.from(this.state.selected)

    if (newSelected.indexOf(index) === -1) {
      newSelected.push(index)
    } else {
      const deleteIndex = newSelected.indexOf(index)
      newSelected.splice(deleteIndex, 1)
    }

    if (newSelected.length > this.props.max) return
    if (newSelected.length === 0) newSelected = []

    this.setState({ selected: newSelected })
  }

  getPhotos = () => {
    let params = { first: 500, sortBy: [Platform.OS === 'ios' ? [MediaLibrary.SortBy.default, true] : [MediaLibrary.SortBy.modificationTime, false]] }
    if (this.state.after) params.after = this.state.after
    if (!this.state.hasNextPage) return
    MediaLibrary
      .getAssetsAsync(params)
      .then((assets) => {
        this.processPhotos(assets)
      })
  }

  processPhotos = (assets) => {
    if (this.state.after === assets.endCursor) return

    let displayAssets
    if (this.props.mediaSubtype == null) {
      displayAssets = assets.assets
    } else {
      displayAssets = assets.assets.filter((asset) => {
        return asset.mediaSubtypes.includes(this.props.mediaSubtype)
      })
    }

    this.setState({
      photos: [...this.state.photos, ...displayAssets],
      after: assets.endCursor,
      hasNextPage: assets.hasNextPage,
      isLoading: false
    })
  }

  getItemLayout = (data, index) => {
    let length = width / 4
    return { length, offset: length * index, index }
  }

  prepareCallback = () => {
    let { selected, photos } = this.state
    const selectedPhotos = selected.map(i => photos[i])
    const assetsInfo = Promise.all(selectedPhotos.map(i => MediaLibrary.getAssetInfoAsync(i)))
    this.props.callback(assetsInfo)
  }

  prepareCameraCallback = (photo) => {
    var index = photo.uri.lastIndexOf("/")
    photo.id = Math.floor(Math.random() * 1000000000);
    photo.filename = photo.uri.substr(index + 1)
    this.props.callback(Promise.resolve([photo]))
  }

  renderHeader = () => {
    let selectedCount = this.state.selected.length

    let headerText = `${selectedCount} ${this.props.headerSelectText ? this.props.headerSelectText : 'Selected'}`
    if (selectedCount === this.props.max) headerText = headerText + ' (Max)'
    const headerCloseText = this.props.headerCloseText ? this.props.headerCloseText : 'Close'
    const headerDoneText = this.props.headerDoneText ? this.props.headerDoneText : 'Done'
    const headerButtonColor = this.props.headerButtonColor ? this.props.headerButtonColor : '#007aff'

    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={{ height: 52 }}>
        <View style={styles.header}>

          <TouchableOpacity onPress={() => this.props.callback(Promise.resolve([]))}>
            <Text style={{ color: headerButtonColor }}>{headerCloseText}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>{headerText}</Text>
          <TouchableOpacity style={{}} onPress={() => CameraImage._takePhoto(this.prepareCameraCallback)}>
            <Image
              source={require("../assets/camera.png")}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain'
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.prepareCallback()}>
            <Text style={{ color: headerButtonColor }}>{headerDoneText}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  renderImageTile = ({ item, index }) => {
    const selected = this.state.selected.indexOf(index) !== -1
    const selectedItemCount = this.state.selected.indexOf(index) + 1

    return (
      <ImageTile
        item={item}
        selectedItemCount={selectedItemCount}
        index={index}
        camera={false}
        selected={selected}
        selectImage={this.selectImage}
        badgeColor={this.state.badgeColor}
      />
    )
  }

  renderLoading = () => {
    return (
      <View style={styles.emptyContent}>
        <ActivityIndicator size='large' color={this.props.loadingColor ? this.props.loadingColor : '#bbb'} />
      </View>
    )
  }

  renderEmpty = () => {
    return (
      <View style={styles.emptyContent}>
        <Text style={styles.emptyText}>{this.props.emptyText ? this.props.emptyText : 'No image'}</Text>
      </View>
    )
  }

  renderImages = () => {
    return (
      <FlatList
        refreshing={this.state.isLoading}
        onRefresh={() => this.refresh()}
        contentContainerStyle={{ flexGrow: 1 }}
        data={this.state.photos}
        numColumns={4}
        renderItem={this.renderImageTile}
        keyExtractor={(_, index) => index}
        onEndReached={() => { this.getPhotos() }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={this.renderEmpty}
        initialNumToRender={24}
        getItemLayout={this.getItemLayout}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderImages()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 19
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#bbb',
    fontSize: 20
  }
})
