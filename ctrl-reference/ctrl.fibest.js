
var closeTime="";
var isWait=false;
var userDelay0=-1;
var isShowChart=false;

function initStock(stock)
{
    $("#print").click(function()
    {
        window.print(); 
    });
    $( "#chart" ).tabs();
    
    
        $.getJSON(apiBaseUrl+"/getShowChart.jsp",
        function(data)
        {
            if(data.showchart)
            {
                $("#stockChart").css('visibility', 'visible');
                $("#stockChart").show();
                isShowChart=data.showchart;
            }
        });
    $.getJSON(apiBaseUrl+"getStock.jsp?ch="+stock+".tw&json=1",
        function(data)
        {
            if(data.rtcode=="0000")
            {
                
                //alert(data.msgArray.length);
                if(data.msgArray.length==0)
                {
                    alert("查無股票名稱或代號"); 
                }
                else if(data.msgArray.length==1)
                {
                    //alert(data.msgArray[0].key);
                    
                    loadStockInfo(data.msgArray[0].key,data.msgArray[0].d)
                    //var refreshId = setInterval(function() {
                    //loadStockInfo(data.msgArray[0].key,data.msgArray[0].d);
                    //  }, 300);
                    
                }
            }
        });
}



var localRefId = -1;

function loadStockInfo(stock,d0)
{/*
    if(isWait)
    {
        return; 
    }
    isWait=true;
*/
    //param= (userDelay0==-1)? "":"&delay="+userDelay0;
        $.getJSON(apiBaseUrl+"getStockInfo.jsp?ex_ch="+stock+"&json=1&delay=0",
            function(data)
            {
                if(data.rtcode=="0000")
                {
                    
                    
                    
                    if(userDelay0==-1)
                    {
                        userDelay0=(data.userDelay);    
                        $("#userDelay0").text(userDelay0/1000);
                    }
                    
                    if(data.userDelay==0)
                    {
                        $("#userDelayView").hide();
                    }
                    
                    
                    if(localRefId==-1)
                    {
                        
                        if(parseInt(data.userDelay)==0)
                        {
                            data.userDelay=125; 
                        }
                        
                        localRefId = setInterval(function() {
                            loadStockInfo(stock,d0)
                        }, data.userDelay);
                    }
                    
                    var upper=0;
                    var lower=0;
                    var yesPrice=0;
                    
                    $.each(data.msgArray, 
                        function(i,item)
                    {
                        //alert("item.c"+item.c);
                        //var cStr=item.ex+"_"+item.ch;
                        if(item.i=="oidx.tw" ||  item.i=="tidx.tw")
                            {
                                //alert("aa");
                                $("#bestFiveDiv").hide();
                                
                                
                            }
                        cStr=item.c;
                        //alert(cStr);
                            if($("#"+cStr+"_n").text()=="")
                            {
                                var exStr=item.ex;
                                exStr= (item.ex=="tse")? FIBEST_TSE:FIBEST_OTC;
                                
                                
                                $("#"+cStr+"_n").text("["+exStr+"]"+"  "+item.c+"  "+item.n);
                            }
                            
                            if($("#"+cStr+"_h").text()!=item.h)
                            {
                                $("#"+cStr+"_h").text(item.h);
                            }
                            
                            if($("#"+cStr+"_l").text()!=item.l)
                            {
                                $("#"+cStr+"_l").text(item.l);
                            }

                            if(typeof(item.st)!="undefined" && typeof(item.rt)!="undefined")
                            {
                                var stStr=item.st;
                                var rtStr=item.rt;
                                var tStr=item.t+"";

                                stStr=parseInt(stStr.replace(/\:/g,""));
                                rtStr=parseInt(rtStr.replace(/\:/g,""));
                                tStr=parseInt(tStr.replace(/\:/g,""));
                                if(stStr==80000 && rtStr==999999)
                                {
                                    $("#fibestrow").css("background-color","#aaa");
                                    $("#title_note").text(" ("+TRADING_HALT+")");
                                }
                                else if(tStr >= stStr && tStr <= rtStr)
                                {
                                    $("#fibestrow").css("background-color","#aaa");
                                    $("#title_note").text(" ("+TRADING_HALT+")");
                                }
                                else
                                {
                                    $("#fibestrow").css("background-color","#f93");
                                    $("#title_note").text(" ("+TRADING_RESUME+")");
                                }
                                if(item.rt=="99:99:99")
                                {
                                    item.rt="13:30:00"
                                }

                                $("#"+cStr+"_comment").html("<img src='images/info.png' class='linkTip' title='"+TRADING_HALT+item.st+"\n"
                                    +TRADING_RESUME+item.rt+"'>");
                                    
                                    
                                    
                                    
                            }
                            
                            if(item.ip==3)
                            {
                                $("#fibestrow").css("background-color","#E7C1FF");
                                $("#"+cStr+"_comment").html("<img src='images/info.png' class='linkTip' title='"+POSTPONED_STRING+"'>");
                                $("#title_note").text(" ("+POSTPONED_STRING+")");
                            }
                            
                            if(item.ip==2)//趨漲↑
                            {
                                $("#"+cStr+"_pre").text($("#"+cStr+"_pre").text()+"↑");
                            }
                            
                            if(item.ip==1)//趨跌ìì↓
                            {
                                $("#"+cStr+"_pre").text($("#"+cStr+"_pre").text()+"↓");
                            }
                            
                            
                            $("#"+cStr+"_o").text(item.o);
                            $("#"+cStr+"_y").text(item.y);
                            $("#"+cStr+"_v").text(item.v);
                            $("#"+cStr+"_t").text(item.t);
                            
                            if(typeof(item.z) != 'undefined' && item.y!="-" && item.z!="-")
                            {
                                var diffStr=(item.z-item.y).toFixed(2);
                                var preStr=(diffStr/item.y*100).toFixed(2);
                                
                                
                                preStr= (isNaN(preStr))? "-":preStr;
                                diffStr= (isNaN(diffStr))? "-":diffStr;
                                $("#"+cStr+"_diff").text(diffStr);
                                $("#"+cStr+"_pre").text(preStr+"%");
                                highlightPriceChange("#"+cStr+"_z",item.z);
                                $("#"+cStr+"_z").text(item.z);
                                if(item.z*1<item.y*1)
                                {
                                    $("#"+cStr+"_z").css("color","#105010");
                                    $("#"+cStr+"_diff").css("color","#105010");
                                    $("#"+cStr+"_pre").css("color","#105010");
                                    $("#"+cStr+"_diff").text("▼"+$("#"+cStr+"_diff").text());
                                }
                                else if(item.z*1>item.y*1)
                                {
                                    $("#"+cStr+"_z").css("color","#ff0000")
                                    $("#"+cStr+"_diff").css("color","#ff0000");
                                    $("#"+cStr+"_pre").css("color","#ff0000");
                                    $("#"+cStr+"_diff").text("▲"+$("#"+cStr+"_diff").text());
                                }
                                else if(item.z==item.y)
                                {
                                    $("#"+cStr+"_z").css("color","#000000")
                                    $("#"+cStr+"_diff").css("color","#000000");
                                    $("#"+cStr+"_pre").css("color","#000000");
                                    
                                }
                                
                                if(item.z==item.u)
                                {
                                    $("#"+cStr+"_z").css("color","#ffffff");
                                    $("#"+cStr+"_z").css("background-color","#ff0000")
                                    //$("#"+cStr+"_z").text("▲"+item.z);
                                }
                                if(item.z==item.w)
                                {
                                    $("#"+cStr+"_z").css("color","#ffffff");
                                    $("#"+cStr+"_z").css("background-color","#105010")
                                    //$("#"+cStr+"_z").text("▼"+item.z);
                                }
                                if(item.tv!=undefined)
                                {
                                    $("#"+cStr+"_tv").text(item.tv);
                                }
                                
                                
                                
                            }
                            //alert("item.g="+item.g);
                            
                            if(item.i!="tidx.tw" && item.i!="oidx.tw")
                            {
                                if(item.g!=undefined)
                                {
                                    insertFiBest("#"+cStr+"_g",item.g,item.y);
                                }
                                if(item.b!=undefined)
                                {
                                    insertFiBest("#"+cStr+"_b",item.b,item.y,item.h,item.l,item.u,item.w);
                                }
                                if(item.a!=undefined)
                                {
                                    insertFiBest("#"+cStr+"_a",item.a,item.y,item.h,item.l,item.u,item.w);
                                }
                                if(item.f!=undefined)
                                {
                                    insertFiBest("#"+cStr+"_f",item.f,item.y);
                                }
                            }
                            else
                            {
                                $(".title5").hide();
                                $("#fiBestDiv").hide(); 
                                $("#fiBestDivTitle").hide();
                            }
                            upper=(item.u);
                            lower=(item.w);
                            if(upper==undefined)
                            {
                                upper=item.h;
                            }
                            
                            if(lower==undefined)
                            {
                                lower=item.l;
                            }
                            
                            yesPrice=(item.y);
                        }
                    );
                    if(isShowChart)
                    {
                        loadChart(stock,d0,upper,lower, yesPrice);
                        loadTechChart(stock);
                    }
                }
                else
                {
                    alert(data.rtmessage);
                }
                //isWait=false;
            }
        );  
}

