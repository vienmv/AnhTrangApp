import React, { Component } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

import { api, Authentication, styles, RenderProcessing } from '../Base';

class UpdateCost extends Component {
  constructor(props) {
    super(props)
    this.state = {
        id: this.props.order.id,
        isLoading: false,
        cost: null,
      
    }
  }

  async updateCost() {
    this.setState({ isLoading: true })
    api.authFetch("/api/admin/order/update-cost", "put", this.state,
      (response) => {
        this.setState({ isLoading: false })
          
          Alert.alert('Thành công', 'Cập nhật phí ship thành công.',
            [
              {
                text: 'OK', onPress: () => {
                  Actions.pop();
                }
              },
            ]
          )
        
      }).catch(error => {
        this.setState({ isLoading: false })
      });
  }

  submit = () => {
    
    this.updateCost()
    
  }

  renderProcessing = () => {
    if (this.state.isLoading) {
      return (<RenderProcessing />)
    }
    return null
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} keyboardShouldPersistTaps="handled" extraScrollHeight={120}>
        <View style={{ flex: 1 }}>
          {this.renderProcessing()}
          <View style={styles.vContainer}>
            <Text style={styles.label}>Giá ship:</Text>
            <TextInput style={[styles.inputs]}
              placeholder="Giá ship"
              keyboardType="number-pad"
              underlineColorAndroid='transparent'
              value={this.state.cost}
              onChangeText={(cost) => this.setState({ cost: cost})} />
 
            <TouchableOpacity style={[styles.buttonContainer]} onPress={this.submit}>
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
export default UpdateCost;
