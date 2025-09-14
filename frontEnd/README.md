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


    # Concise summary — what we did to get DevTinder working

* Logged into the EC2 instance and fixed SSH key permissions so you could connect.
* Cloned the repo and confirmed backend listens on `localhost:7777` (routes mounted at `/`, e.g. `/connections`).
* Installed Node via **nvm**, installed dependencies, and started the app with **pm2** (`pm2 start npm --name devtinder -- start`).
* Built and deployed the frontend to `/var/www/html` (copied `dist`/`build` to that folder).
* Configured Nginx as the public web server and reverse proxy:

  * Created `/etc/nginx/sites-available/devtinder` with `location /api/ { proxy_pass http://127.0.0.1:7777/; }` — **this strips the `/api` prefix** so frontend (`BASE_URL="/api"`) matches backend routes.
  * Removed invalid `map` usage inside server blocks and used `proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";` for websockets.
  * Enabled the site, tested (`nginx -t`), and reloaded nginx.
* Installed TLS with Certbot:

  * Set Cloudflare A record to **DNS-only** for certificate issuance.
  * Ran `sudo certbot --nginx -d dev-tinder.dev -d www.dev-tinder.dev`; certs persisted under `/etc/letsencrypt/live/dev-tinder.dev/`.
  * Verified HTTPS (`curl -I https://dev-tinder.dev` and `openssl s_client`) and nginx listening on 443.
  * Resolved Certbot's “no matching server block” by ensuring `server_name dev-tinder.dev` existed in the enabled site file.
* Fixed Cloudflare 521 issue:

  * Confirmed origin served HTTP/HTTPS and opened ports 80/443.
  * After certs were working, re-enabled Cloudflare proxy (orange cloud) and set SSL to **Full (strict)**.
  * Advised whitelisting Cloudflare IP ranges if you use fail2ban/iptables.
* Cleaned up duplicate nginx server blocks (consolidated SSL/redirect blocks to avoid `conflicting server name` warnings).
* Verified everything: nginx serving the SPA, `/api/*` proxied to Node, HTTPS works, Cloudflare proxy works without 521.

### Important files & commands created/used

* Nginx site: `/etc/nginx/sites-available/devtinder` (and certbot-created `/etc/nginx/sites-available/devtinder-ssl`)
* Certs: `/etc/letsencrypt/live/dev-tinder.dev/fullchain.pem` and `privkey.pem`
* Start backend: `pm2 start npm --name devtinder -- start`
* Certbot: `sudo certbot --nginx -d dev-tinder.dev -d www.dev-tinder.dev`
* Key nginx snippet:

  ```nginx
  location /api/ {
    proxy_pass http://127.0.0.1:7777/;  # trailing slash strips /api
  }
  ```
* Firewall: `sudo ufw allow 'Nginx Full' && sudo ufw allow OpenSSH`
* Cloudflare: set DNS-only during ACME, then Proxied + SSL Full (strict) afterwards.

If you want, I can produce a one-paragraph README for the repo with these steps, or run a final checklist command on the server to validate everything automatically. Which would you prefer?





