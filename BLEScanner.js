





// import React, { useState, useEffect } from 'react';
// import {
//     SafeAreaView,
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     NativeModules,
//     NativeEventEmitter,
//     PermissionsAndroid,
//     Platform,
//     Alert,
// } from 'react-native';
// import BleManager from 'react-native-ble-manager';
// import { Buffer } from 'buffer';

// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// const BLEScanner = () => {
//     const [isScanning, setIsScanning] = useState(false);
//     const [devices, setDevices] = useState([]);
//     const [connectedDevice, setConnectedDevice] = useState(null);
//     const [deviceData, setDeviceData] = useState('');

//     useEffect(() => {
//         BleManager.start({ showAlert: false });

//         const requestPermissions = async () => {
//             if (Platform.OS === 'android' && Platform.Version >= 23) {
//                 try {
//                     const granted = await PermissionsAndroid.requestMultiple([
//                         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//                         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//                     ]);
//                     if (
//                         granted['android.permission.ACCESS_FINE_LOCATION'] !== 'granted' ||
//                         granted['android.permission.BLUETOOTH_SCAN'] !== 'granted' ||
//                         granted['android.permission.BLUETOOTH_CONNECT'] !== 'granted'
//                     ) {
//                         Alert.alert('Permission denied');
//                     }
//                 } catch (err) {
//                     console.warn(err);
//                 }
//             }
//         };

//         requestPermissions();

//         const handleDiscoverPeripheral = (peripheral) => {
//             //   if (peripheral && peripheral.id) {
//             //     const deviceName = peripheral.name || 'NO NAME';
//             //     console.log('Discovered peripheral:', peripheral);
//             if (peripheral && peripheral.id && peripheral.name) {
//                 const deviceName = peripheral.name;
//                 console.log('Discovered peripheral:', peripheral);

//                 setDevices((prevDevices) => {
//                     const existingDevice = prevDevices.find(d => d.id === peripheral.id);
//                     if (existingDevice) {
//                         return prevDevices.map(d =>
//                             d.id === peripheral.id ? { ...d, name: deviceName } : d
//                         );
//                     } else {
//                         return [...prevDevices, { ...peripheral, name: deviceName }];
//                     }
//                 });
//             }
//         };

//         const handleStopScan = () => {
//             console.log('Scan stopped');
//             setIsScanning(false);
//         };

//         const handleUpdateValueForCharacteristic = (data) => {
//             console.log('Received data:', data);
//             const value = data.value ? Buffer.from(data.value, 'base64').toString('utf-8') : 'No Data';
//             setDeviceData(value);
//         };

//         bleManagerEmitter.addListener(
//             'BleManagerDiscoverPeripheral',
//             handleDiscoverPeripheral
//         );

//         bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
//         bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

//         return () => {
//             bleManagerEmitter.removeListener(
//                 'BleManagerDiscoverPeripheral',
//                 handleDiscoverPeripheral
//             );
//             bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
//             bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
//         };
//     }, []);

//     const startScan = () => {
//         if (!isScanning) {
//             setDevices([]);
//             BleManager.scan([], 5, true)
//                 .then(() => {
//                     console.log('Scanning...');
//                     setIsScanning(true);
//                 })
//                 .catch(err => {
//                     console.error('Scan error:', err);
//                 });
//         }
//     };

//     const connectToDevice = (device) => {
//         BleManager.connect(device.id)
//             .then(() => {
//                 console.log('Connected to', device.id);
//                 setConnectedDevice(device);
//                 Alert.alert('Connected', `Connected to ${device.name}`);

//                 // Discover services and characteristics
//                 BleManager.retrieveServices(device.id)
//                     .then((peripheralInfo) => {
//                         console.log('Peripheral info:', peripheralInfo);

//                         // Replace with actual UUIDs
//                         const serviceUUID = '180D'; // Example service UUID for Heart Rate
//                         const characteristicUUID = '2A38'; // Example characteristic UUID for Heart Rate Measurement
//                         // const serviceUUID = '7905f431-b5ce-4e99-a40f-4b1e122d00d0'; // Example service UUID
//                         // const characteristicUUID = '9fbf120d-6301-42d9-8c58-25e699a21dbd'; // Example characteristic UUID

//                         // Start notification on the characteristic
//                         BleManager.startNotification(device.id, serviceUUID, characteristicUUID)
//                             .then(() => {
//                                 console.log('Started notification on characteristic');
//                             })
//                             .catch(error => {
//                                 console.error('Notification error:', error);
//                             });

//                         // Read the characteristic (if needed)
//                         BleManager.read(device.id, serviceUUID, characteristicUUID)
//                             .then((readData) => {
//                                 const value = Buffer.from(readData, 'base64').toString('utf-8');
//                                 console.log('Read data:', value);
//                                 setDeviceData(value);
//                             })
//                             .catch(error => {
//                                 console.error('Read error:', error);
//                             });
//                     })
//                     .catch(error => {
//                         console.error('Retrieve services error:', error);
//                     });
//             })
//             .catch((error) => {
//                 console.log('Connection error', error);
//                 Alert.alert('Connection Error', error.message);
//             });
//     };

