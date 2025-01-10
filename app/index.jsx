import { Appearance, Button, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from '@/constants/Colors'
import { data } from '@/data/todos'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from "react";

export default function Index() {
  const [todos, setTodos] = useState([...data])

  const [inputText, onChangeinputText] = React.useState('');

  const colorScheme = Appearance.getColorScheme()

  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const styles = createStyles(theme, colorScheme);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const seperatorComp = <View style={styles.seperator}/>

  const footerComp = <Text style={styles.footer}>.</Text>
  
  const emptyList = <View style={styles.emptyList}>
                      <MaterialCommunityIcons name="clipboard-list-outline" size={100} color="black" />
                      <Text style={styles.emptyListText}>No Todos.</Text>
                    </View>
  
  const handleSubmit = () => {
    if(inputText.length > 0) {
      todos.push({
        "id": todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        "title": inputText,
        "completed": false
      })
    } else {
      alert("You need to fill in a todo first")
    }
    onChangeinputText("")
  }

  const handleDone = (id) => {
      setTodos(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed } : {...todo, completed: todo.completed }))
  }

  const handleDelete = (id) => {
    // console.log(todos[id-1].title)
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <Container>
      <View style={styles.overallContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeinputText}
            value={inputText}
            placeholder="Add a new todo"
          />
          <Pressable style={styles.inputButton} onPress={handleSubmit}>
            <Text style={styles.inputButtonText}>Add</Text>
          </Pressable>
        </View>
        <FlatList 
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={seperatorComp}
          ListFooterComponent={footerComp}
          ListEmptyComponent={emptyList}
          renderItem={({item}) => (
            <Pressable style={styles.todo} onPress={() => handleDone(item.id)}>
              <Text style={!item.completed ? styles.todoText : styles.todoDone}>{item.title}</Text>
              <Pressable style={styles.button} onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color={colorScheme !== 'dark' && 'white' } />
              </Pressable>
            </Pressable>
          )}
        />
      </View>
    </Container>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    overallContainer: {
      paddingTop: 10,
      paddingBottom: 10,
      width: '100%',
      height: '100%',
      backgroundColor: theme.background,
      color: 'white'
    },
    inputContainer: {
      width: '100%',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
      backgroundColor: theme.background,
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
    },
    input: {
      width: '85%',
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? "grey" : "black",
      color: 'grey',
      padding: 5,
      borderRadius: 5,
      height: 50,
      fontSize: 20
    },
    inputButton: {
      width: '15%',
      borderRadius: 5,
      backgroundColor: colorScheme === 'dark' ? "white" : "black",
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputButtonText: {
      color: colorScheme === 'dark' ? "black" : "white",
      fontSize: 20
    },
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 10,
      width: '100%',
      backgroundColor: theme.background,
      color: 'white'
    },
    seperator: {
      height: 1,
      width: '100%',
      backgroundColor:'grey'
    },
    todo: {
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: "center"
    },
    todoText: {
      color: theme.text,
      fontSize: 20
    },
    todoDone: {
      color: 'grey', 
      textDecorationLine: "line-through",
      fontSize: 20
    },
    button: {
      padding: 5,
      backgroundColor: 'red',
      borderRadius: '100%',

    },
    footer: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 20,
      color: 'grey'
    },
    emptyList: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 20
    },
    emptyListText: {
      fontSize: 20
    }
  })
}
