
import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import ImageBrowser from './ImageBrowser'

export default class ImagePickup extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm !== 'granted' || cameraRollPerm !== 'granted') {
      alert("Vui lòng cho phép truy cập camera và thư viện ảnh trong cài đặt.")
    }
  }

  render() {
    return (
      <ImageBrowser
        max={10} // Maximum number of pickable image. default is None
        headerCloseText={'Quay lại'} // Close button text on header. default is 'Close'.
        headerDoneText={'Xong'} // Done button text on header. default is 'Done'.
        headerButtonColor={'#089101'} // Button color on header.
        headerSelectText={'Ảnh Đã Chọn'} // Word when picking.  default is 'n selected'.
        // Only iOS, Filter by MediaSubtype. default is display all.
        badgeColor={'#089101'} // Badge color when picking.
        emptyText={'Không có ảnh nào'} // Empty Text
        callback={this.props.imageBrowserCallback} // Callback functinon on press Done or Cancel Button. Argument is Asset Infomartion of the picked images wrapping by the Promise.
      />
    );
  }
}
