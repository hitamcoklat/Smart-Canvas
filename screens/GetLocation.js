import React, { Component } from 'react'
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {HeaderBackButton} from 'react-navigation-stack';
import OpenAppSettings from 'react-native-app-settings';
import {WebView} from 'react-native-webview';

export default class GetLocation extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Lokasi Anda',
            headerStyle: {
                backgroundColor: '#FF2B51',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                fontWeight: 'normal',
            },
            headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    };
    };    

    constructor() {
        super();
        this.state = {
            location: null
        };
    }

    async componentDidMount() {
        // Instead of navigator.geolocation, just use Geolocation.
        await this.getLokasi();
    }
    
    async getLokasi() {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted) {
          Geolocation.getCurrentPosition(
            position => {
              console.log(position);
                this.setState({
                    location: position
                });
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          Alert.alert('Info', 'Sharing GPS belum diaktifkan!', [
            {text: 'Tidak', onPress: () => this.props.navigation.navigate('HomeAwal')},
            {text: 'Aktifkan', onPress: () => OpenAppSettings.open()},
          ]);          
        }
    }

    pilihLokasi = () => {
        console.log(this.state.location.coords.latitude);
        this.props.navigation.navigate('CreateReport', {
            long: this.state.location.coords.longitude,
            lat: this.state.location.coords.latitude
        });
    }
        
    render() {
        console.log(this.state)
        return (
          <View style={{flex: 1}}>
            {this.state.location != null && (
              <WebView
                source={{
                  uri: 'https://hitamcoklat.com/smart-canvas/get-location.php?long=' + this.state.location.coords.longitude + '&lat=' + this.state.location.coords.latitude,
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => this.pilihLokasi()}
              style={{
                backgroundColor: '#48a868',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>
                Pilih Lokasi
              </Text>
            </TouchableOpacity>
          </View>
        );
    }
}
