import {FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { data } from '@/data/todos'
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter'
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { useRouter } from "expo-router";

export default function Index() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)

  const router = useRouter();

  const [todos, setTodos] = useState([])

  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
          const jsonValue = await AsyncStorage.getItem('TodoApp');

          const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null;

          if(storageTodos && storageTodos.length) {
            setTodos(storageTodos.sort((a, b) => b.id - a.id))
          } else {
            setTodos(data.sort((a, b) => b.id - a.id))
          }

      } catch (error) {
        console.log(error)
      }
    }


    const fetchTheme = async () => {
      try {
          const theme = await AsyncStorage.getItem('Theme');

          const storageTheme = theme !== null ? theme : null;

          if(storageTheme) {
            setColorScheme(storageTheme)
          } else {
            setColorScheme(colorScheme)
          }

      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
    fetchTheme()
  }, [data])

  useEffect(() => {
    const storeData = async () => {
      try {
          const jsonValue = JSON.stringify(todos)
          await AsyncStorage.setItem("TodoApp", jsonValue)
      } catch (error) {
        console.log(error) 
      }
    }

    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem("Theme", colorScheme)
      } catch (error) {
        console.log(error)
      }
    }

    storeData()
    saveTheme()
  }, [todos, colorScheme]) 

  const [loaded, error] = useFonts({
    Inter_500Medium,
  })

  if(!loaded && !error) {
    return null
  }

  const styles = createStyles(theme, colorScheme);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  // const seperatorComp = <View style={styles.seperator}/>

  const footerComp = <Text style={styles.footer}>.</Text>
  
  const emptyList = <View style={styles.emptyList}>
                      <MaterialCommunityIcons name="clipboard-list-outline" size={100} color={theme.text} />
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

  const handlePress = (id) => {
    router.push(`/todos/${id}`)
  }

  return (
    <Container>
      <View style={styles.overallContainer}>
        <View style={styles.inputContainer}>
          <Pressable onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={styles.toggleTheme}>
            <Octicons name={colorScheme === 'dark' ? 'moon' : 'sun'} size={24} color={theme.text} selectable={undefined}/>
          </Pressable>
          <TextInput
            style={styles.input}
            onChangeText={setInputText}
            value={inputText}
            placeholder="Add a new todo"
            placeholderTextColor="grey"
            maxLength={30}
          />
          <Pressable style={styles.inputButton} onPress={handleSubmit}>
            <Text style={styles.inputButtonText}>Add</Text>
          </Pressable>
        </View>
        <Animated.FlatList  
          data={todos}
          keyExtractor={(todo) => todo.id}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          // ItemSeparatorComponent={seperatorComp}
          ListFooterComponent={footerComp}
          ListEmptyComponent={emptyList}
          renderItem={({item}) => (
            <View style={styles.todo} >
              <Pressable 
                onPress={() => handlePress(item.id)}
                onLongPress={() => handleDone(item.id)}>
                <Text style={!item.completed ? styles.todoText : styles.todoDone}>{item.title}</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => handleDelete(item.id)}>
                <AntDesign name="close" size={18} color={colorScheme !== 'dark' && 'white'} selectable={undefined}/>
              </Pressable>
            </View>
          )}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode="on-drag"
        />
      </View>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </Container>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    overallContainer: {
      paddingTop: 20,
      paddingBottom: 10,
      paddingRight: 10,
      paddingLeft: 10,
      width: '100%',
      height: '100vh',
      backgroundColor: theme.background,
    },
    inputContainer: {
      width: '100%',
      maxWidth: 1024,
      paddingTop: 10,
      backgroundColor: theme.background,
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 20,
      pointerEvents: "auto" 
    },
    input: {
      flexGrow: 1,
      minWidth: 0,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? "grey" : "black",
      color: theme.text,
      padding: 5,
      borderRadius: 10,
      height: 50,
      fontSize: 20,
      fontFamily: 'Inter_500Medium'
    },
    toggleTheme: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'rgba(0,0,0,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputButton: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.button,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputButtonText: {
      color: colorScheme === 'dark' ? "black" : "white",
      fontSize: 20
    },
    contentContainer: {
      gap: 2,
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
      paddingTop: 15,
      paddingBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: "center",
      pointerEvents: 'auto',
      backgroundColor: colorScheme === 'light' ? "rgba(0,0,0,0.04)" : "rgba(225,225,225, 0.2)",
      borderRadius: 10
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
      backgroundColor: theme.deleteButton,
      borderRadius: '100%'
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
      paddingTop: 80,
      fontSize: 20
    },
    emptyListText: {
      fontSize: 20,
      color: theme.text
    }
  })
}
