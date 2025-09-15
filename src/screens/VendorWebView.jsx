// screens/VendorWebView.js
import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const VendorWebView = () => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {
                    isLoading && (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size={"large"} color={"#000"} />
                        </View>
                    )
                }
                <WebView
                    source={{ uri: 'https://vendor.ilovesambhal.com/' }}
                    onLoad={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback={true}
                    originWhitelist={['*']}
                    allowFileAccess={true}
                    allowFileAccessFromFileURLs={true}
                    allowUniversalAccessFromFileURLs={true}
                    mixedContentMode="always"
                    keyboardDisplayRequiresUserAction={false}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    }
});

export default VendorWebView;
