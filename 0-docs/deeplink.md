### DEEP LINK

#### Tutorial
- [https://facebook.github.io/react-native/docs/linking.html](https://facebook.github.io/react-native/docs/linking.html)
- [https://medium.com/react-native-training](https://medium.com/react-native-training/deep-linking-your-react-native-app-d87c39a1ad5e)
- [https://developer.android.com/training/app-links/deep-linking](https://developer.android.com/training/app-links/deep-linking)

#### APPAY DEEP LINKS
- base url: `mfastmobile://`


##### Open a Single Chat

- `mfastmobile://chat/single?userID=2047`
```
- open a single chat to user 2047
- the chat is not need to be created before
```

- `mfastmobile://chat/single?userID=2047&message=hello`
```
- open a single chat to user 2047 with a message
- pre populdate a message
```


##### Open a Group Chat

- `mfastmobile://chat/group?threadID=111222&message=hello`
```
open a group chat, the chat has to be created before
```
