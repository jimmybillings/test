#!/bin/bash
#
# Jenkins will make available several environment variables.
# 
# GIT_BRANCH
#   Name of branch being built
# BUILD_NUMBER
#   The current build number, such as "153"
# JENKINS_HOME
#   The absolute path of the directory assigned on the master node for Jenkins to store data.
# JENKINS_URL
#   Full URL of Jenkins, like http://server:port/jenkins/ (note: only available if Jenkins URL set in system configuration)
# BUILD_URL
#   Full URL of this build, like http://server:port/jenkins/job/foo/15/ (Jenkins URL must be set)
# JOB_URL
#   Full URL of this job, like http://server:port/jenkins/job/foo/ (Jenkins URL must be set)
#
# For a full list, see http://build.thoughtequity.com:8080/jenkins/env-vars.html/
# set -x

baseDir=$( dirname "$0" )

artifactName=wazee-ui

baseDir=$( dirname "$0" )

if [ -n "$JENKINS_HOME" ]; then
  # add jenkins tools to the path
  export PATH=/home/video/bin/nodejs-v5.5.0/bin:/home/video/bin/tools/jenkins:$PATH

  # Special PhantomJS build that works with Centos
  #export PHANTOMJS_BIN=/home/video/bin/phantomjs.2.0.1.patch_12506

  # Setup a tmpdir on a volume with more space
  export TMPDIR=/home/video/tmp/$artifactName
fi

clean_up() {
  # Remove anything in the tmp directory
  if [ -n "$JENKINS_HOME" ]; then
    rm -rf /home/video/tmp/$artifactName
    rm -rf $TMPDIR/wazee-ui-library
  fi
  restore-maven-version.sh
}
trap clean_up EXIT 

build_prod() {
  npm run build.prod || exit 1

  # create build.properties file
  set-maven-build-information.sh --path=${baseDir}/dist/prod --version=${buildVersion}

  zipFile=target/$artifactName-${buildVersion}.zip

  # package into a zip
  mkdir -p ${baseDir}/target
  pushd dist/prod
  zip -r ../../${zipFile} . || exit 1
  popd  

  # Only deploy & tag if we're on Jenkins
  if [ -n "$JENKINS_HOME" ]; then

    # Push to our nexus server
    deploy-to-nexus.sh --version=${buildVersion} --group="com.wazeedigital.wazee-ui" --artifact=wazee-ui --file=target/wazee-ui-${buildVersion}.zip  || exit 1

    # tag the repository with this build version so we can find it again
    add-and-push-git-tag.sh    || exit 1
    restore-maven-version.sh   || exit 1

    # put the calculated artifact version into a properties file so jenkins can find it
    create-jenkins-properties.sh ${buildVersion}
  fi
  return 0
}

build_library() {
  npm run build.library  || exit 1

  # Only deploy & tag if we're on Jenkins
  if [ -n "$JENKINS_HOME" ]; then
    # push to github. ||| NOTE: Eventually we want to move this to the nexus repo, but we're waiting on
    # nexus to get upgraded to include support for node modules
    git clone https://github.com/t3mediacorp/wazee-ui-library $TMPDIR/wazee-ui-library
    rm -rf $TMPDIR/wazee-ui-library/*
    mv dist/library/* $TMPDIR/wazee-ui-library
    pushd $TMPDIR/wazee-ui-library
    git commit -m "Version ${buildVersion}"  $TMPDIR/wazee-ui-library
    git push origin $TMPDIR/wazee-ui-library
    popd
  fi

  return 0
}

# debugging information
print-build-environment.sh

# update the artifact with the correct build version
buildVersion=$(update-maven-version-for-build.sh)  || exit 1 

# Install modules
npm install

# Build the dev webapp
build_prod 

# build the UI library
build_library

