FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y nginx nginx-extras
RUN rm /etc/nginx/sites-enabled/*

VOLUME /media
EXPOSE 80

CMD nginx -g 'daemon off;'
