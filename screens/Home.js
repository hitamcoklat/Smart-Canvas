import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
  BackHandler,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {NavigationEvents} from 'react-navigation';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import { _storeData, _retrieveData, _removeItem } from '../lib/helpers';

export default class Home extends Component {
    
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      hour: null,
      namaLengkap: '',
      idUser: '',
      listData: [],
      dialogShow: false,
      refreshing: false,
      dataExist: false,
    };
  }

    onActionSelected = (position) => {
        console.log(position)
        if(position === 1) {
            this.logout()
        }
    }

  componentDidMount = () => {
    console.log('did mount');
    this.getHour();
    this.__getDataUser();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert('Info', 'Apakah anda ingin keluar aplikasi?', [
        {text: 'Tidak'},
        {text: 'Ya', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    });
  };

  componentWillMount() {
    console.log('will mount');
  }

  componentWillUnmount() {
    console.log('will unmount');
    // this.__getDataUser();
    this.backHandler.remove();
  }

  triggeredNav = () => {
    this.__getDataUser();
  };

  __getDataUser() {
    _retrieveData('dataLogin').then(hasil => {
      let data = JSON.parse(hasil);
      this.setState(
        {
          namaLengkap: data.NAMA_LENGKAP,
          idUser: data.ID,
        },
        () => this.__fetchDataRoomUser(data.ID),
      );
    });
  }

  logout() {
    _removeItem('dataLogin').then(() => {
      this.setState({ dialogShow: true });      
    })
  }
  
  tutupDialog = () => {
    this.setState({ dialogShow: false }, () => {
      this.props.navigation.navigate('Home');
    });

  }

  getHour = () => {
    const date = new Date();
    const hour = date.getHours();
    this.setState({
      hour,
    });
  };

  _onRefresh = () => {
    this.getHour();
    this.__getDataUser();
  };

  __fetchDataRoomUser(id) {
    this.setState({refreshing: true});
    try {
      fetch(API_URL + '/report/getReportByIdUser?limit=5&page=1&user_id=' + id, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            listData: responseJson.data,
            refreshing: false,
          });
        });
    } catch (error) {
      alert(error);
    }
  }

  renderRow = ({item, index}) => {
    var myStar = [];

    for (let i = 0; i < item.RATING; i++) {
      myStar.push(
        <Image
          key={i}
          style={{width: 16, height: 16}}
          source={require('../assets/star-icon.png')}
        />,
      );
    } 

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('DetailReport', {item: item})
        }
        key={index}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', fontSize: 19, color: '#4E4E4E'}}>
              Target:
            </Text>
            <Text style={{fontSize: 19, color: '#4E4E4E', marginLeft: 10}}>
              {item.TARGET}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', fontSize: 19, color: '#4E4E4E'}}>
              Rating:
            </Text>
            <Text style={{fontSize: 19, color: '#4E4E4E', marginLeft: 10}}>
              {myStar}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 16, color: '#4E4E4E', fontStyle: 'italic'}}>
              {item.CREATED_AT}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 0.3,
            borderBottomColor: '#4E4E4E',
            marginVertical: 10,
          }}></View>
      </TouchableOpacity>
    );
  };

  render() {
    console.log(this.state.listData.length);
    return (
      <ImageBackground
        source={require('../assets/bg-1.png')}
        style={{width: '100%', height: '100%'}}>
        <StatusBar backgroundColor="#FF2B51" barStyle="light-content" />
        <Dialog
          visible={this.state.dialogShow}
          onTouchOutside={() => this.tutupDialog()}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'bottom',
            })
          }>
          <DialogContent>
            <View
              style={{width: 200, alignItems: 'center', paddingVertical: 10}}>
              <Image
                width="64"
                height="64"
                source={require('../assets/register-check-success.png')}
              />
              <Text style={{marginTop: 20, textAlign: 'center'}}>
                Anda berhasil keluar.
              </Text>
            </View>
          </DialogContent>
        </Dialog>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              marginHorizontal: 21,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 42, height: 42}}
              source={require('../assets/logo-small.png')}
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold',
                marginLeft: 10,
              }}>
              Nganvas
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.logout()}
            style={{marginRight: 20}}>
            <Icon name="sign-out-alt" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <NavigationEvents onDidFocus={() => this.triggeredNav()} />
          {/* Tulisan Nama dan Avatar */}
          <View
            style={{
              marginHorizontal: 21,
              marginTop: 90,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{fontSize: 22, color: 'white'}}>
                {this.state.hour < 12 ? `Selamat Pagi` : `Selamat Sore`}
              </Text>
              <Text style={{fontSize: 22, fontWeight: 'bold', color: 'white'}}>
                {this.state.namaLengkap}
              </Text>
            </View>
            <View>
              <Image
                style={{width: 64, height: 64}}
                source={require('../assets/avatar-icon.png')}
              />
            </View>
          </View>
          {/* Box History 1 */}
          <View
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#DEDEDE',
              marginHorizontal: 21,
              shadowOpacity: 0.75,
              shadowRadius: 50,
              shadowColor: '#DEDEDE',
              marginTop: 10,
              padding: 18,
              borderRadius: 2,
            }}>
            <Text style={{fontSize: 19, color: '#4E4E4E', marginBottom: 10}}>
              Silahkan klik tombol dibawah untuk membuat Laporan.
            </Text>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('CreateReport')}
              style={{
                backgroundColor: '#FF2B51',
                marginTop: 15,
                borderWidth: 5,
                borderColor: '#FF2B51',
                width: '100%',
                paddingVertical: 12,
                borderRadius: 1,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                BUAT REPORT
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            {this.state.listData.length !== 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 19,
                      fontWeight: 'bold',
                      color: '#4E4E4E',
                      marginLeft: 21,
                      marginTop: 40,
                    }}>
                    Report
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('ListReport')}
                    style={{
                      marginTop: 40,
                      marginRight: 21,
                      borderRadius: 1,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      backgroundColor: '#61dafb',
                      flexDirection: 'row',
                    }}>
                    <Icon name="search" size={20} color="#fff" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#4E4E4E',
                        marginLeft: 10,
                        marginTop: 1,
                      }}>
                      Lihat Report
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* LIST DATA HISTORY */}

          {this.state.listData.length !== 0 && (
            <FlatList
              style={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#DEDEDE',
                marginHorizontal: 21,
                marginTop: 15,
                padding: 15,
                borderRadius: 1
              }}
              data={this.state.listData}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </ScrollView>
      </ImageBackground>
    );
  }
}


