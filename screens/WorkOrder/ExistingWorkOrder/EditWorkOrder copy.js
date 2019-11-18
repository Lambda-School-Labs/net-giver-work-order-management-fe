import React, { useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  Platform
} from "react-native";
import { Field, Formik } from "formik";
import {
  ActionSheet,
  Content,
  Button as NativeButton,
  Container
} from "native-base";
import { Icon, Button } from "react-native-elements";
import { wOForm } from "../../../assets/style";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { PictureField } from "../../../components/shared/PictureField";
import { CameraField } from "../../../components/shared/CameraField";
import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import * as Permissions from "expo-permissions";
import { fieldsConflictMessage } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
import { font, color } from "../../../assets/style/base";
import { topBtn } from "../../../assets/style/components/buttons";
import { StackActions, NavigationActions } from "react-navigation";

const EDIT_WO = gql`
  mutation editWorkorder(
    $qrcode: String!
    $id: ID!
    $detail: String
    $priority: String
    $status: String
    $title: String
  ) {
    editWorkorder(
      qrcode: $qrcode
      id: $id
      detail: $detail
      priority: $priority
      status: $status
      title: $title
    ) {
      id
      detail
      createdAt
      qrcode
      priority
      status
      title
      user {
        username
      }
      workorderphoto {
        path
      }
    }
  }
`;

const WO_PIC = gql`
  mutation uploadWorkorderphoto($photo: Upload!, $workorderId: ID!) {
    uploadWorkorderphoto(photo: $photo, workorderId: $workorderId) {
      userId
      filename
      path
    }
  }
`;

const updateWo = async ({
  values,
  editWorkorder,
  uploadWorkorderphoto,
  navigation
}) => {
  if (values.photo.uri) {
    
    const picresult = await uploadWorkorderphoto({
      variables: {
        photo: values.photo,
        workorderId: values.id
      }
    });

    const editresult = await editWorkorder({
      variables: {
        id: values.id,
        qrcode: values.qrcode,
        detail: values.detail,
        priority: values.priority,
        status: values.status,
        title: values.title
      }
    });

    navigation.state.params.onGoBack({
      id: values.id,
      qrcode: values.qrcode,
      detail: values.detail,
      priority: values.priority,
      status: values.status,
      title: values.title,
      workorderphoto: (values.photo.uri ? values.photo : values.workorderphoto)
  });
    navigation.goBack();
  }
  const editresult = await editWorkorder({
    variables: {
      id: values.id,
      qrcode: values.qrcode,
      detail: values.detail,
      priority: values.priority,
      status: values.status,
      title: values.title,
      // photo: values.photo,
    }
  });

  // if (get(editresult, "data.workorder")) {
  //   // navigation.goBack();
  //   null;
  // }

  navigation.state.params.onGoBack({
    id: values.id,
    qrcode: values.qrcode,
    detail: values.detail,
    priority: values.priority,
    status: values.status,
    title: values.title,
    workorderphoto: (values.photo.uri ? values.photo : values.workorderphoto)
});
  navigation.goBack();
};

