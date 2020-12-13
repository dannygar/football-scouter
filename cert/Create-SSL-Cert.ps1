<#
.SYNOPSIS
  create a certificate and immediately import it into the Trusted Root Certificate store of the computer.
.DESCRIPTION
  REQUIRED : Internet access
  REQUIRED : PowerShell modules, see variables
.PARAMETER CertFileName
   Mandatory
   Cert file name
.PARAMETER Password
   Mandatory
   Cert password
.NOTES
   AUTHOR: Danny Garber
.EXAMPLE
    $CertFileName="FootballScouter"
    $Password="1234"
   .\Create-SSL-Cert.ps1 -CertFileName $CertFileName -Password $Password
#>

param(
  [Parameter(Mandatory=$true,HelpMessage='Cert file name')]
  [String]
  $CertFileName,
  [Parameter(Mandatory=$true,HelpMessage='Cert password')]
  [String]
  $Password
)

$folder = ".cert"

mkdir $folder -ErrorAction SilentlyContinue > $null

Write-Host 'Installing PSPKI module'
Install-Module -Name PSPKI

Write-Host "Creating a new certificate and import it in the computer's personal certificate store"
$SelfSignCert=New-SelfSignedCertificate -CertStoreLocation cert:\LocalMachine\My -NotAfter (Get-Date).AddYears(10) -FriendlyName $CertFileName -Subject "localhost" -KeyExportPolicy Exportable -Provider "Microsoft Enhanced RSA and AES Cryptographic Provider" -TextExtension @("2.5.29.17={text}dns=localhost,127.0.0.1&ipaddress=127.0.0.1")

$CertPassword = ConvertTo-SecureString -String $Password -Force -AsPlainText

$Thumbprints = (Get-ChildItem -Path Cert:\LocalMachine\My | Where-Object {$_.FriendlyName -match 'FootballScouter'}).Thumbprint
if($Thumbprints -is [array]) {
    # Executes when there are more than one SSL certificate already installed
    $Thumbprint = $Thumbprints[-1]
}else {
    # Executes when this is the first SSL certificate for this app
    $Thumbprint = $Thumbprints
}
echo $Thumbprint

Write-Host 'Export SSL Certificate into a file....'
Export-PfxCertificate -Cert cert:\LocalMachine\My\$Thumbprint -FilePath ./$($folder)/$($CertFileName).pfx -Password $CertPassword

Write-Host 'Convert SSL Certificate into a PEM file'
Get-Command -Module PSPKI > $null
Convert-PfxToPem -InputFile ./$($folder)/$($CertFileName).pfx -Outputfile ./$($folder)/$($CertFileName).pem -Password $CertPassword

Write-Host 'Extract Private Key into the KEY file'
Clear-Variable -Name "Matches"
$privateKeyRegExp = '(?ms)(.*?)*(-----BEGIN PRIVATE KEY-----(.*?)*-----END PRIVATE KEY-----)(.*?)*'
(Get-Content ./$($folder)/$($CertFileName).pem -Raw) -match $privateKeyRegExp
$Matches[2] | Set-Content ./$($folder)/$($CertFileName).key

Write-Host 'Extract Certificate into the CRT file'
Clear-Variable -Name "Matches"
$certRegExp = '(?ms)(.*?)*(-----BEGIN CERTIFICATE-----(.*?)*-----END CERTIFICATE-----)(.*?)*'
(Get-Content ./$($folder)/$($CertFileName).pem -Raw) -match $certRegExp
$Matches[2] | Set-Content ./$($folder)/$($CertFileName).crt

Write-Host 'Import SSL Certificate into a Trusted Root Certificate store'
$certFile = Export-Certificate -Cert $SelfSignCert -FilePath ./$($folder)/$($CertFileName).pfx
Import-Certificate -CertStoreLocation Cert:\LocalMachine\AuthRoot -FilePath ./$($folder)/$($CertFileName).pfx

