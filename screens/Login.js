import React, {Component} from 'react';
import {
  ImageBackground,
  View,
  Image,
  ActivityIndicator,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Dialog, {SlideAnimation, DialogContent} from 'react-native-popup-dialog';
import {_storeData, _retrieveData} from '../lib/helpers';
import '../global.js';

export default class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      nohp: '',
      password: '',
      inputHP: '',
      dialogVisible: false,
      dialogShow: false,
      inputHPDialog: false,
      updateAvailable: false,
      dataLogin: '',
      appVersion: '',
      noKonfirmasiHP: '',
    };
  }

  componentDidMount() {
    this.fetchLogin();
    this.checkAppVersionD();
  }

  /* check app version */
  async checkAppVersionD() {
    const response = await fetch(API_ASSET + '/app-config.json');
    // const response = await fetch('http://202.150.151.50/m-rkbr/app-version.php');
    const responseJson = await response.json();
    this.setState({noKonfirmasiHP: responseJson.noKonfirmasiHP});
    if (responseJson.version !== APP_VERSION) {
      this.setState({updateAvailable: true});
    }
  }

  fetchLogin() {
    _retrieveData('dataLogin').then(resp => {
      console.log(resp);
      if (resp != null) {
        this.props.navigation.navigate('HomeAwal');
      } else {
        console.log('tidak ada data');
      }
    });
  }

  prosesLogin() {
    this.setState({dialogVisible: true});
    console.log('prosesLogin');

    if (this.state.password == '' || this.state.nohp == '') {
      this.setState({dialogVisible: false});
      return Alert.alert('Info', 'Mohon isi username dan password.');
    }

    let dataKirim = {
      PASSWORD: this.state.password,
      USERNAME: this.state.nohp,
    };

    try {
      fetch(API_URL + '/team/teamLogin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataKirim),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson.user_login != null) {
            _storeData(
              'dataLogin',
              JSON.stringify(responseJson.user_login),
            ).then(() => {
              console.log('data tersimpan');
              this.setState({dialogVisible: false});
              setTimeout(() => {
                this.props.navigation.navigate('HomeAwal');
              }, 1000);
            });
          } else {
            this.setState({dialogVisible: false});
            alert('Login Gagal!');
          }
        });
    } catch (error) {
      alert(error);
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/bg-2.png')}
        style={{width: '100%', height: '100%'}}>
        <KeyboardAwareScrollView>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{width: 128, height: 148}}
              source={require('../assets/logo-white.png')}
            />
          </View>
          <View style={{marginTop: 30, marginHorizontal: 36}}>
            <Dialog
              visible={this.state.dialogVisible}
              dialogAnimation={
                new SlideAnimation({
                  slideFrom: 'bottom',
                })
              }>
              <DialogContent>
                <ActivityIndicator style={{marginTop: 20}} size="large" />
                <Text style={{marginTop: 20}}>Processing...</Text>
              </DialogContent>
            </Dialog>
            <View>
              <Text style={{fontSize: 29, fontWeight: 'bold', color: 'white'}}>
                LOGIN
              </Text>
              <View>
                <Text
                  style={{marginTop: 20, fontWeight: 'bold', color: '#fff'}}>
                  Username
                </Text>
                <TextInput
                  onChangeText={text => this.setState({nohp: text})}
                  keyboardType="email-address"
                  style={{
                    backgroundColor: '#fff',
                    borderWidth: 0.5,
                    paddingVertical: 10,
                    borderRadius: 2,
                    borderColor: '#ccc',
                    marginTop: 10,
                    paddingHorizontal: 15,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{marginTop: 10, fontWeight: 'bold', color: '#FFF'}}>
                  Password
                </Text>
                <TextInput
                  onChangeText={text => this.setState({password: text})}
                  keyboardType="visible-password"
                  style={{
                    backgroundColor: '#fff',
                    borderWidth: 0.5,
                    paddingVertical: 10,
                    borderRadius: 2,
                    borderColor: '#ccc',
                    marginTop: 10,
                    paddingHorizontal: 15,
                  }}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.prosesLogin()}
                  style={{
                    backgroundColor: '#4cb1cd',
                    width: '100%',
                    paddingVertical: 10,
                    borderRadius: 2,
                    marginTop: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: 'white',
                    }}>
                    LOGIN
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginTop: 20,
                }}></View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}


