import { FlatList, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation } from 'react-native'
import React, { useState } from 'react'
import { Fonts } from '../../utils/typography'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { RFValue } from 'react-native-responsive-fontsize'
import { SCREEN_HEIGHT } from '../../utils/dimensions'
import Animated, { LinearTransition } from 'react-native-reanimated'

const faq = [
  {
    question: "What is Footfall?",
    answer: "Footfall is a platform that allows you to earn money by referring people to the app."
  },
  {
    question: "What is Footfall?",
    answer: "Footfall is a platform that allows you to earn money by referring people to the app."
  },
  {
    question: "What is Footfall?",
    answer: "Footfall is a platform that allows you to earn money by referring people to the app."
  },
]
const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null)
  const toggleItem = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(index);
  };
  return (
    <View>
      <Animated.FlatList
        data={faq}
        renderItem={({ item, index }) => <View style={{ marginBottom: 10 }}>
          <TouchableOpacity style={[
            styles.questionContainer,
            activeIndex === index && {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#ffffff25'
            }
          ]} onPress={() => toggleItem(index)}
            activeOpacity={0.9}
          >
            <Text style={styles.question}>{item.question}</Text>
            <Ionicon name="chevron-down" size={20} color="#fff" />
          </TouchableOpacity>
          {activeIndex === index && <View style={styles.itemContainer}>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>}
        </View>}
        itemLayoutAnimation={LinearTransition}
      />
    </View>
  )
}

export default Faq

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff25',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  questionContainer: {
    padding: 10,
    gap: 5,
    backgroundColor: '#ffffff25',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  question: {
    fontSize: RFValue(16, SCREEN_HEIGHT),
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Fonts.primary_SemiBold
  },
  answer: {
    fontSize: 14,
    color: '#fff',
    fontFamily: Fonts.primary_Regular
  }
})