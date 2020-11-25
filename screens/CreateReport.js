import React, {Component} from 'react';
import {
  ImageBackground,
  View,
  ActivityIndicator,
  Text,
  Image,
  BackHandler,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Picker,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Dialog, {SlideAnimation, DialogContent} from 'react-native-popup-dialog';
import {NavigationEvents} from 'react-navigation';
import {Rating} from 'react-native-ratings';
import {HeaderBackButton} from 'react-navigation-stack';
import RNFetchBlob from 'react-native-fetch-blob';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {_storeData, _retrieveData} from '../lib/helpers';
import '../global.js';

export default class CreateReport extends Component {
    
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Buat Report',
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
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      fileName: '6a418872-885b-49f0-af62-e91ef6a668fd.jpg',
      fileType: 'image/jpeg',
      visibleImage: false,
      dataImage: '',
      fotoKTP: '',
      showCamera: false,
      dialogShow: false,
      id_user: '',
      target: '',
      no_hp: '',
      parent_id: '',
      catatan: '',
      rating: '',
      pilihCampaign: '',
      dialogProses: false,
      kordinatLokasi: '',
      listCampaign: [],
      listCountry: ['India', 'Pakistan', 'USA'],
    };
  } 

  componentDidMount() {
      this.__getDataUser();
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

  triggeredNav = () => {
      const { navigation } = this.props;
      const dataCameraImage = navigation.getParam('cameraImage');
      this.__getKordinat();
      console.log(dataCameraImage);
      if (dataCameraImage) {
          this.setState({
              dataImage: dataCameraImage,
              visibleImage: true
          }); 
      }
  }  

  __getKordinat = () => {
      const {navigation} = this.props;
      if (typeof navigation.getParam('long') !== 'undefined') {
        this.setState({
          kordinatLokasi:
            navigation.getParam('long') + ',' + navigation.getParam('lat'),
        });
      }
  }

  __getDataUser() {
    _retrieveData('dataLogin').then(hasil => {
      let data = JSON.parse(hasil);
      this.setState({
        id_user: data.ID,
        parent_id: data.PARENT_ID,
      }, () => this.__fetchCampaign(data.PARENT_ID));
    });
  }

  __fetchCampaign = (parent_id) => {
    try {
      fetch(API_URL + '/campaign/readAllByParentId?id=' + parent_id)
        .then(response => response.json())
        .then(responseJson => {
            this.setState({ listCampaign: responseJson.data });
            console.log(responseJson.data)
        })
    } catch (error) {
        alert(error);
    }
  }

  ratingCompleted = (rating) => {
      this.setState({ rating: rating })
      console.log("Rating is: " + rating)
  }

  prosesImage() {
    RNFetchBlob.fetch('POST', API_URL + '/Api/uploadFotoCanvas', {
        Authorization: "Bearer access-token",
        otherHeader: "foo",
        'Content-Type': 'multipart/form-data',
    }, 
    [
        { name: 'image', filename: this.state.fileName, type: this.state.fileType, data: this.state.dataImage }
    ]).then((resp) => resp.json()).then((responseJson) => {  
        console.log(responseJson)  
        if(responseJson.status == false) {
            this.setState({ dialogVisible: false });
            return alert(responseJson.error);
        }
        this.setState({ fileName: responseJson.upload_data })
        this.prosesBuatRoom();
    })      
  }

  prosesBuatRoom() {
    if (this.state.kordinatLokasi == '') {
      this.setState({dialogProses: false});
      return Alert.alert('Info', 'Kordinat masih kosong!');
    }

    this.setState({dialogProses: true});

    let dataKirim = {
      OWNER_ID: this.state.id_user,
      TARGET: this.state.target,
      CATATAN: this.state.catatan,
      RATING: this.state.rating,
      NO_HP: this.state.no_hp,
      PARENT_OWNER: this.state.parent_id,
      LONG_LAT: this.state.kordinatLokasi,
      PHOTO: this.state.fileName,
      ID_CAMPAIGN: this.state.pilihCampaign,
    };

    try {
      fetch(API_URL + '/report/inputReport', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataKirim),
      })
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.status == true) {
                console.log(responseJson);
                this.setState({dialogProses: false});
                Alert.alert('info', 'Data berhasil di input!');
                this.props.navigation.navigate('HomeAwal');
            }
        });
    } catch (error) {
      alert(error);
    }
  }

  render() {

    console.log(this.state.listCampaign)

    return (
      <ImageBackground
        source={require('../assets/bg-1.png')}
        style={{width: '100%', height: '100%'}}>
        <NavigationEvents onDidFocus={() => this.triggeredNav()} />
        {/* dialog proses mengirim */}
        <Dialog
          visible={this.state.dialogProses}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'bottom',
            })
          }>
          <DialogContent>
            <ActivityIndicator style={{marginTop: 20}} size="large" />
            <Text style={{marginTop: 20}}>Sedang Mengirim...</Text>
          </DialogContent>
        </Dialog>
        {/* dialog proses mengirim */}
        <KeyboardAwareScrollView>
          <ScrollView>
            <View
              style={{marginTop: 15, marginBottom: 20, marginHorizontal: 15}}>
              <View>
                <View>
                  <Text
                    style={{
                      marginTop: 30,
                      fontWeight: 'bold',
                      color: '#2E2D2D',
                    }}>
                    Kordinat Daerah
                  </Text>
                  <TextInput
                    value={this.state.kordinatLokasi}
                    placeholder="Masukan nama daerah..."
                    onFocus={() =>
                      this.props.navigation.navigate('GetLocation')
                    }
                    style={{
                      borderWidth: 0.5,
                      backgroundColor: 'white',
                      paddingVertical: 3,
                      borderRadius: 0,
                      borderColor: '#FF2B51',
                      marginTop: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                    }}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      marginTop: 10,
                      fontWeight: 'bold',
                      color: '#2E2D2D',
                    }}>
                    Pilih Campaign
                  </Text>
                  <View>
                    <Picker
                      mode="dropdown"
                      selectedValue={this.state.pilihCampaign}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({pilihCampaign: itemValue})
                      }
                      style={{
                        height: 50,
                        width: '100%',
                        backgroundColor: '#fff',
                        borderRadius: 0,
                      }}>
                      {this.state.listCampaign.map((item, index) => {
                        return (
                          <Picker.Item
                            label={item.NAMA_CAMPAIGN}
                            value={item.ID}
                            key={index}
                          />
                        );
                      })}
                    </Picker>
                    <Icon
                      name="sort-down"
                      size={20}
                      color="#3b4045"
                      style={[{right: 18, top: 10, position: 'absolute'}]}
                    />
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      marginTop: 10,
                      fontWeight: 'bold',
                      color: '#2E2D2D',
                    }}>
                    Target
                  </Text>
                  <TextInput
                    placeholder="Nama Orang / Obyek yang diteliti"
                    onChangeText={text => this.setState({target: text})}
                    style={{
                      borderWidth: 0.5,
                      backgroundColor: 'white',
                      paddingVertical: 3,
                      borderRadius: 0,
                      borderColor: '#FF2B51',
                      marginTop: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                    }}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      marginTop: 10,
                      fontWeight: 'bold',
                      color: '#2E2D2D',
                    }}>
                    No. Telp
                  </Text>
                  <TextInput
                    placeholder="No Telepon"
                    keyboardType="phone-pad"
                    onChangeText={text => this.setState({no_hp: text})}
                    style={{
                      borderWidth: 0.5,
                      backgroundColor: 'white',
                      paddingVertical: 3,
                      borderRadius: 0,
                      borderColor: '#FF2B51',
                      marginTop: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                    }}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      marginTop: 10,
                      fontWeight: 'bold',
                      color: '#2E2D2D',
                    }}>
                    Catatan
                  </Text>
                  <TextInput
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => this.setState({catatan: text})}
                    style={{
                      textAlignVertical: 'top',
                      borderWidth: 0.5,
                      backgroundColor: 'white',
                      paddingVertical: 10,
                      borderRadius: 0,
                      borderColor: '#FF2B51',
                      marginTop: 5,
                      paddingHorizontal: 15,
                    }}
                  />
                </View>
                <View>
                    <Image style={[this.state.visibleImage == true ? styles.imageStyle : '']} visible={false} source={{ uri: 'data:image/jpeg;base64,' + this.state.dataImage }} />
                </View>                 
                <View style={{marginVertical: 20}}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Camera')}
                    style={{
                      fontWeight: 'bold',
                      color: '#2E2D2D',
                      textAlignVertical: 'top',
                      borderWidth: 0.5,
                      backgroundColor: '#007bff',
                      paddingVertical: 10,
                      borderRadius: 0,
                      borderColor: '#FF2B51',
                      marginTop: 5,
                      paddingHorizontal: 15,
                    }}>
                    <Text style={{textAlign: 'center', color: '#FFF', fontWeight: 'bold'}}>Ambil Foto</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text>
                    Rating menunjukan keadaan lokasi ketika anda survey.
                  </Text>
                  <Rating
                    showRating
                    defaultRating={0}
                    ratingCount={5}
                    onFinishRating={this.ratingCompleted}
                    style={{paddingVertical: 10}}
                  />
                </View>
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() => this.prosesImage()}
                    style={{
                      backgroundColor: '#FF2B51',
                      width: 215,
                      borderRadius: 4,
                      marginTop: 50,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        paddingVertical: 15,
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: 20,
                      }}>
                      Buat Laporan
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    width: '100%',
    height: 200,
    marginTop: 20,
  }
});