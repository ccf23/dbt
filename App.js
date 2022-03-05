import { StatusBar } from 'expo-status-bar';
import { SectionList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { skills } from './skills.json'; 

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  let quiz = async () => {
    navigation.navigate("Question");
  }

  let list = () => {
    navigation.navigate("List"); 
  }

  return (
    <View style={styles.container}>
      <View >
        <Text style={{color: '#888', fontSize: 35, textAlign: 'center'}}>Mental Health Excerises using DBT</Text>
        <StatusBar style="auto" />
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={quiz} style={styles.button}>
          <Text style={styles.buttonText}>Quiz for Personal Suggestion</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={list} style={styles.button}>
          <Text style={styles.buttonText}>List of Skills</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function ListScreen() {
  return (
    // <FlatList
    //   contentContainerStyle={styles.lstContainer}
    //   data={skills}
    //   renderItem={({ item }) => <Text style={styles.row}>{item.name}</Text>}
    //   keyExtractor={( item ) => item.id}
    // />
    <View style={{ height: "100%" }}>
      <SectionList
        style={styles.lstContainer}
        sections={skills}
        renderItem={({ item }) => <Text style={styles.row}>{item.name}</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={styles.header}>{section.title}</Text>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

function QuestionScreen() {
  return (
    <View></View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={HomeScreen} />
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Question" component={QuestionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  lstContainer: {
    flex:1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },

  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  }, 
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'skyblue',
  },
  header: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'steelblue',
    color: 'white',
    fontWeight: 'bold',
  },
});
