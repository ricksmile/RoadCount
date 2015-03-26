
//公用變數
/*localStorage.setItem('Type', 1);  Type=1:路口停等延滯評估;type=2:路段旅行速率評估;type=3:路口與路段綜合評估;
localStorage.setItem('CityType','高度都市化');//高度都市化,中度都市化,一般都市
localStorage['CityName'] ://城市名稱
localStorage['Step1Parameter'] ://步驟一所有參數
localStorage['Step2Parameter'] ://步驟二所有參數
localStorage['Step3Parameter'] ://步驟三所有參數

localStorage.setItem("Step1Parameter", JSON.stringify($.each($('input.option').serializeArray()));

*/

$(function () {

    //save('1123');
    $('#myModal').modal()
    //新增一個版型物件,專門針對模式而並更版型文字
    var cahgeTypeObj = new CahgeTypeObj;
    //新增一個表格物件，專門在新增表格動作
    var roadobj = new RoadObj;
    //新增一個連結物件，專門在做類型連結動作
    var relateobj = new RelateObj;
    //var dataObj = null;
    //所有回傳皆為同步，因為資料小
    $.ajaxSettings.async = false;

    //alert(localStorage['Type'])


    //秀出第一個步驟
    $('div.step').hide();
    $('div.step').eq(0).show();

    //賦予第一步驟的程式選項點擊功能
    $('ul.dropdown-menu li').delegate('a', 'click', function () {
        localStorage.setItem('CityType', $(this).attr('value'))
        localStorage.setItem('CityName', $(this).text())
        //呼叫儲存設定
        setStepTitle();
    })

    //賦予對話框各選項共用變數並更換所有區塊的文字選項
    $('div.modal-body').delegate('p.tag', 'click', function () {
        switch ($(this).text()) {
            case '1.路口停等延滯評估':
                localStorage.setItem('Type', 1);
                break;
            case '2.路段旅行速率評估':
                localStorage.setItem('Type', 2);
                break;
            case '3.路口與路段綜合評估':
                localStorage.setItem('Type', 3);
                break;
        }

        $('#myModal').modal('hide')
        //變更版型含所有步驟的css
        cahgeTypeObj.saveCss();

        //呼叫儲存設定
        setStepTitle();


    })


    //賦予清除所有設定點擊功能且回到第一步驟
    $('div.modal-footer').delegate('button.clearall', 'click', function () {
        localStorage.clear();
        $('div.step').hide();
        $('div.step').eq(0).show();
        $('#myModal').modal('hide');
        cahgeTypeObj.saveCss();
    })


    //賦予每一個步驟下一步與上一步的功能

    $('div.step').delegate('span.button', 'click', function () {
        var buttonValue = $(this).text();
        $('div.step').hide();
        switch (buttonValue) {
            case '下一步':
                $(this).parent().next('.step').show();

                //alert($(this).index())
                switch ($(this).attr('value')) {
                    case '步驟一': //步驟一
                        localStorage.setItem("Step1Parameter", JSON.stringify($('input.option').serializeArray()));


                        if (localStorage['Type']=='3') {
                            var Parameter = JSON.parse(localStorage['Step2Parameter']);
                            for (var i = 1; i <= Parameter.length; i++) {
                                if (i % 3 == 0) {
                                    var table = $('table.table').get(1);
                                    $(table).append(roadobj.setRoadSec(roadobj));
                                }

                            }
                            $.each($($('table.table').get(1)).find('input'), function (i, field) {
                                this.value = Parameter[i].value;

                            })
                        }//end if
                        


                        break;
                    case '步驟二': //步驟二
                        localStorage.setItem("Step2Parameter", JSON.stringify($($('table.table').get(1)).find('input').serializeArray()));
                        relateobj.yearType();
                        roadobj.moveFunc(roadobj);
                        var Parameter = JSON.parse(localStorage['Step3Parameter']);

                        //輪詢所有的input值插入123
                        // var colors = []; // 空陣列
                        // var colors1 = []; // 空陣列
                        $.each($($('div.step').get(2)).find('input').serializeArray(), function (i, field) {

                            if (Parameter[i].name != 'TTT' && Parameter[i].name != 'YTTT' && Parameter[i].name != 'TFCD' && Parameter[i].name != 'YTFCD' && Parameter[i].name != 'YTCO2') {
                                var Condition = $($('div.step').get(2)).find('input')[i];
                                if (Condition.name != 'TTT' && Condition.name != 'YTTT' && Condition.name != 'TFCD' && Condition.name != 'YTFCD' && Condition.name != 'YTCO2') {
                                    $($('div.step').get(2)).find('input')[i].value = Parameter[i].value;
                                }

                            }



                        })

                        break;
                    case '步驟三': //步驟三

                        //儲存步驟二
                        //1234
                        localStorage.setItem("Step3Parameter", JSON.stringify($($('div.step').get(2)).find('input').serializeArray()));

                        var Parameter = JSON.parse(localStorage['Step3Parameter']);


                        //.attr({ 'name': 'L' })
                        roadobj.resultObj();
                        break;
                }


                break;
            case '上一步':
                $(this).parent().prev('.step').show();
                break;


            default:

                break;
        }

    }); //end of $('div.step').each(function () {

    //賦予新增路口個數功能
    $('span.add').delegate('a', 'click', function () {
        var table = $('table.table').get(1);
        $(table).append(roadobj.setRoadSec(roadobj));


    });
    //賦予縮減路口個數功能
    $('span.sub').delegate('a', 'click', function () {
        var table = $('table.table').get(1);
        $($(table)).find('tr').last().remove();

    });

    //步驟一的設定值
    //判斷步驟一的模式
    cahgeTypeObj.saveCss();

    //呼叫儲存設定
    setStepTitle();

    //秀出第一個版型的時段設定
    var Parameter = JSON.parse(localStorage['Step1Parameter']);
    $.each($($('div.step').eq(0)).find('input.option'), function (i, field) {
        var selfs = this;
        $.each(Parameter, function (j, field) {
            if (selfs.name == Parameter[j].name) {
                $(selfs).attr('checked', true);
            }
        })



    })

});


/*以下是物件定義*/

