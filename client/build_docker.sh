#!/bin/bash

sudo docker build -t client ./

sudo docker image tag client shylk/client:latest

sudo docker push shylk/client
