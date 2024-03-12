# There're two config: 'dev', 'prod', specify by the CONFIGS_FILE in app/constants/configs.js
# This file help to change these values below according to config
# - CFBundleDisplayName (aka App Name)
# - BundleID
# - Provisioning Profile
# - Firebase Plist file


import os
import glob
import re
from shutil import copyfile

# Contants

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
CONFIGS_FILE = "../app/constants/configs.js"

IOS_INFO_FILE = "../ios/mfast/Info.plist"
IOS_PROJECT_FILE = "../ios/mfast.xcodeproj/project.pbxproj"
IOS_FIREBASE_FILE = '../ios/mfast/GoogleService-Info.plist'
ENV_FILE = "../.env"
APP_DELEGATE_FILE = "../ios/mfast/AppDelegate.m"

# App Name

DEV_APP_NAME = "MFast(DEV)"
STAGING_APP_NAME = "MFast(STAGING)"
PROD_APP_NAME = "MFast"

# Deeplink scheme

DEV_DEEPLINK_SCHEME = "mfastmobiledev"
STAGING_DEEPLINK_SCHEME = "mfastmobile"
PROD_DEEPLINK_SCHEME = "mfastmobile"

DEV_DEEPLINK_SCHEME_PATH = "mfastmobiledev://"
STAGING_DEEPLINK_SCHEME_PATH = "mfastmobile://"
PROD_DEEPLINK_SCHEME_PATH = "mfastmobile://"

# Firebase files

DEV_FIREBASE_FILE = "../ios/mfast/GoogleService-Info-Dev.plist"
STAGING_FIREBASE_FILE = "../ios/mfast/GoogleService-Info-Staging.plist"
PROD_FIREBASE_FILE = "../ios/mfast/GoogleService-Info-Prod.plist"

# Provisioning Profiles info need to be change it was rea-generate

DEV_PRODUCT_BUNDLE_IDENTIFIER = "com.digitel.mfastdev"
DEV_PROVISIONING_PROFILE_DEBUG = "\"88400a01-2803-4f3e-91fc-81f1544070b3\""
DEV_PROVISIONING_PROFILE_SPECIFIER_DEBUG = "\"MFastDEV\""
DEV_PROVISIONING_PROFILE_RELEASE = "\"941ec1c0-25a8-43f3-8255-d71023c58f66\""
DEV_PROVISIONING_PROFILE_SPECIFIER_RELEASE = "\"MFastDEVAdHoc\""
DEV_MOENGAGE_KEY = "9QBXCRQ6ZYJBYYXZQMZAG3UM_DEBUG"
DEV_CODEPUSH_KEY = "xU2d07j99FwxILDhrBoadwuShbsMPorw4W36j"

STAGING_PRODUCT_BUNDLE_IDENTIFIER = "com.digitel.mfaststaging"
STAGING_PROVISIONING_PROFILE_DEBUG = "\"acaf7548-b14a-41ac-ac2c-1a431442cd26\""
STAGING_PROVISIONING_PROFILE_SPECIFIER_DEBUG = "\"MFastStaging\""
STAGING_PROVISIONING_PROFILE_RELEASE = "\"9f26c600-dfc5-4da9-9e5e-097b769e9731\""
STAGING_PROVISIONING_PROFILE_SPECIFIER_RELEASE = "\"MFastStagingAdHoc\""
STAGING_MOENGAGE_KEY = "9QBXCRQ6ZYJBYYXZQMZAG3UM_DEBUG"
STAGING_CODEPUSH_KEY = "kagiRKFwIessYq6nARr3Q9hlxQrO4stpA_NKN"

PROD_PRODUCT_BUNDLE_IDENTIFIER = "com.digitel.mfast"
PROD_PROVISIONING_PROFILE_DEBUG = "\"013cc61a-df76-44b8-ab56-b31d8a6ad59e\""
PROD_PROVISIONING_PROFILE_SPECIFIER_DEBUG = "\"MFast\""
PROD_PROVISIONING_PROFILE_RELEASE = "\"9f06b168-40f7-46a3-971c-1f0a5cffac0b\""
PROD_PROVISIONING_PROFILE_SPECIFIER_RELEASE = "\"MFastAppStore\""
PROD_MOENGAGE_KEY = "9QBXCRQ6ZYJBYYXZQMZAG3UM"
PROD_CODEPUSH_KEY = "lAh8WFcVpk7Zf_HTiedgGx77b1kkz7-uUXuOz"

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
    return content

  key_end_index = content.find(key_end, key_begin_index)
  if key_end_index < 0:
    return content

  newContent = content[0:key_begin_index] + value + content[key_end_index:]
  return newContent