//     return (
//         <SafeAreaView style={{ flex: 1, padding: 20 }}>
//             <View>
//                 <TouchableOpacity
//                     onPress={startScan}
//                     style={{
//                         padding: 10,
//                         backgroundColor: '#007bff',
//                         borderRadius: 5,
//                         alignItems: 'center',
//                     }}
//                 >
//                     <Text style={{ color: '#fff' }}>{isScanning ? 'Scanning...' : 'Start Scan'}</Text>
//                 </TouchableOpacity>
//             </View>
//             <FlatList
//                 data={devices}
//                 keyExtractor={(item) => item.id}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity
//                         onPress={() => connectToDevice(item)}
//                         style={{
//                             padding: 10,
//                             borderBottomWidth: 1,
//                             borderBottomColor: '#ccc',
//                         }}
//                     >
//                         <Text>{item.name}</Text>
//                         <Text>{item.id}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//             {connectedDevice && (
//                 <View style={{ marginTop: 20 }}>
//                     <Text>Connected to: {connectedDevice.name}</Text>
//                     <Text>Data from device: {deviceData}</Text>
//                 </View>
//             )}
//         </SafeAreaView>
//     );
// };

// export default BLEScanner;








// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   NativeModules,
//   NativeEventEmitter,
//   PermissionsAndroid,
//   Platform,
//   Alert,
// } from 'react-native';
// import BleManager from 'react-native-ble-manager';
// import { Buffer } from 'buffer';

// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// const BLEScanner = () => {
//   const [isScanning, setIsScanning] = useState(false);
//   const [devices, setDevices] = useState([]);
//   const [connectedDevice, setConnectedDevice] = useState(null);
//   const [deviceData, setDeviceData] = useState('');

//   useEffect(() => {
//     BleManager.start({ showAlert: false });

//     const requestPermissions = async () => {
//       if (Platform.OS === 'android' && Platform.Version >= 23) {
//         try {
//           const granted = await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//             PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//           ]);
//           if (
//             granted['android.permission.ACCESS_FINE_LOCATION'] !== 'granted' ||
//             granted['android.permission.BLUETOOTH_SCAN'] !== 'granted' ||
//             granted['android.permission.BLUETOOTH_CONNECT'] !== 'granted'
//           ) {
//             Alert.alert('Permission denied');
//           }
//         } catch (err) {
//           console.warn(err);
//         }
//       }
//     };

//     requestPermissions();

//     const handleDiscoverPeripheral = (peripheral) => {
//       if (peripheral && peripheral.id && peripheral.name) {
//         const deviceName = peripheral.name;
//         console.log('Discovered peripheral:', peripheral);

//         setDevices((prevDevices) => {
//           const existingDevice = prevDevices.find(d => d.id === peripheral.id);
//           if (existingDevice) {
//             return prevDevices.map(d =>
//               d.id === peripheral.id ? { ...d, name: deviceName } : d
//             );
//           } else {
//             return [...prevDevices, { ...peripheral, name: deviceName }];
//           }
//         });
//       }
//     };

//     const handleStopScan = () => {
//       console.log('Scan stopped');
//       setIsScanning(false);
//     };

//     const handleUpdateValueForCharacteristic = (data) => {
//       console.log('Received data:', data);
//       const value = data.value ? Buffer.from(data.value, 'base64').toString('utf-8') : 'No Data';
//       setDeviceData(value);
//     };

//     bleManagerEmitter.addListener(
//       'BleManagerDiscoverPeripheral',
//       handleDiscoverPeripheral
//     );

//     bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
//     bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

//     return () => {
//       bleManagerEmitter.removeListener(
//         'BleManagerDiscoverPeripheral',
//         handleDiscoverPeripheral
//       );
//       bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
//       bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
//     };
//   }, []);

//   const startScan = () => {
//     if (!isScanning) {
//       setDevices([]);
//       BleManager.scan([], 5, true)
//         .then(() => {
//           console.log('Scanning...');
//           setIsScanning(true);
//         })
//         .catch(err => {
//           console.error('Scan error:', err);
//         });
//     }
//   };

//   const connectToDevice = (device) => {
//     BleManager.connect(device.id)
//       .then(() => {
//         console.log('Connected to', device.id);
//         setConnectedDevice(device);
//         Alert.alert('Connected', `Connected to ${device.name}`);

//         // Discover services and characteristics
//         BleManager.retrieveServices(device.id)
//           .then((peripheralInfo) => {
//             console.log('Peripheral info:', peripheralInfo);

//             // Replace with actual UUIDs
//             const serviceUUID = '180D'; // Example service UUID for Heart Rate
//             const characteristicUUID = '2A38'; // Example characteristic UUID for Heart Rate Measurement

//             // Start notification on the characteristic
//             BleManager.startNotification(device.id, serviceUUID, characteristicUUID)
//               .then(() => {
//                 console.log('Started notification on characteristic');
//               })
//               .catch(error => {
//                 console.error('Notification error:', error);
//               });

