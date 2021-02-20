#!/bin/bash
set -e

echo ""
echo "Football Scouter App - Deployment script"
echo "-----------------------------------"
echo ""

helpFunction()
{
   echo ""
   echo "Usage: $1 -g ResourceGroupName -n ACRName -t ImageTag"
   echo -e "\t-g Name of resource group of Azure Container Registry"
   echo -e "\t-n Name of ACR"
   echo -e "\t-r Path to Dockerfile (default = pwd)"
   echo -e "\t-t Image Tag in format: imagename:tag"
   exit 1 # Exit script after printing help
}

while getopts "g:n:r:t:?:" opt; do
   case "$opt" in
      g ) RGNAME="$OPTARG"  ;;
      n ) ACRNAME="$OPTARG"  ;;
      r ) DOCKERFILEPATH="$OPTARG"  ;;
      t ) IMAGETAG="$OPTARG" ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

# Print helpFunction in case parameters are empty
if [ -z "$RGNAME" ] || [ -z "$ACRNAME" ]; then
   echo "Some or all of the parameters are empty";
   helpFunction
fi

if [ -z "$DOCKERFILEPATH" ]; then
   echo "Defaulting Git repository root to the root directory: $PWD"
   DOCKERFILEPATH="$PWD"
fi

echo "Image Tag: $IMAGETAG"

echo ""
echo "Logging into Azure"
az login
az acr login --name $ACRNAME 

echo ""
echo "Build docker image"
cd $DOCKERFILEPATH
docker build -t $IMAGETAG .

echo ""
echo "Tag Docker Image for Azure CR"
docker tag $IMAGETAG $ACRNAME.azurecr.io/$IMAGETAG

echo ""
echo "Push Docker Image to Azure Container Registry..."
docker push $ACRNAME.azurecr.io/$IMAGETAG
