pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'satyabrataswain/devops-capstone-project'  // Replace with your Docker image name
        DOCKER_TAG = 'latest'  // You can change this to a versioning scheme if needed
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'  // Jenkins credentials ID for Docker Hub
        KUBECONFIG_CREDENTIALS = 'aks-kubeconfig'  // Jenkins credentials ID for AKS kubeconfig
        AKS_CLUSTER_NAME = 'devops-cluster'  // Replace with your AKS cluster name
        RESOURCE_GROUP = 'app-grp'  // Replace with your Azure resource group name
        GITHUB_CREDENTIALS = 'github-credentials'  // Jenkins credentials ID for GitHub access
        GITHUB_REPO = 'https://github.com/Satyabrataswain480/SkillupProjects.git'  // Replace with your GitHub repo URL
        EMAIL_RECIPIENT = 'satyabrataswain480@gmail.com'
        RESOURCE_ID = "/subscriptions/f3277143-169f-4471-9141-ebc4ffec644b/resourceGroups/${RESOURCE_GROUP}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the GitHub repository
                git branch: 'devops-capstone-project', url: "${GITHUB_REPO}"
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
        
        stage('Install Azure CLI') {
            steps {
                script {
                    // Install Azure CLI on Windows
                    bat '''
                    @echo off
                    if not exist "%ProgramFiles%\\Microsoft SDKs\\Azure\\CLI2" (
                        powershell -Command "Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile azure-cli-installer.msi"
                        msiexec /i azure-cli-installer.msi /quiet
                        del azure-cli-installer.msi
                    )
                    '''
                }
            }
        }
        
        stage('Provision Infrastructure with Terraform') {
            steps {
                script {
                    // Initialize Terraform
                    sh 'terraform init'
                    
                    // Create a plan and save it to a file
                    sh 'terraform plan -out main.tfplan'
        
                    // Apply the plan
                    sh 'terraform apply main.tfplan'
                }
            }
        }
        
        stage('Deploy to AKS') {
            steps {
                script {
                    withCredentials([file(credentialsId: KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG_FILE')]) {
                        // Use PowerShell to get AKS credentials
                        bat "az aks get-credentials --resource-group ${RESOURCE_GROUP} --name ${AKS_CLUSTER_NAME} --overwrite-existing"
                        
                        // Update the image in the pod.yaml file
                        sh "sed -i 's|image: .*|image: ${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}|' nodejs-deployment.yml"
        
                        // Update the deployment with the new image tag
                        //bat "kubectl set image nodejs-app nodejs-app=${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
        
                        // Apply Kubernetes manifests if needed
                        bat "kubectl apply -f mysql-deployment.yml"
                        bat "kubectl apply -f mysql-service.yml"
                        bat "kubectl apply -f nodejs-deployment.yml"
                        bat "kubectl apply -f nodejs-service.yml"
                    }
                }
            }
        }
        
        stage('Validate Pod and Service') {
            steps {
                script {
                    // Sleep for 60 seconds
                    sleep(time: 60, unit: 'SECONDS')
                    
                    // Get the name of the pod dynamically
                    def podName = sh(script: "kubectl get pods -l app=nodejs-app -o jsonpath='{.items[0].metadata.name}'", returnStdout: true).trim()
                    
                    // Validate that the pod is running
                    def podStatus = sh(script: "kubectl get pod ${podName} -o jsonpath='{.status.phase}'", returnStdout: true).trim()
                    if (podStatus != 'Running') {
                        error("Pod is not running. Status: ${podStatus}")
                    }
        
                    // Validate that the service is running and fetch the external IP
                    def serviceIP = sh(script: "kubectl get svc nodejs-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}'", returnStdout: true).trim()
                    if (serviceIP == '') {
                        error("Service is not available or does not have an external IP.")
                    }
        
                    // Store the external URL for later use
                    env.SITE_URL = "http://${serviceIP}:8787"  // Assuming port 8787 is used
                }
            }
        }
        
        stage('Send Email Notification') {
            steps {
                script {
                    // Send email with the site URL
                    emailext (
                        to: "${EMAIL_RECIPIENT}",
                        subject: "Deployment Successful",
                        body: "The application has been successfully deployed. You can access it at: ${env.SITE_URL}"
                    )
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}