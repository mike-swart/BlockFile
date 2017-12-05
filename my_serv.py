import keylib
import subprocess
import json
import urllib
import jsontokens
from pprint import pprint


# try to make this a node file that calls https://core.blockstack.org/v1/names/mfreed.id and does the rest
# this way, you can use it to encode with a public key in the browser

def func(username):
	prof_json = subprocess.Popen(['blockstack', 'lookup', username], stdout=subprocess.PIPE).stdout.read()
	data = json.loads(prof_json)
	if data.get('error'): 
		return 
	zonefile = data['zonefile']
	last_index = zonefile.rfind('"')
	url = zonefile[zonefile.rfind('"', 0, last_index)+1: last_index]
	if (not "https://" in url):
		url = "https://" + url
	opened_url = urllib.urlopen(url)
	data = json.loads(opened_url.read())
	token = jsontokens.decode_token(data[0]['token'])
	encoded_PK = token['payload']['subject']['publicKey']
	key = keylib.public_key.ECPublicKey(str(encoded_PK))
	return key.address()

public_key = func('mfreed.id')
if (public_key):
	print "\nPublic Key:\t" + public_key + "\n"

