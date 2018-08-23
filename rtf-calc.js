// (c) Neetcord

jQuery(document).ready(function($) {

    var serverList = ["명량", "노량", "한산도", "옥계"];
    var rotationList = ["샌디에이고", "타카오", "프린츠오이겐", "후드", "워스파이트", "엔터프라이즈", "일러스트리어스"];

    var serverDiv = $("section.calculation > section.example-answer");
    var expectingDiv = $("section.calculation > section.expecting-answer");

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

    // Get history
    $.getJSON("./history/index.json", function (data) {

        var table = $("table.history-table");
        var sTH = $("table.history-table > tr > th.result");
        var sTR = $("table.history-table > tr.servers");
        var trs = [];
        var log = {};
        var servers = [];

        // Fetch data and set server list
        for (var i = data.start; i <= data.end; i++) {

            $.getJSON("./history/" + i + ".json", function (data) {

                var dataServers = Object.keys(data);

                dataServers.forEach(function (s) {

                    if (!servers.includes(s)) {
                        servers.push(s);
                        console.log("Addd");
                        sTR.append("<th>" + s + "</th>");
                    }

                });

                console.log(data);
                sTH.attr("colspan", servers.length);

                log[i] = data;

            });

        }

        // Create trs
        $.each(log, function (k, v) {

            var tempDOM = "<tr>";
            tempDOM += "<td class='th'>제" + (k + 1) + "회</td>";

            var ss = Object.keys(v);

            servers.forEach(function (s) {

                if (ss.includes(s)) {
                    tempDOM += "<td>" + v[s] + "</td>";
                } else {
                    tempDOM += "<td>-</td>";
                }

            });

            trs.push(tempDOM);

        })

        // Append trs
        for (var i = data.start; i < data.end; i++) {

            table.append(trs[i]);

        }

    });

});
