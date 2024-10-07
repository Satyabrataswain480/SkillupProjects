# SkillupProjects

Problem Statement:
1.	Create a CD pipeline for given code and deploy it on your local.
you should be able to show same output which was shown during demo of the sample code run.
(localhost:8787  this endpoint shows you database data from table employee in database demo,   localhost:8787/hello this endpoint returns system date)
2.	While creating image you might need to consider modules/libraries used in project
3.	(optional) Deploy project on cloud
4.	Get an email to your mail id when this deployment is successful
5.	(optional) use some monitoring tool to display any data related to this project.

•	Code – Nodejs
•	Database- Mysql
•	IAC tool- Terraform
•	Cloud – Azure
•	CI/CD- Jenkins
•	Repository- Github
•	Container- Docker & Kubernetes
•	Image Repo- Docker Hub
•	Monitoring – Log Analytics Workspace & Azure Monitor

Steps for this Project
1.	Create your webservice.js file which will connect to mysql DB, in connection pool use environment variables instead of hardcoding the server’s name.
 

2.	Create a Packages.Json and mention all dependencies which are mentioned in webserver.js file.

 
3.	Create a Dockerfile and mention all required step like below.
 
4.	(Optional)Build the docker file, tag the image, push to docker hub. This is just for testing.
 
docker build -t capstone-image devops-capstone-project .
docker tag capstone-image satyabrataswain/devops-capstone-project:v1 
docker push satyabrataswain/devops-capstone-project:v1

5.	Validate from Docker hub, if your image is pushed or not.
 
6.	Create a docker-compose file to define webservice.js and mysql db
 
7.	(Optional to test in local)Run the docker compose to validate the site in local
docker-compose up -d

8.	Login to mysql container to create the DB, table and insert records.

docker exec -it mysqlserver bash
mysql -u root -p
create database demo;
use demo;
CREATE TABLE IF NOT EXISTS employee (
    empid int NOT NULL,
    ename VARCHAR(255) NOT NULL,
    salary int NOT NULL
);
INSERT INTO employee (empid, ename, salary) VALUES
    (1,'John P', 99000),
    (2,'Jonathan Smith', 75000),
    (3, 'Emily Johnson', 50000);


9.	Validate both containers are running or not
docker ps -a

10.	Browse the site
http://localhost:8787/
http://localhost:8787/hello

11.	We can see details like below.
 

 
12.	Create 2 deployment and 2 service files for nodejs app and mysql db. Here mysql db is using ClusterIP and nodejs app is using load balancer service to access from outside.
13.	Create a init.sql file and add that as config map in mysql-deployment.yml. Here we are creating the db->table->insert records to table.
 
14.	Create all .tf files to automate our infrastruacture. Here we are creating resource group and a Kubernetes cluster in Azure.
15.	Now commit and push all your changes to Github
 
16.	Open Jenkins-> Refer https://github.com/Satyabrataswain480/skilluponlinetraining/blob/jenkins/JenkinsInstallationSteps.txt for installation of jenkins.
17.	Create a item type as pipeline.
 

18.	Define all the stages
i.	Checkout from Github
ii.	Build docker image
iii.	Push Docker image to Dockerhub
iv.	Install Azure CLI for IAC deployment
v.	Provision infrastructure with terraform
vi.	Deploy to AKS
vii.	Validate Pod and Service
viii.	Fetch the URL from load balancer and sent a alert in email.
 
19.	Instead of hardcoding all details declare environment variables like below and use that in all stages of pipeline.
  
20.	For login to docker hub and aks from jenkins, create credentials like below.
 
21.	Once Pipeline is succeeded, browse the application via load balancer URL

http://135.236.255.94:8787/
http://135.236.255.94:8787/hello


 
 
22.	Create a Log Analytics Workspace to capture the logs for Kubernetes cluster. 
 

23.	Enable diagnostic settings from Kubernetes Cluster and push the logs to Log Analytics workspace.
 
24.	Go to Azure Monitor -> Metrics -> Choose any Metrics -> You can see the activities.

 

25.	Logs -> Write a KQL query to fetch logs from controlplane.
AKSControlPlane
| where PodName contains "cloud-controller-manager-54494fc496-n9d96"

AKSAudit
| where PodName contains "kube-apiserver-775f8c8cb8-7rk56"


 

 
26.	Azure resources created via terraform

All Resouces
 
Kubernetes Deployment

 

Kubernetes PODS
 
Kubernetes ReplicaSets

 
Kubernetes ConfigMaps

 
Kubernetes Service

 
Kubernetes Load Balancer
 

Commands and Troubleshooting:
•	kubectl apply -f mysql-deployment.yml
•	kubectl apply -f mysql-service.yml
•	kubectl apply -f nodejs-deployment.yml
•	kubectl apply -f nodejs-service.yml
•	kubectl get all
•	kubectl describe pod nodejs-app-789bbd97dc-whdh4
•	az aks get-credentials --resource-group app-grp --name devops-cluster --file ~/.kube/config

For more info refer my Github account:
https://github.com/Satyabrataswain480/SkillupProjects/tree/devops-capstone-project

