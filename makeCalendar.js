﻿/*
* Catholic University of Korea
* Computer Science
* 201521641
* Abdulaziz
* */
var currentDate; //동적 date 변수
var currentYear; //동적 date 변수
var currentMonth; //동적 date 변수   다음 달이나 이전 달 클릭시 동적인 날짜가 이 변수에다 저장됨
var tDay; //원래 날짜 (날)
var tMonth; //원래 날짜 (달)
var tYear; //원래 날짜 (년)

var eventDate; //이벤트 날짜
var eventDetails; //이벤트 내용

//로그인 상태가 아닐 경우 메인 피이지로 redirection
/*
if(localStorage.getItem("loginUser")===null){
    alert("Please login first");
    window.location.replace("index.html");
}*/
//처음에 현재 날짜를 가져오는 (초기화하는) 함수
function initStorage() {

    if (typeof(Storage) !== "undefined") {

        currentDate = new Date(); //
        currentYear = currentDate.getFullYear();
        currentMonth = currentDate.getMonth();
        tDay = currentDate.getDate(); //처음 초기화된 날짜 (원래 날짜)
        tMonth = currentDate.getMonth();
        tYear = currentDate.getFullYear();

        //날짜를 저장소에다가 저장
        localStorage.setItem("tDay", tDay.toString());
        localStorage.setItem("tMonth", tMonth.toString());
        localStorage.setItem("tYear", tYear.toString());
        localStorage.setItem("currentMonth", currentMonth.toString()); //다음달/이전달 동적으로 동작되기 위해 저장해야 함
        localStorage.setItem("currentYear", currentYear.toString());
        localStorage.setItem("initDate", "ok"); //날짜 초기화된 상태를 알려주기 위해

        //아무 스케줄 없으면 없다고 따로 포시하기 위해
        if (localStorage.getItem("isEvent") === null)
            localStorage.setItem("isEvent", "no");

    }
}
function initDate() {

    if (typeof(Storage) !== "undefined") {
        //날짜가 초기화되지 않을 경우 (현재 날짜가 설정되지 않을 경우)
        if(localStorage.getItem("initDate")==null) initStorage();//먼저 초기화

        currentYear = parseInt(localStorage.getItem("currentYear"));
        currentMonth = parseInt(localStorage.getItem("currentMonth"));
        tDay=parseInt(localStorage.getItem("tDay"));
        tMonth=parseInt(localStorage.getItem("tMonth"));
        tYear=parseInt(localStorage.getItem("tYear"));

        //스캐줄(이벤트) 있는지 확인
        var isEvent=localStorage.getItem("isEvent");
        if(isEvent=="yes") {
            //있으면 저장소에서 모든 이변트 날짜와 내용을 가져옴
            var tmpDate = localStorage.getItem("eventDate");
            var tmpDetails = localStorage.getItem("eventDetails");
            eventDate = tmpDate.split("/");
            eventDetails = tmpDetails.split("/");
        }
        //날짜를 지정하기 (이전달이나 다음달 눌렀을때)
        currentDate= new Date(currentYear,currentMonth);

    }
    //alert(currentYear + " " + currentMonth);

    //이제 달력을 뿌리는 과정으로 넘어감
    makeCalendar();
}
// 'TODAY' 버튼을 클랙했을때 오늘의 날짜로 넘어가기
function reInitCalendar() {
    initStorage();
    location.reload();
}

