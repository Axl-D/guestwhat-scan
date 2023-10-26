import React, { useRef, useEffect } from "react";
import { Text, Animated, View, PanResponder, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const SlideInPopUp = ({ participant, onDismiss }) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: Dimensions.get("window").height })).current;

  useEffect(() => {
    console.log("SlideInPopUp mounted");
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dy > 50) {
        Animated.timing(pan.y, {
          toValue: Dimensions.get("window").height,
          duration: 300,
          useNativeDriver: false,
        }).start(onDismiss);
      } else {
        Animated.spring(pan.y, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <Animated.View {...panResponder.panHandlers} style={[pan.getLayout(), styles.card]}>
      <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
        <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>
      <Text>{participant?.first_name ?? "0"}</Text>
      <Text>{participant?.last_name ?? "0"}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default SlideInPopUp;
