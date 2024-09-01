pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials' // Replace with your Docker credentials ID
        DOCKER_IMAGE_NAME = 'satyabrataswain/myhtmlapp' // Replace with your image name
        GITHUB_REPO = 'https://github.com/Satyabrataswain480/SkillupProjects.git' // Replace with your GitHub repo URL
        KUBE_NAMESPACE = 'default' // Replace with your Kubernetes namespace if needed
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the GitHub repository
                git branch: 'HTML-POD-JENKINS-DEPLOYMENT', url: "${GITHUB_REPO}"
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Check if Dockerfile exists
                    if (fileExists('Dockerfile')) {
                        // Build the Docker image
                        sh "docker build -t ${DOCKER_IMAGE_NAME}:latest ."
                        
                        // Tag the image with the build number
                        def buildNumber = env.BUILD_NUMBER
                        sh "docker tag ${DOCKER_IMAGE_NAME}:latest ${DOCKER_IMAGE_NAME}:${buildNumber}"
                    } 
                    else {
                        error("Dockerfile not found. Skipping Docker image build.")
                    }
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    // Log in to Docker Hub
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        // Log in to Docker
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                        
                        // Push the image tagged with the build number
                        sh "docker push ${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Update the image in the pod.yaml file
                    sh "sed -i 's|image: .*|image: ${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}|' htmlpod.yml"

                    // Apply the pod and service YAML files
                    sh "kubectl apply -f htmlpod.yml -n ${KUBE_NAMESPACE}"
                    sh "kubectl apply -f htmlservice.yml -n ${KUBE_NAMESPACE}"
                }
            }
        }
        
        stage('Verify Pod and Service') {
            steps {
                script {
                    // Verify the pod is running
                    sh "kubectl get pods -n ${KUBE_NAMESPACE}"
                    // Verify the service is created
                    sh "kubectl get services -n ${KUBE_NAMESPACE}"
                }
            }
        }
        
         /*stage('Show Service URL') {
            steps {
                script {
                    // Use a timeout to prevent hanging
                    timeout(time: 30, unit: 'SECONDS') {
                        // Display the service URL using minikube
                        def serviceUrl = sh(script: "minikube service myhtmlapp-service --url", returnStdout: true).trim()
                        echo "Access your application at: ${serviceUrl}"
                    }
                }
            }
        }*/
        
        stage('Cleanup') {
            steps {
                script {
                    // Delete the pod and service created during deployment
                    sh "kubectl delete -f htmlpod.yml -n ${KUBE_NAMESPACE} || true"
                    sh "kubectl delete -f htmlservice.yml -n ${KUBE_NAMESPACE} || true"
                }
            }
        }
    }
    post {
        success {
            echo 'Docker image tagged with build number pushed successfully and deployed to Kubernetes!'
        }
        failure {
            echo 'There was an error in the pipeline.'
        }
    }
}