# InstagramScraper
With this little friend, we will get a list of possibles influencers, it will be obteined by usernames followers.

##  INSTALLATION:
1. Download the Repo.

2. Create one ".env" file inside the API.

3. Set the next two variables with a real instagram account:

```
    USERNAME_INSTAGRAM="usernamexample"
    PASSWORD_INSTAGRAM="Example.1234"
```  
Note: Use a Fake Account, you could be banned for life on Instagram.
    
4. Locate you terminal inside the "api" folder and install all the dependencies with `npm install`. 

5. **OPTIONAL:** You could change the default port setting inside the ".env" file the variable `PORT`, if you don't do that the app will run in the `PORT=4000`.

6. You have two options now: 
       + Storage the data locally: 
        - You should download MongoDB Compass. Follow [this link](https://www.mongodb.com/docs/compass/current/install/) and check all the steps according to your operating system:.

       + Storage the data on Internet: 
        - [Register](https://www.mongodb.com/cloud/atlas/register) for an Atlas account. 

        - Create and deploy an M0 cluster.

        - Add your connection IP address to your IP access list.

        - Create a database user for your cluster.

    - Connect to your cluster. You should set the variable MONGODB_URI inside the ".env" file with your connection string it would look similar to this: 
        ```
        MONGODB_URI="mongodb+srv://<account>:<password>@instagramscrapper.kcmwbdf.mongodb.net/?retryWrites=true&w=majority".
        ```

    Note: Remember that you should change the  `<account>` and `<password>` parameters with yours credentials and this is just an example.

    - Load sample data or your own data!.    

7. Write the next script for development mode `npm run dev` and now you will be able to use our API.


## API REST HTTP Instructions:

### Methods available: 
- GET
- POST
- UPDATE
- DELETE 

### Current version:
- Number 1 

### Basic domain and path:
- http://localhost:4000/api/v1/

Note: Remember that the domain port number may be different if you have changed it before.



| http verb | path                 | status codes  | purpose |
| --------- | -------------------- | ------------- | ------- |
| GET       | /api/v1/target       | 200,          | list    |
| POST      | /api/v1/target       | 201, 400      | create  |
| GET       | /api/v1/target/<id>  | 200, 404      | detail  |
| PATCH     | /api/v1/target/<id>  | 200, 400, 404 | update  |
| DELETE    | /api/v1/target/<id>  | 204, 404      | delete  |
