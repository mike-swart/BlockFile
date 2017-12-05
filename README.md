In order to run this code, must be running `docker-compose up -d` in the [blockstack-todos repo](https://github.com/blockstack/blockstack-todos).
+ `blockstack_integration_test_api_password` is the password to use in advanced settings.
+ Note: It is not necessary to buy a username for this application to run. To save time you can skip this setp in the *blockstack-todos* setup

# Getting Started and Running in Browser

### Important Note
Run all code in the browser in an incognito window. Blockstack's underlying api caches information, which makes it difficult to undo changes.

+ run npm install ngrok

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

ngrok
--> read in all files and encrypt them into a JSON block
--> make a server that returns this JSON object
--> on one ending return keys, on other ending return encrypted JSON
--> on the other side, make an https call to ngrok to parse through JSON block
--> unencrypt the files


Want to now:
+ sign a JWT with headers including username.id, phone_number, address, hash method, etc. that has the instance of a health record
+ encrypt with the doctor's public key so that when looking at it on the other end of the server, the doctor can decrypt it with their private key
	+ also works for when a doctor wants to send a new record-- they must send their signed JWT




rather than you typing into the browser read into a file
-server api could read from dropbox, gaia directly if you can sign in to blockstack from node (and not in browser)

browser-env
window
node-localstorage

From the slack channel "automated browser tests can be kind of finicky, though I have had some (limited) success automating with selenium. An alternative would be to manufacture a mock authResponse object which you could pass to your test. We also have some automated testing of blockstack.js itself using node tape (you can find those tests in the blockstack.js repo) -- you could do something similar for unit tests." -- this same thing could be used to sign into a remote server

https://github.com/blockstack/blockstack.js/blob/master/tests/unitTests/src/unitTestsProfiles.js



//decoding string

it's a 66 character hex-string
[1:28] Bitcoin uses 256-bit ECDSA private-keys
[1:28] the public key is also 256-bit
[1:30] there are a number of different libraries which allow you to compute the bitcoin address (which is a hash) from a public key -- our `keylib` for example (https://github.com/blockstack/keylib-py/)



[1:30]  ```>>> k = keylib.public_key.ECPublicKey('031421b7d7a8727a84ebef69a5e8f17bec0e7143ea20cf6e1f3d114a389ac77202')
>>> k.address()
'13o4bCPvsNTueMnGR4acqr29C4utYtr1ig'
```
[1:31] it's also how the profile json is validated
[1:34] so -- in your profile, you have a token field, which is a JWT
[1:34] ```eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJqdGkiOiJmZDkyN2UxYS1iOTg1LTQwY2ItYjQxYS0wNzEzMmVmMWQ1ZTQiLCJpYXQiOiIyMDE3LTExLTEzVDEyOjA5OjA5Ljc1MVoiLCJleHAiOiIyMDE4LTExLTEzVDEyOjA5OjA5Ljc1MVoiLCJzdWJqZWN0Ijp7InB1YmxpY0tleSI6IjAzMWVlM2FlYTU2MTM0NjM4NjJkZWQ4MzA2MDQxMDRlYzVhNTBjZmU1NjhlODQ1MDM0YzM3MDE4YjlkZGI3Mjc4NCJ9LCJpc3N1ZXIiOnsicHVibGljS2V5IjoiMDMxZWUzYWVhNTYxMzQ2Mzg2MmRlZDgzMDYwNDEwNGVjNWE1MGNmZTU2OGU4NDUwMzRjMzcwMThiOWRkYjcyNzg0In0sImNsYWltIjp7IkB0eXBlIjoiUGVyc29uIiwiQGNvbnRleHQiOiJodHRwOi8vc2NoZW1hLm9yZyIsIm5hbWUiOiJNdW5lZWIgQWxpIiwiZGVzY3JpcHRpb24iOiJDby1mb3VuZGVyIG9mIEJsb2Nrc3RhY2ssIGEgbmV3IGludGVybmV0IGZvciBkZWNlbnRyYWxpemVkIGFwcHMuIERpc3RyaWJ1dGVkIHN5c3RlbXMgUGhEIGZyb20gUHJpbmNldG9uLiIsImltYWdlIjpbeyJAdHlwZSI6IkltYWdlT2JqZWN0IiwibmFtZSI6ImF2YXRhciIsImNvbnRlbnRVcmwiOiJodHRwczovL2dhaWEuYmxvY2tzdGFjay5vcmcvaHViLzFKM1BVeFk1dURTaFVuSFJyTXlVNnlLdG9IRVVQaEtVTHMvMC9hdmF0YXItMCJ9XSwiYWNjb3VudCI6W3siQHR5cGUiOiJBY2NvdW50IiwicGxhY2Vob2xkZXIiOmZhbHNlLCJzZXJ2aWNlIjoidHdpdHRlciIsImlkZW50aWZpZXIiOiJtdW5lZWIiLCJwcm9vZlR5cGUiOiJodHRwIiwicHJvb2ZVcmwiOiJodHRwczovL3R3aXR0ZXIuY29tL211bmVlYi9zdGF0dXMvOTMwMDM5ODg0NTQ2NDk0NDY0In0seyJAdHlwZSI6IkFjY291bnQiLCJwbGFjZWhvbGRlciI6ZmFsc2UsInNlcnZpY2UiOiJnaXRodWIiLCJpZGVudGlmaWVyIjoibXVuZWViLWFsaSIsInByb29mVHlwZSI6Imh0dHAiLCJwcm9vZlVybCI6Imh0dHBzOi8vZ2lzdC5naXRodWIuY29tL211bmVlYi1hbGkvOTNhMjViZTZkOTI3M2NiNGMxZWU5YTAzOTJlMTdiYWMifSx7IkB0eXBlIjoiQWNjb3VudCIsInBsYWNlaG9sZGVyIjpmYWxzZSwic2VydmljZSI6ImhhY2tlck5ld3MiLCJpZGVudGlmaWVyIjoibXVuZWViIiwicHJvb2ZUeXBlIjoiaHR0cCIsInByb29mVXJsIjoiaHR0cHM6Ly9uZXdzLnljb21iaW5hdG9yLmNvbS91c2VyP2lkPW11bmVlYiJ9LHsiQHR5cGUiOiJBY2NvdW50IiwicGxhY2Vob2xkZXIiOmZhbHNlLCJzZXJ2aWNlIjoiZmFjZWJvb2siLCJpZGVudGlmaWVyIjoibXVuZWViYWxpIiwicHJvb2ZUeXBlIjoiaHR0cCIsInByb29mVXJsIjoiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL211bmVlYmFsaS9wb3N0cy8xMDE1NjA5OTM2NTUxNDEyMyJ9XX19.o87DpJQ2VIquZ-NkHZeAeiQ-_LnXyOg_NwxKlkWFdruV3dfrIfk_T4BmwfEpzqteW3FQ9zUPIZxi-NgXm-EVwA```
[1:35] which you can decode with a jsontokens library
[1:35] or examine on this website (https://jwt.io/) (edited)
[1:35] though that website doesn't support the signature algorithm ES25K



