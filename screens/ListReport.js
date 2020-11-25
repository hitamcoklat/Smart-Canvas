import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {_storeData, _retrieveData} from '../lib/helpers';
import {FlatList} from 'react-native-gesture-handler';
import {HeaderBackButton} from 'react-navigation-stack';

export default class ListReport extends Component {
  
    static navigationOptions = ({navigation}) => {
    return {
      title: 'List Report',
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
      data: [],
      page: 1,
      isLoading: false,
      namaLengkap: '',
      idUser: '',
      jmlData: 0,
      dataExist: true,
      lastLoadCount: 0,
      refreshing: false,
    };
  }

  _onRefresh = () => {
    console.log('di refresh');
    this.setState({isLoading: true, refreshing: true, page: 1}, () =>
      this._onRefreshData(this.state.idUser),
    );
  };

  _onRefreshData = idUser => {
    const url =
      API_URL +
      '/room/getReportByIdUser?limit=10&page=' +
      this.state.page +
      '&user_id=' +
      idUser;
    try {
      fetch(url)
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.data.length > 0) {
            this.setState({
              data: responseJson.data,
              isLoading: false,
              jmlData: responseJson.count,
              refreshing: false,
            });
          } else {
            this.setState({dataExist: false});
            return false;
          }
        });
    } catch (error) {
      this.setState({isLoading: false, dataExist: false});
    }
  };

  componentDidMount() {
    this.setState({isLoading: true}, this.__getDataUser());
  }

  getData = idUser => {
    const url =
      API_URL +
      '/report/getReportByIdUser?limit=10&page=' +
      this.state.page +
      '&user_id=' +
      idUser;
    // const url = 'https://jsonplaceholder.typicode.com/posts?_limit=10&_page=' + this.state.page;
    try {
      fetch(url)
        .then(response => response.json())
        .then(responseJson => {
          // console.log(responseJson.data.length)
          if (responseJson.data.length > 0) {
            this.setState({
              data: this.state.data.concat(responseJson.data),
              isLoading: false,
              jmlData: responseJson.count,
              lastLoadCount: responseJson.data.length,
              refreshing: false,
              // notFinalLoad: results.length >= 20 ? true : false
            });
          } else {
            this.setState({
              dataExist: false,
              isLoading: false,
              refreshing: false,
            });
            return false;
          }
        });
    } catch (error) {
      this.setState({isLoading: false, dataExist: false});
    }
  };

  _loadMoreData = () => {
    console.log('selanjutnya halaman ' + this.state.page);
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => this.getData(this.state.idUser),
    );
  };

  __getDataUser() {
    _retrieveData('dataLogin').then(hasil => {
      let data = JSON.parse(hasil);
      this.setState(
        {
          namaLengkap: data.NAMA_LENGKAP,
          idUser: data.ID,
        },
        this.getData(data.ID),
      );
    });
  }

  renderRow = ({item, index}) => {
    console.log(item)
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

  renderFooter = () => {
    return this.state.isLoading ? (
      <View style={{marginTop: 20, alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    ) : null;
  };

  render() {
    return (
      <ImageBackground
        source={require('../assets/bg-1.png')}
        style={{width: '100%', height: '100%'}}>
        <FlatList
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#DEDEDE',
            marginHorizontal: 10,
            marginTop: 15,
            padding: 15,
            borderRadius: 2,
          }}
          data={this.state.data}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this._loadMoreData}
          onEndReachedThreshold={0.3}
          ListFooterComponent={this.renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </ImageBackground>
    );
  }
}
