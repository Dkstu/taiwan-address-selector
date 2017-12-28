var url = (new URL(document.currentScript.src)).pathname;
var baseUrl = url.substring(0, url.lastIndexOf("/") + 1)

function readFile(file) {
    var result = '';
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", baseUrl + file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState !== 4) return;
        if(rawFile.status === 200 || rawFile.status == 0) {
          result = JSON.parse(rawFile.responseText)
        }
    }
    rawFile.send(null);
    return result;
}

var TaiwanRoadSelecter = function (targetQuery) {
    var city_area = readFile("city.json");
    var citys = Object.keys(city_area);
    var target = document.querySelector(targetQuery)

    if (target === null) {
        console.error("TaiwanRoadSelecter: can't find '" + targetQuery + "'");
        return false;
    }

    return {
        citys: citys,
        city_area: city_area,
        target: target,
        city: {id: 'city', def_opt: '城市'},
        area: {id: 'area', def_opt: '行政區'},
        road: {id: 'road', def_opt: '路名'},
        init: function () {

            this.city.onChange = this.onChanges.onCity;
            this.city = this.getSelect(this.city);
            this.city.updateOptions(this.citys);
            this.target.appendChild(this.city)

            this.area.onChange = this.onChanges.onArea;
            this.area = this.getSelect(this.area);
            this.target.appendChild(this.area)

            this.road = this.getSelect(this.road);
            this.target.appendChild(this.road)

        },
        getCity: function () {
            return this.city.getSelectedValue()
        },
        getArea: function () {
            return this.area.getSelectedValue()
        },
        getRoad: function () {
            return this.road.getSelectedValue()
        },
        getAddress: function () {
            return this.getCity() + this.getArea() + this.getRoad();
        },
        onChanges : {
            onCity: function () {
                var trs = this.trs;
                var city = this.getSelectedValue();

                trs.area.removeAllChild();
                trs.road.removeAllChild();
                trs.area.updateOptions(trs.city_area[city]);
            },
            onArea: function () {
                var trs = this.trs;
                var area = this.getSelectedValue();
                var city = trs.city.getSelectedValue();
                var road_data = trs.readFile("./area/" + city + "/" + area + ".json")

                trs.road.removeAllChild()
                trs.road.updateOptions(road_data)
            },
        },
        getSelect: function (obj) {
            var select = document.createElement("select");
            select.id = obj.id;
            select.def_opt = obj.def_opt;
            select.addEventListener("change", obj.onChange)
            select.removeAllChild = this.selectMethod.removeAllChild;
            select.updateOptions = this.selectMethod.updateOptions;
            select.getSelectedValue = this.selectMethod.getSelectedValue;
            select.trs = this;

            select.updateOptions([select.def_opt])
            return select;
        },
        selectMethod: {
            getSelectedValue: function () {
                return this.options[this.selectedIndex].value;
            },
            updateOptions: function (option_data) {
                var target = this;
                for (var i = 0; i < option_data.length; i++) {
                    var data = option_data[i];
                    var option = document.createElement("option");
                    option.value = option.text = data;
                    if (data == target.def_opt) option.value = '';
                    target.appendChild(option);
                }
                return target;
            },
            removeAllChild: function () {
                while (this.firstChild) {
                    this.removeChild(this.firstChild);
                }
                this.updateOptions([this.def_opt])
            },
        },
        readFile: readFile

    }

}

