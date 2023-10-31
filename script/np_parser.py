import requests
import bs4
import csv
from urllib.parse import urljoin


def parse_profile(url):
    res = requests.get(url)
    html_text = bs4.BeautifulSoup(res.content, 'html.parser')
    birth_date = html_text.select_one('#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(1) > dd').text
    birth_place = html_text.select_one('#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(2) > dd').text
    mbti = html_text.select_one('#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(3) > dd').text
    height = html_text.select_one('#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(4) > dd').text
    hobby = html_text.select_one('#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(5) > dd').text
    special_skill = html_text.select_one('#page--profile > section > div.inner > div > div:nth-child(2) > div.profile-outline > div.text > dl > div:nth-child(6) > dd').text
    return (birth_date, birth_place, mbti, height, hobby, special_skill)

base_url = 'https://produce101.jp/'
res = requests.get(urljoin(base_url, '/profile/list/'))
html_text = bs4.BeautifulSoup(res.content, 'html.parser')
members = html_text.select('#page--profile > section > div.inner > div > ul > li > div')

with open('members.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(['member_id', 'name', 'birth_date', 'birth_place', 'mbti', 'height', 'hobby', 'special_skill'])
    identifier = 1
    
    for member in members:
        if member.find('div', class_='name').a == None:
            continue
        name = member.find('div', class_='name').a.text
        member_profile_url = urljoin(base_url, member.find('div', class_='photo').a['href'])
        member_img_url = urljoin(base_url, member.find('div', class_='photo').img['src'])
        birth_date, birth_place, mbti, height, hobby, special_skill = parse_profile(member_profile_url)
        writer.writerow([identifier, name, birth_date, birth_place, mbti, height, hobby, special_skill])
        print(*[identifier, name, birth_date, birth_place, mbti, height, hobby, special_skill, member_img_url])
        identifier += 1

        data = requests.get(member_img_url).content
        with open(name + '.jpg', mode='wb') as f2:
            f2.write(data)
