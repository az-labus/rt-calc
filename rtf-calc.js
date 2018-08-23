// (c) Neetcord

var Bluebird = Promise.noConflict();

jQuery(document).ready(function($) {

    var serverList = ["명량", "노량", "한산도", "옥계"];
    var rotationList = ["샌디에이고", "타카오", "프린츠오이겐", "후드", "워스파이트", "엔터프라이즈", "일러스트리어스"];

    var serverDiv = $("section.example-answer");
    var expectingDiv = $("section.expecting-answer");

    // Add Calculator DOM
    serverList.forEach(function(s) {

        var tempServerDOM
            = "<div class='server'>"
                + "<h3>" + s + "</h3>"
            + "</div>"
            ;

        var tempExpDOM
            = "<div class='answer'>"
                + "<h3>" + s + "</h3>"
            + "</div>"
            ;

        serverDiv.append(tempServerDOM);
        expectingDiv.append(tempExpDOM);

    });

    var table = $("tbody.history-tbody");
    var sTH = $("th.result");
    var sTR = $("tr.servers");
    var sep = $("td.sep");
    var trs = [];
    var log = {};
    var servers = [];
    var index = {};

    // Add History DOM
    new Bluebird(function (ok) {

        // Get history
        $.getJSON("./history/index.json", function (data) {

            index = data;

            var tempC = 0;

            // Fetch data and set server list
            for (var i = data.start; i <= data.end; i++) {

                $.getJSON("./history/" + i + ".json", function (data) {

                    var dataServers = Object.keys(data);

                    dataServers.forEach(function (s) {

                        if (!servers.includes(s)) {
                            servers.push(s);
                            sTR.append("<th>" + s + "</th>");
                        }

                    });

                    sTH.attr("colspan", servers.length);
                    sep.attr("colspan", servers.length + 1);

                    log[tempC] = data;

                    if (++tempC > index.end)
                        ok();

                });

            }

        });

    }).then(function () {

        // Create trs
        $.each(log, function (k, v) {

            var tempDOM = "<tr>";
            tempDOM += "<td class='th'>제" + (Number(k) + 1) + "회</td>";

            var ss = Object.keys(v);

            servers.forEach(function (s) {

                if (ss.includes(s)) {
                    tempDOM += "<td>" + v[s] + "</td>";
                } else {
                    tempDOM += "<td>-</td>";
                }

            });

            trs.push(tempDOM);

        });

        return;

    }).then(function () {

        // Append trs
        for (var i = index.start; i <= index.end; i++) {

            table.append(trs[i]);

        }

    }).catch(function (x) {

        console.error("Error occurred while processing rotation histories.");
        console.debug(x);

    });

});
