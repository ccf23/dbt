import { StatusBar } from 'expo-status-bar';
import { Image,SafeAreaView, FlatList, SectionList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, HeaderBackButton } from '@react-navigation/native-stack';
import { skills } from './skills.json'; 
import { questions } from './questions.json'; 
import React, {useLayoutEffect} from 'react'; 

const Stack = createNativeStackNavigator();

const images = new Map(); 
images.set("home", require('./images/home_cropped.png'));
images.set("happy", require('./images/happy.png'));
images.set("sad", require('./images/sad.png'));
images.set("mad", require('./images/mad.png'));
images.set("stressed", require('./images/stressed.png'));

function HomeScreen({ navigation }) {
  let quiz = async () => {
    navigation.navigate("Question", {
      id: 1,
      questionNum: 1,
      answer: ""
    });
  }

  let list = () => {
    navigation.navigate("List"); 
  }

  return (
    <View style={styles.container}>
      <Image source={images.get("home")} style={{ width: 315, height: 350 }} /> 

      <View>
        <Text style={styles.titleText}>Mental Health Excerises using DBT</Text>
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
    <View style={lstStyles.lstContainer}>
      <SectionList
        style={lstStyles.lstContainer}
        sections={skills}
        renderItem={({ item, section }) => (
          <TouchableOpacity 
            key={item.id} 
            onPress={() => {
              navigation.navigate("Skill", {
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


function SkillDetailScreen({route, navigation}) {
  let itemParams = route.params; 
  let section = filterById(skills, itemParams.sectionId); 
  let item = filterById(section.data, itemParams.itemId); 
  return (
    <View style={lstStyles.lstContainer}>
      <View style={lstStyles.headContainer}>
        <Text style={lstStyles.lstDetailHeader}>{section.title}: {item.name}</Text>
      </View>
      <View style={lstStyles.descContainer}>
        <Text style={lstStyles.lstDetailRecord}>Description: {item.description}</Text>
      </View>
      <View style={lstStyles.exContainer}>
        <Text style={lstStyles.lstDetailRecord}>Example: {item.example}</Text>
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
        <Text style={questionStyles.questionText}>Suggested Skills to Practice</Text>
      </View>

      <SafeAreaView style={questionStyles.optionContainer}>
      <FlatList
        data={skillList}
        renderItem={({ item }) => (
          <TouchableOpacity 
            key={item.id} 
            onPress={() => {
              navigation.navigate("Skill", {
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
    if(option.nextQuestion==-1){
      navigation.replace("Done", (option.skills));
    } else {
      navigation.navigate("Question", {
        id: option.nextQuestion,
        questionNum: question.questionNum+1,
        answer: option.answer
      });
    }    
  }

  return (
    <View style={questionStyles.mainContainer}>
      <View style={questionStyles.questionContainer}>
        <Text style={questionStyles.questionText}>{curQuestion.question}</Text>
      </View>

      <SafeAreaView style={questionStyles.optionContainer}>
        <FlatList
          data={curQuestion.options}
          renderItem={({ item }) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => nextQuestion(item)}
            >
              <View style={questionStyles.row}>
               <Text >{item.answer}
               </Text>
               <Image source={images.get(item.image)} style={{ width: 50, height: 50 }} /> 
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
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
        <Stack.Screen name="Skill" component={SkillDetailScreen} />
        <Stack.Screen name="Done" component={DoneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:3,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  imageContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  box1: {
    flex: 3
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
  titleText: {
    color: '#888', 
    fontSize: 35, 
    textAlign: 'center'
  }
});

const lstStyles = StyleSheet.create({
  lstContainer: {
    flex:1,
  },
  headContainer: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  descContainer: {
    flex:2,
  },
  exContainer: {
    flex:2,
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
  questionText: {
    color: '#888', 
    fontSize: 35, 
    textAlign: 'center'
  }
});