//             // Read the characteristic (if needed)
//             BleManager.read(device.id, serviceUUID, characteristicUUID)
//               .then((readData) => {
//                 const value = Buffer.from(readData, 'base64').toString('utf-8');
//                 console.log('Read data:', value);
//                 setDeviceData(value);
//               })
//               .catch(error => {
//                 console.error('Read error:', error);
//               });
//           })
//           .catch(error => {
//             console.error('Retrieve services error:', error);
//           });
//       })
//       .catch((error) => {
//         console.log('Connection error', error);
//         Alert.alert('Connection Error', error.message);
//       });
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, padding: 20 }}>
//       <View>
//         <TouchableOpacity
//           onPress={startScan}
//           style={{
//             padding: 10,
//             backgroundColor: '#007bff',
//             borderRadius: 5,
//             alignItems: 'center',
//           }}
//         >
//           <Text style={{ color: '#fff' }}>{isScanning ? 'Scanning...' : 'Start Scan'}</Text>
//         </TouchableOpacity>
//       </View>
//       <FlatList
//         data={devices}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => connectToDevice(item)}
//             style={{
//               padding: 10,
//               borderBottomWidth: 1,
//               borderBottomColor: '#ccc',
//             }}
//           >
//             <Text>{item.name}</Text>
//             <Text>{item.id}</Text>
//           </TouchableOpacity>
//         )}
//       />
//       {connectedDevice && (
//         <View style={{ marginTop: 20 }}>
//           <Text>Connected to: {connectedDevice.name}</Text>
//           <Text>Data from device: {deviceData}</Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default BLEScanner;









import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BLEScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [deviceData, setDeviceData] = useState('');

  useEffect(() => {
    BleManager.start({ showAlert: false });

    const requestPermissions = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);
          if (
            granted['android.permission.ACCESS_FINE_LOCATION'] !== 'granted' ||
            granted['android.permission.BLUETOOTH_SCAN'] !== 'granted' ||
            granted['android.permission.BLUETOOTH_CONNECT'] !== 'granted'
          ) {
            Alert.alert('Permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestPermissions();

    const handleDiscoverPeripheral = (peripheral) => {
      if (peripheral && peripheral.id && peripheral.name) {
        const deviceName = peripheral.name;
        console.log('Discovered peripheral:', peripheral);

        setDevices((prevDevices) => {
          const existingDevice = prevDevices.find(d => d.id === peripheral.id);
          if (existingDevice) {
            return prevDevices.map(d =>
              d.id === peripheral.id ? { ...d, name: deviceName } : d
            );
          } else {
            return [...prevDevices, { ...peripheral, name: deviceName }];
          }
        });
      }
    };

    const handleStopScan = () => {
      console.log('Scan stopped');
      setIsScanning(false);
    };

    const handleUpdateValueForCharacteristic = (data) => {
      console.log('Received data:', data);
      const value = data.value ? Buffer.from(data.value, 'base64').toString('utf-8') : 'No Data';
      setDeviceData(value);
    };

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral
    );

    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

    return () => {
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral
      );
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
      bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
    };
  }, []);

  const startScan = () => {
    if (!isScanning) {
      setDevices([]);
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(err => {
          console.error('Scan error:', err);
        });
    }
  };

  const connectToDevice = (device) => {
    BleManager.connect(device.id)
      .then(() => {
        console.log('Connected to', device.id);
        setConnectedDevice(device);
        Alert.alert('Connected', `Connected to ${device.name}`);

        // Discover services and characteristics
        BleManager.retrieveServices(device.id)
          .then((peripheralInfo) => {
            console.log('Peripheral info:', peripheralInfo);

            // Replace with actual UUIDs
            const serviceUUID = '180D'; // Example service UUID for Heart Rate
            const characteristicUUID = '2A38'; // Example characteristic UUID for Heart Rate Measurement

            // Start notification on the characteristic
            BleManager.startNotification(device.id, serviceUUID, characteristicUUID)
              .then(() => {
                console.log('Started notification on characteristic');
              })
              .catch(error => {
                console.error('Notification error:', error);
              });

            // Read the characteristic (if needed)
            BleManager.read(device.id, serviceUUID, characteristicUUID)
              .then((readData) => {
                const value = Buffer.from(readData, 'base64').toString('utf-8');
                console.log('Read data:', value);
                setDeviceData(value);
              })
              .catch(error => {
                console.error('Read error:', error);
              });
          })
          .catch(error => {
            console.error('Retrieve services error:', error);
          });
      })
      .catch((error) => {
        console.log('Connection error', error);
        Alert.alert('Connection Error', error.message);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View>
        <TouchableOpacity
          onPress={startScan}
          style={{
            padding: 10,
            backgroundColor: '#007bff',
            borderRadius: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff' }}>{isScanning ? 'Scanning...' : 'Start Scan'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => connectToDevice(item)}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
            }}
          >
            <Text>{item.name}</Text>
            <Text>{item.id}</Text>
          </TouchableOpacity>
        )}
      />
      {connectedDevice && (
        <View style={{ marginTop: 20 }}>
          <Text>Connected to: {connectedDevice.name}</Text>
          <Text>Data from device: {deviceData}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default BLEScanner;