//새로운 스캐줄 등록 함수
function addEvent(year,month,day) {
    //날짜를 한라인으로 합치기
    var newDate=year+" "+month+" "+day+"/";
    var newDetails;
    //사용자가 제대로 입력할때까지 ('/'를 사용하지 않아야 함 -> '/'는 문장을 분리하기 위함)
    while(true){
        newDetails=prompt("Input new event (don't use '/') ","ex: meeting at 18:00");
        if(newDetails.includes("/")) alert("Please avoid using '/'");
        else break;
    }
    //사용자가 스캐줄내용을 제대로 입력시 저장소에다가 저장하는 과정
    if(newDetails!=null) {
        newDetails += "/";

        if (typeof(Storage) !== "undefined") {
            //저장소에서 아무론 스캐줄이 저장되지 않을 경우 (기존 스캐줄 꺼낼 필요 없이 새로운 스캐줄 바로 저장해도 됨)
            if (localStorage.getItem("isEvent") === "no") {
                localStorage.setItem("eventDate", (newDate.toString()));
                localStorage.setItem("eventDetails", newDetails);
                localStorage.setItem("isEvent", "yes");
            }
            //저장소에서 기존에 스캐줄이 있을 경우
            else {
                //모든 스캐줄을 꺼내서 새로운 스캐줄과 합쳐서 다시 저장하는 과정
                var tempDate = "";
                var tempDetails = "";
                tempDate = localStorage.getItem("eventDate");
                tempDetails = localStorage.getItem("eventDetails");

                tempDate += (newDate.toString());
                tempDetails += newDetails;

                localStorage.setItem("eventDate", (tempDate));
                localStorage.setItem("eventDetails", (tempDetails));
            }
        }
        alert("Event successfully saved!");
        location.reload(); //성공적으로 저장한 다음에 페이지를 다시 실행
    }

}
//스캐줄 삭제 함수
function deleteEvent(year,month,day) {
    //alert(year+" "+month+" "+day);
    var fullDate=year+" "+month+" "+day;
    var tmpDate;
    var tmpDetails;
    var newDate="";
    var newDetails="";
    if(typeof (Storage)!=="undefined"){
        //먼저 기존의 모든 스캐줄을 꺼냄
        tmpDate=localStorage.getItem("eventDate");
        tmpDetails=localStorage.getItem("eventDetails");
    }
    //스캐줄을 한 라인에서 분리하는 작업
    var delDate=tmpDate.split("/");
    var delDetails=tmpDetails.split("/");

    //newDate 변수에 삭제할 날짜를 무시하고 나머지 모든 날짜를 다시 저장
    //newDetauls 변수에 삭제할 이벤트 내용을 무시하고 나머지 모든 이벤트내용을 다시 저장
    for(var i=0;i<delDate.length;i++){
        //삭제할 날짜일 경우 그냥 무시
        if(delDate[i]===fullDate)
            continue;
        //그렇지 않을 경우
        else {
            //마지막 반복문일 경우 문자열 끝애 '/' 넣지 않기 -> 이유는 향후 분리 작업 수월해짐
            if (i === delDate.length - 1) {
                newDate += (delDate[i]);
                newDetails += (delDetails[i]);

            }
            //각 날짜와 이밴트 내용을 다시 한 라인으로 저장 (삭제할 날와 스캐줄 무시)
            else {
                newDate += (delDate[i] + "/");
                newDetails += (delDetails[i] + "/");
            }
        }
    }
    //기존에 이벤트가 하나만 있었을 경우 그것을 삭제 후 더이상 이벤트가 없다고 경고
    if(newDate===""){

        localStorage.setItem("isEvent","no");
        alert("Event successfully removed!");
        alert("no events any more");
    }
    //이벤트가 여러 이상 있을 경우
    else{
        localStorage.setItem("eventDate",newDate);
        localStorage.setItem("eventDetails",newDetails);
        alert("Event successfully removed!");
    }

    location.reload(); //재출력
}
//특정 날짜에 이벤트가 있는지 확인하는 함수 있으면 그 날짜에 대한 스캐줄 반환하고, 없을면 없다고 반환
function getEvent(year,month,day) {
    //기존의 모든 스캐줄을 꺼내서 하나씩 검사하고 있으면 이벤트 반환, 없으면 없다고 반환
    if(localStorage.getItem("isEvent")==="yes"){
        var tempDate=localStorage.getItem("eventDate");
        var tempDetails=localStorage.getItem("eventDetails");
        var eDate=tempDate.split("/");
        var eDetails=tempDetails.split("/");
        var compare=year+" "+month+" "+day;
        for(var i=0;i<eDate.length;i++){
            if(eDate[i] ===compare)
                return eDetails[i];
        }
        return "no";
    }
    else return "no";
}
//특정한 달에 몇칠 인지 반환 (예: 11월 2018년에 -> 30일 반환)
function daysInMonth (month, year) {
    return new Date(year, month+1, 0).getDate();
}
//이전달 버튼 눌렀을때
function prevMonth() {
    //예: 3월에서 2월, 2월에서 1월, 1월에서 그 다음으로 12월 로 설정 (11은 인덱스가 0부터시작되기 때문)
    if(currentMonth<1){
        currentMonth=11;
        currentYear--;
    }
    //그렇지 않을 경우
    else currentMonth--;
    if(typeof(Storage)!=="undefined"){
        //출력 희망 달을 저장소에다 저장
        localStorage.setItem("currentMonth",(currentMonth).toString());
        localStorage.setItem("currentYear",(currentYear).toString());

    }
    location.reload(); //페이지 refresh 하면 희망 달에 대한 달력을 보여준다. 여기서 이전달을 출력할 것이다
}
//다음달 버튼 클릭시
function nextMonth() {
    //만약 해당 달이 12월일 경우
    if(currentMonth>10){
        currentMonth=0;
        currentYear++;
    }
    //그렇지 않을 경우
    else currentMonth++;
    if(typeof(Storage)!=="undefined"){
        localStorage.setItem("currentMonth",(currentMonth).toString());
        localStorage.setItem("currentYear",(currentYear).toString());
    }
    location.reload();
}
//캘린더 화면으로 뿔여주기
function makeCalendar() {
    /*
    if(localStorage.getItem("isEvent")==="yes") { //print event on top for check
        for (var i = 0; i < eventDate.length; i++) {
            document.write(eventDate[i]+" "+eventDetails[i]+"<br>");
        }
    }
    */
    var currentDayOfWeek=currentDate.getDay();
    var dayCount=daysInMonth(currentMonth,currentYear);//해당 달에 몇일 있는지
    var weekNames=['MON','TUE','WED','THU','FRI','SAT','SUN'];
    var monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];

    //희망달을 설정
    var tmp=new Date(currentYear,currentMonth,0);
    //해당 달의 시작이 며칠인지
    var startDay=tmp.getDay();

    //헤드 부분 희망 달과 년도 출력
    document.write("<div id='cal-container'><table><caption> <a href='schedule.html' onclick='prevMonth();return false;'>prev</a><h3 id='cal-title'>"+ monthNames[currentMonth]+" "+ currentYear+"</h3><a href='schedule.html' onclick='nextMonth();return false;'>next</a> <a id='caption-today' href='schedule.html' onclick='reInitCalendar();return false;'>today</a> </caption><thead><tr>");
    for(var i =0;i<7;i++){ //주 출력 (print weeks)
        document.write("<th>"+ weekNames[i]+"</th>");
    }
    document.write("</tr></thead><tbody>");

    //날 출력
    for(var i=0,day=1;i<dayCount+startDay;i++){

        if(i%7===0)
            document.write("</tr><tr>"); //반목문이 7일 경우 다음 라인 next line
        if(startDay >i) document.write("<td></td>");//빈 박스 출력 empty cells
        else {
            var isEvent=getEvent(currentYear,currentMonth,day); //해당 날짜에 스캐줄 얻어옴
            if(currentYear===tYear&&currentMonth===tMonth&&day===tDay){ //오늘 날짜를 원형으로 출력
                if(isEvent!=="no") { //오늘 날짜에서 이벤트가 있을 경우
                    document.write("<td><div id='cell-days-with-event'><div><p id='today'>" + day + "</p><br><div id='events' onclick='deleteEvent(currentYear,currentMonth,"+day+");return false;'>"+isEvent+"</div></div></div></td>");
                }
                else{//없을 경우
                    document.write("<td><div id='cell-days-no-event'><div onclick='addEvent(currentYear,currentMonth," + day + ");return false;' ><p id='today'>" + day + "</p></div></div></td>");
                }
            }
            else { //오늘 날짜 아닐 경우 rest of days
                if(isEvent!=="no"){//이벤트가 없을 경우
                    document.write("<td><div id='cell-days-with-event'><div>"+day+"<br><div id='events' onclick='deleteEvent(currentYear,currentMonth,"+day+");return false;'>"+isEvent+"</div>");
                }
                else{//이벤트가 있을 경우
                    document.write("<td><div id='cell-days-no-event'><div onclick='addEvent(currentYear,currentMonth,"+day+");return false;' >"+day+"</div></div></td>");
                }
            }
            day++;
        }

    }
    //테이블 cell 부족할 경우 빈 cell 더 출력
    if(i>35) {
        while (i < 42) {
            document.write("<td></td>");
            i++;
        }
    } //테이블 cell 부족할 경우 빈 cell 더 출력
    else if(i>28&&i<35){
        while (i < 35) {
            document.write("<td></td>");
            i++;
        }
    }

    document.write("</tr></tbody></table></div> ");

}

