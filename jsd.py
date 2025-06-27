from curl_cffi import Session
from lzstring import LZString
from datetime import datetime
import re, json


class Cloudflare:
    def __init__(self, session: Session, host: str, param_r: str):
        self.param_r = param_r
        self.session = session
        self.host = host

    @staticmethod
    def get_fingerprint(fp: str) -> str:
        fingerprint = json.load(open(fp))
        time = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        return json.dumps(fingerprint).replace("%timestamp%", time)

    def solve(self, fp: str = "fingerprint.json") -> str:
        """
        Solve the Cloudflare /h/b challenge and returns the cookie
        :return: cf_clearance cookie
        """
        script = self.session.get(f"https://{self.host}/cdn-cgi/challenge-platform/scripts/jsd/main.js").text

        extension = "b" if "/b/" in script else "g"
        key = next((i for i in script.split(",") if
                    re.fullmatch(r"(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[+\-$])[a-zA-Z0-9+\-$]{65}", i)), None)
        path = [i for i in script.split(",") if i.startswith("/jsd/r/")][0]

        compressed_fingerprint = LZString.compressToCustom(self.get_fingerprint(fp), key)

        url = f"https://{self.host}/cdn-cgi/challenge-platform/h/{extension}{path}{self.param_r}"

        res = self.session.post(url, data=compressed_fingerprint)

        return res.headers["set-cookie"].split("cf_clearance=")[1].split("; ")[0]