# config ios info plist
# config bundle display name to appropriate env
def config_ios_info_file(env):

  filein = open(CURRENT_PATH + '/' + IOS_INFO_FILE, 'r')
  content = filein.read()
  filein.close()

  app_name_begin_index = content.find("<key>CFBundleDisplayName</key>")
  if app_name_begin_index < 0:
    exit(0)

  app_name = PROD_APP_NAME if env == 'prod' else STAGING_APP_NAME if env == 'staging' else DEV_APP_NAME
  relace_value = "<string>" + app_name
  content = replace_value_in_content(content, app_name_begin_index, "<string>", "</string>", relace_value)

  moengage_key_begin_index = content.find("<key>MoEngage_APP_ID</key>")
  if moengage_key_begin_index <0:
    exit(0)

  moengage_key = PROD_MOENGAGE_KEY if env == 'prod' else STAGING_MOENGAGE_KEY if  env == 'staging' else DEV_MOENGAGE_KEY
  replace_value = "<string>" + moengage_key
  content = replace_value_in_content(content, moengage_key_begin_index, "<string>", "</string>", replace_value)

  codepush_key_begin_index = content.find("<key>CodePushDeploymentKey</key>")
  if(codepush_key_begin_index<0):
    exit(0)

  codepush_key = PROD_CODEPUSH_KEY if env == 'prod' else STAGING_CODEPUSH_KEY if  env == 'staging' else DEV_CODEPUSH_KEY
  replace_value_codepush = "<string>" + codepush_key
  content = replace_value_in_content(content, codepush_key_begin_index, "<string>", "</string>", replace_value_codepush)
  
  deeplink_scheme_key_begin_index = content.find("<key>CFBundleURLSchemes</key>")
  if(deeplink_scheme_key_begin_index<0):
    exit(0)

  deeplink_scheme_key = PROD_DEEPLINK_SCHEME if env == 'prod' else STAGING_DEEPLINK_SCHEME if env == 'staging' else DEV_DEEPLINK_SCHEME
  replace_value_deeplink_scheme = "<string>" + deeplink_scheme_key
  content = replace_value_in_content(content, deeplink_scheme_key_begin_index, "<string>", "</string>", replace_value_deeplink_scheme)

  # overwrite file
  fileout = open(CURRENT_PATH + '/' + IOS_INFO_FILE, 'w+')
  fileout.write(content)
  fileout.close()



