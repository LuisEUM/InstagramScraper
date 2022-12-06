# InstagramScraper - API RESTful
With this API you will be able to execute two scripts that will help you to:
<br/> 
:one: Get a list of all the followers of any account (except private ones, unless you already follow them and they have accepted it). 
<br/>
:two: Be able to know how many followers each user on your list has and filter the data according to the number of followers.

It will also store the collected data inside a `MongoDB` database :sunglasses:. But :wink: you will have to set up an account within the `API` and multiple requirements that are explained within the Installation section. 

I hope this API can help or entertain you :grin:, and if you want to help me to improve it or share some ideas feel free to contact me through my instagram @LuisEUM or my personal email luiseum95@gmail.com :smiley:.

<br/>

## :wrench: Technologies:

<div style="display: flex">
<img src="https://alkitu.com/wp-content/uploads/2022/12/JavaSript-Logo.png" alt="JavaScript Logo"  width="100" height="100"/>
<img src="https://alkitu.com/wp-content/uploads/2022/12/Node-JS-Logo.png" alt="NodeJS Logo"  width="100" height="100"/>
<img src="https://alkitu.com/wp-content/uploads/2022/12/Express-Logo.png" alt="Express Logo"  width="100" height="100"/>
<img src="https://alkitu.com/wp-content/uploads/2022/12/MongoDB-Logo.png" alt="MongoDB Logo"  width="100" height="100"/>
<img src="https://alkitu.com/wp-content/uploads/2022/12/Puppeteer-Logo.png" alt="Puppeter Logo"  width="100" height="100"/>
</div>

<br/>

## :memo: Read before you start:
- This was done for educational reasons only, you are solely responsible for what you do with this tool.
- This project was made on Windows, it may have problems with other operating systems.
- Make sure that the installation has been successful before using the API.

<br/>

## :book: Installation:
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


<br/>
<br/>
<br/>

## :clipboard: API RESTful Instructions:
### :floppy_disk: Current version:
- v1 

<br/>

### :computer: Domain with the Basic Path:
- http://localhost:4000/api/v1/

**Note:** Remember that the domain port number may be different if you have changed it before.

<br/>

### :motorway: Available Paths:

#### :no_entry: Auth Routes:

| http verb | path                 | status codes  | purpose |
| --------- | -------------------- | ------------- | ------- |
| POST      | register             | 201, 400      | create  |
| POST      | authenticate         | 200, 400      | access  |
| GET       | profile              | 200           | detail  |
| PATCH     | update               | 200, 400, 404 | update  |
| DELETE    | logout               | 204, 404      | logout  |

<br/>

- `POST` **http://localhost:4000/api/v1/register:**  Create a new account with your username, email and password.

```
{
    "username": "luiseum",
    "email": "luis@example.com",
    "password" : "Example.123"
}
```
<br/>


- `POST` **http://localhost:4000/api/v1/authenticate:**  Login in your account with your email addres or username:

```
{
    "identifier": "luis@example.com",
    "password" : "Example.123"
}
```
<br/>


- `GET` **http://localhost:4000/api/v1/profile:**  Return your account info if you are logged.

```
{
    "id": "1234567890"
    "username": "luiseum",
    "email": "luis@example.com",
    "password" : "Example.123"
}
```
<br/>


- `PATCH` **http://localhost:4000/api/v1/update:** Update any value of your account except the id.

```
{
    "username": "luis",
}
```
<br/>


- `DELETE` **http://localhost:4000/api/v1/logout:** This will delete from the headers your credentials and log you out.

<br/>
<br/>

#### :dart: Target Routes:

| http verb | path                          | status codes              | purpose            |
| --------- | ----------------------------- | ------------------------- | ------------------ |
| GET       | target/:id                    | 200                       | detail             |
| GET       | target                        | 200                       | list               |
| POST      | target                        | 201, 400, 401             | create             |
| GET       | target/:id/followers          | 201, 400, 404, 401, 403   | create & update    |
| PATCH     | target/:id                    | 200, 400, 404, 401, 403   | update             |
| DELETE    | target/:id                    | 204, 404, 404, 401, 403   | delete             |

<br/>


- `POST` **http://localhost:4000/api/v1/target:**  Create your target account by typing its username inside the body with the username key. This will run the first script, which will return and create the owner (your account id), the target username, a list of followers (it will be an empty array) and the total followers (number).

This should be write it inside the body:
```
{
    "username": "targetexample1",
}
```

You will obtain something similar to this:
```
{
    "owner": "638e2d61299a42fd7035f04e",
    "username": "targetexample1",
    "followers": [
        "example3",
        "example4",
        "example5",
    ],
    "totalFollowers": 3,
    "followersWithFollowers": [],
    "createdAt": "2022-12-05T17:44:43.622Z",
    "updatedAt": "2022-12-05T17:58:51.574Z",
    "id": "638e2e0b299a42fd7035f053"
}
```

**Note:** The `totalFollowers` may be different from the length of `followers` because instagram has a limit number of requests per ip and account.

