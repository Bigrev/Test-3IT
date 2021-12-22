import React from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider, Surface } from 'react-native-paper';
import useAxios from '../hooks/useAxios';
import {LineChart} from 'react-native-chart-kit';

const screen = Dimensions.get('screen');

const Graph = (props) =>{
    const [tenValues, setTenValues] = React.useState(null);
    const [tenLabels, setTenLabels] = React.useState(null);
    const [valueType, setValueType] = React.useState(null);
    const [lastValue, setLastValue] = React.useState(null);
    const [lastDate, setLastDate] = React.useState(null);

    const {res, err, loading} = useAxios(`https://mindicador.cl/api/${props.indicatorCode}`);

    //funcion para pasar fecha a dd-mm-yyyy
    function reverseDate(string){
       return string.split("-").reverse().join("-");
    }
    
    //funcion para agregar comas a valores monetarios
    function formatCurrency(value){
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    
    //set de estados y formateo de datos para uso
    React.useEffect(()=>{
        if(res !== null){
            const valuesArr = [];
            const labelsArr = [];
            
            for(let i = 9; i >= 0; i--){
                valuesArr.push(res.serie[i].valor);
                labelsArr.push(reverseDate((res.serie[i].fecha).substring(5, 10)));
            }

            setLastValue(res.serie[0].valor);
            setLastDate(reverseDate((res.serie[0].fecha).substring(0,10)));
            setTenValues([...valuesArr]);
            setTenLabels([...labelsArr]);
            setValueType(res.unidad_medida);
        }
    },[res])

    return(
        <PaperProvider>
            <View style={styles.container}>
            {loading && <ActivityIndicator size="large" color={"white"}/> }
                {(tenValues && tenLabels && valueType) && 
                    <>
                        <Surface style={styles.surface}>
                            <View>
                                <Text style={styles.lastValueText}>{valueType == "Porcentaje" ? `${lastValue}%` : `${formatCurrency(lastValue)}$` }</Text>
                                <Text style={styles.pairText}>{`${res.nombre}/${res.unidad_medida}`}</Text>
                            </View>
                            <View style={styles.surfaceBottom}>
                               <Text style={styles.dateText}>{lastDate}</Text> 
                               <Text style={styles.lastDateText}>última actualización</Text>
                            </View>
                        </Surface>
                        <LineChart
                            data={{labels:[...tenLabels], datasets: [{data:[...tenValues],color:()=>'gold', strokeWidth:1}],legend:[`Valor(${valueType})`]}}
                            width={screen.width}
                            height={screen.height/2}
                            chartConfig={{
                                backgroundGradientFrom: '#183086',
                                backgroundGradientTo: '#183086',
                                decimalPlaces: 1,
                                color: () => '#ECEFF1',
                                propsForHorizontalLabels: {x:"55"},
                            }}
                            yAxisLabel={valueType == "Porcentaje" ? "%" : "$"}
                            style={{borderRadius: 7}}
                            renderDotContent={({x, y, index, indexData}) => 
                                <Text key={index} style={{position:"absolute", paddingTop:y+45, paddingLeft:x-20, fontSize:10, color:"gold", fontWeight:"bold", zIndex:100}}>
                                    {formatCurrency(indexData)}
                                </Text>
                            }
                            verticalLabelRotation={70}
                        />
                    </>
                }
            </View>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    surface:{
        marginTop:10,
        elevation: 12,
        height: screen.height/4.5,
        backgroundColor:"white",
        borderRadius:5,
        marginHorizontal:10
    },
    container:{
        backgroundColor:"#183086",
        height: screen.height,
        width: screen.width
    },
    surfaceBottom:{
        flexDirection:"row-reverse"
    },
    lastValueText:{
        fontSize:52,
        color:"#183086",
        paddingLeft:10,
        paddingTop:10,
    },
    pairText:{
        color:"black",
        paddingLeft:10,
        fontSize:14
    },
    dateText:{
        color:"black",
        fontSize:18,
        paddingRight:15,
        paddingTop:30
    },
    lastDateText:{
        paddingTop:32,
        paddingRight:15,
        color:"gray"
    }

});

export default Graph