# config ios project file
# config bundleID, provisioning profile to appropriate env
def config_ios_project_file(env):

  # read file content
  filein = open(CURRENT_PATH + '/' + IOS_PROJECT_FILE, 'r')
  content = filein.read()
  filein.close()

  # config DEBUG
  debug_begin = content.find("/* Debug */ = {")
  if debug_begin < 0:
    return

  bundle_id = PROD_PRODUCT_BUNDLE_IDENTIFIER if env == 'prod' else STAGING_PRODUCT_BUNDLE_IDENTIFIER if env == 'staging' else DEV_PRODUCT_BUNDLE_IDENTIFIER
  relace_value = "PRODUCT_BUNDLE_IDENTIFIER = " + bundle_id + ";"
  content = replace_value_in_content(content, debug_begin, "PRODUCT_BUNDLE_IDENTIFIER", "\n", relace_value)

  provisioning_profile = PROD_PROVISIONING_PROFILE_DEBUG if env == 'prod' else STAGING_PROVISIONING_PROFILE_DEBUG if env == 'staging' else DEV_PROVISIONING_PROFILE_DEBUG
  relace_value = "PROVISIONING_PROFILE = " + provisioning_profile + ";"
  content = replace_value_in_content(content, debug_begin, "PROVISIONING_PROFILE", "\n", relace_value)

  provisioning_profile_spec = PROD_PROVISIONING_PROFILE_SPECIFIER_DEBUG if env == 'prod' else STAGING_PROVISIONING_PROFILE_SPECIFIER_DEBUG if env == 'staging' else DEV_PROVISIONING_PROFILE_SPECIFIER_DEBUG
  relace_value = "PROVISIONING_PROFILE_SPECIFIER = " + provisioning_profile_spec + ";"
  content = replace_value_in_content(content, debug_begin, "PROVISIONING_PROFILE_SPECIFIER", "\n", relace_value)

  # config RELEASE
  release_begin = content.find("/* Release */ = {")
  if release_begin < 0:
    return

  bundle_id = PROD_PRODUCT_BUNDLE_IDENTIFIER if env == 'prod' else STAGING_PRODUCT_BUNDLE_IDENTIFIER if env == 'staging' else DEV_PRODUCT_BUNDLE_IDENTIFIER
  relace_value = "PRODUCT_BUNDLE_IDENTIFIER = " + bundle_id + ";"
  content = replace_value_in_content(content, release_begin, "PRODUCT_BUNDLE_IDENTIFIER", "\n", relace_value)

  provisioning_profile = PROD_PROVISIONING_PROFILE_RELEASE if env == 'prod' else STAGING_PROVISIONING_PROFILE_RELEASE if env == 'staging' else DEV_PROVISIONING_PROFILE_RELEASE
  relace_value = "PROVISIONING_PROFILE = " + provisioning_profile + ";"
  content = replace_value_in_content(content, release_begin, "PROVISIONING_PROFILE", "\n", relace_value)

  provisioning_profile_spec = PROD_PROVISIONING_PROFILE_SPECIFIER_RELEASE if env == 'prod' else STAGING_PROVISIONING_PROFILE_SPECIFIER_RELEASE if env == 'staging' else DEV_PROVISIONING_PROFILE_SPECIFIER_RELEASE
  relace_value = "PROVISIONING_PROFILE_SPECIFIER = " + provisioning_profile_spec + ";"
  content = replace_value_in_content(content, release_begin, "PROVISIONING_PROFILE_SPECIFIER", "\n", relace_value)

  # overwrite file
  fileout = open(CURRENT_PATH + '/' + IOS_PROJECT_FILE, 'w+')
  fileout.write(content)
  fileout.close()

  # print content
  return


# config firebase service file
# config the firebase plist file to appropriate env
def config_ios_firebase(env):

  firebase_plist_source_file = ''
  firebase_plist_dest_file =  CURRENT_PATH + '/' + IOS_FIREBASE_FILE

  if env == "dev":
    firebase_plist_source_file = CURRENT_PATH + '/' + DEV_FIREBASE_FILE
  elif env == "staging":
    firebase_plist_source_file = CURRENT_PATH + '/' + STAGING_FIREBASE_FILE
  else:
    firebase_plist_source_file = CURRENT_PATH + '/' + PROD_FIREBASE_FILE

  if len(firebase_plist_source_file) > 0:
    copyfile(firebase_plist_source_file, firebase_plist_dest_file)

def config_ios_env(env):

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
def config_app_delegate_file(env):

  filein = open(CURRENT_PATH + '/' + APP_DELEGATE_FILE, 'r')
  content = filein.read()
  filein.close()

  deeplink_scheme_path_begin_index = content.find("NSString * deeplinkScheme =")
  if(deeplink_scheme_path_begin_index<0):
    exit(0)


  deeplink_scheme_key = PROD_DEEPLINK_SCHEME_PATH if env == 'prod' else STAGING_DEEPLINK_SCHEME_PATH if env == 'staging' else DEV_DEEPLINK_SCHEME_PATH
  replace_value_deeplink_scheme ="NSString * deeplinkScheme = @\"" + deeplink_scheme_key +"\""
  content = replace_value_in_content(content, deeplink_scheme_path_begin_index, "",";", replace_value_deeplink_scheme)

  
  # overwrite file
  fileout = open(CURRENT_PATH + '/' + APP_DELEGATE_FILE, 'w+')
  fileout.write(content)
  fileout.close()



# --------------------------------------------------
# MAIN
# --------------------------------------------------

env = get_environment_config()

config_ios_info_file(env)

config_ios_project_file(env)

config_ios_firebase(env)

config_ios_env(env)

config_app_delegate_file(env)

