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

# add jenkins tools to the path
PATH=/home/video/bin/tools/jenkins:$PATH
# add latest node to path
PATH=/home/video/bin/node-v5.4.1-linux-x64/bin:$PATH

# Special PhantomJS build that works with Centos
export PHANTOMJS_BIN=/home/video/bin/phantomjs.2.0.1.patch_12506

cleanup() {
  echo "Removing backup package.json"
  restore-package-version.sh
}

trap cleanup EXIT

# debugging information
print-build-environment.sh

# update the artifact with the correct build version
buildVersion=$(update-package-version-for-build.sh)                                      || exit 1 

# Build
npm install
npm run build.prod                                                                       || exit 1

# create build.properties file
set-maven-build-information.sh --path=${baseDir}/dist/prod --version=${buildVersion}     || exit 1

zipFile=target/wazee-ui-${buildVersion}.zip

# package into a zip
mkdir -p ${baseDir}/target
pushd dist/prod
zip -r ../../${zipFile} .                                                                || exit 1
popd


# Push to our nexus server
deploy-to-nexus.sh --version=${buildVersion} --artifact=wazee-ui --file=${zipFile}       || exit 1

# tag the repository with this build version so we can find it again
add-and-push-git-tag.sh "$buildVersion"                                                  || exit 1

# put the calculated artifact version into a properties file so jenkins can find it
echo "ARTIFACT_VERSION=${buildVersion}" > jenkins.properties
