import {PermissionsAndroid} from 'react-native';
import {ToastAndroid} from 'react-native';
import {Platform} from 'react-native';

export const hasPermission = async () => {
    //si la version de la plataforma es menor a 23, entonces los permisos ya estan habiltiados.
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }
    //comprobar si los permisos ya existen
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

    //solicitar permiso
  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
    //si el permiso fue concedido esta vez, entonces retornar true
  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

    //caso de permiso denegado
  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Permiso de geolocalización denegado por el usuario.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Permiso de geolocalización denegado por el usuario.',
      ToastAndroid.LONG,
    );
  }
  return false;
};