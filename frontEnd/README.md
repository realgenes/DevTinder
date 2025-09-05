## Devtinder

- created vite + react application
- Remove unnecessary code
- install Tailwind css
- Installed daisy ui
- Add navbar component to App.jsx
- install react router 
- create browser router -> router -> route
- create an outlet in body component
- create a footer
- create a login page
- install axios
- CORS - install cors in backend => add middlewares to with configuratio: origin
- whenever making API call using axios pass with  => {withCredentials: true}
- install React redux



## Deployment


- Signup on AWS
- Launch instance

- chmod 400 <secret>.pem
- ssh -i "devTinder-secret.pem" ubuntu@ec2-43-204-96-49.    ap-south-1.compute.amazonaws.com
- Install Node version 16.17.0
- Git clone
- Frontend
   
     -npm install -> dependencies install
    - npm run build
    - sudo apt update
    - sudo apt install nginx
    - sudo systemctl start nginx
    - sudo systemctl enable nginx
    - Copy code from dist(build files) to /var/www/html/
    - sudo scp -r dist/* /var/www/html/
    - Enable port :80 of your instance




