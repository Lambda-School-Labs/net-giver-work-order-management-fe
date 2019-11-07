import React, {useState} from 'react'
import {SafeAreaView, Text, TouchableOpacity, TextInput, Image, StyleSheet} from 'react-native'
const Phone = (props) => {
    const [phone, setPhone] = useState();
    initialState = {
        phone: "",
        username: "",
        email:"",
        password: "password",
        displayName:"",
        photo: null
        }
        
        const [user, setUser] = useState(initialState)
    handleSubmit = () => {
        if(phone === undefined){
            alert('Here Please Enter a Valid Phone Number')
            console.log(user)
            
        } else if (phone.length != 10) {
            alert('There Please Enter a Valid Phone Number')
            console.log(user)


        } 
        else {
            setUser(user => ({...user, phone:phone}))
            console.log(phone)
            props.navigation.navigate('P2', {user: user})
            
        }
    }
    return (
        <SafeAreaView>
            <Image         
            style={su1.logo}
            source={require("../../components/Images/ng.png")} />
            <Text style={su1.header}>Sign Up</Text>
            <Text style={su1.subHead}>And leave your paperwork behind!</Text>
            <TextInput
            style={su1.input}
            placeholder="Enter your Phone Number"
            keyboardType='phone-pad'
            autoCompleteType='tel'
            maxLength={10}
            onChangeText={setUser({ phone:phone})}
            value={phone}
             />
            <TouchableOpacity style={su1.button} onPress={handleSubmit}><Text style={su1.buttonText}>Get Started</Text></TouchableOpacity>
            <Text onPress={() => props.navigation.navigate('Contact')} style={su1.subHead}>Contact the Net Giver Team</Text>

        </SafeAreaView>
    )
}
export default Phone
const su1 = StyleSheet.create({
    logo: {
        width: 108,
        alignSelf:'center',
        marginTop: 50,
        marginBottom: 35,

    },
    header: {
        fontSize: 24,
        alignSelf: 'center',
        marginBottom: 15,
        fontFamily: "IBMPlexSans-Regular",
    },
    subHead:{
        fontSize: 17,
        alignSelf: 'center',
        fontFamily: "IBMPlexSans-Regular",
    },
    input:{
        backgroundColor: "#edf1f3",
        borderWidth: 1,
        borderColor: "#C5C2C2",
        marginTop:30,
        marginBottom:35,
        width:"90%",
        alignSelf:'center',
        padding: 10,
        fontFamily: "IBMPlexSans-Regular",
    },
    button:{
        alignSelf:'center',
        marginBottom:35,
        backgroundColor:'#00830B',
        borderRadius: 4,
        width:"90%",
        padding: 10,

    },
    buttonText:{
        alignSelf:'center',
        color:'white',
        fontFamily: "IBMPlexSans-Regular",
    },


})
  