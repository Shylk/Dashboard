#!/bin/bash

sudo docker build -t server ./

sudo docker image tag server shylk/server:latest

sudo docker push shylk/server