const EditWorkOrder = ({ navigation }) => {
  const {
    id,
    qrcode,
    detail,
    priority,
    status,
    title,
    user,
    user: { username },
    workorderphoto
  } = navigation.state.params;

  console.log("PHOTO", workorderphoto)
  const [wo, setWo] = useState({
    id: id,
    detail: detail
  });
  const [editWorkorder, { loading, error }] = useMutation(EDIT_WO, {});
  const [uploadWorkorderphoto, { picloading, picerror }] = useMutation(
    WO_PIC,
    {}
  );

  const img1 =
    "http://placehold.jp/006e13/ffffff/200x250.png?text=Click%20to%20Add%20an%20Image";
  const BUTTONS = [
    { text: "Gallery" },
    { text: "Take Photo" },
    { text: "Cancel" }
  ];
  const CANCEL_INDEX = 2;
  return (
    <Formik
      initialValues={{
        id: id,
        qrcode: qrcode,
        detail: detail,
        priority: priority,
        status: status,
        title: title,
        workorderphoto: workorderphoto,
        photo: {}
      }}
      onSubmit={async values => {
        console.log(values)
        console.log(values.photo.uri)
        updateWo({
          values,
          editWorkorder,
          uploadWorkorderphoto,
          navigation
        })}}
      render={({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        setFieldValue
      }) =>
        <ScrollView style={{ backgroundColor: "#f8f5f4" }}>
          <View style={{ backgroundColor: "white" }}>
            <View style={{ marginTop: 15 }}>
              <TextInput
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.title}
                placeholder="Work Order Title*"
                style={wOForm.textInput}
              />
            </View>
            <View>
              <TextInput
                onChangeText={handleChange("detail")}
                onBlur={handleBlur("detail")}
                value={values.detail}
                style={wOForm.textInput1}
                multiline={true}
                placeholder="Detailed Description"
              />
            </View>
            <View style={wOForm.psContainer}>
              <View style={wOForm.updateButtonContainer}>
                <Text style={wOForm.updateButtonText}>
                  Tap to update status:
                </Text>
                <View style={wOForm.statusView}>
                  <View style={wOForm.statusButton}>
                    <Button
                      onPress={() => setFieldValue("status", "Open")}
                      buttonStyle={wOForm.statusButtons}
                      titleStyle={wOForm.statusButtonsText}
                      disabled={values.status === "Open"}
                      disabledStyle={wOForm.statusButtonsActive}
                      disabledTitleStyle={wOForm.statusButtonsTextActive}
                      icon={
                        <Icon
                          color={values.status === "Open" ? "white" : "#89898E"}
                          type="antdesign"
                          name="unlock"
                          size={20}
                        />
                      }
                      title="Open"
                    />
                  </View>
                  <Button
                    onPress={() => setFieldValue("status", "Hold")}
                    buttonStyle={wOForm.statusButtons}
                    titleStyle={wOForm.statusButtonsText}
                    disabled={values.status === "Hold"}
                    disabledStyle={wOForm.statusButtonsActive}
                    disabledTitleStyle={wOForm.statusButtonsTextActive}
                    icon={
                      <Icon
                        color={values.status === "Hold" ? "white" : "#89898E"}
                        type="antdesign"
                        name="pause"
                        size={20}
                      />
                    }
                    title="Hold"
                  />
                  <Button
                    onPress={() => setFieldValue("status", "Working")}
                    buttonStyle={wOForm.statusButtons}
                    titleStyle={wOForm.statusButtonsText}
                    disabled={values.status === "Working"}
                    disabledStyle={wOForm.statusButtonsActive}
                    disabledTitleStyle={wOForm.statusButtonsTextActive}
                    icon={
                      <Icon
                        color={values.status === "Working" ? "white" : "#89898E"}
                        type="antdesign"
                        name="sync"
                        size={20}
                      />
                    }
                    title="Working"
                  />
                  <Button
                    onPress={() => setFieldValue("status", "Done")}
                    buttonStyle={wOForm.statusButtons}
                    titleStyle={wOForm.statusButtonsText}
                    disabled={values.status === "Done"}
                    disabledStyle={wOForm.statusButtonsActive}
                    disabledTitleStyle={wOForm.statusButtonsTextActive}
                    icon={
                      <Icon
                        color={values.status === "Done" ? "white" : "#89898E"}
                        type="antdesign"
                        name="lock"
                        size={20}
                      />
                    }
                    title="Done"
                  />
                </View>
              </View>
              <View style={wOForm.updateButtonContainer}>
                <Text style={wOForm.updateButtonText}>
                  Tap to update priority:
                </Text>
                <View style={wOForm.statusView}>
                  <View style={wOForm.priorityDiv}>
                    <Button
                      onPress={() => setFieldValue("priority", "Low")}
                      buttonStyle={wOForm.priorityButtons}
                      title="Low"
                      titleStyle={wOForm.priorityButtonsText}
                      disabled={values.priority === "Low"}
                      disabledStyle={{ backgroundColor: color.accLow }}
                      disabledTitleStyle={{
                        fontFamily: font.reg,
                        color: color.priLow
                      }}
                    />
                    <Button
                      onPress={() => setFieldValue("priority", "Medium")}
                      buttonStyle={wOForm.priorityButtons}
                      title="Medium"
                      titleStyle={wOForm.priorityButtonsText}
                      disabled={values.priority === "Medium"}
                      disabledStyle={{ backgroundColor: color.accMed }}
                      disabledTitleStyle={{
                        fontFamily: font.reg,
                        color: color.priMed
                      }}
                    />
                    <Button
                      onPress={() => setFieldValue("priority", "High")}
                      buttonStyle={wOForm.priorityButtons}
                      title="High"
                      titleStyle={wOForm.priorityButtonsText}
                      disabled={values.priority === "High"}
                      disabledStyle={{ backgroundColor: color.accHigh }}
                      disabledTitleStyle={{
                        fontFamily: font.reg,
                        color: color.priHigh
                      }}
                    />
                    <Button
                      onPress={() => setFieldValue("priority", "Urgent")}
                      buttonStyle={wOForm.priorityButtons}
                      title="Urgent"
                      titleStyle={wOForm.priorityButtonsText}
                      disabled={values.priority === "Urgent"}
                      disabledStyle={{ backgroundColor: color.accUrg }}
                      disabledTitleStyle={{
                        fontFamily: font.reg,
                        color: color.priUrg
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={wOForm.imgCard}>
              <View style={wOForm.imgCardBot}>
                {/* <TouchableOpacity
                                    style={wOForm.touchImage}
                                    onPress={() => PictureField}
                                > */}
                {values.photo.uri
                  ? <View style={wOForm.imgContainer}>
                      <Image
                        style={wOForm.imgUpload}
                        source={{
                          uri: values.photo.uri
                        }}
                      />
                    </View>
                  : values.workorderphoto
                    ? <Image
                        style={wOForm.imgUpload}
                        source={{
                          uri: values.workorderphoto.path
                        }}
                      />
                    : null}
                {/* </TouchableOpacity> */}
                <Content>
                  <Field
                    style={wOForm.imgUpload}
                    titleStyle={wOForm.statusButtonsTextActive}
                    buttonStyle={wOForm.submitButton}
                    name="photo"
                  >
                    {({ field, form }) =>
                      <NativeButton
                        style={wOForm.photoHandlerButton}
                        onPress={() =>
                          ActionSheet.show(
                            {
                              options: BUTTONS,
                              cancelButtonIndex: CANCEL_INDEX,
                              title: "Add an image"
                            },
                            buttonIndex => {
                              if (buttonIndex !== 2) {
                                const find = async () => {
                                  const { status } = await Permissions.getAsync(
                                    buttonIndex === 0
                                      ? Permissions.CAMERA_ROLL
                                      : Permissions.CAMERA
                                  );
                                  console.log(status);
                                  if (status !== "granted") {
                                    await Permissions.askAsync(
                                      buttonIndex === 0
                                        ? Permissions.CAMERA_ROLL
                                        : Permissions.CAMERA
                                    );
                                  }
                                  const imageResult = await (buttonIndex === 0
                                    ? ImagePicker.launchImageLibraryAsync({})
                                    : ImagePicker.launchCameraAsync({}));
                                  console.log(imageResult);
                                  const fileName = imageResult.uri
                                    .split("/")
                                    .pop();
                                  const match = /\.(\w+)$/.exec(fileName);
                                  const mimeType = match
                                    ? `image/${match[1]}`
                                    : "image";
                                  if (!imageResult.cancelled) {
                                    const file = new ReactNativeFile({
                                      uri: imageResult.uri,
                                      type: imageResult.type,
                                      name: "image"
                                    });
                                    console.log(file);
                                    setFieldValue("photo", file);
                                  }
                                };
                                find();
                              }
                            }
                          )}
                      >
                        <Text style={[wOForm.photoHandlerText, {marginBottom: -12}]}>Add Image</Text>
                      </NativeButton>}
                  </Field>
                </Content>
              </View>
              {/* <View style={wOForm.imgCardBot}> */}
              {/* <Field
                                    name="photo"
                                    title="Photo from Camera"
                                    component={CameraField}
                                    style={wOForm.imgUpload}
                                    titleStyle={wOForm.statusButtonsTextActive}
                                    buttonStyle={wOForm.submitButton}
                                />
                            </View> */}
            </View>
            <View>
              <Button
                onPress={handleSubmit}
                buttonStyle={wOForm.submitButton}
                titleStyle={wOForm.statusButtonsTextActive}
                title="Submit"
              />
            </View>
          </View>
        </ScrollView>}
    />
  );
};

export default EditWorkOrder;