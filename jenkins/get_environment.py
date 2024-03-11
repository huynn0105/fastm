import os

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
CONFIGS_FILE = "../app/constants/configs.js"

ANDROID_STRINGS_FILE = "../android/app/src/main/res/values/strings.xml"
ANDROID_GRADLE_FILE = "../android/app/build.gradle"
ANDROID_FIREBASE_FILE = '../android/app/google-services.json'

environment = "dev"
filein = open(CURRENT_PATH + '/' + CONFIGS_FILE, 'r')
content = filein.read()
filein.close()

env_begin = content.find("export const environment")
if env_begin < 0:
  exit(0)

env_equal_sign = content.find("=", env_begin + len("export const environment")) 
if env_equal_sign < 0:
  exit(0)

env_end = content.find(";", env_equal_sign + len("="))
if env_end < 0:
  exit(0)

env = content[env_equal_sign + 1 : env_end].strip()
if env == "'DEV'":
  environment = "dev"
else:
  environment = "prod"

print environment
# return environment


