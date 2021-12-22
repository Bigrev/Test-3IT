import React from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import useAxios from '../hooks/useAxios';
const screen = Dimensions.get('screen');

const Detail = (props) =>{
    const [data, setData] = React.useState(null);
    const [pair, setPair] = React.useState(null);
    const [reverseDate, setReverseDate] = React.useState(true);
    const {res, err, loading} = useAxios(`https://mindicador.cl/api/${props.indicatorCode}`);

    //set de estados
    React.useEffect(()=>{
        if(res !== null){
            const values = [];
            res.serie.forEach((valueObj)=>{
                values.push(valueObj)
            })
            setPair(res.unidad_medida);
            setData([...values]);
        }
    },[res])

    return(
        <View style={styles.container}>
            <View style={styles.guideContainer}>  
                <TouchableOpacity onPress={()=>setReverseDate(prevState => !prevState)} style={styles.guideSection}><Text style={styles.guideText}>{reverseDate? "Fecha (aaaa-mm-dd)": "Fecha (dd-mm-aaaa)"}</Text></TouchableOpacity>
                <View style={styles.guideSection}><Text style={styles.guideText}>Valor{ pair == "Pesos" ? "(CLP)" : pair == "Dólar" ? "(USD)" : "(Porcentaje)" }</Text></View>
            </View>
            <ScrollView style={styles.scrollView}>
                {loading && <ActivityIndicator size="large" color={"#001C73"}/> }
                {data && data.map((entry, key)=>{
                    return(
                        <View style={styles.itemContainer} key={key}>
                            <View style={styles.itemSection}>
                                <MaterialIcons color={"#001C73"} name="date-range" size={screen.width/10}/>
                                <Text style={styles.itemText}>{reverseDate ? entry.fecha.split("T")[0] : entry.fecha.split("T")[0].split("-").reverse().join("-")}</Text>
                            </View>
                            <View style={styles.itemSection}>
                                {pair == "Porcentaje" ? <MaterialCommunityIcons color={"#001C73"} name="percent" size={screen.width/14}/> :
                                <MaterialIcons color={"#001C73"} name="attach-money" size={screen.width/14}/> 
                                }
                                <Text style={styles.itemText}>{pair != "Porcentaje" ? (entry.valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : entry.valor}</Text>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white"
    },
    scrollView:{
        marginBottom:screen.height*0.05
    },
    guideContainer:{
        flexDirection: "row",
        height: screen.height*0.05,
    },
    guideSection:{
        width: screen.width/2,
        alignItems: "center",
        justifyContent: "center"
    },
    guideText:{
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    itemContainer:{
        flexDirection: "row",
        width: screen.width,
        height: screen.height*0.07
    },
    itemSection:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        width: screen.width/2
    },
    itemText:{
        fontSize: 15,
        fontWeight: "bold",
        color: "black"
    }

  });


export default Detail;