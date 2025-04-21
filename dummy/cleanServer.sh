
#!/bin/bash

echo "Deleting specific deployments..."

kubectl delete -f ./backend_deployment.yaml
kubectl delete -f ./client_deployment.yaml
kubectl delete -f ./ingress.yaml
kubectl delete -f ./client_service.yaml
kubectl delete -f ./backend_service.yaml

echo "Specific deployments have been deleted."
