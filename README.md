# Movie-Project
A Movie Ticket Booking PWA

## Frontend
In Development

## Backend
> API Endpoint : https://tl27863-movie-project.up.railway.app/
>
> Body : raw/json

<br>

> Login User
```
POST api/user/login

{
    "email" : "johndoe@test.net",
    "password" : "JohnDoe"
}
```
> Register User
```
POST api/user/register

{
    "fullName" : "John Doe"
    "email" : "johndoe@test.net",
    "password" : "JohnDoe"
}
```
> Refresh User Token
```
POST api/user/token

Required refresh-token cookie
```
> Movie List
```
GET api/data/movie/list

Required auth-token cookie
```
> Movie Screening
```
GET api/data/movie/screening

Required auth-token cookie
```
> Screening Ticket
```
GET api/data/screening/ticket

Required auth-token cookie
```
> User Ticket List
```
GET api/data/user/ticket

Required auth-token cookie
```
> Purchase Ticket
```
POST api/data/ticket

{
    "seatNumber": 10,
    "screening": "ScreeningID"
}
```
