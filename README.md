# HyperSpace Project Setup and Running Instructions

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You must have Docker and Docker Compose installed on your machine. If you haven't installed Docker Compose yet, please follow the installation guide below.

### Installing Docker Compose

If you haven't installed Docker Compose, you can download it from the official Docker documentation [here](https://docs.docker.com/compose/install/). Follow the instructions for your operating system.

## Running the Project

To run the project locally, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `docker-compose up` to start the application containers.

The application will be available at `http://localhost:3000`.

## Adding Items

To add items to list through the Python backend, you can use the following cURL command:

```bash
curl --header "Content-Type: application/json" \
--request POST \
--data '{"name":"Your item description here"}' \
http://localhost:8000/items
```

Replace `"Your item description here"` with the actual item description you wish to add.

## Stopping the Application

To stop the application, press `Ctrl + C` in the terminal where you ran `docker-compose up`. This will stop and remove the containers defined in your `docker-compose.yml` file.

