#!/bin/bash

# Set unique project and siteName variables used in crux-ui-build.sh
project=wazee-ui
siteName=poc19

# Source the common build script - contains all relevent build steps
  # eventually this will just be executed from jenkins with siteName and project as args
source /opt/app/wazee/build-support/tools/jenkins/crux-ui-build.sh

bump_version

build_prod

# -------------------------------------------------------------------------------------------------- #
# 
# ###### BEFORE BUILDING A LIBRARY GO INTO THE SHARED MODULE AND COMMENT OUT THESE TWO LINES: 
# ###### 1. The import statement for StoreDevTools - import { StoreDevtoolsModule } from '@ngrx/store-devtools';
# ###### 2. The storeDevtoolsModule.instrument() item in the imports array.
# 
# build_library
# 
# -------------------------------------------------------------------------------------------------- #

commit_version