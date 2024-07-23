// import React, { useEffect, useState } from 'react';
// import { PermissionsAndroid, Platform, Text, View } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// // import BackgroundFetch from 'react-native-background-fetch';

// const App = () => {
//   const [device, setDevice] = useState(null);
//   const manager = new BleManager();

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'Bluetooth requires location access',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Location permission denied');
//       }
//     }
//   };

//   const connectToDevice = async (device) => {
//     try {
//       const connectedDevice = await device.connect();
//       await connectedDevice.discoverAllServicesAndCharacteristics();
//       setDevice(connectedDevice);
//       console.log('Connected to', connectedDevice.name);
//     } catch (error) {
//       console.log('Connection error', error);
//     }
//   };

//   const readData = async (device) => {
//     const services = await device.services();
//     for (const service of services) {
//       const characteristics = await service.characteristics();
//       for (const characteristic of characteristics) {
//         if (characteristic.isReadable) {
//           const data = await characteristic.read();
//           console.log('Read data', data.value);
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     requestLocationPermission();

//     manager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         console.log(error);
//         return;
//       }
//       console.log(device.name);
//       if (device.name === 'MyBLEDevice') {
//         manager.stopDeviceScan();
//         connectToDevice(device);
//       }
//     });

//     // configureBackgroundFetch();

//     return () => {
//       manager.stopDeviceScan();
//       manager.destroy();
//     };
//   }, []);

//   // const configureBackgroundFetch = () => {
//   //   BackgroundFetch.configure(
//   //     {
//   //       minimumFetchInterval: 15, // minutes
//   //       stopOnTerminate: false,
//   //       startOnBoot: true,
//   //     },
//   //     async (taskId) => {
//   //       console.log('[BackgroundFetch] taskId: ', taskId);
//   //       if (device) {
//   //         await readData(device);
//   //       }
//   //       BackgroundFetch.finish(taskId);
//   //     },
//   //     (error) => {
//   //       console.log('[BackgroundFetch] Failed to start', error);
//   //     }
//   //   );

//   //   BackgroundFetch.start();
//   // };

//   return (
//     <View>
//       <Text>BLE Device Connection</Text>
//     </View>
//   );
// };

// export default App;





import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, View, Text } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import BLEScanner from './BLEScanner';

const App = () => {
  // useEffect(() => {
  //   const requestPermissions = async () => {
  //     if (Platform.OS === 'android') {
  //       try {
  //         const granted = await PermissionsAndroid.requestMultiple([
  //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         ]);

  //         if (
  //           granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
  //           granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
  //           granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
  //         ) {
  //           console.log('You can use the Bluetooth');
  //           // Initialize BLE manager
  //           BleManager.start({ showAlert: false });
  //         } else {
  //           console.log('Bluetooth permission denied');
  //         }
  //       } catch (err) {
  //         console.warn(err);
  //       }
  //     } else if (Platform.OS === 'ios') {
  //       const status = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
  //       if (status === RESULTS.GRANTED) {
  //         console.log('You can use the Bluetooth');
  //         // Initialize BLE manager
  //         BleManager.start({ showAlert: false });
  //       } else {
  //         console.log('Bluetooth permission denied');
  //       }
  //     }
  //   };

  //   requestPermissions();
  // }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <Text>BLE App</Text> */}
      <BLEScanner/>
    </View>
  );
};

export default App;
