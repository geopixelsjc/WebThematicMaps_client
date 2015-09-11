#!/bin/bash
# You must install sshpass:  sudo apt-get install sshpass

START=`date +%d/%m/%Y-%H:%M:%S`
LOG=./logs/`date +%Y-%m-%d`.log

#gulp

echo " " >> $LOG
echo " " >> $LOG
echo "|##############################################" >> $LOG
echo " Deploy iniciado: $START" >> $LOG

SRC_PATH="./dist"
REMOTE_PATH="/home/static/thematic/"
USER="root"
PASS="mlAvaVT6"
HOST="74.208.229.211"
SSH_STRING="$USER@$HOST:$REMOTE_PATH"

#rsync -avz -e ssh $SRC_PATH SSH_STRING >> $LOG
rsync -ratlz --rsh="sshpass -p $PASS ssh -o StrictHostKeyChecking=no -l $USER" $SRC_PATH  $REMOTE_PATH

#scp -r dist/* root@74.208.229.211:/home/static/thematic/

FINISH=`date +%d/%m/%Y-%H:%M:%S`

echo " Deploy finalizado: $FINISH" >> $LOG
echo "|##############################################" >> $LOG
echo " " >> $LOG
echo " " >> $LOG