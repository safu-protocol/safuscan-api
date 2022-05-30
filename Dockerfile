# The image is built on top of one that has node preinstalled
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Copy all files into the container
COPY . .

# Install dependencies
RUN npm install

# Open appropriate port
EXPOSE 3000

# Start the application
ADD start-prod.sh /
RUN chmod +x /start-prod.sh

CMD ["/start-prod.sh"]