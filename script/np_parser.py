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


def generate_base_csv_data(save_pictures):
  base_url = "https://produce101.jp/"
  res = requests.get(urljoin(base_url, "/profile/list/"))
  html_text = bs4.BeautifulSoup(res.content, "html.parser")
  members = html_text.select(
    "#page--profile > section > div.inner > div > ul > li > div"
  )

  items = []
  urls = [["image_url", "profile_url"]]
  header = [
    "member_id",
    "name",
    "birth_date",
    "birth_place",
    "mbti",
    "height",
    "hobby",
    "special_skill",
  ]
  items.append(header)
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
      special_skill
    ]
    urls.append([member_img_url, member_profile_url])
    items.append(item)
    print(*item)
    identifier += 1
  return items, urls


def add_ranking(data):
  base_url = "https://produce101.jp/"
  res = requests.get(urljoin(base_url, "/rank/index.php"))
  html_text = bs4.BeautifulSoup(res.content, "html.parser")
  weeks = [i.attrs["value"] for i in html_text.select("#select > option")]

  for week in weeks:
    week_int = int(week.split("=")[-1])
    url = urljoin(base_url, "/rank/index.php"+week)
    res = requests.get(url)
    html_text = bs4.BeautifulSoup(res.content, "html.parser")
    ranks = html_text.find_all("li", class_="list--ranking__item")  
    for (i, val) in enumerate(data):
      if i:
        data[i].append("")
      else:
        data[i].append(f"week_{week_int}_rank")
  
    for rank in ranks:
      name = rank.find("div", class_="name").text
      icon_rank = rank.find("div", class_="icon-rank")
      if icon_rank is None:
        ranking = "???"
      else:
        ranking = int(icon_rank.text)

      for (i, val) in enumerate(data):
        if val[1] == name:
          data[i][-1] = ranking
          break
  return data


def generate(save_pictures):
  items, urls = generate_base_csv_data(True)
  items = add_ranking(items)
  for (i, url_item) in enumerate(urls):
    items[i] += url_item
  with open("../src/NP_DB/members_full.csv", "w") as f:
    writer = csv.writer(f)
    writer.writerows(items)
  with open("../src/NP_DB/members_minimal.csv", "w") as f:
    writer = csv.writer(f)
    writer.writerows([i[1:-2] for i in items])

  if save_pictures:
    for file in glob.glob("../public/member_pics/*.webp"):
      os.remove(file)
    for (i, (member_img_url, _)) in enumerate(urls[1:]):
      data = requests.get(member_img_url).content
      name = items[i+1][1]
      with open("../public/member_pics/" + name + ".jpg", mode="wb") as f2:
        f2.write(data)
      img = Image.open("../public/member_pics/" + name + ".jpg")
      img.save("../public/member_pics/" + name + ".webp", quality=60)
      os.remove("../public/member_pics/" + name + ".jpg")


if __name__ == "__main__":
  generate(True)
