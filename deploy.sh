#!/usr/bin/env sh

mkdir build
mv * build
tar -czf metocean.tgz build
export SSHPASS=$DEPLOY_PASS
sshpass -e scp metocean.tgz $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/packages
sshpass -e ssh $DEPLOY_USER@$DEPLOY_HOST $DEPLOY_PATH/scripts/deployMetOcean.sh
