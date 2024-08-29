# Steps
1. Pull the repository
2. Go inside each service and run npm instal to install all the dependencies
3. Run all the services in different terminals

OR
1. Build the images of each service and push to your docker hub id
2. Replace the name of the image in K8 congifuration with your image name
3. run command: skaffold dev
4. If you do not want to use skaffold dev command then for each file in infra/K8s run kubectl apply -f file_name.yaml
5. Above step will create deployments and services necessary inside the kubernetes cluster

# TODO
1. Create common library for all the services
2. Improve UI
