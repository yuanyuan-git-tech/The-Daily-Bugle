FROM httpd:latest

COPY . /usr/local/apache2/htdocs/

RUN echo "Alias /dailybugle /usr/local/apache2/htdocs/" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80