//動態建立道路表格物件
RoadObj = function () {

    //1.動態新增路段表格
    this.setRoadSec = function (roadobj) {
        var htmlStr1 = '<input name="幹道名稱" class="span2"  type="text"/>';
        var htmlStr2 = '<input name=" 往"  class="span2"  type="text"/>';
        var htmlStr3 = '<input name="路口數"  class="span2""  type="text"/>';

        var newDiv = $('<tr/>').addClass('')
        .append($('<td/>').addClass('').append(htmlStr1))
        .append($('<td/>').addClass('').append(htmlStr2))
        .append($('<td/>').addClass('').append($(htmlStr3)))//end of append

        return newDiv;

    }


    //2.動態新增圖型    
    this.getRoadSec = function (number) {

        var newDiv = $('<div/>').addClass('outer_road');
        for (var i = 1; i <= number; i++) {
            if (i != number)
                newDiv.append($('<div/>').addClass('sidebar_road').text('路口' + i))
                  .append(
                          $('<div/>').addClass('content_road')
                          .append($('<div/>').addClass('innerRow1_road').append($('<abbr/>').text('L' + i).attr({ 'title': '路口' + i + '與路口' + (i + 1) + '之距離(m)' })).append($('<input class="span1"/>').attr({ 'name': 'L' })))
                          .append($('<div/>').addClass('header_road'))
                          .append($('<div/>').addClass('innerRow2_road').append($('<abbr/>').text('V' + i + ',out').attr({ 'title': '路口' + i + '之幹道流出流量(pcu)' })).append($('<input class="span1"/>').attr({ 'name': 'Vout' })))
                          .append($('<div/>').addClass('innerRow3_road').append($('<abbr/>').text('FD' + (i + 1)).attr({ 'title': '路口' + (i + 1) + '之事後停等延滯(秒)' })).append($('<input/ class="span1">').attr({ 'name': 'FD' })))
                          .append($('<div/>').addClass('innerRow3_road').append($('<abbr/>').text('AD' + (i + 1)).attr({ 'title': '路口' + (i + 1) + '之事前停等延滯(秒)' })).append($('<input/ class="span1">').attr({ 'name': 'AD' })))
                          .append($('<div/>').addClass('innerRow3_road').append($('<abbr/>').text('V' + (i + 1) + ',in').attr({ 'title': '路口' + (i + 1) + '之幹道流入流量(pcu)' })).append($('<input class="span1"/>').attr({ 'name': 'Vin' })))
                   )
            else
                newDiv.append($('<div/>').addClass('sidebar_road').text('路口' + i))


        }


        return newDiv;

    }

    //3連動模組
    this.moveFunc = function (roadobj) {



        //觸發新增表格事件
        //1.查詢第二步驟的所有表格
        var table = $('table.table').get(1);
        var tr = $(table).find('tr');

        if (tr.length > 1) {//代表有資料存入localstorage
            //183
            localStorage.setItem('tableStep2', table.innerHTML);
            //儲存步驟二的表格參數

        }


        //2.找到後輪巡長出html(),清空裡面值
        $('#graphic').html(null);


        //跑大項迴圈附加上去
        $.each($('input.option').serializeArray(), function (i, field) {
            //建立一個html obj
            var htmlobj = $('<div/>').attr('value', field.name).addClass('時段區塊');
            var createHtmlObj = new CreateHtmlObj();

            $('#graphic').append('<a href="#" class="btn btn-large btn-primary disabled">' + field.name + '</a>');
            switch (localStorage['Type']) {
                case '1': //路口停等延滯評估
                    var table_tmp = $('<table/>').addClass('table table-bordered roadMode1Table').append(
                    $('<tr/>').addClass('success lead')
                        .append($('<td/>').text('路口'))
                        .append($('<td/>').text('路口流量(pcu)'))
                        .append($('<td/>').text('事前停等延滯(秒)'))
                        .append($('<td/>').text('事後停等延滯(秒)'))
                    )//end  table_tmp
                    var value = $($(tr).get(0)).find('input').serializeArray()[0].value;
                    localStorage.setItem('Step2Value1', value);

                    for (var j = 0; j < parseInt(value); j++) {
                        var tr_tmp = $('<tr/>').addClass('lead text-info');
                        $(tr_tmp).append($('<td/>').text('路口' + (j + 1)));
                        $(tr_tmp).append($('<td/>').append($('<input name="V" class="span2"  type="text"/>')));
                        $(tr_tmp).append($('<td/>').append($('<input name="FD" class="span2"  type="text"/>')));
                        $(tr_tmp).append($('<td/>').append($('<input name="AD" class="span2"  type="text"/>')));
                        $(table_tmp).append(tr_tmp);
                    }
                    //2.添加計算
                    table_tmp = createHtmlObj.addAccountButton(table_tmp);

                    //3.加入#graphic區塊中

                    $(htmlobj).append(table_tmp);


                    break;
                case '2': //路段旅行速率評估
                    //1. 建立table 跟欄位
                    var table_tmp = $('<table/>').addClass('table table-bordered').append(
                    $('<tr/>').addClass('success lead')
                        .append($('<td/>').text('路段'))
                        .append($('<td/>').text('距離(km)'))
                        .append($('<td/>').text('路段平均流量(pcu)'))
                        .append($('<td/>').text('事前旅行速率(km/hr)'))
                        .append($('<td/>').text('事後旅行速率(km/hr)'))
                    )//end  table_tmp
                    var value = $($(tr).get(0)).find('input').serializeArray()[0].value;
                    localStorage.setItem('Step2Value2', value);
                    for (var j = 0; j < parseInt(value); j++) {
                        var tr_tmp = $('<tr/>').addClass('lead text-info');
                        $(tr_tmp).append($('<td/>').text('路段' + (j + 1)));
                        $(tr_tmp).append($('<td/>').append($('<input name="L" class="span2"  type="text"/>')));
                        $(tr_tmp).append($('<td/>').append($('<input name="V" class="span2"  type="text"/>')));
                        $(tr_tmp).append($('<td/>').append($('<input name="FD" class="span2"  type="text"/>')));
                        $(tr_tmp).append($('<td/>').append($('<input name="AD" class="span2"  type="text"/>')));
                        $(table_tmp).append(tr_tmp);
                    }
                    //2.添加計算
                    table_tmp = createHtmlObj.addAccountButton(table_tmp);
                    //3.加入#graphic區塊中
                    $(htmlobj).append(table_tmp);


                    break;
                case '3': //路口與路段綜合評估;
                    //會
                    $(tr).each(function (i, field) {
                        if (i > 0) {

                            var roadName = $(this).find('input').serializeArray();
                            var htmlobjHeader = $('<h3/>').addClass('路段名稱').text(roadName[0].value + ' 往' + roadName[1].value);
                            var htmlobjBody = $('<div/>').attr('value', roadName[0].value + ' 往' + roadName[1].value + ' ' + roadName[2].name + ':' + roadName[2].value)
                                            .addClass('路段區塊')
                                            .append(roadobj.getRoadSec(roadName[2].value))
                                            .append($('<div/>').addClass('innerRow4_road')
                                            .append($('<h4/>').text(' 幹道之事前平均旅行時間(秒)')
                                                            .append($('<input name="FT" class="span2"  type="text"/>'))
                                                            .append(' 幹道之事後平均旅行時間(秒)')
                                                            .append($('<input name="AT" class="span2"  type="text"/>'))
                                                            .append($('<a class="stepCaculte btn btn-large" size="2">計算</a>'))


                                            )).append($('<p/>'))


                            $(htmlobj).append(htmlobjHeader);
                            $(htmlobj).append(htmlobjBody)

                        }

                    }); //end of tr
                    //動態生出TTT 查詢DIV放在各時段的後面



                    break;


            } //end of switch(Type);

            htmlobj = createHtmlObj.addPublicTable(htmlobj)

            $('#graphic').append(htmlobj);

            //$('#graphic h3.green').hide();



        }); //end of each


        //每個圖表的計算按鈕功能，是為了計算各時段總車輛旅行時間減少量(TTT) //會
        $('h4').delegate('a.stepCaculte', 'click', function () {
            //alert()
            var L = 0; //路段i之長度
            var V = 0; //路口i之流量
            var DT = 0; //路口i本時段之停等延滯量
            var TDT = 0; //各時段DT加總
            var Vave = null; //路段平均流量
            var TT = null; //路段車輛旅行時間減少量(TT)(車小時)
            var FT = null; //事前平均旅行時間
            var AT = null; //事後平均旅行時間
            var TTT = 0; //各時段總車輛旅行時間減少量
            var YC = 0; //年化放大系數
            var YTTT = 0; //各時段全年時間節省
            var TYTTT = 0; //全年時間節省
            var TYTTT_money = 0; //全年時間價值節省
            var Lsum = 0; //道路總長度
            var FDsum = 0; //事前路口總停滯時間
            var ADsum = 0; //事後路口總停滯時間
            var FS = 0; //事前路段平均旅行速率
            var AS = 0; //事後路段平均旅行速率
            var FDV = 0; // FD1*V1+....
            var ADV = 0; // AD1*V1+....
            var FR0 = 1.5427; //小客車油耗率0
            var FRfs = 0; //FS油耗率
            var FRas = 0; //AS油耗率
            var FFC = 0; //事前路段油耗量
            var AFC = 0; //事後路段油耗量
            var FCD = 0; //FFC-AFC
            var TFCD = 0; //FCD加總
            var YTFCD = 0; //各時段全年油耗節省(YTFCD)
            var TYTFCD = 0; //全年油耗節省(TYTFCD)(公升)
            var TYTFCD_money = 0; //全年油耗價值節省(TYTFCD_money)(元)
            var OilPrice = 0; //油價
            var YTCO2 = 0; //各時段全年CO2減少量(YTCO2)(公噸)
            var TYTCO2 = 0; //全年CO2減少量(TYTCO2) (公噸)
            var TYTCO2_money = 0; //全年CO2貨幣化效益(TYTCO2_money) (元)
            var TYTALL = 0; //全年貨幣化效益(TYTALL)
            var relateobj = new RelateObj;
            var createHtmlObj = new CreateHtmlObj();


            switch (localStorage["Type"]) {
                case '1': //路口停等延滯評估

          
                    var relateobj = new RelateObj;

                    var content_roadObj = $(this).parent().parent().parent().parent().parent().find('tr');
                    $(content_roadObj).each(function (i, field) {
                        if (i > 0) {
                            var valueObj = $(this).find('input').serializeArray();
                            if (valueObj.length != 0) {
                                V = parseFloat(valueObj[0].value);
                                FD = parseFloat(valueObj[1].value);
                                AD = parseFloat(valueObj[2].value);
                                DT = (V * (FD - AD)) / 3600;
                                //2.計算TDT
                                TDT += DT;
                                //計算FFC
                                FFC += ((FD * V) / 3600) * FR0;
                                //計算AFC
                                AFC += ((AD * V) / 3600) * FR0;

                                //計算FCD
                                FCD = FFC - AFC

                                //計算TFCD
                                TFCD += FCD;
                            }


                        }
                    })
                    //3.計算YTTT
                    var index = $(this).parent().parent().parent().parent().parent().parent().attr('value');
                    YC = eval('dataObj.' + index);
                    YTTT = TDT * YC;
                    $(this).parent().parent().parent().parent().parent().parent().find('input.YTTT').attr('value', formatFloat(YTTT, 2));
                   
                    //4.計算TYTTT
                    $('#graphic').find('input.YTTT').each(function (i, field) {
                        TYTTT += parseFloat(field.value);
                    })

                    //5.計算TYTTT_money
                    TYTTT_money = TYTTT * 234.6;

                    //TFCD
                    $(this).parent().parent().parent().parent().parent().parent().find('input.TFCD').attr('value', formatFloat(TFCD, 2));


                    //計算YTFCD
                    YTFCD = TFCD * YC;
                    $(this).parent().parent().parent().parent().parent().parent().find('input.YTFCD').attr('value', formatFloat(YTFCD, 2))


                    //計算TYTFCD
                    $('#graphic').find('input.YTFCD').each(function (i, field) {
                        TYTFCD += parseFloat(field.value);
                    })

                    //計算TYTFCD_money油耗價值節省  
                    $('div.step').find('input').each(function (i, field) {
                        switch (field.name) {
                            case '95無鉛汽油油價':
                                OilPrice = parseFloat(field.value);

                                break;

                        }

                    })

                    TYTFCD_money = TYTFCD * OilPrice;

                    //計算各時段全年CO2減少量(YTCO2)(公噸)
                    YTCO2 = (YTFCD * 2263) / 1000000;
                    $(this).parent().parent().parent().parent().parent().parent().find('input.YTCO2').attr('value', formatFloat(YTCO2, 2))


                    //計算全年CO2減少量(TYTCO2) (公噸)
                    $('#graphic').find('input.YTCO2').each(function (i, field) {
                        TYTCO2 += parseFloat(field.value);
                    })



                    //計算全年CO2貨幣化效益(TYTCO2_money) (元)
                    TYTCO2_money = TYTCO2 * 590;

                    //計算全年貨幣化效益(TYTALL)
                    TYTALL = TYTTT_money + TYTFCD_money + TYTCO2_money;



                    //alert(formatFloat(TYTCO2_money, 2) + ':' + formatFloat(TYTALL, 2))


                    //把所有結果放在步驟四中
                    createHtmlObj.addStep4Table(TYTTT, TYTTT_money, TYTFCD, OilPrice, TYTFCD_money, TYTCO2, TYTCO2_money, TYTALL);



                    //  alert(content_roadObj.html())

                    break;
                case '2': //路段旅行速率評估            

                    var relateobj = new RelateObj;

                    var content_roadObj = $(this).parent().parent().parent().parent().parent().find('tr');
                    $(content_roadObj).each(function (i, field) {
                        if (i > 0) {
                            var valueObj = $(this).find('input').serializeArray();
                            if (valueObj.length != 0) {
                                L = parseFloat(valueObj[0].value);
                                V = parseFloat(valueObj[1].value);
                                FS = parseFloat(valueObj[2].value);
                                AS = parseFloat(valueObj[3].value);

                                //計算FT
                                FT = ((L / FS) / 1000) * 3600;
                                //計算AT
                                AT = ((L / AS) / 1000) * 3600;
                                //計算TT
                                TT = (V * (FT - AT)) / 3600;
                                //計算TTT
                                TTT += TT;

                                //計算FFC
                                relateobj.getOilData(FS);
                                FRfs = $('.小客車油耗率').text();
                                FFC += ((FT * V) / 3600) * FRfs;
                                //計算AFC
                                relateobj.getOilData(AS);
                                FRas = $('.小客車油耗率').text();
                                AFC += ((AT * V) / 3600) * FRas;

                                //計算FCD
                                FCD = FFC - AFC

                                //計算TFCD
                                TFCD += FCD;
                            }


                        }
                    })

                    //計算YTTT
                    var index = $(this).parent().parent().parent().parent().parent().parent().attr('value');
                    YC = eval('dataObj.' + index);
                    YTTT = TTT * YC;
                    $(this).parent().parent().parent().parent().parent().parent().find('input.TTT').attr('value', formatFloat(TTT, 2));
                    $(this).parent().parent().parent().parent().parent().parent().find('input.YTTT').attr('value', formatFloat(YTTT, 2));



                    //計算TYTTT
                    $('#graphic').find('input.YTTT').each(function (i, field) {
                        TYTTT += parseFloat(field.value);
                    })

                    //5.計算TYTTT_money
                    TYTTT_money = TYTTT * 234.6;

                    //TFCD
                    $(this).parent().parent().parent().parent().parent().parent().find('input.TFCD').attr('value', formatFloat(TFCD, 2));


                    //計算YTFCD
                    YTFCD = TFCD * YC;
                    $(this).parent().parent().parent().parent().parent().parent().find('input.YTFCD').attr('value', formatFloat(YTFCD, 2))


                    //計算TYTFCD
                    $('#graphic').find('input.YTFCD').each(function (i, field) {
                        TYTFCD += parseFloat(field.value);
                    })

                    //計算TYTFCD_money油耗價值節省  
                    $('div.step').find('input').each(function (i, field) {
                        switch (field.name) {
                            case '95無鉛汽油油價':
                                OilPrice = parseFloat(field.value);
                                break;

                        }

                    })

                    TYTFCD_money = TYTFCD * OilPrice;

                    //計算各時段全年CO2減少量(YTCO2)(公噸)
                    YTCO2 = (YTFCD * 2263) / 1000000;
                    $(this).parent().parent().parent().parent().parent().parent().find('input.YTCO2').attr('value', formatFloat(YTCO2, 2))


                    //計算全年CO2減少量(TYTCO2) (公噸)
                    $('#graphic').find('input.YTCO2').each(function (i, field) {
                        TYTCO2 += parseFloat(field.value);
                    })


                    //計算全年CO2貨幣化效益(TYTCO2_money) (元)
                    TYTCO2_money = TYTCO2 * 590;


                    //計算全年貨幣化效益(TYTALL)
                    TYTALL = TYTTT_money + TYTFCD_money + TYTCO2_money;



                    //alert(formatFloat(TYTCO2_money, 2) + ':' + formatFloat(TYTALL, 2))


                    //把所有結果放在步驟四中
                    createHtmlObj.addStep4Table(TYTTT, TYTTT_money, TYTFCD, OilPrice, TYTFCD_money, TYTCO2, TYTCO2_money, TYTALL);

                    break;
                case '3': //路口與路段綜合評估;


                    var content_roadObj = $(this).parent().parent().prev().find('.content_road')

                    //清空前一個計算結果
                    $(this).parent().parent().parent().find('.innerRow5_road').remove();


                    //計算此路段所有路段平均流量
                    $(content_roadObj).each(function (i, field) {

                        var valueObj = $(this).find('input').serializeArray();
                        //L*(Vint+Vout)
                        var number = parseFloat(valueObj[0].value) * (parseFloat(valueObj[1].value) + parseFloat(valueObj[4].value))
                        Vave += number;
                        //Lsum=L1+L2+...+Ln-1
                        Lsum += parseFloat(valueObj[0].value);
                        //FDsum=FD+FD+...FD-1
                        FDsum += parseFloat(valueObj[2].value);
                        //ADsum=AD+AD+...AD-1
                        ADsum += parseFloat(valueObj[3].value);
                        //FDV= FD1*V1+...FDn*Vn
                        FDV += parseFloat(valueObj[2].value) * parseFloat(valueObj[4].value);
                        //ADV= AD1*V1+...ADn*Vn
                        ADV += parseFloat(valueObj[3].value) * parseFloat(valueObj[4].value);
                    })
                    Vave = Vave / (2 * Lsum);
                    //計算此路段車輛旅行時間減少量(TT)(車小時)
                    //1.獲取FT 和AT值
                    $(this).parent().parent().find('input').each(function (i, field) {
                        switch (field.name) {
                            case 'FT':
                                FT = field.value;
                                break;
                            case 'AT':
                                AT = field.value;
                                break;
                        }

                    })
                    //2.計算TT
                    TT = (Vave * (FT - AT)) / 3600;

                    //新增一個DIV來顯示此路段的路段平均流量
                    $(this).parent().parent().parent().append($('<div/>').addClass('innerRow5_road')
            .append($('<h3/>').addClass('green').append($('<div/>').addClass('Vave').text('路段平均流量Vave:' + Vave))
            ));
                    //新增一個DIV來顯示此路段的TT值
                    $(this).parent().parent().parent().append($('<div/>').addClass('innerRow5_road')
            .append($('<h3/>').addClass('green').append($('<div/>').addClass('TT').text('計算此路段車輛旅行時間減少量(TT)(車小時):' + TT).attr('value', TT))
            ));



                    //3.計算TTT
                    $(this).parent().parent().parent().parent().find('div.TT').each(function (i, field) {
                        TTT += parseFloat($(this).attr('value'));
                    })

                    $(this).parent().parent().parent().parent().find('input.TTT').attr('value', TTT);

                    //4.計算YTTT


                    var index = $(this).parent().parent().parent().parent().attr('value');
                    YC = eval('dataObj.' + index);
                    // alert(YC);

                    YTTT = TTT * YC;
                    $(this).parent().parent().parent().parent().find('input.YTTT').attr('value', YTTT);

                    //5.計算TYTTT
                    $('#graphic').find('input.YTTT').each(function (i, field) {
                        TYTTT += parseFloat(field.value);
                    })

                    //6.計算TYTTT_money
                    TYTTT_money = TYTTT * 234.6;


                    //7.計算FS
                    FS = ((Lsum / (FT - FDsum)) / 1000) * 3600;
                    //新增一個DIV來顯示事前路段平均旅行速率(FS)(km/hr)
                    $(this).parent().parent().parent().append($('<div/>').addClass('innerRow5_road')
            .append($('<h3/>').addClass('green').append($('<div/>').addClass('FS').text('事前路段平均旅行速率(FS)(km/hr):' + FS))
            ));

                    //8.計算FFC
                    relateobj.getOilData(FS);
                    FRfs = $('.小客車油耗率').text();
                    FFC = ((Vave * (FT - FDsum)) / 3600 * FRfs) + ((FDV / 3600) * FR0);
                    //新增一個DIV來顯示事前路段油耗量(FFC)(公升)
                    $(this).parent().parent().parent().append($('<div/>').addClass('innerRow5_road')
            .append($('<h3/>').addClass('green').append($('<div/>').addClass('FFC').text('事前路段油耗量(FFC)(公升):' + FFC))
            ));

                    //9.計算AS
                    AS = ((Lsum / (AT - ADsum)) / 1000) * 3600;
                    //新增一個DIV來顯示事前路段平均旅行速率(AS)(km/hr)
                    $(this).parent().parent().parent().append($('<div/>').addClass('innerRow5_road')
            .append($('<h3/>').addClass('green').append($('<div/>').addClass('AS').text('事後路段平均旅行速率(AS)(km/hr):' + AS))
            ));

                    //10.計算AFC
                    relateobj.getOilData(AS);
                    FRas = $('.小客車油耗率').text();
                    AFC = ((Vave * (AT - ADsum)) / 3600 * FRas) + ((ADV / 3600) * FR0);
                    //新增一個DIV來顯示事後路段油耗量(AFC)(公升)
                    $(this).parent().parent().parent().append($('<div/>').addClass('innerRow5_road')
            .append($('<h3/>').addClass('green').append($('<div/>').addClass('AFC').text('事後路段油耗量(AFC)(公升):' + AFC))
            ));

                    //10.計算FCD
                    FCD = FFC - AFC;
                    //新增一個DIV來顯示各路段油耗節省(FCD)(公升)
                    $(this).parent().parent().parent().append($('<div/>').addClass('innerRow5_road')
            .append($('<h3/>').addClass('green').append($('<div/>').addClass('FCD').text('路段油耗節省(FCD)(公升):' + FCD).attr('value', FCD))
            ));

                    //11 .計算TFCD
                    $(this).parent().parent().parent().parent().find('div.FCD').each(function (i, field) {
                        TFCD = TFCD + parseFloat($(this).attr('value'));
                    })
                    $(this).parent().parent().parent().parent().find('input.TFCD').attr('value', TFCD);

                    //12.計算YTFCD
                    YTFCD = TFCD * YC;
                    $(this).parent().parent().parent().parent().find('input.YTFCD').attr('value', YTFCD)


                    //13.計算TYTFCD
                    $('#graphic').find('input.YTFCD').each(function (i, field) {
                        TYTFCD += parseFloat(field.value);
                    })

                    //14.計算油耗價值節省  
                    $('div.step').find('input').each(function (i, field) {
                        switch (field.name) {
                            case '95無鉛汽油油價':
                                OilPrice = parseFloat(field.value);
                                break;

                        }

                    })

                    TYTFCD_money = TYTFCD * OilPrice;


                    //15.計算各時段全年CO2減少量(YTCO2)(公噸)
                    YTCO2 = (YTFCD * 2263) / 1000000;
                    $(this).parent().parent().parent().parent().find('input.YTCO2').attr('value', YTCO2)


                    //16.計算全年CO2減少量(TYTCO2) (公噸)
                    $('#graphic').find('input.YTCO2').each(function (i, field) {
                        TYTCO2 += parseFloat(field.value);
                    })

                    //17.計算全年CO2貨幣化效益(TYTCO2_money) (元)
                    TYTCO2_money = TYTCO2 * 590;


                    //18.計算全年貨幣化效益(TYTALL)
                    TYTALL = TYTTT_money + TYTFCD_money + TYTCO2_money;



                    //把所有結果放在步驟四中
                    createHtmlObj.addStep4Table(TYTTT, TYTTT_money, TYTFCD, OilPrice, TYTFCD_money, TYTCO2, TYTCO2_money, TYTALL);


                    //把各時段去掉以及全年度都去掉
                    $('.innerRow5_road').hide();

                    break; // case 3 


            } //end of switch(Type);

            //做圖表參考http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/highcharts/demo/pie-basic/
            var rat1 = TYTALL / (TYTALL + TYTCO2_money + TYTFCD)
            var rat2 = TYTCO2_money / (TYTALL + TYTCO2_money + TYTFCD)
            var rat3 = TYTFCD / (TYTALL + TYTCO2_money + TYTFCD)



            $('#container2').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: '路線成本分析圖表'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                    percentageDecimals: 1
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                            }
                        }
                    }
                },

                series: [{
                    type: 'pie',
                    name: '分享比例',
                    data: [
                                    ['全年總貨幣化效益(元)', formatFloat(rat1, 2)],

                                    {
                                        name: '全年油耗節省(公升)',
                                        y: formatFloat(rat2, 2),
                                        sliced: true,
                                        selected: true
                                    },
                                    ['全年CO2貨幣化效益(元)', formatFloat(rat3, 2)],

                                  ]
                }]



            });


        }); //end of $('h4')




        //縮放每一個時段區塊功能  //不會
        $('.btn-primary').click(function () {
            $(this).next('.時段區塊').toggle('slow');

        })


       

    } //end of this.moveFunc

    //步驟四的結果
    this.resultObj = function () {
        var htmlobj = null;
        var step2table = $('div.changeStep2 table');
        var step2tr = $(step2table).find('tr');
        var createHtmlObj = new CreateHtmlObj();

        //1.新增都市層級
        $('div.都市層級').empty();
        $('div.都市層級').append($('<h3/>').text('都市層級')).append($('<h3/>').addClass('green').append($('<em/>').text(localStorage['CityType'])));
        //2.新增評估時段
        $('div.評估時段').empty();
        $('div.評估時段').append($('<h3/>').text('評估時段'));

        $.each($('input.option').serializeArray(), function (i, field) {
            $('div.評估時段').append($('<h3/>').addClass('green').append($('<em/>').text(field.name)));

        })
        //3.新增評估路段與路口
        $('div.評估路段與路口').empty();
        switch (localStorage['Type']) {
            case '1':
                $('div.評估路段與路口').append($('<h3/>').text('評估路口'));
                $(step2tr).each(function (i, field) {
                    var roadName = $(this).find('input').serializeArray();
                    $('div.評估路段與路口').append($('<h3/>').addClass('green').append($('<em/>').text(roadName[0].value)));

                }); //end of tr
                $('div.路口與路段績效值').empty();
                $('div.路口與路段績效值').append($('<h3/>').text('路口績效值(輸入值)'));
                $(step2tr).each(function (j, field) {
                    var roadName = $(this).find('input').serializeArray();
                    $.each($('input.option').serializeArray(), function (i, field) {


                        //1.找到此時段區塊
                        var div = $('div.時段區塊').get(i);

                        //2.找到此路段的區塊
                        createHtmlObj.addStep4Setting(div);

                    })
                })

                break;
            case '2':
                $('div.評估路段與路口').append($('<h3/>').text('評估路段'));
                $(step2tr).each(function (i, field) {

                    var roadName = $(this).find('input').serializeArray();
                    $('div.評估路段與路口').append($('<h3/>').addClass('green').append($('<em/>').text(roadName[0].value)));

                }); //end of tr
                $('div.路口與路段績效值').empty();
                $('div.路口與路段績效值').append($('<h3/>').text('路段績效值(輸入值)'));
                $(step2tr).each(function (j, field) {
                    var roadName = $(this).find('input').serializeArray();
                    $.each($('input.option').serializeArray(), function (i, field) {


                        //1.找到此時段區塊
                        var div = $('div.時段區塊').get(i);

                        //2.找到此路段的區塊
                        createHtmlObj.addStep4Setting(div);
                    })
                })

                break;
            case '3':
                $('div.評估路段與路口').append($('<h3/>').text('評估路段與路口'));
                $(step2tr).each(function (i, field) {
                    if (i > 0) {

                        var roadName = $(this).find('input').serializeArray();
                        $('div.評估路段與路口').append($('<h3/>').addClass('green').append($('<em/>').text(roadName[0].value + ' 往' + roadName[1].value + ' ' + roadName[2].name + ':' + roadName[2].value)));
                    }

                }); //end of tr

                //4.新增路口與路段績效值(輸入值)


                $('div.路口與路段績效值').empty();
                $('div.路口與路段績效值').append($('<h3/>').text('路口與路段績效值(輸入值)'));
                $(step2tr).each(function (j, field) {
                    if (j > 0) {

                        var roadName = $(this).find('input').serializeArray();
                        //跑時段迴圈
                        $.each($('input.option').serializeArray(), function (i, field) {

                            $('div.路口與路段績效值').append($('<h3/>').addClass('green').append($('<em/>').text(field.name + ' ' + roadName[0].value + ' 往' + roadName[1].value + ' ' + roadName[2].name + ':' + roadName[2].value)));
                            //生一個table
                            var table = $('<table/>').addClass('table table-bordered').append(
                                            $('<tr/>').addClass('success lead')
                                             .append($('<td/>').text(''))
                                             .append($('<td/>').text('幹道流入流量pcu'))
                                             .append($('<td/>').text('幹道流出流量pcu'))
                                             .append($('<td/>').text('事前停等延滯秒'))
                                             .append($('<td/>').text('事後停等延滯秒'))
                                             .append($('<td/>').text('與下一路口距離m'))
                                            )//end  table





                            //分析路段圖表塞入表格
                            //1.找到此時段區塊

                            var div = $('div.時段區塊').get(i);
                            //2.找到此路段的區塊
                            var div_outer_road = $(div).find('div.outer_road').get((j - 1));
                            var div_content_road = $(div_outer_road).find('.content_road');
                            var list_corect = [];
                            var list_tmp = [];
                            var Lsum = 0; //路段長度總合
                            $.each($(div_content_road), function (i, field) {

                                var list = [];
                                $.each($(this).find('input').serializeArray(), function (i, field) {
                                    list.push(field)
                                    //$(tr).append($('<div/>').addClass('cssno_td ').text('路段名稱'));
                                })
                                //把陣列轉換成正確的順序
                                if (i == 0) {
                                    list_corect.push(null);
                                    list_corect.push(list[1]);
                                    list_corect.push(null);
                                    list_corect.push(null);
                                    list_corect.push(list[0]);

                                    list_tmp.push(list[4]);
                                    list_tmp.push(list[2]);
                                    list_tmp.push(list[3]);
                                }
                                else {
                                    list_corect.push(list_tmp[0]);
                                    list_corect.push(list[1]);
                                    list_corect.push(list_tmp[1]);
                                    list_corect.push(list_tmp[2]);
                                    list_corect.push(list[0]);

                                    list_tmp.length = 0;
                                    list_tmp.push(list[4]);
                                    list_tmp.push(list[2]);
                                    list_tmp.push(list[3]);

                                }




                                //  list_corect = list


                                $(table).append(tr);
                            })//end each

                            //把list_corect陣列重組成tr 
                            var tr = $('<tr/>').addClass('lead text-info');
                            var lastNumber = 0;
                            for (var i = 0; i < list_corect.length; i++) {
                                var value = '';
                                if (list_corect[i] != null)
                                    value = list_corect[i].value;
                                if (i % 5 == 0) {
                                    $(table).append(tr);
                                    tr = $('<tr/>').addClass('lead text-info'); ;
                                    $(tr).append($('<td/>').text('路口' + (i / 5 + 1)));
                                    lastNumber = i / 5 + 2;
                                }

                                //計算路段長度
                                if (i % 5 == 4)
                                    Lsum += parseFloat(value);

                                $(tr).append($('<td/>').text(value));


                            }
                            $(table).append(tr);
                            //把list_tmp陣列重組成tr 
                            tr = $('<tr/>').addClass('lead text-info');
                            $(tr).append($('<td/>').text('路口' + lastNumber));
                            $(tr).append($('<td/>').text(list_tmp[0].value));
                            $(tr).append($('<td/>'));
                            $(tr).append($('<td/>').text(list_tmp[1].value));
                            $(tr).append($('<td/>').text(list_tmp[2].value));
                            $(tr).append($('<td/>'));


                            $(table).append(tr);
                            $('div.路口與路段績效值').append(table);

                            htmlobj = $('<em/>');
                            $.each($(div_outer_road).next().find('input').serializeArray(), function (i, field) {
                                var name = '';
                                switch (field.name) {
                                    case 'FT':
                                        name = '事前平均旅行時間(秒)'
                                        break;
                                    case 'AT':
                                        name = '事後平均旅行時間(秒)'
                                        break;
                                }

                                $(htmlobj).append(name + ':' + field.value + '   ');
                            })
                            $(htmlobj).append('路段長度(m):' + Lsum);

                            $('div.路口與路段績效值').append(htmlobj);



                        }) //end of each

                    } //end if

                }); //end of tr
                break;
        }








        //5.新增績效計算結果
        $('div.績效計算結果').empty();
        $('div.績效計算結果').append($('<h3/>').text('績效計算結果'));
        //1.新增績效計算結果表格標頭
        //生一個table
        var table = $('<table/>').addClass('table table-bordered')
        var tr = $('<tr/>').addClass('success lead')
        $(tr).append($('<td/>'))

        $.each($('input.option').serializeArray(), function (i, field) {
            $(tr).append($('<td/>').text(field.name))

        })
        $(table).append(tr)

        //找到各路段的迴圈
        $(step2tr).each(function (i, field) {
            if (i > 0) {

                var roadName = $(this).find('input').serializeArray();
                var roadNameValue = roadName[0].value + '往' + roadName[1].value;

                tr = $('<tr/>').addClass('lead')
                $(tr).append($('<td/>').text(roadNameValue + ' 車輛旅行時間減少量(車小時)'))
                //裡面再跑時段的迴圈
                $('div.時段區塊').each(function (j, field) {
                    //去每個時段的迴圈取出相對應的路段名稱
                    $(this).find('div.路段區塊').each(function (k, field) {
                        if (roadNameValue == $(this).attr('value')) {
                            //取出裡面的TT
                            var TT = $(this).find('div.TT').attr('value');
                            $(tr).append($('<td/>').text(TT))
                        }
                    })

                })
                $(table).append(tr)

            }
        }); //end of tr

        //新增各時段總車輛旅行時間減少量(車小時)行列 0820
        if (localStorage['Type'] == '3') {
            tr = $('<tr/>').addClass('lead');
            $(tr).append($('<td/>').text('各路段總車輛旅行時間減少量(車小時)'))
            //跑一次時段區塊的迴圈抓出TTT
            $('div.時段區塊').each(function (j, field) {

                var TTT = $(this).find("input[name='TTT']")[0].value;
                $(tr).append($('<td/>').text(formatFloat(TTT, 2)))

            })
        }


        $(table).append(tr)

        //新增年化放大系數行列
        tr = $('<tr/>').addClass('lead');
        $(tr).append($('<td/>').text('年化放大係數'))
        //跑時段迴圈，把值撈出來
        $('div.時段區塊').each(function (j, field) {
            var YC = eval('dataObj.' + $(this).attr('value'));
            $(tr).append($('<td/>').text(YC))
        })

        $(table).append(tr)

        //新增各時段全年時間節省(車小時)
        tr = $('<tr/>').addClass('lead');
        $(tr).append($('<td/>').text('各時段全年時間節省(車小時)'))

        $('div.時段區塊').each(function (j, field) {

            var YTTT = $(this).find("input[name='YTTT']")[0].value;
            $(tr).append($('<td/>').text(formatFloat(YTTT, 2)))

        })

        $(table).append(tr)


        //新增各時段全年油耗節省(公升)
        tr = $('<tr/>').addClass('lead');
        $(tr).append($('<td/>').text('各時段全年油耗節省(公升)'))

        $('div.時段區塊').each(function (j, field) {

            var YTFCD = $(this).find("input[name='YTFCD']")[0].value;
            $(tr).append($('<td/>').text(formatFloat(YTFCD, 2)))

        })

        $(table).append(tr)


        //新增各時段全年CO2節省(公噸)
        tr = $('<tr/>').addClass('lead');
        $(tr).append($('<td/>').text('各時段全年CO2節省(公噸)'))

        $('div.時段區塊').each(function (j, field) {

            var YTCO2 = $(this).find("input[name='YTCO2']")[0].value;
            $(tr).append($('<td/>').text(formatFloat(YTCO2, 2)))

        })

        $(table).append(tr)


        $('div.績效計算結果').append(table)



    }

    // .append(('<h3/>').text($('input').serializeArray()[0].value))
};



