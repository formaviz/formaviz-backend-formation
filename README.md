#Formaviz BackEnd

## 1.Requirements

- NodeJS > 10.x
- Docker > 17.x

## 2.Set up

1. Using Docker, create a Postgres container
2. Update variables DATABASE_* in the .env file to connect to your container
3. clone this repository ```git clone https://github.com/formaviz/formaviz-backend-formation.git```
4. run ```npm install```
5. run ```npm run build```
6. run the script init.sql to initialize the database
7. run ```npm run dev``` to launch the project. 

## Database Schema

![DB Schema](https://github.com/formaviz/formaviz-backend-formation/tree/develop/src/utils/MCD.png "Formaviz BackEnd DB Schema")


## Postman documentation

[Postman collection](https://github.com/formaviz/formaviz-backend-formation/tree/develop/src/utils/FORMAVIZ_CC.postman_collection.json)
