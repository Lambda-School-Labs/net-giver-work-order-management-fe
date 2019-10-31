import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    View,
    TextInput,
    // Text,
    Alert,
    Image,
    SafeAreaView,
    Picker,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import {
    Container,
    Header,
    Left,
    Body,
    Right,
    Button,
    ActionSheet,
    // Icon,
    Title,
    Segment,
    Content,
    Text,
} from 'native-base'
import { Icon } from 'react-native-elements'

// import { token } from '../../../token'
import axios from 'axios'
// import { wOForm } from '../../../components/Styles'
import { StackActions, NavigationActions } from 'react-navigation'
import { wOList } from '../../../components/Styles'

const NewWorkOrderForm = props => {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'WorkOrderList' })],
    })
    const resetAction1 = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'BarCodeScanner' })],
    })
    console.log('TCL: props', props)
    // SET PLACEHOLDER IMAGES TO STATE 10/24/2019 SD
    const [photoUri, setPhotoUri] = useState(
        'http://placehold.jp/006e13/ffffff/200x250.png?text=Click%20to%20Add%20an%20Image'
    )
    useEffect(() => {
        setPhotoUri(
            props.navigation.getParam(
                'uri',
                'http://placehold.jp/006e13/ffffff/200x250.png?text=Click%20to%20Add%20an%20Image'
            )
        )
    }, [])

    //SET CLICKED TO STATE FOR ACTIONsHEET (CAMERA FUNCTIONS) 10/24/2019 SD
    const [clicked, setClicked] = useState()
    // SET PRIORITY 10/24/2019 SD
    const [priority, setPriority] = useState('N/A')
    // SET STATUS 10/24/2019 SD
    const [status, setStatus] = useState('Not Started')
    //SET TITLE 10/24/2019 SD
    const [title, setTitle] = useState()
    //SET DETAIL 10/24/2019 SD`
    const [detail, setDetail] = useState()
    //SET BUTTONS AND CANCEL_INDEX FOR ACTIONSHEET 12/24/2019 SD

    //SET QR CODE FROM PROPS 10/24/2019 SD
    const { qrcode } = 7

    // props.navigation.state.params.qrcode
    const { workOrderId } = 1
    console.log('TCL: qrcode', qrcode)
    //SUBMIT HANDLER 10/24/2019 SD

    const handleSubmit = () => {
        const editMutation = `mutation {
            editWorkorder( qrcode: "${qrcode}", detail: "${detail}", priority: "${priority}", status: "${status}", title: "${title}"){
              qrcode
              detail
              priority
              status
              title
            }
          }`

        axios({
            method: 'post',
            url: 'https://netgiver-stage.herokuapp.com/graphql',
            data: {
                query: editMutation,
            },
        })
            .then(res => {
                const apiUrl = 'https://netgiver-stage.herokuapp.com/graphql'
                const query = `mutation($photo: Upload!) { uploadWorkorderphoto(photo: ${photoUri}, workorderId: ${workOrderId}, primaryPhoto: true) { path, filename, workorderId, primaryPhoto, photocount, userId } }",
                "variables": {
                    "photo": null
                }`

                let fileName = photoUri.split('/').pop()
                let match = /\.(\w+)$/.exec(fileName)
                let mimeType = match ? `image/${match[1]}` : `image`

                let data = {
                    query,
                    variables: { photo: null },
                    operationName: null,
                }
                let fileMap = {}
                fileMap[0] = ['variables.photo']

                let body = new FormData()

                body.append('operations', JSON.stringify(data))
                body.append('map', JSON.stringify(fileMap))
                body.append(0, {
                    uri: photoUri,
                    name: fileName,
                    type: mimeType,
                })

                axios
                    .post(apiUrl, body, {
                        headers: {
                            'x-token': token,
                            Accept: 'application/json',
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then(res => {
                        console.log('response submit', res)
                        // props.navigation.dispatch(resetAction1)
                        props.navigation.navigate('WorkOrderList', {
                            sentFrom: 'NewWorkOrder',
                            token: token,
                        })
                        // props.navigation.dispatch(resetAction)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <ScrollView style={{ backgroundColor: '#f8f5f4' }}>
            <View>
                <View style={{ marginTop: 15 }}>
                    {/* TITLE TEXT INPUT 12/24/2019 SD */}
                    <TextInput
                        placeholder="Work Order Title*"
                        onChangeText={setTitle}
                        value={title}
                        style={wOForm.textInput}
                    />
                </View>
                <View>
                    <TextInput
                        // DETAIL TEXT INPUT 12/24/2019 SD
                        placeholder="Detailed Description"
                        onChangeText={setDetail}
                        value={detail}
                        style={wOForm.textInput1}
                    />
                </View>
                <View style={{ backgroundColor: 'white' }}>
                    <Text>Tap to update status:</Text>
                </View>
                <View style={wOForm.statusDiv}>
                    <TouchableOpacity
                        onPress={() => setStatus('1 Open')}
                        style={wOForm.statusButtons}
                    >
                        <Icon color="#009900" type="antdesign" name="unlock" />
                        <Text style={wOForm.statusButtonsText}>Open</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setStatus('2 OnHold')}
                        style={wOForm.statusButtons}
                    >
                        <Icon color="#009900" type="antdesign" name="pause" />
                        <Text style={wOForm.statusButtonsText}>On Hold</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setStatus('3 InProgress')}
                        style={wOForm.statusButtons}
                    >
                        <Icon color="#009900" type="antdesign" name="sync" />
                        <Text style={wOForm.statusButtonsText}>
                            In Progress
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setStatus('4 Complete')}
                        style={wOForm.statusButtons}
                    >
                        <Icon color="#009900" type="antdesign" name="lock" />
                        <Text style={wOForm.statusButtonsText}>Complete</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: 'white' }}>
                    <Text>Tap to update priority:</Text>
                </View>
                <View style={wOForm.priorityDiv}>
                    <TouchableOpacity
                        onPress={() => setPriority('1 None')}
                        style={wOForm.priorityButtons}
                    >
                        <Text style={wOForm.priorityButtonsText}>None</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setPriority('2 Low')}
                        style={wOForm.priorityButtons}
                    >
                        <Text style={wOForm.priorityButtonsText}>Low</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setPriority('3 Medium')}
                        style={wOForm.priorityButtons}
                    >
                        <Text style={wOForm.priorityButtonsText}>Medium</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setPriority('4 High')}
                        style={wOForm.priorityButtons}
                    >
                        <Text style={wOForm.priorityButtonsText}>High</Text>
                    </TouchableOpacity>
                </View>
                <View style={wOForm.imgCard}>
                    <View style={wOForm.imgCardTop}>
                        <Text>Tap on image to upload.</Text>
                    </View>
                    <View style={wOForm.imgCardBot}>
                        <TouchableOpacity
                            style={wOForm.touchImage}
                            onPress={() =>
                                props.navigation.navigate('Camera', {
                                    from: 'NewWorkOrder',
                                })
                            }
                        >
                            <Image
                                style={wOForm.imgUpload}
                                source={{
                                    uri: photoUri,
                                }}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* SUBMIT BUTTON 10/24/2019 SD */}
                <Button
                    type="primary"
                    style={wOForm.button}
                    onPress={handleSubmit}
                    color="white"
                >
                    <Text>Submit</Text>
                </Button>
            </View>
            {/* </View> */}
        </ScrollView>
    )
}
const wOForm = StyleSheet.create({
    imgCard: {
        borderWidth: 1,
        marginTop: 5,
        padding: 5,
        marginBottom: 5,
    },
    imgCardTop: {},
    imgCardBot: {},
    imgCardBot: {},
    touchImage: {},
    imgUpload: {
        width: 150,
        height: 150,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    statusDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#C5C2C2',
        padding: 5,
        backgroundColor: 'white',
        borderBottomWidth: 1,
    },
    statusButtons: {
        backgroundColor: '#f4f3f3',
        width: '23%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#C5C2C2',
        padding: 5,
    },
    statusButtonsText: { color: '#009900', textAlign: 'center', fontSize: 14 },
    statusButtonsActive: {
        backgroundColor: '#009900',
        width: '23%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#C5C2C2',
        padding: 5,
    },
    statusButtonsTextActive: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
    },
    priorityDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#C5C2C2',
        padding: 5,
        backgroundColor: 'white',
        borderBottomWidth: 1,
    },
    priorityButtons: {
        backgroundColor: '#f4f3f3',
        width: '23%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#C5C2C2',
        padding: 5,
        height: 55,
    },
    priorityButtonsText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 14,
        marginTop: 'auto',
        marginBottom: 'auto',
    },

    priorityButtonsActive: {
        backgroundColor: '#009900',
        width: '23%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#C5C2C2',
        padding: 5,
        height: 53,
    },
    priorityButtonsTextActive: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
    },
    hidden: {
        display: 'none',
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#006E13',
        borderWidth: 2,
        borderColor: '#EDF1F3',
        width: '96%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    textInput: {
        marginTop: -15,
        borderTopWidth: 1,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        backgroundColor: '#ffffff',
        borderColor: '#C5C2C2',
        width: '102%',
        alignSelf: 'center',
        padding: 10,
    },
    textInput1: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        backgroundColor: '#ffffff',
        borderColor: '#C5C2C2',
        width: '102%',
        alignSelf: 'center',
        padding: 10,
        height: 90,
    },
})
export default NewWorkOrderForm