//動態連結類別物件
RelateObj = function () {

    this.yearType = function () {
        var typeUrl = '';
        switch (localStorage['CityType']) {
            case '高度都市化':
                typeUrl = 'data/mu-factor-high.json'
                break;
            case '中度都市化':
                typeUrl = 'data/mu-factor-mid.json'
                break;
            case '一般都市':
                typeUrl = 'data/mu-factor-low.json'
                break;
        }
        $.getJSON(typeUrl, function (data) {
            var pp = data;
            var optionList = ['平日上午尖峰', '平日下午尖峰', '假日上午尖峰', '假日下午尖峰', '平日離峰', '假日離峰']
            var list = [];
            $.each($('input.option').serializeArray(), function (i, field) {
                list.push(field.name);

            })

            var objlist = [];
            for (var i = 0; i < optionList.length; i++) {
                //比對
                for (var j = 0; j < list.length; j++) {
                    if (list[j] == optionList[i]) {
                        objlist.push(list[j]);

                    }

                }
                if (objlist[i] == null)
                    objlist.push('');

            } //end of for


            //拿原本物件比對一下
            $.each(data, function (i, field) {

                var list1 = [];
                //設定一個布林值，如果data的其中一個物件符合objlist 就回傳
                var itis = true;

                if (field.平日上午尖峰 != '')
                    list1.push('平日上午尖峰');
                else
                    list1.push('');

                if (field.平日下午尖峰 != '')
                    list1.push('平日下午尖峰');
                else
                    list1.push('');

                if (field.假日上午尖峰 != '')
                    list1.push('假日上午尖峰');
                else
                    list1.push('');

                if (field.假日下午尖峰 != '')
                    list1.push('假日下午尖峰');
                else
                    list1.push('');
                if (field.平日離峰 != '')
                    list1.push('平日離峰');
                else
                    list1.push('');
                if (field.假日離峰 != '')
                    list1.push('假日離峰');
                else
                    list1.push('');


                for (var k = 0; k < objlist.length; k++) {
                    if (objlist[k] != list1[k])
                        itis = false;
                }

                if (itis == true)
                    dataObj = data[i];


            })


        })//end of getJSON



    }

    // 速率切換油耗率
    this.getOilData = function (AFS) {
        $.getJSON('data/fuel-rate.json', function (data) {

            //內插法
            var m = parseInt(AFS);
            var n = m + 1;
            var a = parseFloat(data[m]);
            var b = parseFloat(data[n]);
            var k = parseFloat(AFS);
            var Fn = a + (b - a) * ((k - m) / (n - m));
            $('.小客車油耗率').addClass('green').text(Fn);

        })


    }

}


