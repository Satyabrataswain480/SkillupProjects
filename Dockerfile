# Use the official NGINX image as the base image
FROM nginx:latest
WORKDIR /html-app

# Copy your HTML files to the Nginx default directory
COPY index.html /usr/share/nginx/html

# Expose port 80 to allow access to the web server
EXPOSE 80