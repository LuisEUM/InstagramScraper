# InstagramScraper
With this API you will be able to get a list of all the followers of any account (except private ones, unless you already follow them and they have accepted it). And you will also be able to know how many followers each user has in your list.


## Read before you start:
- This was done for educational reasons only, you are solely responsible for what you do with this tool.
- This project was made on Windows, it may have problems with other operating systems.
- Make sure that the installation has been successful before using the API.


##  INSTALLATION:
1. Clone or Fork this Repo.

2. Create one **.env** file inside the **api** folder.

3. Set the next two variables with a real instagram account:

```
USERNAME_INSTAGRAM="usernamexample"
PASSWORD_INSTAGRAM="Example.1234"
```  
**Note:** Use a Fake Account, you could be banned for life on Instagram.

4. Locate you terminal inside the **api** folder and install all the dependencies with `npm install`. 

5. **Optional:** Set inside the **.env** file the variable `PORT`, if you don't do that the app will run in the `PORT=4000`.

6. You have two options now: 

    + Storage the data locally: 
        - [Download MongoDB Compass.](https://www.mongodb.com/docs/compass/current/install/)

    + Storage the data on Internet: 
        - [Register for an Atlas account.](https://www.mongodb.com/cloud/atlas/register)  

        - Create and deploy an M0 cluster.

        - Add your connection IP address to your IP access list.

        - Create a database user for your cluster.

        - Connect to your cluster. Set the variable `MONGODB_URI` inside the **.env** file with your connection string it should look similar to this: 
```
MONGODB_URI="mongodb+srv://<account>:<password>@instagramscrapper.kcmwbdf.mongodb.net/?retryWrites=true&w=majority".
```

**Note:** Change the  `<account>` and `<password>` parameters with yours credentials, this is just an example the string must be different.

7. Type the following script for development mode `npm run dev` and if everything is done correctly you will see a message in your terminal indicating the port and database you are using.


## API REST HTTP Instructions:

### Available Methods: 
- GET
- POST
- PATCH
- DELETE 

### Current version:
- v1 

### Domain with the Basic Path:
- http://localhost:4000/api/v1/

**Note:** Remember that the domain port number may be different if you have changed it before.




### Available Paths:

#### Auth Routes:

| http verb | path                 | status codes  | purpose |
| --------- | -------------------- | ------------- | ------- |
| POST      | register             | 201, 400      | create  |
| POST      | authenticate         | 200, 400      | access  |
| GET       | profile              | 200           | detail  |
| PATCH     | update               | 200, 400, 404 | update  |
| DELETE    | logout               | 204, 404      | logout  |



- `POST` **http://localhost:4000/api/v1/register:**  Create a new account with your username, email and passord.

```
{
    "username": "luiseum",
    "email": "luis@example.com",
    "password" : "Example.123"
}
```

- `POST` **http://localhost:4000/api/v1/authenticate:**  Login in your account with your email addres or username:

```
{
    "identifier": "luis@example.com",
    "password" : "Example.123"
}
```

- `GET` **http://localhost:4000/api/v1/profile:**  Return your account info if you are logged.

```
{
    "id": "1234567890"
    "username": "luiseum",
    "email": "luis@example.com",
    "password" : "Example.123"
}
```

- `PATCH` **http://localhost:4000/api/v1/update:** Update any value of your account except the id.

```
{
    "username": "luis",
}
```


- `DELETE` **http://localhost:4000/api/v1/logout:** This will delete from the headers your credentials and log you out.


#### Target Routes:

| http verb | path                 | status codes  | purpose |
| --------- | -------------------- | ------------- | ------- |
| POST      | target               | 201, 400      | create  |

- `POST` **http://localhost:4000/api/v1/target:**  Create your target account with his username. This will return and create the owner (your account id), the target username, a list of followers (this will be an array) and the followers total (number). 

```
{
    "username": "elonmuskoffiicial",
}
```