//動態更換版面物件
CahgeTypeObj = function () {
    this.saveCss = function () {
        var htmlobj = null;
        $('.changeStep2').empty();
        $('span.add').hide();
        $('span.sub').hide();
        $($('blockquote').get(1)).hide();
        var step1Title = '步驟一：選擇評估時段';

        switch (localStorage['Type']) {
            case '1':
                step1Title += '  路口停等延滯評估';
                htmlobj = $('<p/>').addClass('lead').text('步驟二：輸入路口數與交通績效值');
                htmlobj.append($('<table/>').addClass('table table-striped table-bordered').append($('<tr/>').append(' <td><p class="lead"><em>評估路口數</em></p></td>' +
                                 '<td><input name="評估路口數" class="span2" value="' + localStorage['Step2Value1'] + '"  type="text"/></td>')))
                break;
            case '2':
                step1Title += '  路段旅行速率評估';
                htmlobj = $('<p/>').addClass('lead').text('步驟二：輸入路段數與交通績效值');
                htmlobj.append($('<table/>').addClass('table table-striped table-bordered').append($('<tr/>').append(' <td><p class="lead"><em>評估路段數</em></p></td>' +
                                 '<td><input name="評估路段數" class="span2"  value="' + localStorage['Step2Value2'] + '"  type="text"/></td>')))
                $($('blockquote').get(1)).show();
                break;
            case '3':
                step1Title += '  路口與路段綜合評估';
                htmlobj = $('<p/>').addClass('lead').text('步驟二：輸入路段與路口與交通績效值');
                htmlobj.append($('<table/>').addClass('table table-striped table-bordered').append($('<tr/>').append(
                 '<td><p class="lead"><em>幹道名稱</em></p></td>' +
                 '<td><p class="lead"><em>方向</em></p></td>' +
                 '<td><p class="lead"><em>路口數</em></p></td>'
                )))
                $('span.add').show();
                break;
        }

        $('p.step1Title').text(step1Title);

        $('.changeStep2').append(htmlobj)

        //123
      
    }

}


