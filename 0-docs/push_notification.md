### PUSH NOTIFICATION STRUCTURE
https://firebase.google.com/docs/cloud-messaging/send-message#send_messages_using_the_legacy_app_server_protocols
https://firebase.google.com/docs/cloud-messaging/http-server-ref#notification-payload-support

#### FCM SEND
##### SERVER SEND:
for fcm payload:
```json
{
   "to": "...",
   "content_available" : true,
   "notification" : {
       "title": "this is title",
       "body": "this is message's body"
   },
   "data": {
   		"type": 1,
   		"extra_data": {
   			"web_link": "this is hidden props",
   			"app_link": "this is hidden props"
   		}
   }
}
```
##### SERVER SEND FOR SILENT:
for fcm payload:
```json
{
   "to": "...",
   "content_available" : true,
   "data": {
   		"type": 1,
   }
}
```



##### CLIENT RECEIVE:
iOS onMessage:
```json
[
  {
    "aps": {
      "content-available": "1",
      "alert": {
        "title": "this is title",
        "body": "this is message's body"
      }
    },
    "type": 1,
    "extra_data": {...}
  }
]
```

Android onMessage:
```json
[
  {
    "fcm": {
      "action": null,
      "tag": null,
      "icon": null,
      "color": null,
      "title": this is title,
      "body": this is message's body
    },
    "type": 1,
    "extra_data": {...}
  }
]
```

##### FORCE LOGOUT:
iOS onMessage:
```json
[
  {
    "aps": {
      "content-available": "1",
    },
    "type": 1000,
  }
]
```
Android onMessage:
```json
[
  {
    "fcm": {
      "action": null,
      "tag": null,
      "icon": null,
      "color": null,
    },
    "type": 1000,
  }
]
```

#### PLAIN TEXT
```json
{
  "to": "",
  "content_available" : true,
  "notification" : {
    "title" : "Thong bao thang 9",
    "body" : "Don hang da duoc cap nhat"
  },
  "data": {
    "type": 1,
  }
}
```

#### LINK TO WEB
```json
{
  "to": "",
  "content_available" : true,
  "notification" : {
    "title" : "Thong bao thang 9",
    "body" : "Don hang da duoc cap nhat"
  },
  "data": {
    "type": 2,
    "extra_data": {
      "screen_title": "web", (opt) // for display as a navigation bar title on app
      "url": "https://link..." // web link
    }
  }
}
```

#### LINK TO WEB STACK
```json
{
  "to": "",
  "content_available" : true,
  "notification" : {
    "title" : "Thong bao thang 9",
    "body" : "Don hang da duoc cap nhat"
  },
  "data": {
    "type": 3,
    "extra_data": {
      "screen_title": "web", (opt) // for display as a navigation bar title on app
      "urls_stack": [ // list of urls must be open in order
        "https://link1",
        "https://link2,https://link3"
      ]
    }
  }
}
```

#### LINK TO NEWS
```json
{
  "to": "",
  "content_available" : true,
  "notification" : {
    "title" : "Thong bao thang 9",
    "body" : "Don hang da duoc cap nhat"
  },
  "data": {
    "type": 10,
    "extra_data": {
      "title": "web", (opt) // for display as a navigation bar title on app
      "news": {...} // news object
    }
  }
}
```

#### LINK TO MONEY HISTORY
```json
{
  "to": "",
  "content_available" : true,
  "notification" : {
    "title" : "Thong bao thang 9",
    "body" : "Don hang da duoc cap nhat"
  },
  "data": {
    "type": 11,
    "extra_data": {}
  }
}
```

#### LINK TO POINTS HISTORY
```json
{
  "to": "",
  "content_available" : true,
  "notification" : {
    "title" : "Thong bao thang 9",
    "body" : "Don hang da duoc cap nhat"
  },
  "data": {
    "type": 12,
    "extra_data": {}
  }
}
```


### SEND TO
https://firebase.google.com/docs/cloud-messaging/send-message

#### SEND TO SINGLE DEVICE
```json
https://fcm.googleapis.com/fcm/send
Content-Type:application/json
Authorization:key=AIzaSyZ-1u...0GBYzPu7Udno5aA

{ "data": {
    "score": "5x1",
    "time": "15:10"
  },
  "to" : "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1..."
}
```

#### SEND TO TOPICS

##### SINGLE TOPIC
```json
https://fcm.googleapis.com/fcm/send
Content-Type:application/json
Authorization:key=AIzaSyZ-1u...0GBYzPu7Udno5aA
{
  "to": "/topics/foo-bar",
  "data": {
    "message": "This is a Firebase Cloud Messaging Topic Message!",
   }
}
```

##### MANY TOPICS
```json
https://fcm.googleapis.com/fcm/send
Content-Type:application/json
Authorization:key=AIzaSyZ-1u...0GBYzPu7Udno5aA
{
  "condition": "'dogs' in topics || 'cats' in topics",
  "data": {
    "message": "This is a Firebase Cloud Messaging Topic Message!",
   }
}
```