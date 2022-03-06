import { StatusBar } from 'expo-status-bar';
import { Button, SectionList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, HeaderBackButton } from '@react-navigation/native-stack';
import { skills } from './skills.json'; 
import React, {useLayoutEffect} from 'react'; 


const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  let quiz = async () => {
    navigation.navigate("Question", {
      questionNum: 1,
      answer: "",
      path: []
    });
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

function ListScreen({navigation}) {
  return (
    <View style={{ height: "100%" }}>
      <SectionList
        style={lstStyles.lstContainer}
        sections={skills}
        renderItem={({ item, section }) => (
          <TouchableOpacity 
            key={item.id} 
            onPress={() => {
              navigation.navigate("ListDetail", {
                sectionId: section.id,
                itemId: item.id
              })
            }}
          >
            <Text style={styles.row}>{item.name}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.header}>{section.title}</Text>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

function filterById(jsonObject, id) {
  return jsonObject.filter(function(jsonObject) {
    return (jsonObject['id'] == id);
  })[0];
}


function ListDetailScreen({route, navigation}) {
  let itemParams = route.params; 
  let section = filterById(skills, itemParams.sectionId); 
  let item = filterById(section.data, itemParams.itemId); 
  return (
    <View style={{ height: "100%", alignContent: "center", justifyContent: "center" }}>
      <Text style={lstStyles.lstDetailHeader}>{section.title}: {item.name}</Text>
      <View style={{ height: "90%"}}>
        <View style={{height: "50%"}}>
          <Text style={lstStyles.lstDetailRecord}>Description: {item.description}</Text>
        </View>
        <View style={{height: "50%"}}>
          <Text style={lstStyles.lstDetailRecord}>Example: {item.example}</Text>
        </View>
      </View>
    </View>
  );
}

class DoneScreen extends React.Component {
  static navigationOptions = () => {
    return{
      headerLeft:(<HeaderBackButton onPress={()=>{navigation.navigate("Welcome")}}/>)
    }
  };

  render() {
    return (
      <View>
        <Text style={{color: '#888', fontSize: 35, textAlign: 'center'}}>Suggested Skills to Practice</Text>
      </View>
    )
  };
}

function QuestionScreen({route, navigation}) {
  let question = route.params;  

  let nextQuestion = () => {
    if(question.questionNum >= 5){
      navigation.navigate("Done", {
        questionNum: question.questionNum+1,
        answer: "answer question 5",
        path: "test"
      });
    } else {
      navigation.navigate("Question", {
        questionNum: question.questionNum+1,
        answer: "answer question " + question.questionNum,
        path: "test"
      });
    }    
  }
  return (
    <View style={{ flex: 1 }}>
      <Text>Question {question.questionNum}</Text>
      <TouchableOpacity onPress={nextQuestion} style={styles.button}>
        <Text>Next Question</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={HomeScreen} />
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Question" component={QuestionScreen} />
        <Stack.Screen name="ListDetail" component={ListDetailScreen} />
        <Stack.Screen name="Done" component={DoneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const lstStyles = StyleSheet.create({
  lstContainer: {
    flex:1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
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
  lstDetailHeader: {
    padding: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#888', 
    fontSize: 30, 
    textAlign: 'center'
  },
  lstDetailRecord: {
    padding: 15,
    marginBottom: 5,
    color: '#888', 
    fontSize: 20, 
  },
});
