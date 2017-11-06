In order to run this code, must be running `docker-compose up -d` in the [blockstack-todos repo](https://github.com/blockstack/blockstack-todos).
+ `blockstack_integration_test_api_password` is the password to use in advanced settings.
+ Note: It is not necessary to buy a username for this application to run. To save time you can skip this setp in the *blockstack-todos* setup

# Getting Started and Running in Browser

### Important Note
Run all code in the browser in an incognito window. Blockstack's underlying api caches information, which makes it difficult to undo changes.

+ run `npm run start`. This will run on localhost:5000

+ Clicking on the *Sign In with BlockStack* button in the app will take you to their website. The address will look something like 
`https://blockstack.org/auth?authRequest=` with a long string of letters and numbers after the "=" sign. Delete the `https://blockstack.org` part of the URL and replace it with `localhost:8888`, which is the port that the docker container for their API will be running on. The whole URL will now look like `localhost:8888/auth?authRequest=` with the long string following.

+ You will now be taken to a page that asks if you would like to approve the sign in. On approval, the app will be running.

# Making Changes
+ Changes made in *Public* folder will be automatically included in the code on `localhost:5000`. Refresh the page to include them.


# Git

### To Add To Master

+ `git add .`

+ `git commit -m <commit_message>`

+ `git push -u origin master`

### To Add To Branch

+ `git checkout -b <branch_name>`

+ `git add .`

+ `git commit -m <commit_message>`

+ `git push -u origin <branch_name>`

+ merge and squash within the branch on the website



### Things to look into 

they use cors-anywhere and gulp-connect-proxy for their proxy connection. Look into these for figuring out how to share data.
These might just forward to localhost...



