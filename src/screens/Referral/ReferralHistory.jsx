import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useGetUserByIdQuery } from '../../features/auth/authApi'
import { useSelector } from 'react-redux'

const ReferralHistory = () => {
    const user = useSelector(state => state.user.user)
    const { data } = useGetUserByIdQuery(user?._id)
    console.log(data)
  return (
    <FlatList
      data={[1,2,3,4,5,6,7,8,9,7]}
      renderItem={({ item }) => <View style={styles.itemContainer}>
        <Text>ReferralHistory</Text>
      </View>}
    />
  )
}

export default ReferralHistory

const styles = StyleSheet.create({})