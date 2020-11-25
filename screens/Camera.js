import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

export default class Camera extends Component {
    static navigationOptions = {
        header: null,
    };

  constructor() {
    super();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.navigasi(data.base64);
    }
  };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }  

    navigasi = dataImage => {
        console.log(dataImage);
        this.props.navigation.navigate('CreateReport', {cameraImage: dataImage});
    };

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }  

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}>
            <Image
              style={{width: 64, height: 64}}
              source={require('../assets/capture-icon.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row-reverse',
            position: 'absolute',
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('CreateReport')}>
            <Image
              style={{width: 64, height: 64, marginTop: 20, marginRight: 20}}
              source={require('../assets/cross-icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    alignSelf: 'center',
    margin: 20,
  },
});
