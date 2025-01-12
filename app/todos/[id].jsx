import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { useRouter } from "expo-router";

const EditScreen = () => {
    const { id } = useLocalSearchParams()
    const [todo, setTodo] = useState({})
    const router = useRouter()

    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)

    // const [inputText, setInputText] = useState('');

    const styles = createStyles(theme, colorScheme);
    
    const [loaded, error] = useFonts({
        Inter_500Medium,
    })

    useEffect(() => {
        const fetchData = async (id) => {
            try { 
                const jsonValue = await AsyncStorage.getItem("TodoApp")
                const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null

                if(storageTodos) {
                    const currentTodo = storageTodos.find(todo => todo.id.toString() === id)
                    setTodo(currentTodo)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchData(id)
    }, [id])

    if(!loaded && !error) {
        return null
    }

    const handleSave = async () => {
        try {
            const savedTodo = { ...todo, title: todo.title }

            const jsonValue = await AsyncStorage.getItem("TodoApp")
            const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null

            if(storageTodos && storageTodos.length) {
                console.log(savedTodo)
                const otherTodos = storageTodos.filter(todo => todo.id !== savedTodo.id)
                const allTodos = [...otherTodos, savedTodo] 

                await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos))
            } else {
                await AsyncStorage.setItem('TodoApp', JSON.stringify([savedTodo]))
            }

            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <Pressable onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={styles.toggleTheme}>
                    <Octicons name={colorScheme === 'dark' ? 'moon' : 'sun'} size={24} color={theme.text} selectable={undefined}/>
                </Pressable>
                <TextInput
                    style={styles.input}
                    maxLength={30}
                    placeholder="Edit todo"
                    placeholderTextColor="grey"
                    value={todo?.title || ''}
                    onChangeText={(text) => setTodo(prev => ({
                        ...prev, title: text
                    }))}
                />
            </View>
            <View style={styles.inputContainer}>
                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>

                <Pressable style={[styles.cancelButton, {backgroundColor: '#ff3b3b'}]} onPress={() => router.push('/')}>
                    <Text style={[styles.saveButtonText, {color: 'white'}]}>Cancel</Text>
                </Pressable>
            </View>

            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    )
}

export default EditScreen

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
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
    //   justifyContent: "space-between",
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
    saveButton: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.button,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveButtonText: {
      color: colorScheme === 'dark' ? "black" : "white",
      fontSize: 20
    },
    cancelButton: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.button,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelButtonText: {
      color: colorScheme === 'dark' ? "black" : "white",
      fontSize: 20
    },
  })
}