<br/>

- `GET` **http://localhost:4000/api/v1/target:**  This will return the complete list of targets you have previously searched for. 

```
[
    {
        "owner": "638e2d61299a42fd7035f04e",
        "username": "targetexample1",
        "followers": [
            "example3",
            "example4",
            "example5",
        ],
        "totalFollowers": 3,
        "followersWithFollowers": [],
        "createdAt": "2022-12-05T17:44:43.622Z",
        "updatedAt": "2022-12-05T17:58:51.574Z",
        "id": "638e2e0b299a42fd7035f053"
    },
        {
        "owner": "638e2d61299a42fd7035f04e",
        "username": "targetexample2",
        "followers": [
            "example1",
            "example2",
        ],
        "totalFollowers": 2,
        "followersWithFollowers": [],
        "createdAt": "2022-12-05T17:44:43.622Z",
        "updatedAt": "2022-12-05T17:58:51.574Z",
        "id": "638e2e0b299a42fd7035f053"
    }
]
```

<br/>

- `GET` **http://localhost:4000/api/v1/target/638e2d61299a42fd7035f04e:**  This will return the info from the target id that you wrote in the param.

```
{
    "owner": "638e2d61299a42fd7035f04e",
    "username": "targetexample2",
    "followers": [
        "example1",
        "example2",
    ],
    "totalFollowers": 2,
    "followersWithFollowers": [],
    "createdAt": "2022-12-05T17:44:43.622Z",
    "updatedAt": "2022-12-05T17:58:51.574Z",
    "id": "638e2e0b299a42fd7035f053"
}
```
<br/>

- `GET` **http://localhost:4000/api/v1/target/638e2d61299a42fd7035f04e/followers:**
    - The first time it will run a script that will return the target id information you typed in the parameter, and fill in the followersWithFollowers array.
    - The next time it will automatically check the followers and continue the process where it left off last time. (This is done because instagram will probably ban you before you get the full data back).  

```
{
    "owner": "638e2d61299a42fd7035f04e",
    "username": "targetexample2",
    "followers": [
        "example1",
        "example2",
    ],
    "totalFollowers": 2,
    "followersWithFollowers": [
        {
            "username": "example1",
            "totalFollowers": 1000,
            "private": true,
            "url": "https://www.instagram.com/example1"
        },
        {
            "username": "example2",
            "totalFollowers": 4000,
            "private": false,
            "url": "https://www.instagram.com/example2"
        },
    ],
    "createdAt": "2022-12-05T17:44:43.622Z",
    "updatedAt": "2022-12-05T17:58:51.574Z",
    "id": "638e2e0b299a42fd7035f053"
}
```
<br/>

- `PATCH` **http://localhost:4000/api/v1/target/638e2d61299a42fd7035f04e:** Overwrites and updates from scratch selected in the param with the id. This will run the main script again, collecting the target instagram account data.

- `DELETE` **http://localhost:4000/api/v1/target/638e2d61299a42fd7035f04e:** Delete the target data selected in the param with the id.

<br/>
<br/>

#### :mag_right: Filter Examples:

| http verb | path                          | available filters         | 
| --------- | ----------------------------- | ------------------------- |
| GET       | target                        | match query params           |
| GET       | target/:id/followers          | gte=number lte=number     |

<br/>

- `GET` **http://localhost:4000/api/v1/target/?followersWithFollowers.username=example4:** You could try to find any match inside you list of targets following the query params.

```
[
    {
        "owner": "638e2d61299a42fd7035f04e",
        "username": "targetexample1",
        "followers": [
            "example3",
            "example4",
            "example5",
        ],
        "totalFollowers": 3,
        "followersWithFollowers": [
            {
                "username": "example3",
                "totalFollowers": 1000,
                "private": true,
                "url": "https://www.instagram.com/example3"
            },
            {
                "username": "example4",
                "totalFollowers": 4000,
                "private": false,
                "url": "https://www.instagram.com/example4"
            },
                "username": "example5",
                "totalFollowers": 6000,
                "private": false,
                "url": "https://www.instagram.com/example5"
            }
        ],
        "createdAt": "2022-12-05T17:44:43.622Z",
        "updatedAt": "2022-12-05T17:58:51.574Z",
        "id": "638e2e0b299a42fd7035f053"
    }
]
```
<br/>

- `GET` **http://localhost:4000/api/v1/target/638e2e0b299a42fd7035f053/followers/?gte=2000&lte=7000:** You could obtain a list of followers accounts filtered with `gte` (greater than or equal or greater) and/or `lte` (less than or equal or less).

```
[
    {
        "username": "example4",
        "totalFollowers": 4000,
        "private": false,
        "url": "https://www.instagram.com/example4"
    },
        "username": "example5",
        "totalFollowers": 6000,
        "private": false,
        "url": "https://www.instagram.com/example5"
    }
]
```
<br/>
<br/>

:gift: Inside this repo you will see a `json` file for [Postman](https://www.postman.com/), enjoy it and play with the api. :smile: