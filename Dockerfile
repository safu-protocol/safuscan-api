# The image is built on top of one that has node preinstalled
FROM node:16

ARG TYPE=start-api

# ARG is only available at build time but we need at run time
ENV TYPE ${TYPE}

# Create app directory
WORKDIR /usr/src/app

# Copy all files into the container
COPY . .

# Install dependencies
RUN npm install

# Open appropriate port
EXPOSE 3000

# Start the application
ADD ${TYPE}.sh /
RUN chmod +x /${TYPE}.sh

CMD ["sh", "-c", "/${TYPE}.sh"]