### Appay Database Rules:

#### Normal Security Level (CURRENT USE)
---
```json
{
  "rules": {
    "chat": {
      "phonenumbers_user": {
        // can read any
        ".read": "auth != null",
        // can write any
        ".write": "auth != null"
      },
      "threads": {
        "$threadID": {
          // can only read the thread if they belongs to that thread
          ".read": "auth != null && root.child('chat/threads/' + $threadID + '/users/user_' + auth.uid).exists()",
          // can write to any
          ".write": "auth != null"
        }
      },
      "threads_messages": {
        "$threadID": {
          // can only read the thread's messages if they belongs to that thread
          ".read": "auth != null && root.child('chat/threads/' + $threadID + '/users/user_' + auth.uid).exists()",
          // can only write the thread's messages if they belongs to that thread
          ".write": "auth != null && root.child('chat/threads/' + $threadID + '/users/user_' + auth.uid).exists()"
        }
      },
      "users": {
        "$userID": {
          // can only read their own user's data
          ".read": "auth != null && $userID === 'user_' + auth.uid",
          // can only read their own user's data
          ".write": "auth != null && $userID === 'user_' + auth.uid"
        }
      },
      "users_presence": {
        "$userID": {
          // can read any presence
          ".read": "auth != null",
          // can only write their own presence
          ".write": "auth != null && $userID === 'user_' + auth.uid"
        }
      },
      "users_threads": {
        "$userID": {
          // can only read their own threads
          ".read": "auth != null && $userID === 'user_' + auth.uid",
          // can write to all
          ".write": "auth != null"
        }
      }
    }
  }
}
```

#### Strictly Security Level
```json
{
  "rules": {
    "chat": {
      "phonenumbers_user": {
        // can read any
        ".read": "auth != null",
        // can write any
        ".write": "auth != null"
      },
      "threads": {
        "$threadID": {
          // can only read the thread if they belongs to that thread
          ".read": "auth != null && root.child('chat/threads/' + $threadID + '/users/user_' + auth.uid).exists()",
          // can write to any
          ".write": "auth != null"
        }
      },
      "threads_messages": {
        "$threadID": {
          // can only read the thread's messages if they belongs to that thread
          ".read": "auth != null && root.child('chat/threads/' + $threadID + '/users/user_' + auth.uid).exists()",
          // can only write the thread's messages if they belongs to that thread
          ".write": "auth != null && root.child('chat/threads/' + $threadID + '/users/user_' + auth.uid).exists()"
        }
      },
      "users": {
        "$userID": {
          // can only read their own user's data
          ".read": "auth != null && $userID === 'user_' + auth.uid",
          // can only read their own user's data
          ".write": "auth != null && $userID === 'user_' + auth.uid"
        }
      },
      "users_presence": {
        "$userID": {
          // can read any presence
          ".read": "auth != null",
          // can only write their own presence
          ".write": "auth != null && $userID === 'user_' + auth.uid"
        }
      },
      "users_threads": {
        "$userID": {
          // user can read their own threads
          ".read": "auth != null && $userID === 'user_' + auth.uid",
          "threads": {
           	"$threadID": {
              // user can only write to the the thread which they're in
              ".write": "auth != null && root.child('chat/threads/' + $threadID + '/users/' + $userID).exists()",
            } 
          }
        }
      }
    }
  }
}
```

### Docs
---
+ [docs/security-intro](https://firebase.google.com/docs/database/security/)
+ [docs/securing-data](https://firebase.google.com/docs/database/security/securing-data)

#### Read and Write Rules Cascade

> Note: Shallower security rules override rules at deeper paths. Child rules can only grant additional privileges to what parent nodes have already declared. They cannot revoke a read or write privilege.

+ `.read`, `.write` work from top-down
+ children **CANNOT** revoke the permissions its parent already granted

Example:
```json
{
  "rules": {
    "chat": {
      ".read": "auth != null",
      ".write": "auth != null",
      "users": {
      	"$uid": {
          ".read": "$uid === 'user_' + auth.uid",
          ".write": "$uid === 'user_' + auth.uid"
        }
      }
    }
  }
}
```
> Although the `users` specify a user can only read its own data. It will not effect because the parent already granted all `.read`, `.write` for any logged in user
