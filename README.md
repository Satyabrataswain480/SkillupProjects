text
# Jenkins Pipeline for Docker and Kubernetes Deployment

## Overview

This project contains a Jenkins pipeline that automates the process of building a Docker image from a simple HTML application, pushing the image to Docker Hub, and deploying the application to a Kubernetes cluster using Minikube. The pipeline also retrieves and displays the service URL for easy access to the deployed application.

## Features

- **Docker Integration**: Builds and pushes Docker images to Docker Hub.
- **Kubernetes Deployment**: Deploys the application as a Pod and exposes it via a Service.
- **Service URL Retrieval**: Automatically retrieves and displays the service URL for easy access.

## Prerequisites

Before running the Jenkins pipeline, ensure you have the following:

- **Jenkins**: A Jenkins server set up and running.
- **Docker**: Docker installed on the Jenkins server.
- **Kubernetes**: A Kubernetes cluster set up (Minikube is recommended for local development).
- **Git**: Git installed on the Jenkins server.
- **Docker Hub Account**: An account on Docker Hub to push images.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo

2. **Configure Jenkins**:
Install the necessary Jenkins plugins: Pipeline, Docker, and Kubernetes.
Create a new pipeline job in Jenkins.
3. **Add Docker Hub Credentials**:
Go to Jenkins Dashboard > Manage Jenkins > Manage Credentials.
Add your Docker Hub credentials (username and password) and note the credentials ID.
4. **Update the Jenkinsfile**:
Modify the DOCKER_CREDENTIALS_ID, DOCKER_IMAGE_NAME, and GITHUB_REPO environment variables in the Jenkinsfile to match your setup.
5. **Create Pod and Service YAML Files**:
Ensure you have pod.yaml and service.yaml files in the repository with the correct configuration for your application.

**Running the Pipeline**
1. Open Jenkins and navigate to your pipeline job.
2. Click on "Build Now" to start the pipeline.
3. Monitor the Console Output for progress and any potential errors.
4. Once the pipeline completes successfully, you will see the service URL in the console output.
   
**Accessing the Application**
After the pipeline runs successfully, you can access your application using the URL displayed in the Jenkins console output.

**Troubleshooting**
1. If the pipeline hangs or fails, check the console output for errors.
2. Ensure that Docker and Kubernetes services are running correctly on the Jenkins server.
3. Verify that your Docker Hub credentials are correctly configured in Jenkins.
