import {FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { data } from '@/data/todos'
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter'
import Animated, { LinearTransition } from "react-native-reanimated";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import React, { useContext, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export default function Index() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)

  const [todos, setTodos] = useState(data.sort((a, b) => b.id - a.id))

  const [inputText, setInputText] = useState('');

  const [loaded, error] = useFonts({
    Inter_500Medium,
  })

  if(!loaded && !error) {
    return null
  }

  const styles = createStyles(theme, colorScheme);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const seperatorComp = <View style={styles.seperator}/>

  const footerComp = <Text style={styles.footer}>.</Text>
  
  const emptyList = <View style={styles.emptyList}>
                      <MaterialCommunityIcons name="clipboard-list-outline" size={100} color="black" />
                      <Text style={styles.emptyListText}>No Todos.</Text>
                    </View>
  
  const handleSubmit = () => {
    if(inputText.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;

      setTodos([{
        id: newId,
        title: inputText,
        completed: false
      }, ...todos])
    } else {
      alert("You need to fill in a todo first")
    }
    setInputText("")
  }

  const handleDone = (id) => {
      setTodos(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed } : todo))
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
            onChangeText={setInputText}
            value={inputText}
            placeholder="Add a new todo"
            placeholderTextColor="grey"
          />
          <Pressable style={styles.inputButton} onPress={handleSubmit}>
            <Text style={styles.inputButtonText}>Add</Text>
          </Pressable>
          <Pressable onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 10}}>
            <Octicons name={colorScheme === 'dark' ? 'moon' : 'sun'} size={36} color={theme.text} selectable={undefined} style={{ width: 36 }}/>
          </Pressable>
        </View>
        <Animated.FlatList  
          data={todos}
          keyExtractor={(todo) => todo.id}
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
                <MaterialIcons name="delete" size={24} color={colorScheme !== 'dark' && 'white' } selectable={undefined}/>
              </Pressable>
            </Pressable>
          )}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode="on-drag"
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
      maxWidth: 1024,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
      backgroundColor: theme.background,
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
      pointerEvents: "auto" 
    },
    input: {
      width: '85%',
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? "grey" : "black",
      color: theme.text,
      padding: 5,
      borderRadius: 5,
      height: 50,
      fontSize: 20,
      fontFamily: 'Inter_500Medium'
    },
    inputButton: {
      width: '15%',
      borderRadius: 5,
      backgroundColor: theme.button,
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
      alignItems: "center",
      pointerEvents: 'auto'
    },
    todoText: {
      color: theme.text,
      fontSize: 20,
      fontFamily: 'Inter_500Medium'
    },
    todoDone: {
      color: 'grey', 
      textDecorationLine: "line-through",
      fontSize: 20,
      fontFamily: 'Inter_500Medium'
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
