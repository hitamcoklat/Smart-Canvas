module.exports = {
    assets: ['react-native-vector-icons'],
    dependencies: {
        'react-native-vector-icons': {
            platforms: {
                android: null, // disable Android platform, other platforms will still autolink
            },
        },
    },    
};