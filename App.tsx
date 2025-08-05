// App.tsx (or index.js)
// --- IMPORTANT: StructuredClone Polyfill (MUST be at the very top) ---
// when supabase login it show this message: [ReferenceError: Property 'structuredClone' doesn't exist]
// that's why i installed this code
if (typeof global.structuredClone === 'undefined') {
  console.warn("structuredClone is not natively available. Providing a polyfill.");
  // A more robust polyfill might be needed if this simple one fails.
  // For now, let's try this one again, ensuring it's loaded first.
  global.structuredClone = (obj: any) => {
    // This is a basic deep clone. For more complex types (Date, RegExp, Map, Set, etc.),
    // a more comprehensive polyfill library would be required.
    return JSON.parse(JSON.stringify(obj));
  };
}


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { StyleZ } from './assets/css/styles';
import AppNavigator from './navigation/AppNavigator';
import AuthProvider from './context/ContextAuth';
import { enableFreeze } from 'react-native-screens';
import { useKeepAwake } from 'expo-keep-awake';


enableFreeze(true);

export default function App() {

  // this function don't allow the phone to go in sleep mode :)
  useKeepAwake();

  return <>
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
  <StatusBar style="light" />
  </>

  /*return (
    <View style={StyleZ.test}>
      <Text style={StyleZ.testText}>Open Tayler 2 up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <View>
      </View>
      <View>

      </View>

      

    </View>
  );*/
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
