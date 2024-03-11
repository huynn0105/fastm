# configure app name (in strings.xml) & firebase info google-services.json
# to match with the environment setting in app/constants/configs.js
# *** developer still have to config the applicationId manually ***

import os
import glob
import re
from shutil import copyfile

# Contants

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
CONFIGS_FILE = "../app/constants/configs.js"

ANDROID_STRINGS_FILE = "../android/app/src/main/res/values/strings.xml"
ANDROID_GRADLE_FILE = "../android/app/build.gradle"
ANDROID_FIREBASE_FILE = '../android/app/google-services.json'
ANDROID_APPLICATION_FILE = '../android/app/src/main/java/com/digipay/mfast/MainApplication.java'
ENV_FILE = "../.env"

# App Name

DEV_APP_NAME = "MFast(DEV)"
STAGING_APP_NAME = "MFast(STAGING)"
PROD_APP_NAME = "MFast"

# Application Id

DEV_APPLICATION_ID = "\"com.digipay.mfastdev\""
STAGING_APPLICATION_ID = "\"com.digipay.mfaststaging\""
PROD_APPLICATION_ID = "\"com.digipay.mfast\""

# Deeplink scheme

DEV_DEEPLINK_SCHEME = "mfastmobiledev"
STAGING_DEEPLINK_SCHEME = "mfastmobile"
PROD_DEEPLINK_SCHEME = "mfastmobile"


# Firebase

DEV_FIREBASE_FILE = "../android/app/google-services-dev.json"
STAGING_FIREBASE_FILE = "../android/app/google-services-staging.json"
PROD_FIREBASE_FILE = "../android/app/google-services-prod.json"

# Moengage key

DEV_MOENGAGE_KEY = "\"9QBXCRQ6ZYJBYYXZQMZAG3UM_DEBUG\""
STAGING_MOENGAGE_KEY = "\"9QBXCRQ6ZYJBYYXZQMZAG3UM_DEBUG\""
PROD_MOENGAGE_KEY = "\"9QBXCRQ6ZYJBYYXZQMZAG3UM\""

DEV_CODEPUSH_KEY = "iMFvzv8v6Wifk8EHYrqWWrSVh-uYhWQzxWolc"
STAGING_CUDEPUSH_KEY = "V6wMSXYOXl0-l2Qi-cgX9jWW2MSc-OeoZXpdA"
PROD_CUDEPUSH_KEY = "U1jx7gz32R_P2-IJnru9wnAiGuv9c5QS0gznV"

# environment is 'dev', 'staging' or 'prod'
DEV_ENV_FILE = "../.env.dev"
STAGING_ENV_FILE = "../.env.staging"
PROD_ENV_FILE = "../.env.prod"

# --------------------------------------------------
# HELPER FUNCTIONS
# --------------------------------------------------

## read config file and get environment whether is 'dev' or 'prod'
def get_environment_config():
  
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
  elif env == "'STAGING'":
    environment = "staging"
  else:
    environment = "prod"

  # print environment
  return environment


# replace the text in content from key_begin t0 key_end with the value
# return the new content = [0:key_begin] + value + [key_end:]
def replace_value_in_content(content, search_from_index, key_begin, key_end, value):
  
  key_begin_index = content.find(key_begin, search_from_index)
  if key_begin_index < 0:
    # print "not found key_begin"
    return content

  key_end_index = content.find(key_end, key_begin_index)
  if key_end_index < 0:
    # print "not found key_end"
    return content

  newContent = content[0:key_begin_index] + value + content[key_end_index:]
  return newContent


# config app strings.xml
# - app_name
#
def config_android_strings_file(env):
  
  filein = open(CURRENT_PATH + '/' + ANDROID_STRINGS_FILE, 'r')
  content = filein.read()
  filein.close()

  app_name = PROD_APP_NAME if env == 'prod' else STAGING_APP_NAME if env == 'staging' else DEV_APP_NAME
  relace_value = "<string name=\"app_name\">" + app_name
  content = replace_value_in_content(content, 0, "<string name=\"app_name\">", "</string>", relace_value)

  deeplink_scheme_key = PROD_DEEPLINK_SCHEME if env == 'prod' else STAGING_DEEPLINK_SCHEME if env == 'staging' else DEV_DEEPLINK_SCHEME
  replace_value_deeplink_scheme = "<string name=\"deeplink_scheme\">" + deeplink_scheme_key
  content = replace_value_in_content(content, 0, "<string name=\"deeplink_scheme\">", "</string>", replace_value_deeplink_scheme)

  # re-write info file with new content
  # print content
  fileout = open(CURRENT_PATH + '/' + ANDROID_STRINGS_FILE, 'w+')
  fileout.write(content)
  fileout.close()


