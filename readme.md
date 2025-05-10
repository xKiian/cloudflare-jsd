# Cloudflare reverse

I fully reverse engineered the `/cdn-cgi/challenge-platform/h/b/jsd` [challenge](./reverse/script.js).

# ⭐️ star the repo

please star the repo to show support❤️
i might publish cf turnstile👀

## Installation

```
Copy cfhb.py & lzstring.py into your project and import Cloudflare from cfbm
```

## Fingerprint

Obtaining a fingerprint is pretty easy.

1. Go to the target Website
2. Copy the code from [get_fingerprint.js](get_fingerprint.js) and paste it into the console (F12 -> Console)
3. Copy the output and paste it into `fingerprint.json`

The script automatically gets the fingerprint and replaces the timestamp with %timestamp% for your convenience

## Example Usage

```python
# basic PoC (proof of concept) getting a cf_clearance cookie for bstn.com

from cfhb import Cloudflare
from curl_cffi import requests

session = requests.Session(impersonate="chrome")
session.headers = {
    "connection": "keep-alive",
    "sec-ch-ua-platform": '"Windows"',
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-dest": "script",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
}

response = session.get("https://www.bstn.com/eu_de")
#<Response [403]>
init_res = response.text

param_r = response.headers["cf-ray"].split("-")[0]
# do something with the initial request...

cf_clearance = Cloudflare(session, "www.bstn.com", init_res, param_r).solve()

print("[+]", cf_clearance, len(cf_clearance))

response = session.get("https://www.bstn.com/eu_de")
print(response)
#<Response [200]>

# execution time: ~700ms
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Here are some ways you can contribute:

- 🐛 Report bugs
- ✨ Request features
- 📝 Improve documentation
- 🔧 Submit bug fixes
- 🎨 Add examples

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Note

This is **NOT** a cloudflare turnstile solver. It's a completetly different challenge. Please stop making Issues about it.

## Star History

 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=xKiian/cloudflare-jsd&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=xKiian/cloudflare-jsd&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=xKiian/cloudflare-jsd&type=Date" />
 </picture>

---

## Disclaimer

This package is unofficial and not affiliated with Cloudflare. Use it responsibly and in accordance with Cloudflare's terms of service.

> I might share how I managed to reverse engineer the challenge if this repository receives enough attention.
