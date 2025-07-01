# devtinder api

## authRouter
- POST /signup
- POST /login
- POST /logout


## profile router
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connection request router
- POST /request/send/interested/:userID
- POST /request/send/ignored/:userID
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:requestID


## userRouter
- GET /user/connections
- GET /user/request/received
- GET /user/feed profile of other users
