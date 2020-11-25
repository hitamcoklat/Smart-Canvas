import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './screens/Home';
import Login from './screens/Login';
import CreateReport from './screens/CreateReport';
import GetLocation from './screens/GetLocation';
import DetailReport from './screens/DetailReport';
import ListReport from './screens/ListReport';
import Camera from './screens/Camera';

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

const AppNavigator = createStackNavigator({
    Home: Login,
    HomeAwal: Home,
    GetLocation: GetLocation,
    DetailReport: DetailReport,
    ListReport: ListReport,
    Camera: Camera,
    CreateReport: CreateReport,
    // Home: Login
  });

const AppContainer = createAppContainer(AppNavigator);
