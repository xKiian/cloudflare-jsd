# basic PoC (proof of concept) getting a cf_clearance cookie for bstn.com

from requests import Session
from cfhb import Cloudflare

session = Session()
session.headers = {
    "connection": "keep-alive",
    "sec-ch-ua-platform": '"Windows"',
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-dest": "script",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
}

response = session.get("https://www.bstn.com/eu_de")
init_res = response.text

param_r = response.headers["cf-ray"].split("-")[0]
# do something with the initial request...

cf_clearance = Cloudflare(session, "www.bstn.com", init_res, param_r).solve()

print("[+]", cf_clearance, len(cf_clearance))
print(session.cookies.get_dict())
