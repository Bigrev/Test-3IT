import React from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Navigation } from 'react-native-navigation';

const screen = Dimensions.get('screen');

const PairItem = (props) =>{
    //funcion reutilizable para push de la navegación 
    const handleNavPush = (navName) =>{
        Navigation.push(props.componentID,
            {
                component: {
                    name: navName,
                    id: `${navName}_Id`,
                    options: {
                        topBar: {
                            title: {
                                text: props.indicador.nombre
                            }
                        }
                    },
                    passProps: {
                        indicatorCode: props.indicador.codigo
                    }
                }
            }
        );
    }

    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={()=>handleNavPush('Detail')} activeOpacity={0.4} style={styles.leftSide}>
                <Text style={styles.indicatorText}>{props.indicador.nombre}</Text>
                <Text style={styles.currencyText}>{props.indicador.unidad_medida == "Pesos" ? "Pesos (CLP)" : props.indicador.unidad_medida == "Dólar" ? "Dólar (USD)" : "Porcentaje (%)"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>handleNavPush('Graph')} activeOpacity={1} style={styles.rightSide} >
                <MaterialIcons color={"#001C73"} name="insert-chart" size={screen.width/10}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: screen.height/12,
        width: screen.width
    },
    leftSide:{
        width: screen.width*0.80,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: screen.width*0.035
    },
    rightSide:{
        width: screen.width*0.20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    indicatorText:{
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    currencyText:{
        fontSize: 14,
        color: 'gray'
    }
  });

export default PairItem;

