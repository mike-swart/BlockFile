In order to run this code, must be running `docker-compose up -d` in the [blockstack-todos repo](https://github.com/blockstack/blockstack-todos).

# Getting Started and Running in Browser
+ run `npm run start`. This will run on localhost:5000

### Important Note
Run all code in the browser in an incognito window. Blockstack's underlying api caches information, which makes it difficult to undo changes.

+ Clicking on the *Sign In with BlockStack* button in the app will take you to their website. The address will look something like 
`https://blockstack.org/auth?authRequest=` with a long string of letters and numbers after the "=" sign. Delete the `https://blockstack.org` part of the URL and replace it with `localhost:8888`, which is the port that the docker container for their API will be running on. The whole URL will now look like `localhost:8888/auth?authRequest=` with the long string following.

+ You will now be taken to a page that asks if you would like to approve the sign in. On approval, the app will be running.

# Making Changes
+ Changes made in *Public* folder will be automatically included in the code on `localhost:5000`. Refresh the page to include them.




