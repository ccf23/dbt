import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, FlatList, SectionList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, HeaderBackButton } from '@react-navigation/native-stack';
import { skills } from './skills.json'; 
import { questions } from './questions.json'; 
import React, {useLayoutEffect} from 'react'; 


const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  let quiz = async () => {
    navigation.navigate("Question", {
      id: 1,
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

function DoneScreen({route, navigation}) {
  let skillIds = route.params;
  let skillList =[];
  let count = 0; 

  skillIds.forEach(element => {
    const [sectionId, itemId] = element.split(":");
    let section = filterById(skills, parseInt(sectionId));
    let item = filterById(section.data, parseInt(itemId)); 
    let suggestion = {
      id: count,
      sectionId: sectionId,
      itemId: itemId,
      item: item
    }
    skillList.push(suggestion);
    count++; 
  });

  return (
    <View style={questionStyles.mainContainer}>
      <View style={questionStyles.questionContainer}>
        <Text style={{color: '#888', fontSize: 35, textAlign: 'center'}}>Suggested Skills to Practice</Text>
      </View>

      <SafeAreaView style={questionStyles.optionContainer}>
      <FlatList
        data={skillList}
        renderItem={({ item }) => (
          <TouchableOpacity 
            key={item.id} 
            onPress={() => {
              navigation.navigate("ListDetail", {
                sectionId: item.sectionId,
                itemId: item.itemId
              })
            }}
          >
            <Text style={styles.row}>{item.item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
      </SafeAreaView>
    </View>
  )
}

function QuestionScreen({route, navigation}) {
  let question = route.params;  
  let curQuestion = filterById(questions, question.id); 

  let nextQuestion = (option) => {
    if(question.questionNum >= 5){
      navigation.navigate("Done", (option.skills));
    } else {
      navigation.navigate("Question", {
        id: option.nextQuestion,
        questionNum: question.questionNum+1,
        answer: option.answer,
        path: "test"
      });
    }    
  }
  return (
    <View style={questionStyles.mainContainer}>
      <View style={questionStyles.questionContainer}>
        <Text style={{color: '#888', fontSize: 35, textAlign: 'center'}}>{curQuestion.question}</Text>
      </View>

      <SafeAreaView style={questionStyles.optionContainer}>
        <FlatList
          data={curQuestion.options}
          renderItem={({ item }) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => nextQuestion(item)}
            >
              <Text style={questionStyles.row}>{item.answer}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>

      {/* <View styles={questionStyles.nextContainer}>
        <TouchableOpacity onPress={nextQuestion} style={questionStyles.button}>
          <Text>Next Question</Text>
        </TouchableOpacity>
      </View> */}
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

const questionStyles = StyleSheet.create({
  mainContainer: {
    flex:1,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  nextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
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
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
});
