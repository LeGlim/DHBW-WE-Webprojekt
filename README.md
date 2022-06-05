## Description
A Website where you are able to perform different actions and access different subsections depending on your user-status. For example look at a few stocks.
## Screenshots
> TODO
## Project setup with docker
### 1. Build the docker image
- Make sure you are in the **same directory as the Dockerfile**
- **`yourcontainernamehere` can be replaced** with a name of your liking, don't forget to also change it in the run command
- Make sure you have no equaly named image or container from previous projects, cause it might cause problems

```docker
docker build . -t yourcontainernamehere
```
### 2. Run the docker image

```docker
docker run -p 8080:6001 yourcontainernamehere
```
### 3. View the page
- http://localhost:8080

## Project setup without docker
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```