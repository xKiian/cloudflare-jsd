from requests import Session
from lzstring import LZString
from datetime import datetime
import re, json


class Cloudflare:
    def __init__(self, session: Session, host: str, default_page: str):
        self.session = session
        self.host = host
        self.default_page = default_page

    @staticmethod
    def get_fingerprint(fp: str) -> str:
        fingerprint = json.load(open(fp))
        return (json.dumps(fingerprint)
                .replace("%timestamp%", datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
                )

    def solve(self, fp: str = "fingerprint.json") -> str:
        """
        Solve the Cloudflare /h/b challenge and returns the cookie
        :return: cf_clearance cookie
        """
        param_r = re.findall(r"r:'(.+?)'", self.default_page)

        script = self.session.get(f"https://{self.host}/cdn-cgi/challenge-platform/scripts/jsd/main.js").text

        key = next((i for i in script.split(",") if
                    re.fullmatch(r"(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[+\-$])[a-zA-Z0-9+\-$]{65}", i)), None)
        path = [i for i in script.split(",") if i.startswith("/jsd/r/")][0]

        compressed_fingerprint = LZString.compressToCustom(self.get_fingerprint(fp), key)

        res = self.session.post(f"https://{self.host}/cdn-cgi/challenge-platform/h/b{path}{param_r}",
                                data=compressed_fingerprint)

        return res.cookies.get("cf_clearance")
