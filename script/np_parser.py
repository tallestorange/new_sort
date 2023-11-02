import requests
import bs4
import csv
from urllib.parse import urljoin
from PIL import Image
import os
import math
import glob


def parse_profile(url):
    res = requests.get(url)
    html_text = bs4.BeautifulSoup(res.content, "html.parser")
    birth_date = html_text.select_one(
        "#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(1) > dd"
    ).text
    birth_place = html_text.select_one(
        "#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(2) > dd"
    ).text
    mbti = html_text.select_one(
        "#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(3) > dd"
    ).text
    height = html_text.select_one(
        "#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(4) > dd"
    ).text
    hobby = html_text.select_one(
        "#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(5) > dd"
    ).text
    special_skill = html_text.select_one(
        "#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(6) > dd"
    ).text
    return (birth_date, birth_place, mbti, height, hobby, special_skill)


def generate_csv(save_pictures):
    base_url = "https://produce101.jp/"
    res = requests.get(urljoin(base_url, "/profile/list/"))
    html_text = bs4.BeautifulSoup(res.content, "html.parser")
    members = html_text.select(
        "#page--profile > section > div.inner > div > ul > li > div"
    )

    for file in glob.glob("../public/member_pics/*.webp"):
        os.remove(file)

    items = []
    with open("../src/NP_DB/members_full.csv", "w") as f:
        writer = csv.writer(f)
        header = [
            "member_id",
            "name",
            "birth_date",
            "birth_place",
            "mbti",
            "height",
            "hobby",
            "special_skill",
            "icon_url",
            "profile_url",
        ]
        items.append(header)
        writer.writerow(header)
        identifier = 1

        for member in members:
            if member.find("div", class_="name").a == None:
                continue
            name = member.find("div", class_="name").a.text
            member_profile_url = urljoin(
                base_url, member.find("div", class_="photo").a["href"]
            )
            member_img_url = urljoin(
                base_url, member.find("div", class_="photo").img["src"]
            )
            birth_date, birth_place, mbti, height, hobby, special_skill = parse_profile(
                member_profile_url
            )

            item = [
                identifier,
                name,
                birth_date,
                birth_place,
                mbti,
                height,
                hobby,
                special_skill,
                member_img_url,
                member_profile_url,
            ]
            writer.writerow(item)
            items.append(item)
            print(*item)
            identifier += 1

            data = requests.get(member_img_url).content

            if save_pictures:
                with open("../public/member_pics/" + name + ".jpg", mode="wb") as f2:
                    f2.write(data)
                img = Image.open("../public/member_pics/" + name + ".jpg")
                img.save("../public/member_pics/" + name + ".webp", quality=70)
                os.remove("../public/member_pics/" + name + ".jpg")

    with open("../src/NP_DB/members_minimal.csv", "w") as f:
        writer = csv.writer(f)
        writer.writerows([i[1:-2] for i in items])


def estimate_sort_count(n):
    ans = 0
    for k in range(1, n + 1):
        ans += math.ceil(math.log2(3 * k / 4))
    return ans


if __name__ == "__main__":
    generate_csv(True)
