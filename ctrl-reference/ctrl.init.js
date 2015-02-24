    var apiBaseUrl="";
    var userDelay=-1;
    var hostname = window.location.hostname;
    apiBaseUrl="http://"+hostname+"/stock/api/";

    var startTime="";
    var closeTime="";

    var startTimeO="";
    var closeTimeO="";

    var timezoneOffset=0;
    var hourOffset=0;
    var msecOffset=0;

    $.curCSS = function (element, attrib, val) {
    $(element).css(attrib, val);
};

    $(document).ready(function()
    {
        timezoneOffset=(new Date()).getTimezoneOffset()+480;

        hourOffset=(timezoneOffset)/60;
        msecOffset=hourOffset*60*60*1000;

        //$("#search").focus();
        $.ajaxSetup({ cache: false });
        preloadData();
        if(window.location.href.indexOf("index.jsp")>0 ||  window.location.href.indexOf("jsp")==-1)
        {
            procIndexPageTSE();
            procIndexPageOTC();
        }


        $('#disclaimerDiv').dialog({
        autoOpen: false,
        resizable: true,
        draggable: true,
        maxHeight: false,
        width: 550,
        height: 550,
        position: [150, 200],
        open: function(event, ui) {
            var $dialog  = $(event.target);
            var position = $dialog.dialog('option', 'position');
            $dialog.closest('.ui-dialog').css({
                left: position[0],
                top:  position[1]
                    });
                }
            });

            $('#disclaimerButton').click(function() { $('#disclaimerDiv').dialog('open') });


            $('#privacyDiv').dialog({
        autoOpen: false,
        resizable: true,
        draggable: true,
        maxHeight: false,
        width: 550,
        height: 350,
        position: [150, 200],
        open: function(event, ui) {
        var $dialog  = $(event.target);
        var position = $dialog.dialog('option', 'position');
        $dialog.closest('.ui-dialog').css({
            left: position[0],
            top:  position[1]
                });
            }
        });

        $('#privacyButton').click(function() { $('#privacyDiv').dialog('open') });

        $('ul.sf-menu').superfish();



        $('ul.sf-menu').superfish();
        $('#search').autocomplete({
            position: { at: 'left top' ,of :'#search_bar' }
        });



        $(".qSearch").live("click", function()
        {
            var qryStr = $("#search").val();
            if(qryStr.indexOf("[")>0 && qryStr.indexOf("]")>0 )
            {
                $("#search").val(qryStr.substring(qryStr.indexOf("[")+1,qryStr.indexOf("]")));
                window.location.href="fibest.jsp?stock="+$("#search").val();
            }
        });

        $("#zh_tw").click(function()
        {
            var url=window.location.href;
            url=url.replace("&lang=en_us","");
            url=url.replace("?lang=en_us","");
            if(url.indexOf("#")>0)
            {
                url=url.substring(0,url.indexOf("#"));
            }
            url += ((url.indexOf("?")==-1)? "?":"&") +"lang=zh_tw";
            window.location.href=url;
        });

        $("#en_us").click(function()
        {
            $("#zh_tw").attr("disabled", true);
            $("#en_us").attr("disabled", false);
            var url=window.location.href;
            url=url.replace("&lang=zh_tw","");
            url=url.replace("?lang=zh_tw","");
            if(url.indexOf("#")>0)
            {
                url=url.substring(0,url.indexOf("#"));
            }
            url += ((url.indexOf("?")==-1)? "?":"&") +"lang=en_us";
            window.location.href=url;
        });

        if(lang==("zh_tw"))
        {
            $("#zh_tw").attr("disabled", true);
            $("#en_us").attr("disabled", false);
            $("#en_us").removeClass('ui-state-focus ui-state-hover ui-state-active');
        }
        else if(lang==("en_us"))
        {
            $("#zh_tw").attr("disabled", false);
            $("#en_us").attr("disabled", true);
            $("#zh_tw").removeClass('ui-state-focus ui-state-hover ui-state-active');
        }

        $("#search").keyup(function(event)
        {

            var qryStr = $("#search").val();
            qryStr = $.trim(qryStr);
            if(qryStr.length>0)
            {

                searchStock(qryStr);
            }


        });



    });





    var refreshTseId =-1;
    function procIndexPageTSE()
    {
        $.getJSON(apiBaseUrl+"getChartOhlcStatis.jsp?ex=tse&ch=t00.tw&fqy=1",function(data)
        {
            if(data.rtcode=="0000")
            {
                if(typeof(data.infoArray)!='undefined' && data.infoArray.length>0)
                {
                    exeYear=data.infoArray[0].d.substring(0,4);
                    exeMonth=data.infoArray[0].d.substring(4,6)-1;
                    exeDay=data.infoArray[0].d.substring(6);

                    var dtB = new Date(exeYear, exeMonth, exeDay, 13, 33, 0);
                    closeTime=dtB.getTime();

                    var dtA = new Date(exeYear, exeMonth, exeDay, 08, 59, 0);
                    startTime=dtA.getTime();

                    procIndexPage(data);
                }
                if(refreshTseId==-1)
                {
                    var userDelay=15000;
                    if(typeof(data.userDelay)!='undefined' )
                    {
                        userDelay=data.userDelay;
                    }

                    refreshTseId = setInterval(function() {
                        procIndexPageTSE();
                    }, userDelay);
                }
            }

        });

    }
    var refreshOtcId = -1;
    function procIndexPageOTC()
    {
        $.getJSON(apiBaseUrl+"getChartOhlcStatis.jsp?ex=otc&ch=o00.tw&fqy=1",function(data)
        {
            if(data.rtcode=="0000")
            {
                if(typeof(data.infoArray)!='undefined' && data.infoArray.length>0)
                {
                    exeYear=data.infoArray[0].d.substring(0,4);
                    exeMonth=data.infoArray[0].d.substring(4,6)-1;
                    exeDay=data.infoArray[0].d.substring(6);
                    //initInfoArray(data.infoArray);
                    var dtB = new Date(exeYear, exeMonth, exeDay, 13, 33, 0);
                    closeTimeO=dtB.getTime();

                    var dtA = new Date(exeYear, exeMonth, exeDay, 08, 59, 0);
                    startTimeO=dtA.getTime();

                    procIndexPage(data);
                }
                if(refreshOtcId==-1)
                {
                    var userDelay=15000;
                    if(typeof(data.userDelay)!='undefined' )
                    {
                        userDelay=data.userDelay;
                    }

                    refreshOtcId = setInterval(function() {
                        procIndexPageOTC();
                    }, userDelay);
                }
            }
        });
    }

    function initUrlPath()
    {

    }
    function resetSession()
    {
        $.getJSON(apiBaseUrl+"resetSession.jsp",function(data)
        {});
    }

    function add_placeholder (id, placeholder)
{
    var el = document.getElementById(id);
    el.placeholder = placeholder;

    el.onfocus = function ()
    {
        if(this.value == this.placeholder)
        {
            this.value = '';
            el.style.cssText  = '';
        }
    };

    el.onblur = function ()
    {
        if(this.value.length == 0)
        {
            this.value = this.placeholder;
            el.style.cssText = 'color:#A9A9A9;';
        }
    };

    el.onblur();
}


    function searchStock(qryStr)
    {
        //alert(qryStr);
        $.getJSON(apiBaseUrl+"getStockNames.jsp?n="+encodeURIComponent(qryStr),
            function(data)
            {
                if(data.rtcode!="0000")
                {
                    return;
                }
                //alert("length"+qryStr.length);
                var availableTags=new Array();
                $.each(data.datas,function(i,item)
                {
                    availableTags.push({label:item.n+"["+item.c+"] ",value:item.c});
                });
                /*if($("#search").val()!=qryStr)
                {
                    return;
                }*/
                if(availableTags.length>0)
                {
                    $( "#search" ).autocomplete({
                        source: availableTags,
                        select: function( event, ui )
                        {
                                $( "#search" ).val( ui.item.label );
                                //var qryStr = $("#search").val();
                                window.location.href="fibest.jsp?stock="+ui.item.value;
                            return true;
                        }
                    });
                }
            });




    }


    function highlightPriceChange(oldItem,newPrice)
    {/*
        if($(oldItem).text()!="" && !(newPrice==$(oldItem).text() || "▼"+newPrice==$(oldItem).text() || "▲"+newPrice==$(oldItem).text() ))
        {
                                    var options = {color: 'blue'};
                                    $( oldItem ).effect( "highlight", options, 1000 );

        }
        */

    }

    function highlightItemChange(oldItem,newPrice)
    {
        /*
        if($(oldItem).text()!="" && !(newPrice==$(oldItem).text() || newPrice==$(oldItem).text() || newPrice==$(oldItem).text() ))
        {
                                    var options = {color: 'blue'};
                                    $( oldItem ).effect( "highlight", options, 1000, callback );
                                    function callback()
                                    {

                                    };
        }
        */

    }

    var exeYear="";
    var exeMonth="";
    var exeDay="";
    var refreshId = -1;

    function preloadData()
    {
        $.getJSON(apiBaseUrl+"getStockInfo.jsp?ex_ch=tse_t00.tw|otc_o00.tw|tse_FRMSA.tw&json=1&delay=0" ,
            function(data)
            {
                if(data.rtcode=="0000")
                {
                    if(refreshId==-1)
                    {

                        refreshId = setInterval(function() {
                            preloadData();
                        }, data.userDelay);

                    }


                    if(userDelay==-1)
                    {
                        userDelay=(data.userDelay);
                        $("#userDelay").text(userDelay/1000);
                    }



                    $.each(data.msgArray,function(i,item)
                    {
                        var cStr=item.c;
                            $("#side_"+cStr+"_t").text(item.t);
                            var dateStr=item.d;
                            dateStr=dateStr.substring(0,4)+"/"+dateStr.substring(4,6)+"/"+dateStr.substring(6);
                            var urlStr=window.location.toString();
                            if($("#marketIndexName").text().indexOf(dateStr)==-1 && ( (item.ch=="t00.tw" && urlStr.indexOf("tse") >0 ) ||
                             (item.ch=="o00.tw" && urlStr.indexOf("otc") >0 ) ) )
                            {
                                $("#marketIndexName").text(dateStr+"  "+$("#marketIndexName").text());
                            }
                            if(item.ch=="t00.tw")
                            {
                                if(window.location.href.indexOf("index.jsp")>0 ||  window.location.href.indexOf("jsp")==-1)
                                {
                                    $("#chartTitle").html(dateStr+ " "+INDEX_TITLE+" ");
                                    $("#chartTitle2").html(" <a href=frmsa.jsp>"+FRMEA_TITLE+"</a>");
                                }
                                else if(window.location.href.indexOf("frmsa.jsp")>0 )
                                {
                                    $("#chartTitle").html(dateStr+ " "+FRMEA_TITLE+" ");
                                    $("#chartTitle2").html("  <a href=index.jsp>"+INDEX_TITLE+"</a>");

                                }

                            }

                            if (typeof(item.z) != 'undefined')
                            {


                            if(item.y!="-" && item.z!="-")
                            {
                                var diffStr=(item.z-item.y).toFixed(2);
                                var preStr=(Math.round(diffStr/item.y*10000)/100).toFixed(2);
                                highlightPriceChange("#side_"+cStr+"_z",item.z);
                                $("#side_"+cStr+"_z").text(item.z);


                                if(item.z*1<item.y*1)
                                {
                                    $("#side_"+cStr+"_pre").css("color",DOWN_COLOR);
                                    $("#side_"+cStr+"_diff").text("▼"+(diffStr*-1));
                                }
                                else if(item.z*1>item.y*1)
                                {
                                    $("#side_"+cStr+"_pre").css("color",UP_COLOR);
                                    $("#side_"+cStr+"_diff").text("▲"+diffStr);
                                }
                                else if(item.z==item.y)
                                {
                                    $("#side_"+cStr+"_pre").css("color","#000000");
                                    $("#side_"+cStr+"_diff").text(diffStr);
                                }

                                $("#side_"+cStr+"_h").text(item.h);
                                $("#side_"+cStr+"_l").text(item.l);
                                $("#side_"+cStr+"_z").text(item.z);
                                $("#side_"+cStr+"_pre").text("("+preStr+"%)");

                                setPriceColor(item.y,item.h,"#side_"+cStr+"_h");
                                setPriceColor(item.y,item.l,"#side_"+cStr+"_l");
                                setPriceColor(item.y,item.z,"#side_"+cStr+"_z");
                                setPriceColor(item.y,item.z,"#side_"+cStr+"_diff");
                                setPriceColor(item.y,item.z,"#side_"+cStr+"_pre");
                            }

                            }
                            else
                            {
                                $("#side_"+cStr+"_z").text(item.y);
                            }
                        }
                    );
                }
                else
                {
                    alert(data.rtmessage);
                }
            }
        );
    }


    function setPriceColor(refPrice, currPrice, item)
    {
        if(currPrice<refPrice)
        {
            $(item).css("color",DOWN_COLOR);
        }
        else if(currPrice>refPrice)
        {
            $(item).css("color",UP_COLOR)
        }
        else if(currPrice==refPrice)
        {
            $(item).css("color","#000000")
        }
    }

    function procIndexPage(data)
    {
        var item=data.infoArray[0];


        var channel=item.ex+"_"+item.ch;
        var d0=item.d;
        var upper=item.u;
        var lower=item.w;
        var yesPrice=(item.y);

        var ch="#INDEX_";
        if(item.ch.indexOf("t00")==0)
        {
            ch+="TWSE";
        }
        else
        {
            ch+="OTC";
        }


        if (typeof(item.z) != 'undefined')
        {
            var zHtmlStr=item.z;
            var diff=(item.z-item.y).toFixed(2);
            var diffPre=(Math.round(diff/item.y*10000)/100).toFixed(2);
            var newColor="#000000";
            diff= (diff>0)? "+"+diff:diff;

            newColor=(diff>0)? UP_COLOR:DOWN_COLOR;
            zHtmlStr=  "<font color="+ newColor + ">("+diff+"/"+diffPre+"%)</font>";

            $(ch).html(item.z);
            $(ch+"_DIFF").html(zHtmlStr);
            $(ch+"_HIGH").text(item.h);
            $(ch+"_LOW").text(item.l);

            $(ch+"_VALUE").text(addCommas((data.staticObj.tz/100000000).toFixed(2)));

            if(typeof(data.staticObj.tv)!= 'undefined')
            {
                $(ch+"_VOLUME").text(addCommas(data.staticObj.tv));
            }
            if(typeof(data.staticObj.tr)!= 'undefined')
            {
                $(ch+"_TRANS").text(addCommas(data.staticObj.tr));
            }
            if(typeof(data.staticObj.t4)!= 'undefined')
            {
                $(ch+"_BID_VOLUME").text(addCommas(data.staticObj.t4));
            }
            if(typeof(data.staticObj.t2)!= 'undefined')
            {
                $(ch+"_BID_ORDERS").text(addCommas(data.staticObj.t2));
            }
            if(typeof(data.staticObj.t3)!= 'undefined')
            {
                $(ch+"_ASK_VOLUME").text(addCommas(data.staticObj.t3));
            }
            if(typeof(data.staticObj.t1)!= 'undefined')
            {
                $(ch+"_ASK_ORDERS").text(addCommas(data.staticObj.t1));
            }
        }
        else
        {
            $(ch).text(item.y);
        }
        $(ch+"_TIME").text(item.t);
        if(item.t.indexOf("13:33")>=0 || item.t.indexOf("13:31")>=0)
        {
            var dateStr=item.d;
            dateStr=dateStr.substring(0,4)+"/"+dateStr.substring(4,6)+"/"+dateStr.substring(6);
            $(ch+"_TIME").text(dateStr);
        }

        if(upper==undefined)
        {
            upper=item.h;
        }

        if(lower==undefined)
        {
            lower   =item.l;
        }

        loadChart(channel,d0,upper,lower,yesPrice,data);
    }


