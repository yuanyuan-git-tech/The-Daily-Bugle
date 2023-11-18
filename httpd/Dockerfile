FROM httpd:latest

COPY . /usr/local/apache2/htdocs/

RUN echo "Alias /dailybugle /usr/local/apache2/htdocs/" >> /usr/local/apache2/conf/httpd.conf
RUN echo "LoadModule proxy_module modules/mod_proxy.so" >> /usr/local/apache2/conf/httpd.conf
RUN echo "LoadModule proxy_http_module modules/mod_proxy_http.so" >> /usr/local/apache2/conf/httpd.conf
RUN echo "ProxyPass /auth_node http://auth_node:3001" >> /usr/local/apache2/conf/httpd.conf
RUN echo "ProxyPassReverse /auth_node http://auth_node:3001" >> /usr/local/apache2/conf/httpd.conf
RUN echo "ProxyPass /article_node http://article_node:3000" >> /usr/local/apache2/conf/httpd.conf
RUN echo "ProxyPassReverse /article_node http://article_node:3000" >> /usr/local/apache2/conf/httpd.conf
RUN echo "ProxyPass /ads_node http://ads_node:3002" >> /usr/local/apache2/conf/httpd.conf
RUN echo "ProxyPassReverse /ads_node http://ads_node:3002" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80