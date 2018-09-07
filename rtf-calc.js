// (c) Neetcord

var Bluebird = Promise.noConflict();

jQuery(document).ready(function($) {

    var serverList = ["명량", "노량", "한산도", "옥계"];
    var rotationList = ["샌디에이고", "타카오", "프린츠오이겐", "후드", "워스파이트", "엔터프라이즈", "일러스트리어스"];

    var serverBtn = $("button.retry");
    var expectingDiv = $("section.expecting-answer");

    // Add Calculator DOM
    serverList.forEach(function(s) {

        var tempServerDOM
            = "<div class='server' data-name='" + s + "'>"
                + "<h4>" + s + "</h4>"
                + "<p class='example'></p>"
            + "</div>"
            ;

        var tempExpDOM
            = "<div class='answer' data-name='" + s + "'>"
                + "<h4>" + s + "</h4>"
            + "</div>"
            ;

        $(tempServerDOM).insertBefore(serverBtn);
        expectingDiv.append(tempExpDOM);

    });

    // Set examples
    var exampleList = {};
    var shuffle = function () {

        exampleList = {};
        serverList.forEach(function (s) {

            exampleList[s] = rotationList[Math.floor(Math.random() * rotationList.length)];

            $(document.querySelector("div.server[data-name=" + s + "] > p.example")).text(exampleList[s]);

        });

        $(document.activeElement).blur();

    };
    shuffle();
    serverBtn.click(shuffle);

    // Add selections
    var optionDOM = "<option value='!'>선택</option>";
    rotationList.forEach(function (r) {
        optionDOM += "<option value='" + r + "'>" + r + "</option>";
    });
    serverList.forEach(function (s) {
        $(document.querySelector("div.answer[data-name=" + s + "]")).append(
            "<select data-name='" + s + "'>" + optionDOM + "</select>"
        );
    });

    // Add Calculation Function
    var calculate = function () {

        var input = {};

        // Gather answer
        serverList.forEach(function (s) {

            var value = $(document.querySelector("div.answer[data-name=" + s + "] > select")).val();

            if (value !== "!") {

                input[s] = value;

            }

        });

        // Calculate score
        if (Object.keys(input).length !== Object.keys(serverList).length) {

            $("p.error").text("모든 서버를 올바로 입력해주세요.");
            $("span.score").text("???");

        } else {

            $("p.error").text("");

            var score = 0;
            var remainedList = {};
            var remainedInput = {};

            $.each(exampleList, function (k, v) {

                if (input[k] == v) {// Perfect Answer

                    score += 4;

                } else {
                    remainedList[k] = v;
                    remainedInput[k] = input[k];
                }

            });

            var answerValuePool = Object.values(remainedInput);
            var originValuePool = Object.values(input);

            $.each(remainedList, function (k, v) {

                if (answerValuePool.includes(v)) // Unfortunate Answer (High)
                    score += 2;
                else if (originValuePool.includes(v)) // Unfortunate Answer(Low)
                    score += 1;

            });

            $("span.score").text(score.toString());

        }

        $(document.activeElement).blur();

    };
    $("button.calculate").click(calculate);

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

            var tempC = data.start;

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

            tempDOM += "</tr>";
            
            var dom = $.parseHTML(tempDOM)[0];
            
            $(dom).click(function () {

                exampleList = {};
                serverList.forEach(function (s) {

                    exampleList[s] = v[s];

                    $(document.querySelector("div.server[data-name=" + s + "] > p.example")).text(exampleList[s]);

                });

                $(document.activeElement).blur();

            });

            trs.push(dom);

        });

        return;

    }).then(function () {

        // Append trs
        trs.forEach(function (tr) {

            table.append(tr);

        });

    }).catch(function (x) {

        console.error("Error occurred while processing rotation histories.");
        console.debug(x);

    });

});
