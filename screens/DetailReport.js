import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackHandler,
  Alert,
  ScrollView,
  PermissionsAndroid
} from 'react-native';
import {HeaderBackButton} from 'react-navigation-stack';
import Geolocation from 'react-native-geolocation-service';
import OpenAppSettings from 'react-native-app-settings';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {WebView} from 'react-native-webview';
import FullWidthImage from 'react-native-fullwidth-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import '../global.js';

export default class DetailReport extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Detail Lokasi',
      headerStyle: {
        backgroundColor: '#FF2B51',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      headerLeft: () => (
        <HeaderBackButton onPress={() => navigation.goBack(null)} />
      ),
    };
  };

  constructor() {
    super();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      item: null,
      place: null,
      location: null
    };
  }

  async componentDidMount() {
    // Instead of navigator.geolocation, just use Geolocation.
    await this.getLokasi();
  }

  componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }  

  handleBackButtonClick() {
      this.props.navigation.goBack(null);
      return true;
  }  

  async getLokasi() {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    console.log(granted)

    if (granted) {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            location: position
          });
          console.log(position)
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { timeout: 15000 },
      );
    } else {
      Alert.alert('Info', 'Sharing GPS belum diaktifkan!', [
        { text: 'Tidak', onPress: () => this.props.navigation.navigate('HomeAwal') },
        { text: 'Aktifkan', onPress: () => OpenAppSettings.open() },
      ]);
    }
  } 

  removeReport = (id) => {
    Alert.alert(
      'Info',
      'Apakah anda yakin ingin menghapus report ini?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.submitRemove(id)},
      ],
      {cancelable: true},
    ); 
  }

  submitRemove = async (id) => {
    try {
      let response = await fetch(
        API_URL + '/report/removeReport?id=' + id,
      );
      let responseJson = await response;
      this.props.navigation.navigate('HomeAwal');
      console.log(responseJson)
    } catch (error) {
      console.error(error);
    }
  }

  render() {

    const { navigation } = this.props;
    const item = navigation.getParam('item');
    const coords = item.LONG_LAT;
    var partCoord = coords.split(',');
    var myStar = [];

    console.log(item)
    console.log(API_URL + '/' + item.PHOTO)

    for (let i = 0; i < item.RATING; i++) {
      myStar.push(
          <Image
            key={i}
            style={{ width: 32, height: 32 }}
            source={require('../assets/star-icon.png')}
          />
      );
    }    

    // console.log(item);
    if(this.state.location != null) {
      console.log('https://hitamcoklat.com/smart-canvas/route-location.php?from=' + this.state.location.coords.latitude + ',' + this.state.location.coords.longitude + '&to=' + partCoord[1] + ',' + partCoord[0]);
      console.log(this.state.location.coords.latitude);
    }

    return (
      <View style={{flexDirection: 'column', justifyContent: 'space-between', flex: 1}}>
        <ScrollView>
        <View>
          <View style={{ height: 350 }}>
            {this.state.location != null && (
              <WebView
                source={{
                  // uri: 'https://hitamcoklat.com/smart-canvas/route-location.php?from=' + this.state.location.coords.latitude + ',' + this.state.location.coords.longitude + '&to=' + partCoord[0] + ',' + partCoord[1],
                  uri: 'https://hitamcoklat.com/smart-canvas/route-location.php?from=' + this.state.location.coords.latitude + ',' + this.state.location.coords.longitude + '&to=' + partCoord[1] + ',' + partCoord[0],
                }}
              />
            )}
          </View>

          <View style={{ marginHorizontal: 20 }}>
            <View style={{ borderBottomWidth: 0.5, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 10, borderBottomColor: '#3b4045' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Target:</Text>
              <Text style={{ fontSize: 16 }}>{item.TARGET}</Text>
            </View>
            <View style={{ borderBottomWidth: 0.5, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 10, borderBottomColor: '#3b4045' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Rating:</Text>
              <View style={{ flexDirection: 'row' }}>
                {myStar}
              </View>
            </View>
            <View
              style={{ alignItems: 'center', paddingVertical: 10 }}>
              <FullWidthImage style={{ height: 200, left: 0, right: 0, width: '100%' }} source={{ uri: API_URL + '/' + item.PHOTO }} />
            </View>
          </View>          
        </View>
        </ScrollView>
        <View>
          <TouchableOpacity
            onPress={() => this.removeReport(item.ID)}
            style={{
              backgroundColor: 'red',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
            <Icon name="trash-alt" size={24} color="#fff" />
            <Text style={{ fontWeight: 'normal', color: '#fff', fontSize: 18, marginLeft: 10 }}>
              Delete
          </Text>
          </TouchableOpacity>            
        </View>                
      </View>
    );
  }
}