function insertFiBest(htmlView,values,y,h,l,u,w)
{
    var valArr=values.split("_");
    
    for(i=0;i<valArr.length-1 || i<5;i++)
    {
        if(i==0)
        {
            $(htmlView).text(valArr[0]);
        }
        
        
        if(i<valArr.length-1)
        {
            $(htmlView+i).text(valArr[i]);
        }
        else if(i>=valArr.length-1 && i<5)
        {
            $(htmlView+i).text("-");
        }
        
        if(htmlView.indexOf("b")>0)
        {
            leftHtmlView=htmlView.substring(0,htmlView.length-2)+"_l"+i;
            $(leftHtmlView).text("");
        }
        
        if(htmlView.indexOf("a")>0 )
        {
            leftHtmlView=htmlView.substring(0,htmlView.length-2)+"_r"+i;
            $(leftHtmlView).text("");
        }
        
        
        
        if(h>0 && valArr[i]==h && htmlView.indexOf("b")>0 )
        {
            leftHtmlView=htmlView.substring(0,htmlView.length-2)+"_l"+i;
            $(leftHtmlView).text(HIGHEST);
        }
        
        if(l>0 && valArr[i]==l && htmlView.indexOf("b")>0 )
        {
            leftHtmlView=htmlView.substring(0,htmlView.length-2)+"_l"+i;
            $(leftHtmlView).text(LOWEST);
        }
        
        if(h>0 && valArr[i]==h && htmlView.indexOf("a")>0 )
        {
            leftHtmlView=htmlView.substring(0,htmlView.length-2)+"_r"+i;
            $(leftHtmlView).text(HIGHEST);
        }
        
        if(l>0 && valArr[i]==l && htmlView.indexOf("a")>0 )
        {
            leftHtmlView=htmlView.substring(0,htmlView.length-2)+"_r"+i;
            $(leftHtmlView).text(LOWEST);
        }
        
        if(htmlView.indexOf("b")>0 || htmlView.indexOf("a")>0 )
        {
            $(htmlView+i).css('background-color', '');
            if(valArr[i]==u)
            {
                $(htmlView+i).css("color","#ffffff");
                $(htmlView+i).css("background-color","#ff0000");                
            }
            else if(valArr[i]==w)
            {
                $(htmlView+i).css("color","#ffffff");
                $(htmlView+i).css("background-color","#105010");
            }
            else if(y>valArr[i])
            {
                $(htmlView+i).css("color","#105010");
                
            }
            else if(y<valArr[i])
            {
                $(htmlView+i).css("color","#ff0000");
                                    
            }
            else if(y==valArr[i])
            {
                $(htmlView+i).css("color","#000000");
            }
        }
    }
}

