# guitar-app

## Set it up

1. Clone it
  ```git clone https://github.com/dabutvin/guitar-app.git```
1. Run it
  ```npm start```
  
### You want to use the database
The database lives in the ```data``` folder at the root of the project

1. Find ```var mode = "read-only";``` and set it to ```"read-write"```
1. Start up mongodb
  ```"c:\Program Files\MongoDB 2.6 Standard\bin\mongod.exe" --dbpath data```
1. ```npm start```