//動態增加公用變數物件
CreateHtmlObj = function () {

    this.addAccountButton = function (htmlobj) {
        $(htmlobj).append($('<tr calss="acc"/>')
                                .append($('<td colspan="4" align="right">')
                                .append($('<h4 class="span2"/>')
                                .append($('<a class="stepCaculte btn btn-large" size="2"    type="button">計算</a>')))))
        return htmlobj;

    }

    this.addPublicTable = function (htmlobj) {

        //動態生出YTTT 總車輛旅行時間減少量(TTT) DIV
        $(htmlobj).append($('<h3/>').addClass('green').text('各時段總車輛旅行時間減少量(TTT):')
                       .append($('<input/>').addClass('TTT span2').attr({ 'name': 'TTT' })));


        //動態生出YTTT 查詢全年時間節省(YTTT) DIV
        $(htmlobj).append($('<h3/>').addClass('green').text('各時段全年時間節省(YTTT):')
                      .append($('<input/>').addClass('YTTT span2').attr({ 'name': 'YTTT' })));

        //動態生出TFCD 查詢各時段油耗節省(TFCD)DIV
        $(htmlobj).append($('<h3/>').addClass('green').text('各時段油耗節省(TFCD):')
                        .append($('<input/>').addClass('TFCD span2').attr({ 'name': 'TFCD' })));


        //動態生出YTFCD 查詢各時段全年油耗節省(YTFCD)DIV  
        $(htmlobj).append($('<h3/>').addClass('green').text('各時段全年油耗節省(YTFCD)')
                          .append($('<input/>').addClass('YTFCD span2').attr({ 'name': 'YTFCD' })));


        //動態生出YTFCD 查詢各時段全年CO2減少量(YTCO2)(公噸)DIV  
        $(htmlobj).append($('<h3/>').addClass('green').text('各時段全年CO2減少量(YTCO2)(公噸)')
                        .append($('<input/>').addClass('YTCO2 span2').attr({ 'name': 'YTCO2' })));
        return htmlobj;


    }

    this.addStep4Table = function (TYTTT, TYTTT_money, TYTFCD, OilPrice, TYTFCD_money, TYTCO2, TYTCO2_money, TYTALL) {
        $('div.總效益分析').empty();
        $('div.總效益分析').append($('<h3/>').text('總效益分析'));
        $('div.總效益分析').append($('<p/>').addClass('lead text-success').text('全年時間節省(車小時):' + formatFloat(TYTTT, 2)));
        $('div.總效益分析').append($('<p/>').addClass('lead text-success').text('小客車時間價值(元/車小時)：234.6'));
        $('div.總效益分析').append($('<p/>').addClass('lead text-success').text('全年時間價值節省(元):' + formatFloat(TYTTT_money, 2)));
        $('div.總效益分析').append($('<p/>').addClass('lead text-success').text('全年油耗節省(公升):' + formatFloat(TYTFCD, 2)));
        $('div.總效益分析').append($('<p/>').addClass('lead text-success').text('油價(元/公升):' + formatFloat(OilPrice, 2)));
        $('div.總效益分析').append($('<p/>').addClass('lead text-success').text('全年油耗價值節省(元):' + formatFloat(TYTFCD_money, 2)));
        $('div.總效益分析').append($('<p/>').addClass('lead text-success').text('全年CO2減少量(公噸):' + formatFloat(TYTCO2, 2)));
        $('div.總效益分析').append($('<p/>').addClass('lead text-success').text('CO2損害成本(元/公噸):590'));
        $('div.總效益分析').append($('<p/>').addClass('lead text-success').text('全年CO2貨幣化效益:' + formatFloat(TYTCO2_money, 2)));
        $('div.總效益分析').append($('<p/>').addClass('lead text-success').text('全年總貨幣化效益:' + formatFloat(TYTALL, 2)));

    }

    this.addStep4Setting = function (div) {
        var table = $(div).find('table');

        var tr = $(table).find('tr');

        var tmpTable = $('<table/>').addClass('table table-bordered roadMode1Table');
        $(tmpTable).append(tr[0].outerHTML);

        for (var i = 1; i < tr.length - 1; i++) {
            var tr_tmp = $('<tr/>').addClass('lead text-info').append($('<td/>').text(   $(tr[i]).find('td').get(0).innerText));

            $.each($(tr[i]).find('input').serializeArray(), function (j, field) {
                $(tr_tmp).append($('<td/>').text(field.value));
              
            })

             $(tmpTable).append(tr_tmp);
        
        }

        $('div.路口與路段績效值').append(tmpTable);
    }



}


