@echo off

IF "%1"=="" (
  echo "usage: .\generate <page-name>"
) ELSE (
  mkdir .\pages\%1
  touch .\pages\%1\%1.js
  echo .\pages\%1\%1.js generated
  touch .\pages\%1\%1.wxml
  echo .\pages\%1\%1.wxml generated
  touch .\pages\%1\%1.wxss
  echo .\pages\%1\%1.wxss generated
  touch .\pages\%1\%1.json
  echo .\pages\%1\%1.json generated
)

