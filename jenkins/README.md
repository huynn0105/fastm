### Trigger jenkins cmd
~~~
sh invoke_build.sh all/build/test
~~~

- all: test + build -> fabric -> telegram
- build: just build -> fabric -> telegram
- test: just test -> telegram

### jenkins_build.sh
The script is run in jenkins server

### Release note
Will be add to release note in Fabric 
