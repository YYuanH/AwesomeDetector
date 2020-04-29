# electron-awesomeqos branch

*Date: 2020 - 04 - 29*

## How to use

### win32 release

1. use `npm install && yarn build`
   
2. use `Yarn package` compile the app to `.exe` executable file

3. copy the `config.json` file from `./<project-release>/resources/app/config.json` to the root of release folder

### linux release

1. *IF you want to checkout the linux version please modify api config*

2. use `Yarn package-linux` compile the app to `.deb` executable file
   
3. use `Yarn create-debian-installer` compile the app to `.deb` executable file

## config

Go `./resources/app/config.json` set server IP.