def config_android_codepush_key(env):
  
  filein = open(CURRENT_PATH + '/' + ANDROID_STRINGS_FILE, 'r')
  content = filein.read()
  filein.close()

  codepush_key = PROD_CUDEPUSH_KEY if env == 'prod' else STAGING_CUDEPUSH_KEY if env == 'staging' else DEV_CODEPUSH_KEY
  relace_value = "<string moduleConfig=\"true\" name=\"CodePushDeploymentKey\">" + codepush_key
  content = replace_value_in_content(content, 0, "<string moduleConfig=\"true\" name=\"CodePushDeploymentKey\">", "</string>", relace_value)


  # re-write info file with new content
  # print content
  fileout = open(CURRENT_PATH + '/' + ANDROID_STRINGS_FILE, 'w+')
  fileout.write(content)
  fileout.close()


# config android app build.gradle file
# - applicationId
#
def config_android_gradle_file(env):

  filein = open(CURRENT_PATH + '/' + ANDROID_GRADLE_FILE, 'r')
  content = filein.read()
  filein.close()

  application_id = PROD_APPLICATION_ID if env == 'prod' else STAGING_APPLICATION_ID if env == 'staging' else DEV_APPLICATION_ID
  relace_value = "applicationId " + application_id
  content = replace_value_in_content(content, 0, "applicationId ", "\n", relace_value)


  # re-write info file with new content
  # print content

  fileout = open(CURRENT_PATH + '/' + ANDROID_GRADLE_FILE, 'w+')
  fileout.write(content)
  fileout.close()
  



# config firebase service plist file
# - google-services.json
#
def config_android_firebase(env):

  firebase_plist_source_file = ''
  firebase_plist_dest_file =  CURRENT_PATH + '/' + ANDROID_FIREBASE_FILE

  if env == "dev":
    firebase_plist_source_file = CURRENT_PATH + '/' + DEV_FIREBASE_FILE
  elif env == "staging":
    firebase_plist_source_file = CURRENT_PATH + '/' + STAGING_FIREBASE_FILE
  else:
    firebase_plist_source_file = CURRENT_PATH + '/' + PROD_FIREBASE_FILE

  if len(firebase_plist_source_file) > 0:
    copyfile(firebase_plist_source_file, firebase_plist_dest_file)


# config mainApplication file


def config_moengage_key(env): 

  filein = open(CURRENT_PATH + '/' + ANDROID_APPLICATION_FILE, 'r')
  content = filein.read()
  filein.close()

  moengage_key = PROD_MOENGAGE_KEY if env == 'prod' else STAGING_MOENGAGE_KEY if env == 'staging' else DEV_MOENGAGE_KEY
  replace_value = "new MoEngage.Builder(this, " + moengage_key
  content = replace_value_in_content(content,0,"new MoEngage.Builder(this, ",", DataCenter.DATA_CENTER_1)", replace_value)

  fileout = open(CURRENT_PATH + '/' + ANDROID_APPLICATION_FILE, 'w+')
  fileout.write(content)
  fileout.close()

def config_android_env(env):

  env_source_file = ''
  env_dest_file =  CURRENT_PATH + '/' + ENV_FILE

  if env == "dev":
    env_source_file = CURRENT_PATH + '/' + DEV_ENV_FILE
  elif env == "staging":
    env_source_file = CURRENT_PATH + '/' + STAGING_ENV_FILE
  else:
    env_source_file = CURRENT_PATH + '/' + PROD_ENV_FILE

  if len(env_source_file) > 0:
    copyfile(env_source_file, env_dest_file)

  

# --------------------------------------------------
# MAIN
# --------------------------------------------------

env = get_environment_config()

config_android_strings_file(env)

config_android_gradle_file(env)

config_android_firebase(env)

config_moengage_key(env)

config_android_codepush_key(env)
  
config_android_env(env)
