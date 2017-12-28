#!/usr/bin/python3
import os
import csv
import json

def rindex(mylist, myvalue):
    return len(mylist) - mylist[::-1].index(myvalue) - 1

def indexRange(list1, list2):
    return [[value, list2.index(value), rindex(list2, value)] for value in set(list1)]

csv_file = "opendata106road+v1.1.csv"

with open(csv_file, 'r') as f:
    reader = csv.reader(f)
    data_list = list(reader)

# 刪除title
del data_list[0:2]

# 城市
city_list = [item[0] for item in data_list]
city_list_uniq = set(city_list)
city_list_range = indexRange(city_list_uniq, city_list)
# 區域
area_list = [item[1].replace(item[0], item[0] + "/") for item in data_list]
# area_list = [item[1] for item in data_list]
area_list_uniq = set(area_list)
area_list_range = indexRange(area_list_uniq, area_list)
# 路名
road_list = [item[2] for item in data_list]

area_dict = {item[0]: road_list[item[1]:item[2]] for item in area_list_range}
city_dict = {item[0]: [area.replace(item[0] + "/", "") for area in set(area_list[item[1]:item[2]])] for item in city_list_range}

def createJsonFile(file_name, data):
    json_str = json.dumps(data)
    with open(file_name + ".json", 'w') as json_file:
        json_file.write(json_str)
    return

createJsonFile("../js/city", city_dict)

for city in city_list_uniq:
    if not os.path.exists("../js/area/" + city):
        os.makedirs("../js/area/" + city)
for area in area_dict:
    createJsonFile("../js/area/" + area, area_dict[area])