function setStepTitle() {

     switch(localStorage['Type']){
        case'1':
            $('.stepTitle').text('1.路口停等延滯評估' + ':' + localStorage['CityName']);
            break;
        case'2':
            $('.stepTitle').text('2.路段旅行速率評估' + ':' + localStorage['CityName']);
            break;
       case'3':
           $('.stepTitle').text('3.路口與路段綜合評估' + ':' + localStorage['CityName']);
           break;

       default:
           $('.stepTitle').text('尚未選擇');
           break;
     
     }

  
}



function save(item) {
    var playlistArray = getStoreArray("playlist");
    playlistArray.push(item);
    localStorage.setItem("playlist", JSON.stringify(playlistArray));
}


function getStoreArray(key) {
    var playlistArray = localStorage.getItem(key); // localStorage.getItem(key)裡面的涵示自己掰的，也太自由了吧
    if (playlistArray == null || playlistArray == "") {
        playlistArray = new Array();
    }
    else {
        playlistArray = JSON.parse(playlistArray); //playlistArray+=playlistArray ,跟本機資料原件無關
        // playlistArray.clear();
        //  localStorage.clear();
    }
    return playlistArray;  //回傳資料
}



//取小數點後幾位的函式
function formatFloat(num, pos) {
    var size = Math.pow(10, pos);
    return Math.round(num * size) / size;
}



