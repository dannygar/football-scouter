#!/bin/bash
set -e

# Please install the below pre-requisites if using this on your local machine, or alternately, you can just use Azure Cloud Shell for a seamless experience.
#1. azure cli    :   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
#2. kubectl      :   https://kubernetes.io/docs/tasks/tools/install-kubectl/
#3. curl
#4. gunzip
#5. tar

HELMDIR=/var/tmp/helm_bridge
INGRESSNAME=scouter-traefik

echo ""
echo "Bridge to Kubernetes"
echo "Football Scouter App - Deployment script"
echo "-----------------------------------"
echo ""
if [ "$OSTYPE" == "msys" ]; then
   echo "The script is currently only supported in Windows using WSL. https://aka.ms/wsl"  
   echo "Alternatively you can use the Azure Cloud Shell https://shell.azure.com (bash)"
   
   exit 1
fi

helpFunction()
{
   echo ""
   echo "Usage: $1 -g ResourceGroupName -n AKSName"
   echo -e "\t-g Name of resource group of AKS Cluster"
   echo -e "\t-n Name of AKS Cluster"
   echo -e "\t-k Kubernetes namespace (default = scouterapp)"
   echo -e "\t-r Path to Root of the git repo (default = pwd)"
   echo -e "\t-c Cleanup"
   echo -e "\t-d Helm Debug switch"
   exit 1 # Exit script after printing help
}

installHelmFunction()
{
  if [ ! -d "$HELMDIR" ]; then
    mkdir $HELMDIR
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
       curl -fsSL -o $HELMDIR/helm.tar.gz https://get.helm.sh/helm-v3.2.1-linux-amd64.tar.gz
       gunzip -c $HELMDIR/helm.tar.gz | tar xopf - -C $HELMDIR
       mv $HELMDIR/linux-amd64/helm $HELMDIR
    elif [[ "$OSTYPE" == "darwin"* ]]; then
       curl -fsSL -o $HELMDIR/helm.tar.gz https://get.helm.sh/helm-v3.2.1-darwin-amd64.tar.gz
       gunzip -c $HELMDIR/helm.tar.gz | tar xopf - -C $HELMDIR
       mv $HELMDIR/darwin-amd64/helm $HELMDIR
    else
       echo "OS not recognized. Please either run on linux-gnu or osx"
       exit 1
    fi
  fi
}

cleanupFunction()
{
   set +e
   echo ""
   echo "Setting the Kube context to $AKSNAME in $RGNAME"
   az aks get-credentials -g $RGNAME -n $AKSNAME
   $HELMDIR/helm --namespace $APPNS uninstall scouterapp
   $HELMDIR/helm --namespace $APPNS uninstall $INGRESSNAME
   echo "Delete namespace $APPNS? (Y/n): "
   read RESPONSE
   if [ "$RESPONSE" == "y" ] || [ "$RESPONSE" == "Y" ]; then
      kubectl delete namespace $APPNS
   fi
   rm -rf $HELMDIR
   exit 0
}

while getopts "g:n:r:k:cd" opt; do
   case "$opt" in
      c ) CLEANUP="true"  ;;
      g ) RGNAME="$OPTARG"  ;;
      n ) AKSNAME="$OPTARG"  ;;
      r ) REPOROOT="$OPTARG"  ;;
      d ) HELMARGS=" --debug" ;;
      k ) APPNS="$OPTARG" ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

if [ -z "$APPNS" ]; then
   APPNS="footballscouterapp"
fi
APPNS=$(echo $APPNS | tr [:upper:] [:lower:])
echo "Using kubernetes namespace: $APPNS"

# Print helpFunction in case parameters are empty
if [ ! -z "$CLEANUP" ]; then
   echo ""
   echo "Running app Cleanup"
   if [ -z "$RGNAME" ]; then
      echo "Please pass -g when calling -c"
      helpFunction
   else
      cleanupFunction
   fi
elif [ -z "$RGNAME" ] || [ -z "$AKSNAME" ]; then
   echo "Some or all of the parameters are empty";
   helpFunction
fi

if [ -z "$REPOROOT" ]; then
   echo "Defaulting Git repository root to the root directory: $PWD"
   REPOROOT="$PWD"
fi


installHelmFunction

echo "Setting the Kube context to $AKSNAME in $RGNAME"
az aks get-credentials -g $RGNAME -n $AKSNAME

# Use Helm to deploy a traefik ingress controller
echo "helm repo add && helm repo update"
$HELMDIR/helm repo add stable https://charts.helm.sh/stable
$HELMDIR/helm repo update

echo ""
echo "helm install traefik ingress controller in $APPNS $HELMARGS"
$HELMDIR/helm install "$INGRESSNAME-$APPNS" stable/traefik \
   --namespace $APPNS --create-namespace \
   --set kubernetes.ingressClass=traefik \
   --set fullnameOverride=$INGRESSNAME \
   --set rbac.enabled=true \
   --set kubernetes.ingressEndpoint.useDefaultPublishedService=true \
   --version 1.85.0 $HELMARGS

echo ""
echo "Waiting for ScouterWeb ingress Public IP to be assigned..."
while [ -z "$PUBLICIP" ]; do
  sleep 5
  PUBLICIP=$(kubectl get svc -n $APPNS $INGRESSNAME -o jsonpath={.status.loadBalancer.ingress[0].ip})
done
echo ""
echo "ScouterWeb ingress Public IP: " $PUBLICIP

NIPIOFQDN=$PUBLICIP.nip.io
echo "The Nip.IO FQDN would be " $NIPIOFQDN

CHARTDIR="$REPOROOT/charts/"
echo "---"
echo "Chart directory: $CHARTDIR"

echo "helm install scouterapp (average time to install = 4 minutes)"
$HELMDIR/helm install scouterapp "$CHARTDIR" \
   --set scouterweb.ingress.hosts={$APPNS.scouterweb.$NIPIOFQDN} \
   --set scouterapi.ingress.hosts={$APPNS.scouterapi.$NIPIOFQDN} \
   --set scouterweb.ingress.annotations."kubernetes\.io/ingress\.class"=traefik \
   --set scouterapi.ingress.annotations."kubernetes\.io/ingress\.class"=traefik \
   --dependency-update \
   --namespace $APPNS \
   --timeout 9m \
   --atomic $HELMARGS

echo ""
echo "To try out the app, open the url:"
kubectl -n $APPNS get ing scouterweb -o jsonpath='{.spec.rules[0].host}'
echo ""

