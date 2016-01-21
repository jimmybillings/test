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


# add jenkins tools to the path
PATH=/home/video/bin/tools/jenkins:$PATH
# add latest node to path
PATH=/home/video/bin/node-v5.4.1-linux-x64/bin:$PATH

# debugging information
print-build-environment.sh

# deploy the artifact with the correct build version
buildVersion=$(update-maven-version-for-build.sh)

# TODO: Update package.json with version/build info

# Build
npm install
npm run build

# tag the repository with this build version so we can find it again
#add-and-push-git-tag.sh "$buildVersion"
