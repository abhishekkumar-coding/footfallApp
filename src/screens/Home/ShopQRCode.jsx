import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const ShopQRCode = ({ shopId, email , logo}) => {
    console.log("ShopId : ", shopId)
  const qrData = `shop_id=${shopId}&email=${email}`;

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Scan to view shop details:</Text> */}
      <QRCode
        value={qrData}
        size={130}
        linearGradient={['#8e2de2', '#4a00e0']} 
        enableLinearGradient
        eyeColor="#4a00e0"
        quietZone={10}
        logo={{ uri:logo }}
        logoSize={50}
        logoBackgroundColor="transparent"
        ecl="H"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#fff' },
});

export default ShopQRCode;