var chart;
var teChart;
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

                function loadChart(channel,d0,upper,lower,yesPrice)
                {
                    // series.data.push(parseFloat(item));
                    //alert("loadChart="+channel);
                    $.getJSON(apiBaseUrl+"getOhlc.jsp?ex_ch="+channel+"&d0="+d0, function(data) 
                        {
                            
                            var ohlc = [],
                                    volume = [],
                                    cPrice=[],
                                    dataLength = data.msgArray.length;
                            var maxValume=0;
                            for (i = 0; i < dataLength; i++) 
                            {
                                
                                
                                var currTime=parseInt(data.msgArray[i].tlong);
                                if(i==0)
                                {
                                    var date = new Date(currTime);
                                    var minutes = date.getMinutes();
                                    var hours = date.getHours();
                                    var seconds = date.getSeconds();
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
                                if(closeTime=="" && i==dataLength-1)
                                {
                                    var dt = new Date();
                                    dt.setTime(currTime);
                                    var dtB = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 13, 31, 0);
                                    closeTime=dtB.getTime();
                                }
                                
                                
                                
                                
                                cPrice.push([
                                    currTime,//currentTime, // the date
                                    data.msgArray[i].c*1 // the volume
                                ]);
                                
                                if(data.msgArray[i].s>maxValume)
                                {
                                        maxValume=data.msgArray[i].s*1;
                                }
                                volume.push([
                                    currTime,//currentTime, // the date
                                    data.msgArray[i].s*1 // the volume
                                ]);
                            }
                                    
                            loadOhcl(channel,cPrice,volume,upper,lower,maxValume,yesPrice);     
                            
    
                        });
                
                }
                
                
                function loadTechChart(channel)
                {
                    // series.data.push(parseFloat(item));
                    //alert("loadChart="+channel);
                    $.getJSON(apiBaseUrl+"getDailyRangeWithMA.jsp?ex_ch="+channel+"&d0="+techD0+"&d1="+techD1, function(data) 
                        {
                            
                            var ohlc = [],
                                    ma05=[],
                                    ma10=[],
                                    ma20=[],
                                    volume = [],
                                    cPrice=[],
                                    dataLength = data.msgArray.length;
                            var maxValume=0;
                            for (i = 0; i < dataLength; i++) 
                            {
                                
                                
                                ohlc.push([
                                    (data.msgArray[i].tlong)*1,//currentTime, // the date
                                    data.msgArray[i].o*1, // open
                                    data.msgArray[i].h*1, // high
                                    data.msgArray[i].l*1, // low
                                    data.msgArray[i].z*1 // close
                                ]);
                                
                                if(data.msgArray[i].ma05!=0)
                                {
                                    ma05.push([
                                        (data.msgArray[i].tlong)*1,//currentTime, // the date
                                        data.msgArray[i].ma05*1 // the volume
                                    ]);
                                }
                                if(data.msgArray[i].ma10!=0)
                                {
                                    ma10.push([
                                        (data.msgArray[i].tlong)*1,//currentTime, // the date
                                        data.msgArray[i].ma10*1 // the volume
                                    ]);
                                }
                                
                                if(data.msgArray[i].ma20!=0)
                                {
                                    ma20.push([
                                        (data.msgArray[i].tlong)*1,//currentTime, // the date
                                        data.msgArray[i].ma20*1 // the volume
                                    ]);
                                }
                                
                                cPrice.push([
                                    (data.msgArray[i].tlong)*1,//currentTime, // the date
                                    data.msgArray[i].z*1 // the volume
                                ]);
                                
                                if(data.msgArray[i].s>maxValume)
                                {
                                        maxValume=data.msgArray[i].s*1;
                                }
                                volume.push([
                                    (data.msgArray[i].tlong)*1,//currentTime, // the date
                                    data.msgArray[i].v*1 // the volume
                                ]);
                            }   
                            //alert("done");    
                            loadTechOhcl(channel,ohlc,ma05,ma10,ma20,volume);       
    
                        });
                
                }
                
                
                function loadOhcl(channel,cPrice,volume,upper,lower,maxValume,yesPrice)
                {
                    
                    var tkInt=parseFloat(((upper-lower)/4).toFixed(2));
                    upper=parseFloat(upper);
                    lower=parseFloat(lower);
                    var lower1=parseFloat(lower+tkInt);
                    var upper1=parseFloat(upper-tkInt);
                    upper=upper.toFixed(2);
                    lower=lower.toFixed(2);
                    lower1=lower1.toFixed(2);
                    upper1=upper1.toFixed(2);
                    
                    if(chart==undefined)
                    {
                        chart = new Highcharts.StockChart({
                            chart: 
                            {
                                renderTo: 'stockChart',
                            alignTicks:false,
                            plotBorderColor: '#000000',
                                plotBorderWidth: 1
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
                             borderColor: 'gray',
                            borderWidth: 1
                        },
                            rangeSelector: 
                            {
                                enabled: false
                            },
                                plotOptions: 
                                {
                                    column:
                                    {
                                        animation:false,
                                        color:'red'
                                    },
                                    line:
                                    {
                                        animation:false
                                    }  
                                },
                            xAxis: 
                            {
                                max:closeTime,
                                minorTickInterval: 60*60*1000,
                                type: 'datetime',
                                dateTimeLabelFormats:
                                        {
                                            hour: '%H'
                                        }
                            },
                            yAxis: [
                            {
                                title: 
                                {
                                    text: '成交價'
                                },
                                labels:
                                {
                                    style: 
                                    {
                                fontSize: '9px'
                                },
                                    align: 'right',
                                    x:-2,
                                    y:4
                                },
                                height: 180,
                                minPadding: 0,
                                min:lower,
                                max:upper,
                                startOnTick: false,
                            endOnTick: false,    
                                showLastLabel: true,
                                tickPositions:[lower,lower1,upper1,upper],
                                plotLines : [
                                
                        {
                        value : yesPrice,
                        color : 'blue',
                        dashStyle : 'shortdash',
                        width : 1
                        
                        }/*,{
                        value : upper,
                        color : 'red',
                        dashStyle : 'shortdash',
                        width : 1
                        
                        },{
                        value : lower,
                        color : 'green',
                        dashStyle : 'shortdash',
                        width : 1
                        
                        }*/]
                                        
                            }, 
                            {
                                title: 
                                {
                                    text: '成交量'
                                },
                                max:parseInt(maxValume),
                                tickInterval: parseInt((maxValume/4)),
                                min:0,
                                top: 200,
                                height: 80,
                                offset: 0,
                                tickColor:'#0000ff',
                                labels:
                                {
                                    style: 
                                    {
                                fontSize: '9px'
                                },
                                    align: 'right',
                                    x:-2,
                                    y:4
                                }
                            }],
                            
                            series: [{
                                    type: 'line',
                                name: "成交價",
                                data: cPrice,
                                dataGrouping: 
                                {
                           enabled: false
                        }
                            }, {
                                type: 'column',
                                name: '成交量',
                                data: volume,
                                yAxis: 1,
                                dataGrouping: 
                                {
                           enabled: false
                        }
                            }]
                        }); 
                        //chart.redraw(true) ;
                    }
                    else
                    {
                        //alert(chart); 
                        //chart.series[0].series.hide();
                        //chart.series[1].series.hide();
                        chart.series[0].setData(cPrice,false);
                        chart.series[1].setData(volume,false);
                        chart.redraw();
                        //chart.redraw(true) ;
                        //chart.redraw();
                        //chart.series[0].series.show();
                        //chart.series[1].series.show();
                    }
            }
            
            function loadKD(channel)
            {
                $.getJSON(apiBaseUrl+"getDailyRangeOnlyKD.jsp?ex_ch="+channel+"&d0="+techD0+"&d1="+techD1, function(data) 
                        {
                            var kValue = [],
                                    dValue = [],
                                    dataLength=data.msgArray.length;
                                    
                            for (i = 0; i < dataLength; i++) 
                            {
                                
                                kValue.push([
                                             data.msgArray[i].tlong*1,
                                            data.msgArray[i].k*1 
                                        ]);
                                
                                dValue.push([
                                            (data.msgArray[i].tlong)*1,
                                            data.msgArray[i].d*1 
                                        ]);
                                
                            }
                            if(teChart!=undefined)
                            {
                                //teChart.series[2].addPoint(kValue);
                                /*
                                teChart.series.push({
                                    type: 'line',
                                name: "KD",
                                data: kValue,
                                 yAxis: 2
                                });*/
                                //alert("add done");
                            }
                            
                        });
            }
            
            
            function loadTechOhcl(channel,ohlc,ma05,ma10,ma20,volume)
                {
                    
                    //alert(yesPrice);
                    // set the allowed units for data grouping
                    //alert("maxValume"+maxValume);
                    //maxValume=maxValume;
                    
                    
                    if(teChart==undefined)
                    {
                        
                        teChart = new Highcharts.StockChart({
                            chart: 
                            {
                                renderTo: 'techChart',
                                zoomType:'x'
                            },
                             plotOptions: {
                            candlestick: {
                                animation:false,
                                color: 'green',
                                upColor: 'red',
                                 gapSize: 0
                                //dataGrouping:[['day',[1]]]
                            },
                            column:
                                        {
                                            animation:false,
                                            color:'red',
                                             gapSize: 0
                                            //dataGrouping:[['day',[1]]]
                                            
                                        },
                                        line:
                                        {
                                            animation:false,
                                             gapSize: 0
                                        }
                        },
                            scrollbar:
                            {
                                    enabled:true
                                },
                        credits:
                        {
                            text:""
                        },
                                navigator: 
                                {
                                    enabled: true
                                },
                        tooltip: 
                        {
                             borderColor: 'gray',
                            borderWidth: 1
                        },
                            rangeSelector: 
                            {
                                
                                selected:1,
                                enabled: false
                            },
                                /*plotOptions: 
                                {
                                    candlestick:
                                    {
                                        dataGrouping:[['day',[1]]]
                                            
                                    } 
                                },*/
                            xAxis: 
                            {
                                //max:closeTime,
                                //minorTickInterval: 30*60*1000
                            },
                            yAxis: [
                            {
                                title: 
                                {
                                    text: '成交價'
                                },
                                height: 300
                                //min:lower,
                                //max:upper,
                                //minRange:parseInt((upper-lower)/4),
                                //maxRange:parseInt((upper-lower)/4),
                                //tickInterval: parseInt((upper-lower)/4),
                                
                                        
                            }, 
                            {
                                title: 
                                {
                                    text: '成交量'
                                },
                                //min:0,
                                top: 330,
                                height: 80,
                                offset: 0,
                                tickColor:'#0000ff'
                            }],
                            
                            series: [{
                                    type: 'candlestick',
                                name: "成交價",
                                data: ohlc
                               // dataGrouping:[['day',[1]]]
                            },
                            {
                                    type: 'line',
                                data: ma05,
                                name: "5MA"
                               // dataGrouping:[['day',[1]]]
                            },
                            {
                                    type: 'line',
                                data: ma10,
                                name: "10MA"
                               // dataGrouping:[['day',[1]]]
                            },
                            {
                                    type: 'line',
                                data: ma20,
                                name: "20MA"
                               // dataGrouping:[['day',[1]]]
                            },
                             {
                                type: 'column',
                                name: '成交量',
                                data: volume,
                                //dataGrouping:[['day',[1]]],
                                yAxis: 1
                            }]
                        }); 
                        
                        //loadKD(channel);
                        teChart.redraw(true) ;
                    }
                    else
                    {
                        teChart.series[0].setData(ohlc,false);
                        teChart.series[1].setData(volume,false);
                        teChart.redraw();

                    }
            }
            
