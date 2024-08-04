import requests

url = "https://dev-x5fymzmitaph36zd.us.auth0.com/api/v2/users"

payload = {}
headers = {
    "Accept": "application/json",
    "Authorization": "Bearer ",
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