var chart;
var chartChannel;
var otcChart;
var otcChartChannel;
var groupingUnits = [
                    ['minute',[1]]];
var groupingUnits1 = [[
                        'minute',
                        [1, 5, 10, 30, 6]
                    ],['hour',[1]]];
Highcharts.setOptions({

                        global: {
                            useUTC: false
                        }
                });
var tseLastTime="";
var tseLastTimeStamp="";
var otcLastTime="";
var otcLastTimeStamp="";

                function loadChart(channel,d0,upper,lower,yesPrice,data)
                {
                    upper=(parseInt(upper)<parseInt(yesPrice))? yesPrice:upper;
                    lower=(parseInt(lower)>parseInt(yesPrice))? yesPrice:lower;

                            var ohlc = [],
                                    volume = [],
                                    cPrice=[],
                                    dataLength = data.ohlcArray.length;
                            var maxValume=0;
                            //tseLastTime="";
                            //otcLastTime="";
                            for (i = 0; i < dataLength; i++)
                            {
                                var currTime=parseInt(data.ohlcArray[i].t)+msecOffset;
                                if(i==0)
                                {
                                    var date = new Date(currTime);
                                    var minutes = date.getMinutes();
                                    var hours = date.getHours();
                                    var seconds = date.getSeconds();
                                    //alert(date+"    "+hours);
                                    if(!(hours==9 && minutes==0))
                                    {

                                        date.setMinutes(0);
                                        date.setHours(9);

                                        cPrice.push([
                                            date.getTime(),//currentTime, // the date
                                            yesPrice*1 // the volume
                                        ]);
                                    }
                                }

                                if(i==dataLength-1)
                                {
                                    if(channel.indexOf("t00")>0)
                                    {
                                        tseLastTime=data.ohlcArray[i].ts;
                                        tseLastTimeStamp=parseInt(data.ohlcArray[i].t)+12*60*60*1000;
                                        //alert("tseLastTime="+tseLastTime);

                                    }
                                    if(channel.indexOf("o00")>0)
                                    {
                                        otcLastTime=data.ohlcArray[i].ts;
                                        otcLastTimeStamp=parseInt(data.ohlcArray[i].t)+12*60*60*1000;
                                        //alert("otcLastTime="+otcLastTime);

                                    }
                                }

                                if(channel.indexOf("t00")>0)
                                {
                                    data.ohlcArray[i].s=(data.ohlcArray[i].s/100).toFixed(2);

                                }

                                if(channel.indexOf("o00")>0)
                                {
                                    data.ohlcArray[i].s=(data.ohlcArray[i].s/100).toFixed(2);

                                }


                                if(data.ohlcArray[i].s>=0)
                                {
                                    cPrice.push([
                                        currTime,//currentTime, // the date
                                        data.ohlcArray[i].c*1 // the volume
                                    ]);

                                    if(data.ohlcArray[i].s>maxValume)
                                    {
                                            maxValume=data.ohlcArray[i].s*1+1;
                                    }
                                    volume.push([
                                        currTime,//currentTime, // the date
                                        data.ohlcArray[i].s*1 // the volume
                                    ]);
                                }
                            }
                            loadOhcl(channel,cPrice,volume,upper,lower,maxValume,yesPrice);
                            //alert(1);
/*
                            alert("channel  "+channel  );
                            alert("cPrice   "+cPrice   );
                            alert("volume   "+volume   );
                            alert("upper    "+upper    );
                            alert("lower    "+lower    );
                            alert("maxValume"+maxValume);
                            alert("yesPrice "+yesPrice );
*/
                }

                var sPoint=200;
                function loadOhcl(channel,cPrice,volume,upper,lower,maxValume,yesPrice)
                {
//TSE 線圖
                    if(channel.indexOf("t00")>0)
                    {
                        var gap=parseInt(yesPrice*0.015);

                        var upGap=upper-yesPrice;
                        var lowGap=yesPrice-lower;

                        var tkInt=5;
                        chartChannel=channel;
                        //var topTk=parseInt(lower+tkInt*10);

                        var yes=(Math.round(yesPrice/10)*10);
                        //var tkInt=10;
                        //alert(upper-yesPrice);
                        //alert(yesPrice - lower);

                        var vGap=0;
                        if (upper-yes > yes-lower)
                            vGap=upper-yes;
                        else
                            vGap=yes-lower;

                        //alert(upper-yesPrice); 51.77
                        //alert(upper-yes); 48.05
                        //alert(vGap+15);
                        //var tkInt1=0;

                        if (vGap < 20 )
                            tkInt=5;
                        else
                        {
                            for (i = 1; i < 50; i++)
                            {
                                if(vGap < 25*i )
                                {
                                    tkInt=5*(i);
                                    break;
                                }
                            }
                        }

                        for (i = 1; i < 50; i++)
                        {
                            if(maxValume < 10*i )
                            {
                                valumeInt=i;
                                break;
                            }
                        }

                        if(upGap>gap || lowGap>gap)
                        {
                            gap=lowGap;
                            if(upGap>lowGap)
                            {
                                gap=upGap;
                            }
                            if(chart!=undefined)
                            {
                                chart=undefined;
                            }
                        }
                        if(chart!=undefined && maxValume > chart.yAxis[1].max)
                        {
                            chart.yAxis[1].max=maxValume;
                            if(chart!=undefined)
                            {
                                chart=undefined;
                            }
                        }
                        //alert("gap="+gap);
                        //if(chart==undefined || chartChannel!=channel)
                        if(1==1)
                        {
                            //upper=Math.floor(upper) ;
                            //lower=Math.floor(lower-1) ;
                            var upper0=parseInt(yesPrice)+gap;
                            var lower0=parseInt(yesPrice-gap);
                            if(upper > upper0)
                            {
                                upper=Math.ceil(upper);
                                lower=Math.ceil(yesPrice-(upper-yesPrice));
                            }
                            else if(lower< lower0)
                            {
                                lower=Math.floor(lower);
                                upper=Math.ceil(yesPrice+(yesPrice-lower));
                            }
                            else
                            {
                                upper=upper0;
                                lower=lower0;
                            }


                            //alert("upper="+upper);
                            //if(upper0)




                            chart = new Highcharts.StockChart({
                                chart:
                                {
                                    animation:false,
                                    renderTo: 'twseChart',
                                    alignTicks:true,
                                    plotBorderColor: '#000000',
                                    plotBorderWidth: 0
                                },
                                scrollbar:
                                {
                                    enabled:false
                                },
                                credits:
                                {
                                    text:""
                                },
                                navigator:
                                {
                                    enabled: false
                                },
                            tooltip:
                            {
                                useHTML:true,
                                borderColor: '#000000',
                                borderWidth: 1,
                                formatter: function()
                                {
                                    var s = '<b>'+ Highcharts.dateFormat('%Y/%m/%d &nbsp; %H:%M', this.x) +'</b>';
                                    if(typeof(tseLastTime)!="undefined" && tseLastTime.length>0 && tseLastTimeStamp>0)
                                        {
                                            var tempTime=Highcharts.dateFormat('%H%M', this.x);
                                            if(tseLastTimeStamp-43200000==this.x)
                                            {
                                                var showTime=tseLastTime.substring(0,2)+":"+tseLastTime.substring(2,4)+":"+tseLastTime.substring(4);
                                                s = '<b>'+ Highcharts.dateFormat('%Y/%m/%d   ', this.x)+showTime +'</b>';
                                            }
                                        }
                                                $.each(this.points, function(i, point)
                                                {
                                                    if(i==1)
                                                    {
                                                        s += "<br/><font color="+this.series.color+">"+this.series.name+": "+point.y + INDEX_UNIT+"</font>";
                                                    }
                                                    else if(i==0)
                                                    {
                                                        var tip_diff=(point.y-yesPrice).toFixed(2);
                                                        if (point.y >= yesPrice)
                                                        {
                                                            p_color=UP_COLOR;
                                                            tip_diff = '+' +tip_diff;
                                                        }
                                                        else
                                                            p_color=DOWN_COLOR;

                                                        s += "<br/><font color="+p_color+">"+this.series.name+": "+point.y + ' (' +tip_diff + ')' +"</font>";
                                                    }

                                                });
                                        return s;
                                }
                            },
                                rangeSelector:
                                {
                                    enabled: false
                                },
/*
                                rangeSelector:
                                {
                                    buttonSpacing:10,
                                     buttons: [
{
                count: 60,
                type: 'minute',
                text: '小時'
            }, {
                type: 'all',
                text: '全部'
            }],

            inputEnabled: false,
                                    enabled: 1
                                },
*/

                                    plotOptions:
                                    {
                                        area:
                                        {
                                            fillColor: {
                                                linearGradient: [ 0,200,400],
                                                stops: [
                                                    [0, Highcharts.getOptions().colors[0]],
                                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                                ]
                                            },
                                            animation:false,
                                            color: "#376FB9",
                                            fillOpacity: 0.75,
                                            lineWidth: 1.5,
                                            zIndex:1,
                                            states: {
                                                hover: {
                                                    enabled: true,
                                                    lineWidth: 1.5
                                                }
                                            }
                                        },
                                        line:
                                        {
                                            animation:false,
                                            fillOpacity: 1,
                                            grouping: false,
                                            dataGrouping:[['minute',[1]]],
                                            color:'#ff0000',
                                            lineWidth: 1.2,
                                            zIndex:2,
                                            states: {
                                                hover: {
                                                    enabled: true,
                                                    lineWidth: 1.2
                                                }
                                            }
                                        }
                                    },
                                xAxis:
                                [{
                                    width:350,  //走勢線整體寬度
                                    height:280,
                                    type: 'datetime',
//                                          tickInterval: 60*1000,
//                                          minTickInterval: 60*1000,
                                    tickInterval: 60*60*1000,
                                    //minTickInterval: 60*60*1000,
                                    //maxTickInterval: 60*60*1000,
                                    minorTickInterval: 60*60*1000, //時間垂直線

                                    dateTimeLabelFormats:
                                    {
                                        hour: '%H'
                                    },
                                    min:startTime,
                                    max:closeTime,
                                    startOnTick:false,
                                    endOnTick:false,
                                    maxPadding:0,
                                    plotLines : [
/*                                      {
                                            value : startTime,
                                            color : '#C9C9C9',
                                            width : 1
                                        },*/
                                        {
                                            value : closeTime,
                                            color : '#E4E4E4',
                                            width : 1
                                        }]
                                }],
                                yAxis: [
                                {
                                    //指數值
                                    labels:
                                    {
                                        style:
                                        {
                                            color:'#ff0000',
                                            fontSize: '10px'
                                        },
                                        align: 'right',
                                        x:-5,
                                        y:4,
                                        formatter: function() {
                                           return this.value ;
                                        }
                                    },
                                    width:350, //昨日線
                                    height:280,
//                                  min:lower,
//                                  max:topTk,
                                    min:yes-(tkInt*5),
                                    max:yes+(tkInt*5),
                      gridLineColor: '#E4E4E4',
                                    gridLineWidth: 0,
                                    startOnTick: false,
                                endOnTick: false,
                                    showLastLabel: true,
//                                  tickPositions:[lower,lower+tkInt*1,Math.round(yesPrice),lower+tkInt*3,topTk],
//                                  tickPositions:[lower,lower+tkInt*1,lower+tkInt*2,lower+tkInt*3,Math.round(yesPrice),lower+tkInt*5,lower+tkInt*6,lower+tkInt*7,topTk],
//                                  tickPositions:[yes-100,yes-75,yes-50,yes-25,yes,yes+25,yes+50,yes+75,yes+100],
                                    tickPositions:[
                                        yes-(tkInt*5),
                                        yes-(tkInt*4),
                                        yes-(tkInt*3),
                                        yes-(tkInt*2),
                                        yes-(tkInt*1),
                                        yes,
                                        yes+(tkInt*1),
                                        yes+(tkInt*2),
                                        yes+(tkInt*3),
                                        yes+(tkInt*4),
                                        yes+(tkInt*5)
                                        ],
                                    plotLines : [
                                        {
                                            value : yesPrice,
                                            color : '#A9A9A9',
                                            dashStyle : 'shortdash',
                                            width : 2
                                        }]
/*
                                    plotLines : [
                                        {
                                            value : topTk,
                                            color : 'black',
                                            width : 2
                                        },
                                        {
                                            value : yesPrice,
                                            color : '#0000ff',
                                            dashStyle : 'shortdash',
                                            width : 2
                                        },
                                        {
                                            value : lower,
                                            color : 'black',
                                            width : 2
                                        }]
*/
                                },
                                {
                                    allowDecimals:true,
                                    //交易量
                                    //max:parseInt(maxValume),
                                    //max:parseInt(maxValume).toFixed(2),
                                    //tickInterval:parseInt(maxValume)/10,
                                    max:valumeInt*10,
                                    tickInterval:valumeInt,
                                    gridLineColor: '#E4E4E4',
                                    //gridLineWidth: 0,
                                    //tickInterval:tkInt,
                                    //max:80,
                                    //tickInterval:80/8,
                                    height:280,
                                    width:350,
                                    offset:0,
                                    //max:0.5,
//                                  min:0,
                                    minPadding: 0,
                                    //tickPositions:[0,5,10,15,20,25,30,35,40,45],
                                    startOnTick: false,
                                    endOnTick: false,
                                    showLastLabel: true,
                                    labels:
                                    {
                                        style:
                                        {
                                            color: "#3a81ba",
                                            fontSize: '10px',
                                            align: 'right'
                                        },
                                        align: 'left',
                                        x:350+1,
                                        y:4
                                    }
                                }],
                                series: [
                                {
                                    type: 'line',
                                    name: INDEX_TWSE,
                                    colorup: UP_COLOR,
                                    colordown: DOWN_COLOR,
                                    data: cPrice,
                                    zIndex:2,
                                    refprice: yesPrice,
                                    dataGrouping: {
                                    enabled: false
                                    }
                                }
                                ,
                                {
                                    type: 'area',
                                    name: CHART_VOLUME,
                                    data: volume,
                                    yAxis:1,
                                    zIndex:1,
                                    dataGrouping: {
                                        enabled: false
                                    }
                                }
                                ]
                            });
                            chart.redraw(true) ;
                        }
                        else
                        {
                            chart.series[0].setData(cPrice,false);
                            chart.series[1].setData(volume,false);
                            chart.redraw();
                        }
                    }

//OTC 線圖
                    if(channel.indexOf("o00")>0)
                    {

                        var gap=parseInt(yesPrice*0.015);

                        var upGap=upper-yesPrice;
                        var lowGap=yesPrice-lower;

                        var tkInt='0';
                        chartChannel=channel;
                        //var topTk=parseInt(lower+tkInt*10);

                        var yes=(Math.round(yesPrice*10)/10);
                        //alert(yes);
                        var tkInt=0.1;
                        //alert(upper-yesPrice);
                        //alert(yesPrice - lower );


                        var vGap=0;
                        if (upper-yes > yes - lower)
                            vGap=upper-yes;
                        else
                            vGap=yes-lower;
                        //alert(vGap);


                        if (vGap < 0.5 )
                            tkInt=0.1;
                        else
                        {
                            for (i = 1; i < 50; i++)
                            {
                                if(vGap < 0.5*i )
                                {
                                    tkInt=0.1*(i);
                                    break;
                                }
                            }
                        }
                        //alert(yes);
                        //alert(maxValume);

                                                if (maxValume == 0 )
                                                     valumeInt=1;
                                                else
                                                {
                                                    for (i = 1; i < 50; i++)
                                                    {
                                                        if(maxValume < 5*i )
                                                        {
                                                            valumeInt=0.5*(i);
                                                            break;
                                                        }
                                                    }
                                                }


                        if(upGap>gap || lowGap>gap)
                        {
                            gap=lowGap;
                            if(upGap>lowGap)
                            {
                                gap=upGap;
                            }
                            if(chart!=undefined)
                            {
                                otcChart=undefined;
                            }
                        }

                        if(otcChart!=undefined && maxValume > chart.yAxis[1].max)
                        {
                            otcChart.yAxis[1].max=maxValume;
                            if(chart!=undefined)
                            {
                                otcChart=undefined;
                            }
                        }


//                      if(otcChart==undefined || otcChartChannel!=channel)
                        if(1==1)
                        {
                            yesPrice=parseFloat(yesPrice);

                            var upper0=parseFloat(yesPrice)+gap;
                            var lower0=parseFloat(yesPrice-gap);
                            if(upper > upper0)
                            {
                                upper=parseFloat(upper)+1;
                                lower=parseFloat(yesPrice-(upper-yesPrice));
                            }
                            else if(lower< lower0)
                            {
                                lower=parseFloat(lower)-1;
                                upper=parseFloat(yesPrice+(yesPrice-lower));
                            }
                            else
                            {
                                upper=upper0;
                                lower=lower0;
                            }

//alert(yes-(tkInt*4).toFixed(2));
//                          var tkInt=((upper-lower)/10).toFixed(1);
//                          var tkInt=parseInt((upper+10-lower)/10);
//alert((yes-(tkInt*4)).toFixed(2));

                            otcChartChannel=channel;
                            otcChart = new Highcharts.StockChart({
                                chart:
                                {
                                    animation:false,
                                    renderTo: 'otcChart',
                                    alignTicks:true,
                                    plotBorderColor: '#000000',
                                    plotBorderWidth: 0
                                },
                                scrollbar:
                                {
                                    enabled:false
                                },
                                credits:
                                {
                                    text:""
                                },
                                navigator:
                                {
                                    enabled: false
                                },
                            tooltip:
                            {
                                useHTML:true,
                                borderColor: '#000000',
                                borderWidth: 1,
                                formatter: function()
                                {
                                    var s = '<b>'+ Highcharts.dateFormat('%Y/%m/%d   %H:%M', this.x) +'</b>';
                                        if(typeof(otcLastTime)!="undefined" && otcLastTime.length>0 && otcLastTimeStamp>0)
                                        {
                                            var tempTime=Highcharts.dateFormat('%H%M', this.x);

                                            if(otcLastTimeStamp-43200000==this.x)
                                            {
                                                var showTime=otcLastTime.substring(0,2)+":"+otcLastTime.substring(2,4)+":"+otcLastTime.substring(4);
                                                s = '<b>'+ Highcharts.dateFormat('%Y/%m/%d   ', this.x)+showTime +'</b>';

                                            }
                                        }

                                                $.each(this.points, function(i, point)
                                                {
                                                    if(i==1)
                                                    {
                                                        s += "<br/><font color="+this.series.color+">"+this.series.name+": "+point.y + INDEX_UNIT+"</font>";
                                                    }
                                                    else if(i==0)
                                                    {
                                                        var tip_diff=(point.y-yesPrice).toFixed(2);
                                                        if (point.y >= yesPrice)
                                                        {
                                                            p_color=UP_COLOR;
                                                            tip_diff = '+' +tip_diff;
                                                        }
                                                        else
                                                            p_color=DOWN_COLOR;

                                                        s += "<br/><font color="+p_color+">"+this.series.name+": "+point.y + ' (' +tip_diff + ')' +"</font>";                                                   }

                                                });
                                    return s;
                                }
                            },
                                rangeSelector:
                                {
                                    enabled: false
                                },
                                    plotOptions:
                                    {
                                        area:
                                        {
                                            fillColor: {
                                                linearGradient: [ 0,200,400],
                                                stops: [
                                                    [0, Highcharts.getOptions().colors[0]],
                                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                                ]
                                            },
                                            animation:false,
                                            color: "#376FB9",
                                            fillOpacity: 0.75,
                                            lineWidth: 1.5,
                                            zIndex:1,
                                            states: {
                                                hover: {
                                                    enabled: true,
                                                    lineWidth: 1.5
                                                }
                                            }
                                        },
                                        line:
                                        {
                                            animation:false,
                                            fillOpacity: 0.6,
                                            grouping: false,
                                            dataGrouping:[['minute',[1]]],
                                            color:'#ff0000',
                                            lineWidth: 1.2,
                                            zIndex:2,
                                            states: {
                                                hover: {
                                                    enabled: true,
                                                    lineWidth: 1.2
                                                }
                                            }
                                        }
                                    },
                                xAxis:
                                [{
                                    width:350,
                                    height:280,
                                    type: 'datetime',
                                    tickInterval: 60*60*1000,
                                    //minTickInterval: 60*60*1000,
                                    dateTimeLabelFormats:
                                    {
                                        hour: '%H'
                                    },
                                    min:startTimeO,
                                    max:closeTimeO,
                                    startOnTick:false,
                                    endOnTick:false,
                                    maxPadding:0,
                                    minorTickInterval: 60*60*1000,
                                    plotLines : [
/*                                      {
                                            value : startTime,
                                            color : '#C9C9C9',
                                            width : 1
                                        },*/
                                        {
                                            value : closeTime,
                                            color : '#DDDDDD',
                                            width : 1
                                        }]
                                }],
                                yAxis: [
                                {
                                    labels:
                                    {
                                        style:
                                        {
                                            color: "#ff0000",
                                            fontSize: '10px'
                                        },
                                        align: 'right',
                                        x:-5,
                                        y:4
                                    },
                                    width:350,
                                    height:280,
                                    //min:(lower-0.1).toFixed(1),
                                    //max:(lower+tkInt*4+0.1).toFixed(1),
                                    min:(yes-(tkInt*5)).toFixed(1),
                                    max:(yes+(tkInt*5)).toFixed(1),
                                    gridLineColor: '#E4E4E4',
                                    gridLineWidth: 0,
                                    startOnTick: false,
                                    endOnTick: false,
                                    showLastLabel: true,
                                    //tickPositions:[(lower-0.1).toFixed(1),(lower+tkInt*1).toFixed(1),yesPrice.toFixed(1),(lower+tkInt*3).toFixed(1),(lower+tkInt*4+0.1).toFixed(1)],
                                    tickPositions:[
                                        (yes-(tkInt*5)).toFixed(1),
                                        (yes-(tkInt*4)).toFixed(1),
                                        (yes-(tkInt*3)).toFixed(1),
                                        (yes-(tkInt*2)).toFixed(1),
                                        (yes-(tkInt*1)).toFixed(1),
                                        (yes).toFixed(1),
                                        (yes+(tkInt*1)).toFixed(1),
                                        (yes+(tkInt*2)).toFixed(1),
                                        (yes+(tkInt*3)).toFixed(1),
                                        (yes+(tkInt*4)).toFixed(1),
                                        (yes+(tkInt*5)).toFixed(1)
                                        ],
                                    plotLines : [
                                        {
                                            value : yesPrice,
                                            color : '#A9A9A9',
                                            dashStyle : 'shortdash',
                                            width : 2
                                        }]
/*
                                    plotLines : [
                                        {
                                            value : (lower+tkInt*4+0.1).toFixed(1),
                                            color : 'black',
                                            width : 2
                                        },
                                        {
                                            value : yesPrice.toFixed(1),
                                            color : 'blue',
                                            dashStyle : 'shortdash',
                                            width : 2
                                        },
                                        {
                                            value : (lower-0.1).toFixed(1),
                                            color : 'black',
                                            width : 3
                                        }]
*/
                                },
                                {
                                    allowDecimals:true,
                                    //max:parseInt(maxValume).toFixed(2),
                                    //tickInterval:parseInt(maxValume)/10,
                                    max:valumeInt*10,
                                    tickInterval:valumeInt,
                                    gridLineColor: '#E4E4E4',
                                    //gridLineWidth: 0,
                                    //max:(maxValume),
                                    height:280,
                                    width:350,
                                    offset:0,
                                    minPadding: 0,
                                    startOnTick: false,
                                    endOnTick: false,
                                    showLastLabel: true,
                                    tickColor:'#0000ff',
                                    labels:
                                    {
                                        style:
                                        {
                                            color: "#3a81ba",
                                            fontSize: '10px'
                                        },
                                        align: 'left',
                                        x:350+1,
                                        y:4
                                    }
                                }],

                                series: [
                                {
                                    type: 'line',
                                    name: INDEX_GTSM,
                                    data: cPrice,
                                    colorup: UP_COLOR,
                                    colordown: DOWN_COLOR,
                                    zIndex:2,
                                    refprice: yesPrice,
                                    dataGrouping: {
                                    enabled: false
                                    }
                                },
                                {
                                    type: 'area',
                                    name: CHART_VOLUME,
                                    data: volume,
                                    yAxis: 1,
                                    zIndex:1,
                                    dataGrouping: {
                                        enabled: false
                                    }
                                }
                                ]
                            });
                            otcChart.redraw(true) ;
                        }
                        else
                        {

                            otcChart.series[0].setData(cPrice,false);
                            otcChart.series[1].setData(volume,false);
                            otcChart.redraw();
                        }
                    }
            }

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

