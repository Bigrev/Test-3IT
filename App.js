import React from 'react';
import {View, ScrollView, ActivityIndicator, StyleSheet, ToastAndroid} from 'react-native';
import { Navigation } from 'react-native-navigation';
import GeoLocation from 'react-native-geolocation-service';
import PairItem from './src/component/PairItem';
import Detail from './src/navigation/Detail';
import Graph from './src/navigation/Graph';
import useAxios from './src/hooks/useAxios';
import { hasPermission } from './src/hooks/hasLocation';


const App = (props) =>{
  const [data, setData] = React.useState(null);
  const {res, err, loading} = useAxios('https://mindicador.cl/api');

  //preparar datos para el estado
  React.useEffect(()=>{
    if(res !== null){
      const pairs = [];
      Object.keys(res).forEach((key)=>{
        if(key!=='autor' && key!=='fecha' && key!=='version'){
          pairs.push(res[key]);
        }
      })
      pairs.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1);
      setData([...pairs]);
    }
  },[res]);

  //funcion para probar geolocalización, imprime por consola 
  const getLocation = async () =>{
    const locationPermission = await hasPermission();
      if(locationPermission){
        GeoLocation.getCurrentPosition(
          position => {
            console.log(position);
          },
          error => {
            ToastAndroid.show(
              "No se pudo consultar la ubicación, compruebe si el servicio está activado.",
              ToastAndroid.LONG,
            );
            console.log(error);
          },
          {
            accuracy: {
              android: 'high',
            },
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 0,
            forceRequestLocation: true,
            forceLocationManager: false,
            showLocationDialog: true,
          },
        );
      }
  }

  React.useEffect(()=>{
    getLocation();
  },[])


  return(
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color={"#001C73"}/>}
        <ScrollView>
        {data && data.map((indicador, key) => {
          return(
            <PairItem componentID={props.componentId} key={key} indicador={indicador}/>
          )
        })
        }
      </ScrollView>
    </View>
  )
}

App.options = {
  topBar: {
    title: {
      text: 'Indicadores'
    }
  }
}

Navigation.registerComponent('HomeScreen', () => App);
Navigation.registerComponent('Detail', () => Detail);
Navigation.registerComponent('Graph', () => Graph);

const styles = StyleSheet.create({
  container:{
    backgroundColor:"white"
  }
})

export default App;
