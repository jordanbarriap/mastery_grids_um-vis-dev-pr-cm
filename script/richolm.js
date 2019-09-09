
var colors1                  = ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"];

//var colors =["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"];
var colors = CONST.vis.colors.me[7];//["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"];



var colorProperty           = "uK"; //property in the json file that is used to represent the color
var dcolorProperty           = "gK"; //property in the json file that is used to represent the color
var color                   = "faveColor"; 
var dcolor                   = "donutColor"; 
var sizeProperty            = "uATT"; //property in the json file that is used to represent the size
var dsizeProperty            = "gATT"; //property in the json file that is used to represent the size
var size                    = "faveSize"; 
var dsize                    = "donutSize"; 
var idProperty              = "id"; //property in the json file that is used to represent the object id - for nodes
var nameProperty            = "name"; //property in the json file that is used to represent the object name - for edges

var minWidthNode            = 5; //the minimum width of a node
var maxWidthNode            = 15; //the maximum width of a node
var donutWidth              = 4; //the width of the donut chart
var maxConnections          = 5;// the maximum of connections of all nodes
var minSizePropertyNode     = null; //the minimum value of the size of a node (updated each time the graph is updated)
var maxSizePropertyNode     = null; //the maximum value of the size of a node (updated each time the graph is updated)

var minWidthEdge            = 1; //the minimum width of a edge
var maxWidthEdge            = 5; //the maximum width of a edge
var minSizePropertyEdge     = null; //the minimum value of the size of a edge (updated each time the graph is updated)
var maxSizePropertyEdge     = null; //the maximum value of the size of a edge (updated each time the graph is updated)

var showLinks               = false;//if the links are visible or not
var showTopicColor          = true; //if the color of the topics are shown
var showTopicName           = false;//if the name of the topics are shown

var modGoals                = true; //enable or disable the goals module
var modLinks                = true;//enable or disable the links module
var modLastAction           = true; //enable or disable the last action module
var modSession              = true; //enable or disable the session module
var modConceptMap           = true; //enable or disable the concept map module
var modToolbar              = true;//enable or disable the toolbar module
var modCollapseMenu         = true;//enable or disable the collapse menu module

var w                       = 900; //width of the svg window
var h                       = 500; //height of hte svg window
var nodes                   = []; //array with all the nodes data
var links                   = []; //array with all the links data
var groups                  = []; //array with all the groups data
var svg                     = null; //reference to the svg, same as d3.selectALl("svg")
var force                   = null; //reference to the force layout settings
var path                    = null; //reference to the path, same as d3.selectALl("path"), path is the tag used to draw the groups
var link                    = null; //reference to the links in d3, same as d3.selectAll(".link")
var text                    = null; //reference to the text (topic name)
var node                    = null; //reference to the nodes in d3, however it loses the reference when the donuts are added. It references the donuts now
var inner                   = null; //reference to the nodes in d3, same as d3.selectALl(".node")
var donut                   = null; //reference to the donuts in d3, same as d3.selectALl(".donut")
var arc                     = null; //reference to the arc (used to draw the donuts)
var blockClick              = false; //flag to identify if it is a normal click or an especial click


//new variables added by Haoran Zhao
var nodes_static                   = []; //array with all the nodes static data
var links_static                   = []; //array with all the links static data
var nodes_dynamic                  = []; //array with all the nodes static data
var links_dynamic                  = []; //array with all the links static data
var mapD;
var mapP;
//change this to change the style of the color circles: 
//my new variables
var table      =null;
var tablerow   =null;

var groups =null;
var conceptArray = [];
var idArray = [];

 var topic_order =[]; //['Variables', "Arithmetic_Operations", 'Boolean_Expressions', 
//                     'Arrays', 'Switch', 'ArrayList', 'Inheritance', 'Strings', 
//                     'Loops', 'Objects', 'Constants', 'Decisions', 'Primitive_Data_Types', 'Classes','Interface'];

var topic_column_order = [];

var mapTopicPos = {};/*'Variables':150, "Arithmetic_Operations":160, 'Boolean_Expressions':170, 
                    'Arrays':180, 'Switch':190, 'ArrayList':200, 'Inheritance':210, 'Strings':220, 
                    'Loops':230, 'Objects':240, 'Constants':250, 'Decisions':260, 'Primitive_Data_Types':270, 'Classes':280};*/
                    //mapping of the topic names between the mastery grid and the concept map
                    //commented by jbarriapineda (they have to be dynamically assigned)

var mapConceptColumnTopic = {};
var mapConceptName = {};
var mapConceptNameDisplayName = {};

//added by jbbarriapineda
var sorted_kcs = [];
var sorted_topics = [];
var actId_kcs = [];
var learner_id=0;
var group_id=0;
var kc_state_act;

var maxActGridSvgWidth = 500;
var offsetTopActSvg = -120;

//gauge
//var gwidth=200;
//var gheight=100;
var totalPercent=50;
var padRad = 0.025;
var chart;
var arc1,arc2,arc3;
var needle;
//end of code added by jbarriapineda

var dot = null;
var concept_Ques = null;

var testValue = 0;
var test = 0;
var nodeConcept;
var tempAllDots = [];

var maxminTemp=[];
var barChartLeftPos;
var barChartRightPos;
var gapBetweenBars=1;


var orderMap = {};
var orderBy = "topic";//alphabet,topic,userBarSizeAscend,userBarSizeDescend,grpBarSizeAscend,grpBarSizeDescend

var temp1 = [];

var ifClickButton = false;

var gridSetting;

//add by Jiaruixue
//align_left_indi;align_left_comp; double_circle; align_ctopic_indi;align_ctopic_comp
var matrix_mod = "align_ctopic_indi";

//var uiCMVisId = "conceptMatrix"; //commented by jbarriapineda
var uiCMVisId = "";
var barSizeGrp = "gP";
var barSizeUser = "uP";
var barColorGrp = "gK";
var barColorUser = "uK";
var maxBarHeight = 80;//added by jbarriapineda
var yStartBipartite = 160;//added by jbarriapineda
var barSeparation = 3.3;
var groupSorting="me";

//Scale for draw the height of the bars for each concept
var bipartiteBarScale = d3.scale.linear()
                           .domain([0,1])
                           .range([5,maxBarHeight]);//added by jbarriapineda

var barColorUserProperty = "Greens";
var barColorGrpProperty = "Blues"
var barColorScale = 5;//3~9

var barColorScaleProbabilities = d3.scale.linear()
    .domain([0, 0.5, 1])
    .range(['red', '#d3d3d3', 'green']);

var conceptYPosMap={};//for conceptlist use only

//used to show or hide sidebar
var showSidebar = false;



//function to execute when DOM is ready
$(function($, window){

  if(!showSidebar){
    $("#toolbar").hide();
    $("#collapse-menu").hide();
  }
  else{
    $("#toolbar").show();
    $("#collapse-menu").show();
  }

  $('input[name=kcmap]').click(function(event){
        event.stopPropagation();
        var selected = $("input[type='radio'][name='kcmap']:checked");
        if (selected.length > 0) {
            selectedkcMap = selected.val();
            uiCMVisId = selectedkcMap;
            initConceptVis(selectedkcMap);
        }
    });

  //body click to deselect nodes, hide menus and so on
  $("body").click(function (e) {
    // console.log("body");
    // block the click event for some places that set blockClick to true, such as nodes,...
    if(!blockClick) {

      //$("#collapse-menu").css("display", "none");
      
      actLstHide();
       

      //if you there is a node selected and you click in another one, deselect all the others
      //deselectAllElements();
      //hide the qz content menu and set the title
      $("#qz-content").hide("clip"); 
      $("#qz-title").html("Concept Selected");

      $("#act-lst, #act-lst-arrow").hide();

      //hide the tooltip of a selected node
      if ($(".tipsyClick").length > 0) {
        $(".tipsyClick").tipsy('hide');
        d3.selectAll(".tipsyClick").classed("tipsyClick", false);
      }

      //when some link is selected on the last action menu, there is 2 tooltips
      //hide se second tooltip of a selected link
      if ($(".tipsyClick2").length > 0) {
        $(".tipsyClick2").tipsy('hide');
        d3.selectAll(".tipsyClick2").classed("tipsyClick2", false);
      }

      //show the frase on the concept selected menu. There is no concept selected at this time
      $("#none-concept-selected").show();
      //collapse hide the concept selected menu
      //$("#collapse-concept-selected").collapse('hide'); //commented by jbarriapineda
      //hide the context menu, if there is one being shown
      $("#context-menu").hide("fold");

    }
    //if the block was true, at the second time it's gonna be false
    blockClick = false;
  });

  //click action on the userBarSizeAscend button from the toolbar
  $("#btn-userBarSizeAscend").click(function (e) {
    ifClickButton=true;
    orderBy = "userBarSizeAscend";//alphabet,topic,userBarSizeAscend,userBarSizeDescend,grpBarSizeAscend,grpBarSizeDescend
    getOrderMap();
    initConceptVis(uiCMVisId);
  });

  //click action on the userBarSizeDescend button from the toolbar
  $("#btn-userBarSizeDescend").click(function (e) {
    ifClickButton=true;
      orderBy = "userBarSizeDescend";//alphabet,topic,userBarSizeAscend,userBarSizeDescend,grpBarSizeAscend,grpBarSizeDescend
      getOrderMap();
      initConceptVis(uiCMVisId);
  });

  //click action on the grpBarSizeAscend button
  $("#btn-grpBarSizeAscend").click(function (e) {
    ifClickButton=true;
      orderBy = "grpBarSizeAscend";//alphabet,topic,userBarSizeAscend,userBarSizeDescend,grpBarSizeAscend,grpBarSizeDescend
      getOrderMap();
      initConceptVis(uiCMVisId);
  });

  //click action on the grpBarSizeDescend button 
  $("#btn-grpBarSizeDescend").click(function (e) {
    ifClickButton=true;
      orderBy = "grpBarSizeDescend";//alphabet,topic,userBarSizeAscend,userBarSizeDescend,grpBarSizeAscend,grpBarSizeDescend
      getOrderMap();
      initConceptVis(uiCMVisId);
  });

  //click action on the alphabet button
  $("#btn-alphabet").click(function (e) {
    ifClickButton=true;
      orderBy = "alphabet";//alphabet,topic,userBarSizeAscend,userBarSizeDescend,grpBarSizeAscend,grpBarSizeDescend
      getOrderMap();
      initConceptVis(uiCMVisId);
  });

  //click action on the topic button
  $("#btn-topic").click(function (e) {
    ifClickButton=true;
      orderBy = "topic";//alphabet,topic,userBarSizeAscend,userBarSizeDescend,grpBarSizeAscend,grpBarSizeDescend
      getOrderMap();
      initConceptVis(uiCMVisId);
  });

  //---------------------------------------------------------------
  //add by Jiaruixue
  //following button are for concept matrix 
  //click action on the userBarSizeAscend button from the toolbar
  $("#btn-left-indi").click(function (e) {
    //align_left_indi;align_left_comp; double_circle; align_ctopic_indi;align_ctopic_comp
    matrix_mod = "align_left_indi";
    initConceptVis(uiCMVisId);
  });

  //click action on the userBarSizeDescend button from the toolbar
  $("#btn-left-comp").click(function (e) {
    //align_left_indi;align_left_comp; double_circle; align_ctopic_indi;align_ctopic_comp
    matrix_mod = "align_left_comp";
    initConceptVis(uiCMVisId);
  });

  //click action on the grpBarSizeAscend button
  $("#btn-double-circle").click(function (e) {
    //align_left_indi;align_left_comp; double_circle; align_ctopic_indi;align_ctopic_comp
    matrix_mod = "double_circle";
    initConceptVis(uiCMVisId);
  });

  //click action on the grpBarSizeDescend button 
  $("#btn-ctopic-indi").click(function (e) {
    //align_left_indi;align_left_comp; double_circle; align_ctopic_indi;align_ctopic_comp
    matrix_mod = "align_ctopic_indi";
    initConceptVis(uiCMVisId);
  });

  //click action on the alphabet button
  $("#btn-ctopic-comp").click(function (e) {
    //align_left_indi;align_left_comp; double_circle; align_ctopic_indi;align_ctopic_comp
    matrix_mod = "align_ctopic_comp";
    initConceptVis(uiCMVisId);
  });





  //click action on the goals menu (open or close it) just for logging
  $("#a-goals").click(function (e) {
    var action = "";
    if ($("#collapse-goals").hasClass("in")){
      action = "close";
    } else {
      action ="open";
    }
    var value = $("#a-goals .badge").text();
    log(
      "action"            + CONST.log.sep02 + "cm-menu-goals-click"  + CONST.log.sep01 +
      "value-displayed"   + CONST.log.sep02 + value                  + CONST.log.sep01 +
      "event"             + CONST.log.sep02 + action,
      true
    );
  });

  //click action on the last action menu (open or close it) just for logging
  $("#a-last-action").click(function (e) {
    var action = "";
    if ($("#collapse-last-action").hasClass("in")){
      action = "close";
    } else {
      action ="open";
    }
    var value = $("#a-last-action .badge").text();
    log(
      "action"            + CONST.log.sep02 + "cm-menu-lastaction-click"  + CONST.log.sep01 +
      "value-displayed"   + CONST.log.sep02 + value                       + CONST.log.sep01 +
      "event"             + CONST.log.sep02 + action,
      true
    );
  });

  //click action on the session menu (open or close it) just for logging
  $("#a-session").click(function (e) {
    var action = "";
    if ($("#collapse-session").hasClass("in")){
      action = "close";
    } else {
      action ="open";
    }
    var value = $("#a-session .badge").text();
    log(
      "action"            + CONST.log.sep02 + "cm-menu-session-click"  + CONST.log.sep01 +
      "value-displayed"   + CONST.log.sep02 + value                    + CONST.log.sep01 +
      "event"             + CONST.log.sep02 + action,
      true
    );
  });

  //click action on the new knowledges of last action menu (open or close it) just for logging
  $("#tab-new-knowledges").click(function (e) {
    var value = $("#tab-new-knowledges .badge").text();
    log(
      "action"            + CONST.log.sep02 + "cm-lastaction-tab-select"  + CONST.log.sep01 +
      "tab"               + CONST.log.sep02 + "concept"                   + CONST.log.sep01 +
      "value-displayed"   + CONST.log.sep02 + value,
      true
    );
  });

  //click action on the new connections of last action menu (open or close it) just for logging
  $("#tab-new-connections").click(function (e) {
    var value = $("#tab-new-connections .badge").text();
    log(
      "action"            + CONST.log.sep02 + "cm-lastaction-tab-select"  + CONST.log.sep01 +
      "tab"               + CONST.log.sep02 + "links"                   + CONST.log.sep01 +
      "value-displayed"   + CONST.log.sep02 + value,
      true
    );
  });

  //click action on the new knowledges of session menu (open or close it) just for logging
  $("#tab-session-new-knowledges").click(function (e) {
    var value = $("#tab-session-new-knowledges .badge").text();
    log(
      "action"            + CONST.log.sep02 + "cm-session-tab-select"  + CONST.log.sep01 +
      "tab"               + CONST.log.sep02 + "concept"                   + CONST.log.sep01 +
      "value-displayed"   + CONST.log.sep02 + value,
      true
    );
  });

  ////click action on the new connections of session menu (open or close it) just for logging
  $("#tab-session-new-connections").click(function (e) {
    var value = $("#tab-session-new-connections .badge").text();
    log(
      "action"            + CONST.log.sep02 + "cm-session-tab-select"  + CONST.log.sep01 +
      "tab"               + CONST.log.sep02 + "links"                  + CONST.log.sep01 +
      "value-displayed"   + CONST.log.sep02 + value,
      true
    );
  });

  //click action on the set node as a goal (context menu)
  $("#ctx-add-goal").click(function(e) {

    //get the node id by the attr id-value. 
    var id = $('#context-menu .concept-name').attr("id-value");
    //get the data of the selected node
    var d = d3.select("#node" + id).data()[0];

    //if the node is already settled as a goal, just highlight it and then return
    if ($("#goal-node"+id).length > 0) {
      $("#goal-node"+id).effect("highlight", 1000);
      return;
    }

    //add the arrow image to the node settled as a goal
    d3.select("#chart g").append("image")
      .attr("xlink:href", "http://127.0.0.1/~felipe/um-vis-dev/d3/img/arrow.png")
      .attr("id-value", function(){ return d.id;})
      .attr("id", function(){ return "arrow-node" + d.id;})
      .attr("class", "arrow-node")
      .attr("x", function(){
        return d.x + d.faveSize;
      })
      .attr("y", function(){
        return d.y -7;
      })
      .attr("width", "20px")
      .attr("height", "20px");


    //clone the new goal node element and add it as a new row in the goals menu
    //the old and the new version are the same at this point
    var el_node = $("#node" + id).clone()[0];
    var r = +$(el_node).attr("r");
    var size = ((r*2)+(donutWidth*2));
    var html = "<tr id='" + "goal-node"+id + "' id-value='"+id+"'>"; 
    html = html + "<td style='vertical-align: middle;'><svg class='old' height='" + size   + "' width='"+ size +"' style='margin-left: auto; margin-right: auto; display: block;'></svg></td>";
    html = html + "<td style='vertical-align: middle;'><svg class='new' height='" + size   + "' width='"+ size +"' style='margin-left: auto; margin-right: auto; display: block;'></svg></td>";
    html = html + "<td style='vertical-align: middle;'><h5 class='concept-increase'>0%</h5></td>";
    html = html + "<td style='vertical-align: middle;'><h5 class='concept-name'>" + d.name + "</h5></td>";
    html = html + "<td style='vertical-align: middle;'><span class='goal-remove glyphicon glyphicon-minus-sign' aria-hidden='true' onclick='remove_goal("+id+");' tittle='Remove Goal'></span></td>"
    html = html + "</tr>";   
    $("#goals-content").append(html);
    $("#goal-node"+id).attr({
      "old-progress": d[colorProperty],
      "new-progress": d[colorProperty],
    });

    //set the node id, cx, cy, and the class
    $(el_node).attr({
      id: "goal-old-node"+id,
      cx: size/2,
      cy: size/2,
      class: "goal-node"
    });
    //update the cloned node to stroke white and opcity 1
    $(el_node).css("stroke", "white");
    $(el_node).css("opacity", 1);

    //everything the same for the donut of the node
    var el_donut = $("#donut-node"+id).clone()[0];

    $(el_donut).attr({
      id: "goal-old-donut-node"+id,
      transform: "translate("+size/2+","+size/2+")", 
      class: "goal-donut"
    });
    $(el_donut).css("stroke", "white");
    $(el_donut).css("opacity", 1);

    //add both node and donut to the .old svg
    $("#goal-node"+id+" .old").html("");
    $("#goal-node"+id+" .old").append(el_node, el_donut); 

    //clone the node and donut element and set their ids
    var new_el_node = $(el_node).clone()[0];
    $(new_el_node).attr("id", "goal-new-node"+id);

    var new_el_donut = $(el_donut).clone()[0];
    $(new_el_donut).attr("id", "goal-new-donut-node"+id);

    //add both new version to the .new svg
    $("#goal-node"+id+" .new").html("");
    $("#goal-node"+id+" .new").append(new_el_node, new_el_donut);

    //add the mouse events to the new row
    d3.select("#goal-node"+id)
      .style("cursor", "pointer") //set the cursor to pointer in this row
      .on("mouseover", function(d) { 
        //get the node that has the mouseover
        d3.select(this).classed("active", true);
        var node_id = d3.select(this).attr("id-value");
        node_id = "#node"+node_id;

        //call the mouseover function with this node data
        mapMouseOver(d3.select(node_id).data()[0], "mod-lastaction");
      })
      .on("mouseout", function(d) {
        //the same approach of the mouseover
        d3.select(this).classed("active", false);
        var node_id = d3.select(this).attr("id-value");
        node_id = "#node"+node_id;
        mapMouseOut(d3.select(node_id).data()[0], "mod-lastaction");

      })
      .on("click", function(d) {

        // console.log("goal click");
        //the same approach of the mouseover
        var node_id = d3.select(this).attr("id-value");
        // console.log(goalRemoved, node_id);
        if ((goalRemoved+"") === (node_id+"")) {
          goalRemoved = null;
          return;
        }
        node_id = "#node"+node_id;
        mapClick(d3.select(node_id).data()[0], "mod-lastaction");
      });

    //hide the none goal phrase
    $("#none-goal").hide();
    //set the goals badge (the number on the right side)
    $("#a-goals .badge").html($("#goals-content tr").length);
    //show the goals table (it is hidden when there is no goals)
    $("#goals-table").show("clip");
    //open the goals menu
    $("#collapse-goals").collapse('show');

    //log the user action
    log(
      "action"                + CONST.log.sep02 + "cm-set-goal"   + CONST.log.sep01 +
      "concept-name"          + CONST.log.sep02 + d.name          + CONST.log.sep01 +
      "topic-name"            + CONST.log.sep02 + d.topic         + CONST.log.sep01 +
      "concept-radius"        + CONST.log.sep02 + d.faveSize      + CONST.log.sep01 +
      "min-size"              + CONST.log.sep02 + minWidthNode    + CONST.log.sep01 +
      "max-size"              + CONST.log.sep02 + maxWidthNode    + CONST.log.sep01 +
      "concept-color"         + CONST.log.sep02 + d.faveColor     + CONST.log.sep01 +
      "concept-completeness"  + CONST.log.sep02 + d.completeness  + CONST.log.sep01 +
      "origin"                + CONST.log.sep02 + "context-menu",
      true
    );
  });

  //click action on the select concept of the context menu
  $("#ctx-select-concept").click(function(e) {
    //get the node
    var id = $('#context-menu .concept-name').attr("id-value");
    var d = d3.select("#node" + id).data()[0];

    //hide the context menu
    $('#context-menu').hide("fold");
    //when the user click on select node, there is no mouseover, so the node is not active
    //using the mouseover to activate the node
    mapMouseOver(d);
    //selecting the node
    mapClick(d.id, "context-menu");

  });

  //hide the selected node menu
  $("#qz-content").hide();
  //hide the last action menu
  $("#history-panel").hide();

});

// function initConceptMap(){

//   if (!modConceptMap) {
//     $("#chart").css("display", "none");
//     $("#tab-concept-map").css("display", "none");
//     $("#tab-load-others").addClass("ui-tabs-active ui-state-active");
//     modToolbar = false;
//     modCollapseMenu = false;
//   }

//   if (!modGoals){
//     $("#goals").parent().css("display", "none");
//   }

//   if (!modLastAction) {
//     $("#last-action").parent().css("display", "none");
//   }

//   if (!modSession) {
//     $("#session").parent().css("display", "none");
//   }

//   if (!modLinks) {
//     $("#tab-session-new-connections").css("display", "none");
//     $("#tab-new-connections").css("display", "none");
//   }

//   if (!modToolbar) {
//     $("#toolbar").css("display", "none");
//   }

//   if (!modCollapseMenu) {
//     $("#collapse-menu").css("display", "none");
//   }
// }

//-------------------------------------------------------------------------------------
//remove a goal by its id
var goalRemoved = null;
function remove_goal(id){
  goalRemoved = id;
  //first hide the node with a fadeout animation
  $("#goal-node"+id).hide(1000, function(){
    setTimeout(function() {
        //1 second later remove it from the html
        $("#goal-node"+id).remove();
        //hide the node arrow with an animation
        $("#arrow-node"+id).hide(500, function(){
          setTimeout(function(){
            //0.5 seconds later remove the arrow from the html
            $("#arrow-node"+id).remove();
          },500);
        });
        //get the amount of goals
        var n = $("#goals-content tr").length;
        //test if there is no more goals
        if (n <= 0){
          //if not, show the none goal message, then hide the table
          $("#none-goal").show("clip");
          $("#goals-table").hide();
          $("#collapse-goals").collapse('hide');
          n = "";
        } 
        //set the goals badge to show the amount of goals
        $("#a-goals .badge").html(n);
        
      }, 1000 );
  });

  var d = d3.select("#node" + id).data()[0];
  //log the user action
  log(
    "action"                + CONST.log.sep02 + "cm-remove-goal"   + CONST.log.sep01 +
    "concept-name"          + CONST.log.sep02 + d.name          + CONST.log.sep01 +
    "topic-name"            + CONST.log.sep02 + d.topic         + CONST.log.sep01 +
    "concept-radius"        + CONST.log.sep02 + d.faveSize      + CONST.log.sep01 +
    "min-size"              + CONST.log.sep02 + minWidthNode    + CONST.log.sep01 +
    "max-size"              + CONST.log.sep02 + maxWidthNode    + CONST.log.sep01 +
    "concept-color"         + CONST.log.sep02 + d.faveColor     + CONST.log.sep01 +
    "concept-completeness"  + CONST.log.sep02 + d.completeness  + CONST.log.sep01 +
    "origin"                + CONST.log.sep02 + "context-menu",
    true
  );
}


// ------------------------------------------------------------------------------------
//added by Haoran Zhao
//get the dot and a total progress based on the node id
function getDotProperties(id, mapItemProgress){
  var res = [];
  var test = 1;//id2 ? 2 : 1;
  var dotCnt = [];
  var cntTemp;
  var pos = 0;
  // for (var pos = 0; pos < test; pos++){
    res[pos] = [];
    var node = getNodeById(id);//(pos === 0 ? id : id2);
    var cnt = node.cnt;//.split("~");//commented by jbarriapineda


    for (var i = 0; i < data.topics.length; i++){
      var counter = 0;
      dotCnt = [];
      var tempProgress = 0;
      if (data.topics[i].id !== "AVG"){
        for (var j = 0; j < data.topics[i].activities.qz.length; j++){
          for (var k = 0; k < cnt.length; k++){
            if (data.topics[i].activities.qz[j].id === cnt[k]){
              dotCnt[counter] = cnt[k];
              tempProgress += mapItemProgress[data.topics[i].activities.qz[j].id];
              counter +=1;
            }
          }
        }
        for (var j = 0; j < data.topics[i].activities.ae.length; j++){
          for (var k = 0; k < cnt.length; k++){
            if (data.topics[i].activities.ae[j].id === cnt[k]){
              dotCnt[counter] = cnt[k];
              tempProgress += mapItemProgress[data.topics[i].activities.ae[j].id];
              counter +=1;
            }
          }
        }
        for (var j = 0; j < data.topics[i].activities.ex.length; j++){
          for (var k = 0; k < cnt.length; k++){
            if (data.topics[i].activities.ex[j].id === cnt[k]){
              dotCnt[counter] = cnt[k];
              tempProgress += mapItemProgress[data.topics[i].activities.ex[j].id];
              counter +=1;
            }
          }
        }
        if(0 !== counter){
          res[pos].push({
                "totalProgress":(tempProgress/counter),
                "topicId": data.topics[i].id,
                "conceptTopicId": node.ct,
                "conceptId":id,
                "cnt": dotCnt
              });
        }
      }
    }
  // }
  return res[0];
}

// ------------------------------------------------------------------------------------
//get the questions based on the node id, if a second id (id2) exist, it means that
//the function is gonna return the questions for both nodes (link selection)
function getCnt(id, id2){
  var res = [];
  var test = id2 ? 2 : 1;
  for (var pos = 0; pos < test; pos++){
    res[pos] = [];
    var node = getNodeById(pos === 0 ? id : id2);
    var cnt = node.cnt;//.split("~");

    for (var i = 0; i < data.topics.length; i++){
      if (data.topics[i].id !== "AVG"){
        for (var j = 0; j < data.topics[i].activities.qz.length; j++){
          for (var k = 0; k < cnt.length; k++){
            if (data.topics[i].activities.qz[j].id === cnt[k]){
              res[pos].push({
                "name": data.topics[i].activities.qz[j].name, 
                "id": data.topics[i].activities.qz[j].id,
                "url": data.topics[i].activities.qz[j].url,
                "topicIdx": i,
                "topicId": data.topics[i].id,
                "topicName": data.topics[i].name,
                "qzIdx": j
              });
            }
          }
        }
        for (var j = 0; j < data.topics[i].activities.ae.length; j++){
          for (var k = 0; k < cnt.length; k++){
            if (data.topics[i].activities.ae[j].id === cnt[k]){
              res[pos].push({
                "name": data.topics[i].activities.ae[j].name, 
                "id": data.topics[i].activities.ae[j].id,
                "url": data.topics[i].activities.ae[j].url,
                "topicIdx": i,
                "topicId": data.topics[i].id,
                "topicName": data.topics[i].name,
                "qzIdx": j
              });
            }
          }
        }
        for (var j = 0; j < data.topics[i].activities.ex.length; j++){
          for (var k = 0; k < cnt.length; k++){
            if (data.topics[i].activities.ex[j].id === cnt[k]){
              res[pos].push({
                "name": data.topics[i].activities.ex[j].name, 
                "id": data.topics[i].activities.ex[j].id,
                "url": data.topics[i].activities.ex[j].url,
                "topicIdx": i,
                "topicId": data.topics[i].id,
                "topicName": data.topics[i].name,
                "qzIdx": j
              });
            }
          }
        }
      }
    }
  }
  if (id2) {
    res[2] = [];
    for (var i = 0; i < res[0].length; i++){
      for (var j = 0; j < res[1].length; j++){
        if (res[0][i].id === res[1][j].id){
          res[2].push(res[0][i]);
        }
      }
    }
    return res[2];
  } else {
    return res[0];
  }
}

// ------------------------------------------------------------------------------------
//get a node by its id
function getNodeById(id){
  var node = null;
  // console.log(id);
  //nodes_static.forEach(function(e, i){
  sorted_kcs.forEach(function(e,i){  
    if (e.id == id){
      node = e;
      return;
    }
  });
  return node;
}

//mapping of the topic names between the mastery grid and the concept map
var topicMap = {};

// ------------------------------------------------------------------------------------
//select a group and all its nodes by the name of the topic


// ------------------------------------------------------------------------------------
//compare old with new nodes and return an array with the difference (updated nodes)
//assuming that the number of nodes is always the same


// ------------------------------------------------------------------------------------
//compare old with new links and return an array with the difference (new or updated links) 
//assuming that the number of links is diferent

// ------------------------------------------------------------------------------------
// mapping to the mouse over of the new connections
// it selects both nodes and put the tooltip on them

// ------------------------------------------------------------------------------------
//deselect all the selected elements
function deselectAllElements(){
  // if (!modConceptMap){
  //   return;
  // }

  if(uiCMVisId == "bipartite"){
    //redrawNormal();//commented by jbarriapineda in order to dont redraw the graph when hovering one topic square in MG

  /*svg.selectAll(".link.selected")
    .transition()
    .style("visibility", "hidden");*/

  svg.selectAll(".nodename")
    .transition()
    .style("opacity", 1);

  svg.selectAll(" .bar")
    .transition()
    .style("opacity", 1);
    //.style("stroke", "#fff");

  svg.selectAll(" .groupbar")
    .transition()
    .style("opacity", 1);
    //.style("stroke", "#fff");

  svg.selectAll(".diagonals")
    .transition()
    .style("opacity", 0);

  svg.selectAll(" .text-userbar")
    .style("opacity", 0);

  svg.selectAll(" .text-groupbar")
    .style("opacity", 0);

  d3.selectAll(".selected").classed("selected", false);
  }else if(uiCMVisId=="conceptMatrix" || uiCMVisId=="conceptList" || uiCMVisId=="conceptMap"){


    svg.selectAll(".link.selected")
    .transition()
    .style("visibility", "hidden");

  svg.selectAll(".node, .donut")
    .transition()
    .style("opacity", 1)
    .style("stroke", "#fff");

  d3.selectAll(".selected").classed("selected", false);

  $(".node").each(function(){
       $(this).tipsy('hide');});
    //$("#node"+d.id).tipsy('hide');
        d3.select(".node").classed("tipsyOver", false);

  }else if(uiCMVisId=="circle"){

      //Code added by jbarriapineda
      $("#conceptVisSvg").show();

    svg.selectAll(".link")
      .classed("link--target", false)
      .classed("link--source", false);

  svg.selectAll(".node-name")
      .classed("node--selected", false) 
      .classed("node--target", false)
      .classed("node--source", false);

  svg.selectAll(".node-circle").classed("node--selected", false);
  svg.selectAll(".node-circle").classed("node--target", false);
  svg.selectAll(".node-circle").classed("node--source", false);

  svg.selectAll(".link")
      .classed("link--target--clicked", false)
      .classed("link--source--clicked", false);

  svg.selectAll(".node-name")
      .classed("node--selected--clicked", false) 
      .classed("node--target--clicked", false)
      .classed("node--source--clicked", false);

  svg.selectAll(".node-circle").classed("node--selected--clicked", false);
  svg.selectAll(".node-circle").classed("node--target--clicked", false);
  svg.selectAll(".node-circle").classed("node--source--clicked", false);

  svg.selectAll(".link")
      .transition()
      .style("stroke", function(d) { return "gray"; })
      .style("stroke-opacity", function(d) { return .4; })
      .style("fill", function(d) { return "none"; })
      .style("pointer-events", function(d) { return "none"; });

  svg.selectAll(".node-name")
      .transition()
      .style("fill", function(d) { return "#000"; });


  svg.selectAll(".node-circle")
    .transition()
    .style("stroke", function(d) { return "white"; })
    .style("opacity", 1);
  }
  
}

// ------------------------------------------------------------------------------------
// mapping function to add the colors to the nodes
function mapPropertyToColors(colors, items, type){

  for(var i = 0; i < items.length; ++i){
    items[i][color] = propertyToColor(colors,items[i][colorProperty], items[i].uATT);
    items[i][dcolor] = propertyToColor(colors,items[i][dcolorProperty], items[i].gATT);

    if (type === 'nodes') {
      if (minSizePropertyNode == null || maxSizePropertyNode == null) {
        minSizePropertyNode = items[i][sizeProperty];
        maxSizePropertyNode = items[i][sizeProperty];
      }
      if (items[i][sizeProperty] > maxSizePropertyNode){
        maxSizePropertyNode = items[i][sizeProperty];
      }
      if (items[i][sizeProperty] < minSizePropertyNode){
        minSizePropertyNode = items[i][sizeProperty];
      }
    } else if (type === 'links') {
      if (minSizePropertyEdge == null || maxSizePropertyEdge == null){
        minSizePropertyEdge = items[i][sizeProperty];
        maxSizePropertyEdge = items[i][sizeProperty];
      }
      if (items[i][sizeProperty] > maxSizePropertyEdge){
        maxSizePropertyEdge = items[i][sizeProperty];
      }
      if (items[i][sizeProperty] < minSizePropertyEdge){
        minSizePropertyEdge = items[i][sizeProperty];
      }
    }
  }
}



// ------------------------------------------------------------------------------------
function propertyToColor(colors, property, nAttempts){
    var idx = Math.floor(property*colors.length);
    //if(property > 0) alert(idx+" "+property);
    if(nAttempts === 0){
      return "#CCCCCC";
    }
    if(idx >= colors.length){
      return colors[colors.length - 1];
    } else if (idx < 0){
      return colors[0];
    }
    return colors[idx];
}


function mapWidthDonutData(size){
  return mapData(size, maxWidthNode, 0, maxSizePropertyNode, 0);
}
// ------------------------------------------------------------------------------------
function mapWidthNodeData(size){
  return mapData(size, maxWidthNode, minWidthNode, maxSizePropertyNode, minSizePropertyNode);
}

// ------------------------------------------------------------------------------------
function mapHeightNodeData(size){
  return mapData(size, maxHeightNode, minHeightNode, maxSizePropertyNode, minSizePropertyNode);
}

// ------------------------------------------------------------------------------------
function mapFontSizeNodeData(size){
  return mapData(size, maxFontSizeNode, minFontSizeNode, maxSizePropertyNode, minSizePropertyNode);
}

// ------------------------------------------------------------------------------------
function mapWidthEdgeData(size){
  return mapData(size, maxWidthEdge, minWidthEdge, maxSizePropertyEdge, minSizePropertyEdge);
}

// ------------------------------------------------------------------------------------
function mapData(size, maxW, minW, maxSize, minSize){
  return (size * ((maxW - minW)/(maxSize - minSize))) + minW;
}




// ------------------------------------------------------------------------------------
//set the biggest node of the group
function groupSettings(uiCMVisId){ 

if(uiCMVisId == "conceptMap"){
  for(var i = 0; i < groups.length; i++){
    var max = groups[i].values[0];
    var avg = 0;
    var amount = 0;
    groups[i].biggest = 0;
    for (var j = 0; j < groups[i].values.length; j++){
      groups[i].values[j].groupIndex = i;
      if (groups[i].values[j].nAttempts !== 0){
        avg += groups[i].values[j][colorProperty];
        amount++;
      }
      
      if (groups[i].values[j][sizeProperty] > max[sizeProperty]){
        max = groups[i].values[j];
        groups[i].biggest = j;
      }
    }
    groups[i].color = propertyToColor(colors, (avg/amount), 'group');
  }
}else{
  for(var i = 0; i < groups.length; i++){
    var max = 0;
    var temp = 0;

    groups[i].outcomeConceptId = 0;

    for (var j = 0; j < groups[i].values.length; j++){
      temp = getCnt(groups[i].values[j].id).length;
      
      if (max <= temp){
        max = temp;
        groups[i].outcomeConceptId = groups[i].values[j].id;
      }
    }
  }
}

}
// ------------------------------------------------------------------------------------
//
function getConceptFromTopic(topicId){ 
  var kcs = sorted_kcs;
  var res = [];
  var counter =0;
  /*for(var i = 0; i < Object.keys(mapConceptColumnTopic).length; i++){
    if(mapConceptColumnTopic[i] == topicId){
      res[counter] = i;
      counter++;
    }
  }*///commented by jbarriapineda
  console.log(topicId);
  console.log(kcs);
  for(var i = 0; i < kcs.length; i++){
    //if (kcs[i].t == topicId){//Commented by @Jordan in order to make it work for course id=351 (it has different topic names)
    if(state.curr.cid!=367){
      if (correctTopicName(kcs[i].t) == topicId){
        res[counter] = kcs[i].id;
        counter++;
      }
    }else{
      if (correctTopicNameMemphis(kcs[i].t) == topicId){
        res[counter] = kcs[i].id;
        counter++;
      }
    }
    
  }

  return res;
}




function getMapProgress(){
  var mapProgress={};
  learnersD = getMe(false);
  var activitiesD = learnersD.state.activities;
  //get two maps mapping from items to topic and process
  for(var key in activitiesD){
    for(var key1 in activitiesD[key].ae){
      mapProgress[key1] = activitiesD[key].ae[key1].values.p;
    }
    for(var key2 in activitiesD[key].ex){
      mapProgress[key2] = activitiesD[key].ex[key2].values.p;
    }
    for(var key3 in activitiesD[key].qz){
      mapProgress[key3] = activitiesD[key].qz[key3].values.p;
    }
  }
  return mapProgress;

}


//add by jiaruixue
//load static concept structure
function loadConceptStructure(){
  vis.loadingShow();

  $call("GET", "script/richolm/data/SAMPLE_static.json", null, loadConceptStructure_cb, true, false);
  //$call("GET", "http://localhost:8080/aggregateUMServices/GetConceptMapStructure?domain=java", null, loadConceptStructure_cb, true, false);
}

function loadConceptStructure_cb(graph){


  var topicMapFromGraph = graph["topic-map"];
  for(var i=0;i<topicMapFromGraph.length;i++){
    topicMap[topicMapFromGraph[i].ct] = topicMapFromGraph[i].t;
  }

          learnersD = getMe(false);
  
          mapD = {}; //the map of questions to course topics
          var activitiesD = learnersD.state.activities;
            //get map mapping from items to topic
            for(var key in activitiesD){
              for(var key1 in activitiesD[key].ae){
                mapD[key1] = key;
              }
              for(var key2 in activitiesD[key].ex){
                mapD[key2] = key;
              }
              for(var key3 in activitiesD[key].qz){
                mapD[key3] = key;
              }
            }

          nodes_static = graph.nodes;
          links_static = graph.links;
            
           // groups = d3.nest().key(function(d) { return d.topic; }).entries(nodes);
           var topicCount = 0;
           for(var i=0;i<data._rt.topicsOrd.length;i++){
            if(data._rt.topicsOrd[i].id=="AVG"){}
              else{
                topic_column_order[topicCount] = data._rt.topicsOrd[i].id;
                topicCount++;
              }
           }


           //get the ordered array of topic downward
           topicCount = 0;
           for(var i=0;i<topic_column_order.length;i++){
            if(i==0){
               topic_order[topicCount] = topicMap[topic_column_order[i]];
               topicCount++;
            }
            else{
              if(topic_order[topicCount-1]==topicMap[topic_column_order[i]]){}
                else{
                  topic_order[topicCount] = topicMap[topic_column_order[i]];
                  topicCount++;
                }
            }
           }

           //get the topic map to a column topic mapConceptColumnTopic
           for(var i=0; i<nodes_static.length;i++){
              mapConceptColumnTopic[nodes_static[i].id] = nodes_static[i].ct;
              mapConceptName[nodes_static[i].id] = nodes_static[i].dn;
              mapConceptNameDisplayName[nodes_static[i].n] = nodes_static[i].dn;
           }


          //following part is copied from vis: 
          //calculating course topic  and position mapping
          /*var resNames  = $map(function (x) { return x.name; }, data.resources.slice(1));

          var resOffsetL = svgGetMaxTextBB(resNames).width + 50;

          var paddingL = gridSetting.padding.l;//(doShowYAxis ? settings.padding.l : 10);

          var sqX = 6;//this number is actually from txtX
          mapTopicPos["AVG"] = resOffsetL + paddingL+sqX;
          var sqW = gridSetting.sq.w;

          //var y = ((sqH + CONST.vis.gridAbsAct.sq.padding) * iSeries) + CONST.vis.gridAbsAct.padding.t + topicOffsetT + paddingT;
          sqX += gridSetting.sepX+sqW; 
          

          for(var j=0;j<topic_column_order.length;j++){
          sqX += (j === 0 ? 0 : sqW * visGetTopicSize(topic_column_order[j]) + gridSetting.sq.padding);
          //sqX += sqW * visGetTopicSize(topic_column_order[i]) + CONST.vis.gridAbsAct.sq.padding;
          var x = resOffsetL + sqX;
           mapTopicPos[topic_column_order[j]] = x;
           maxminTemp[j]=x;
          }

          barChartLeftPos = svgGetMaxTextBB(resNames).width;//d3.min(maxminTemp)-sqW/2;
          barChartRightPos = d3.max(maxminTemp)+sqW*2+50;*/
          

  //loadDynamicData();
  vis.loadingHide();
}

//load dynamic data
function loadDynamicData(){
  $call("GET", "script/richolm/data/SAMPLE_dynamic.json", null, loadDynamicData_cb, true, false);
  //$call("GET", "http://localhost:8080/aggregateUMServices/GetConceptKnowledgeList?usr="+state.curr.usr+"&grp="+state.curr.grp+"&domain=java", null, loadDynamicData_cb, true, false); //
}

function loadDynamicData_cb(graph){

          nodes_dynamic= graph.nodes;
          links_dynamic = graph.links;

          //adding source and to node to the links dynamic data
          links_dynamic.forEach(function(e, i) {
            //var linkId
            links_static.filter(function(n){
              if(n.id === e.id){
                e.s = n.s;
                e.t = n.t;
              }
            });
          });

          //calculating max connection of each code
          links_static.forEach(function(e, i) {

          var sourceNode = nodes_dynamic.filter(function(n) {
            if (!n.maxConnections) {
              n.maxConnections = 0;
            }
            if (n.id === e.s) {
                n.maxConnections += 1;
            }
           return n.id === e.s;
          })[0];

          var targetNode = nodes_dynamic.filter(function(n) {
            if (!n.maxConnections) {
              n.maxConnections = 0;
            }
            if (n.id === e.t) {
                n.maxConnections += 1;
            }
            return n.id === e.t;
          })[0];
    
          if (sourceNode) {
            e.s = sourceNode; 
            e.source = sourceNode;
          } else {
            //e = null;
          }
          
          if (targetNode) {
            
            e.t = targetNode;
            e.target = targetNode;
          } else {
            //e = null;
          }
         });

          //counting the connections each node has according to dynamic data
          links_dynamic.forEach(function(e, i) {
          var sourceNode = nodes_dynamic.filter(function(n) {
            if (!n.connections) {
              n.connections = 0;
            }
            if (n.id === e.s) {
                n.connections += 1;
            }
           return n.id === e.s;
          })[0];
          var targetNode = nodes_dynamic.filter(function(n) {
            if (!n.connections) {
              n.connections = 0;
            }
            if (n.id === e.t) {
                n.connections += 1;
            }
            return n.id === e.t;
          })[0];
    
          if (sourceNode) {
            e.s = sourceNode; 
            e.source = sourceNode;
          } else {
            e = null;
          }
          if (targetNode) {
            e.t = targetNode;
            e.target = targetNode;
          } else {
            e = null;
          }

         });

          //added by jiaruixue
          //adding the static data into dynamic data
          //TODO: if the data structure of static data changed, this part might need to be changed
          // for(var i=0;i<links_dynamic.length;i++){
          //   var link_static_tmp = links_static.filter(function(d) {return d.id==links_dynamic[i].id; });
          //   links_dynamic[i].cnt=link_static_tmp[0].cnt;
          //   links_dynamic[i].idf=link_static_tmp[0].idf;
          //   links_dynamic[i].nUniqueQues=link_static_tmp[0].nUniqueQues;
          // }
          // for(var i=0;i<nodes_dynamic.length;i++){
          //   var node_static_tmp = nodes_static.filter(function(d) { return d.id==nodes_dynamic[i].id; });
          //   nodes_dynamic[i].cnt=node_static_tmp[0].cnt;
          //   nodes_dynamic[i].ct=node_static_tmp[0].ct;
          //   nodes_dynamic[i].dn=node_static_tmp[0].dn;
          //   nodes_dynamic[i].n=node_static_tmp[0].n;
          //   nodes_dynamic[i].t=node_static_tmp[0].t;
          //   nodes_dynamic[i].groupIndex=node_static_tmp[0].groupIndex;

          //}
          //added by jiaruixue
          //adding the dynamic data into static data
          //TODO: if the data structure of static data changed, this part might need to be changed
          for(var i=0;i<links_static.length;i++){
            var link_static_tmp=[];
            if(i<links_dynamic.length){
                link_static_tmp = links_static.filter(function(d) {return d.id==links_dynamic[i].id; });
            }
            if(link_static_tmp.length != 0){
              links_dynamic[i].cnt=link_static_tmp[0].cnt;
              links_dynamic[i].idf=link_static_tmp[0].idf;
              links_dynamic[i].nUniqueQues=link_static_tmp[0].nUniqueQues;
            }else{
              links_dynamic.push(links_static[i]);
            }
          }
          for(var i=0;i<nodes_dynamic.length;i++){
            var node_static_tmp = nodes_static.filter(function(d) { return d.id==nodes_dynamic[i].id; });
            nodes_dynamic[i].cnt=node_static_tmp[0].cnt;
            nodes_dynamic[i].ct=node_static_tmp[0].ct;
            nodes_dynamic[i].dn=node_static_tmp[0].dn;
            nodes_dynamic[i].n=node_static_tmp[0].n;
            nodes_dynamic[i].t=node_static_tmp[0].t;
            nodes_dynamic[i].groupIndex=node_static_tmp[0].groupIndex;

          }





          //added by Jiaruixue for conceptMap
           if(uiCMVisId=="conceptMap" || uiCMVisId=="circle"){
                mapPropertyToColors(colors, nodes_dynamic, 'nodes');
                groups = d3.nest().key(function(d) { return d.t; })
                    .sortKeys(function(a,b){ return topic_order.indexOf(a) - topic_order.indexOf(b);})
                    .entries(nodes_dynamic);
           }else{
                groups = d3.nest().key(function(d){ return d.ct;})
                     .sortKeys(function(a,b){ return topic_column_order.indexOf(a) - topic_column_order.indexOf(b);})
                     .entries(nodes_dynamic);
           }

          //get the outcome concept and put it in to groups data
          groupSettings(uiCMVisId);

          //get the concept list grouped by the topic
            var temp = null;
            var counter = 0;
            for(var i=0; i<groups.length; i++){
              temp = null;
              temp = groups[i]; 
              for(var j=0; j<groups[i].values.length; j++){
                conceptArray[counter] = groups[i].values[j].n;
                idArray[counter] = groups[i].values[j].id;
                counter+=1;
              }
            }

          getOrderMap();

          initConceptVis(uiCMVisId);
}



function initConceptVis(uiCMVisId){

  console.log("initConceptVis");

  removeAll();

  if(uiCMVisId=="bipartite"){
    initBipartite();
  }else if(uiCMVisId=="conceptMatrix"){
    initConceptMatrix();
  }else if(uiCMVisId=="conceptList"){
    initConceptList();
  }else if(uiCMVisId=="conceptMap"){
    console.log("conceptMap");
    initConceptMap();
  }else if(uiCMVisId=="circle"){
    initcircle();
  }

  
  //Code added by jbarriapineda
  if (uiCMVisId=="bipartite" || uiCMVisId=="circle"){
    //$("#kcmap-selection").width($(".svg-grid").width());//code added by jbarriapineda
    //$("#kcmap-selection").width("88%");
    //$("#kcmap-selection").css("display","block");
  }
  //end of code added by jbarriapineda

}


function initConceptMap(){
    $(".btn-bipartite").hide();
    $(".btn-conceptMatrix").show();

    mapPropertyToColors(colors, nodes_dynamic, 'nodes');
    mapPropertyToColors(colors, links_dynamic, 'links');

    //TODO: modify this to evenly connect between nodes
    createFakeLinks();

    //zoom reference http://bl.ocks.org/mbostock/6123708 
    svg = d3.select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("pointer-events", "all")
      .call(d3.behavior.zoom().scaleExtent([0.5, 5]).on("zoom", redrawConceptMap))
      .append('g')
      .attr("transform", "translate(" + 0 + "," + 50 +  ") scale(" + 0.8 + ")");


    force = d3.layout.force()
      .nodes(nodes_dynamic)
      .links(links_dynamic)
      .size([w, h])
      .gravity(0.1)
      .distance(50)
      .charge(-100)
      .linkStrength(function(d){
        return d.class === "fake" ? 0.9 : 0;
      });

    path = svg.selectAll("path")
      .data(groups)
      .attr("d", groupPath)
      .enter().insert("path", "circle")
      .attr("class", "group")
      .attr("id", function(d, i){ 
        return "group"+i})
      .style("fill", function(d){ return d.color; })
      .style("stroke", function(d){ return d.color; })
      .style("stroke-width", 50)
      .style("stroke-linejoin", "round")
      .style("opacity", 0.4);

    link = svg.selectAll("line");

    node = svg.selectAll("g.node");

    drawConceptMap();

    link.classed("elementChanged", false);

    text = svg.selectAll("text")
      .data(groups)
      .enter().append("text")
      .text( function (d) { return d.key; })
      .style("font", "16px sans-serif")
      .style("pointer-events", "none")
      .style("text-shadow", "2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff")
      .style("fill", "#000")
      .style("visibility", "hidden");

    svg.style("opacity", 1e-6)
      .transition()
      .duration(1000)
      .style("opacity", 1);
    

    force.on("tick", function(e) {

      link //link = d3.selectALl(".link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      d3.selectAll(".node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

      d3.selectAll(".arrow-node")
        .attr("x", function() { return +d3.select("#node" + d3.select(this).attr("id-value")).attr("cx") + +d3.select("#node" + d3.select(this).attr("id-value")).attr("r"); })
        .attr("y", function() { return +d3.select("#node" + d3.select(this).attr("id-value")).attr("cy") - 7; });

      d3.selectAll(".donut")
        .attr('transform', function(d) { 
          return 'translate(' + d.x + ',' + d.y + ')'; 
        });

      svg.selectAll("path")
        .data(groups)
        .attr("d", groupPath)
        .enter().insert("path", "circle");

      text
        .attr("transform", function(d) { 
            return "translate(" + (d.values[d.biggest].x - (d.key.length*4))+ "," + d.values[d.biggest].y + ")";      
        });
    });
}
// ------------------------------------------------------------------------------------
// set all the attributes and styles of the links, nodes, and donuts its acrs, 
function drawConceptMap() {

  link = link.data(links_dynamic, function(d) { 
    return d.source.id + "-" + d.target.id; });

  link.enter().insert("line", ".node")
    .attr("id", function(d) {return "link"+d.source.id + "-" + d.target.id;})
    .attr("id-source", function(d) { return d.source.id})
    .attr("id-target", function(d) { return d.target.id})
    .attr("class", "link")
    .style("stroke", function(d) { return d.faveColor = "#444444"; })
    .style("stroke-width", function(d) { return 1;})//d.faveWidth = mapWidthEdgeData(d[sizeProperty]); })
    .style("cursor", "pointer")
    .style("opacity", 1)
    .style("visibility", function(d){
      d3.select(this).classed("elementChanged", true);
      return "hidden"; //it turns all links hidden at the first load
      //return d.class === "fake" ? "hidden" : "visible";
    })
    .on("click", function(d){ mapLinkClick(d, "map"); }) 
    .on("contextmenu", function(d) {
      d3.event.preventDefault();
      // console.log("Link Right Click: link" + d[idProperty]);
    });


  link.exit().remove();

  node = node.data(nodes_dynamic, function(d) { return d.id;});

  var pi = Math.PI;
    
  arc = d3.svg.arc()
    .innerRadius(function(d) {return d[size] + 0.5})
    .outerRadius(function(d) {return d[size] + donutWidth})
    .startAngle(0)
    .endAngle(function(d) {
      var completeness = d.connections/maxConnections; //d.maxConnections
      d.completeness = completeness;
      return (360 * completeness) * (pi/180);
    }); //just radians

  inner = node.enter().append("circle")
    .attr("class", "node")
    .attr("id", function(d) { return "node" + d[idProperty]})
    .attr("id-value", function(d) { return d[idProperty]})
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d){ return 10})//d[size] = mapWidthNodeData(d[sizeProperty]); })
    .attr("title", function(v) { return styleTooltip(mapConceptName[v.id]); })
    .style("fill", function(d) { return d[color]; })
    .style("stroke", function(d) { return "white"; })
    .style("stroke-width", 2)
    .style("cursor", "pointer")
    .call(force.drag)
    .on("mouseover", function(d){ mapMouseOver(d,d.t, "map"); })                  
    .on("mouseout", function(d){ mapMouseOut(d,d.t, "map"); })
    .on("click", function(d){ mapClick(d.id, "map"); }) 
    .on("contextmenu", function(d) {
      d3.event.preventDefault();
      // console.log("Node Right Click: " + d.name);

      if (modGoals) {

        $("#context-menu .concept-name")
          .html("<b>" + d.name + "</b>")
          .attr("id-value", d.id);

        $("#context-menu").css({
          left: d3.event.pageX,
          top: d3.event.pageY
        }).show("fold");
      }

    });


  d3.selectAll(".node")
    .each(function(d) {
      $(this).tipsy({ gravity: "s", opacity: 1, html: true, trigger: 'manual'});
    });

  // donut = node
  //   .enter()
  //   .append("path")
  //   .attr("id", function(d) { return "donut-node" + d[idProperty]})
  //   .attr("id-node", function(d) { return d[idProperty]})
  //   .attr("class", "donut")
  //   .attr("d", arc)
  //   .style("fill", function(d){ return d[color]; })
  //   .style("stroke", function(d) { return "white"; })
  //   .style("stroke-width", function(d) { return (d.completeness>0?1:0); });

  force.start();
}
//------------------------------------------------------------------------------------
//redraw the graph every time there is an zoom or translate event
var translateAddValue = 50;
function redrawConceptMap() {
    var v = d3.event.translate;
    if (translateAddValue > 0){
      d3.event.translate[1] += translateAddValue;
      translateAddValue--;
    }

    svg.attr("transform", "translate(" + d3.event.translate + ")" +
                          " scale(" + (d3.event.scale - 0.2) + ")");

    if ($(".tipsyClick").length > 0) {
      $(".tipsyClick").tipsy('show');
    }
    if ($(".tipsyOver").length > 0) {
      $(".tipsyOver").tipsy('show');
    }
}; 
// ------------------------------------------------------------------------------------
// Simple function to style the tooltip for the given node.
var styleTooltip = function(name) {
  return "<p class='name'>" + name + "</p>";
};
var styleColorTooltip = function(name) {
  // @@@@ Julio
  return "<p class='name' style='color: white; font-size:1.2em'>" + name + "</p>";
  //return name;
};

// ------------------------------------------------------------------------------------
//set the points for the convex hulls (groups)
var groupPath = function(d) {
    return "M" + 
      d3.geom.hull(d.values.map(function(i) { return [i.x, i.y]; }))
        .join("L")
    + "Z";
};





function initConceptMatrix(){
   $(".btn-bipartite").hide();
    $(".btn-conceptMatrix").show();


    var sqW = gridSetting.sq.w;
          svg = d3.select("#chart")
                 .style("overflow","scroll")
                 .style("height","450px")
                 .append("svg")
                 .attr("id","conceptVisSvg")
                 .attr("width", w)
                 .attr("height", 3500) 
                 .attr("pointer-events", "all")  
                 .append('g');

                nodename = svg.selectAll("g.nodename");
                nodename = nodename.data(conceptArray);       
            
              nodename.enter().append("text")
                   .text(function(d){return d;})
                   .attr("class","nodename")
                   .attr("id",function(d,i){return "nodename" + i})
                   .attr("transform", function(d,i) { 
                   return "translate( 5, " + (2+i)*gridSetting.sq.w + ")";})
                   .style("font-weight", "bold");


            //highlight horizontal
            nodename.enter().append("rect")
                   .attr("class","highlight")
                   .attr("id",function(d,i){return "highlight"+idArray[i]})
                   .attr("x",0)
                   .attr("y",function(d,i) {return  (2+i)*gridSetting.sq.w-maxWidthNode;})
                   .attr("width",900)
                   .attr("height",function(d,i){return  maxWidthNode*2;})
                   .style("fill-opacity", function(d) { return 0; });
                   //highlight vertical
            nodename.enter().append("rect")
                   .attr("class","highlight")
                   .attr("id",function(d,i){return "Vhighlight"+mapConceptColumnTopic[idArray[i]]})
                   .attr("x",function(d,i) {return mapTopicPos[mapConceptColumnTopic[idArray[i]]]-sqW/2;})
                   .attr("y",0)
                   .attr("width",function(d,i){return  maxWidthNode*2;})
                   .attr("height",3500)
                   .style("fill-opacity", function(d) { return 0; });




            // need dynamic data
            node = svg.selectAll("g.node");
            node = node.data(nodes_dynamic, function(d) { return d.id;});


             var pi = Math.PI;

             // if(matrix_mod === "align_ctopic_indi" | matrix_mod ==="align_left_indi"){
             //  arc = d3.svg.arc()
             //        .innerRadius(function(d) {return d[size] + 0.5})
             //        .outerRadius(function(d) {return d[size] + donutWidth})
             //        .startAngle(0)
             //        .endAngle(function(d) {
             //          var completeness = d.connections/d.maxConnections; //d.maxConnections
             //          d.completeness = completeness;
             //          return (360 * completeness) * (pi/180);
             //        }); //just radians  
             // }else if(matrix_mod === "align_ctopic_comp" | matrix_mod ==="align_left_comp"){
             //    arc = d3.svg.arc()
             //        .innerRadius(function(d) {return d[size]})
             //        .outerRadius(function(d) {return d[size] + mapWidthDonutData(d[dsizeProperty]);} )
             //        .startAngle(0)
             //        .endAngle(12); //just radians  
             // }else if(matrix_mod=="double_circle"){}//doing nothing, we don't need arc here.

             
              

            mapPropertyToColors(colors, nodes_dynamic, 'nodes');
            

            

            if(matrix_mod=="double_circle"){
              //indi
              inner = node.enter().append("circle")
                     .attr("class", "node")
                     .attr("id", function(d) { return "node" + d[idProperty]})
                     .attr("id-value", function(d) { return d[idProperty]})
                     .attr("cx", function(d) { return mapTopicPos["AVG"];})//need to be modified to accomodate to make two circles parallel
                     .attr("cy", function(d) { return (2+conceptArray.indexOf(mapConceptName[d.id]))*sqW; })
                     .attr("r", function(d){ return 10;})//d[size] = mapWidthNodeData(d[sizeProperty]); })
                     .attr("title", function(v) { return mapConceptName[v.id]; })
                     .style("fill", function(d) { return d[color]; })
                     .style("stroke", function(d) { return "white"; })
                     .style("stroke-width", 2)
                     .style("cursor", "pointer")
                     .on("mouseover", function(d){ mapMouseOver(d,mapConceptColumnTopic[d.id], "map"); })                  
                     .on("mouseout", function(d){ mapMouseOut(d,mapConceptColumnTopic[d.id], "map"); })
                     .on("click", function(d){ mapClick(d.id, "map"); });
              //compare
              // inner = node.enter().append("circle")
              //        .attr("class", "node-comp")
              //        .attr("id", function(d) { return "nodeC" + d[idProperty]})
              //        .attr("id-value", function(d) { return d[idProperty]})
              //        .attr("cx", function(d) {  return mapTopicPos["AVG"]-sqW;})//need to be modified to accomodate to make two circles parallel
              //        .attr("cy", function(d) { return (2+conceptArray.indexOf(mapConceptName[d.id]))*sqW; })
              //        .attr("r", function(d){ return d[size] = mapWidthNodeData(d[dsizeProperty]); })
              //        .attr("title", function(v) { return mapConceptName[v.id]; })
              //        .style("fill", function(d) { return d[dcolor]; })
              //        .style("stroke", function(d) { return "white"; })
              //        .style("stroke-width", 2)
              //        .style("cursor", "pointer")
              //        .on("mouseover", function(d){ mapMouseOver(d,mapConceptColumnTopic[d.id], "map"); })                  
              //        .on("mouseout", function(d){ mapMouseOut(d,mapConceptColumnTopic[d.id], "map"); })
              //        .on("click", function(d){ mapClick(d.id, "map"); });
            }else{
              //these colorful circles will overlay the black dots blong to the topics the concept blongs to
            inner = node.enter().append("circle")
                     .attr("class", "node")
                     .attr("id", function(d) { return "node" + d[idProperty]})
                     .attr("id-value", function(d) { return d[idProperty]})
                     .attr("cx", function(d) { 
                      if(matrix_mod === "align_ctopic_indi"|matrix_mod ==="align_ctopic_comp" )return mapTopicPos[mapConceptColumnTopic[d.id]];
                      else if(matrix_mod === "align_left_indi"| matrix_mod ==="align_left_comp") return mapTopicPos["AVG"];})
                     .attr("cy", function(d) { return (2+conceptArray.indexOf(mapConceptName[d.id]))*sqW; })
                     .attr("r", function(d){ return 10;})//d[size] = mapWidthNodeData(d[sizeProperty]); })
                     .attr("title", function(v) { return mapConceptName[v.id]; })
                     .style("fill", function(d) { return d[color]; })
                     .style("stroke", function(d) { return "white"; })
                     .style("stroke-width", 2)
                     .style("cursor", "pointer")
                     .on("mouseover", function(d){ mapMouseOver(d,mapConceptColumnTopic[d.id], "map"); })                  
                     .on("mouseout", function(d){ mapMouseOut(d,mapConceptColumnTopic[d.id], "map"); })
                     .on("click", function(d){ mapClick(d.id, "map"); });

               // donut = node
               //       .enter()
               //       .append("path")
               //       .attr("id", function(d) { return "donut-node" + d[idProperty]})
               //       .attr("id-node", function(d) { return d[idProperty]})
               //       .attr("class", "donut")
               //       .attr('transform', function(d) { 
               //        if(matrix_mod === "align_ctopic_indi" |matrix_mod ==="align_ctopic_comp" )
               //            return 'translate(' + mapTopicPos[mapConceptColumnTopic[d.id]] + ',' + (2+conceptArray.indexOf(mapConceptName[d.id]))*sqW + ')'; 
               //        else if(matrix_mod === "align_left_indi" | matrix_mod ==="align_left_comp")                   
               //            return 'translate(' + mapTopicPos["AVG"] + ',' + (2+conceptArray.indexOf(mapConceptName[d.id]))*sqW + ')'; })
               //       .attr("d", arc)
               //       .style("fill", function(d){ return d[dcolor]; })
               //       .style("stroke", function(d) { return "white"; })
               //       .style("stroke-width", function(d) { return (d.completeness>0?1:0); });   
             }
            


            //this part is supposed to show the black dot differently than each other
            var temp;
            var counterAllDots = 0;
            for(var c=0; c<idArray.length; c++){
              //temp = getCnt(idArray[c]);
              temp = getDotProperties(idArray[c],getMapProgress());
              for(var k=0; k<temp.length; k++){
                if(matrix_mod === "align_ctopic_indi"| matrix_mod ==="align_ctopic_comp"){
                  if(mapConceptColumnTopic[idArray[c]]!==temp[k].topicId){
                  tempAllDots[counterAllDots] = temp[k];
                  counterAllDots++;
                  }
                }else if(matrix_mod === "align_left_indi"| matrix_mod ==="align_left_comp"|matrix_mod==="double_circle"){
                      tempAllDots[counterAllDots] = temp[k];
                      counterAllDots++;
                }
                   
              }             
            }  
             
            var dot = svg.selectAll("g.dot");
            dot = dot.data(tempAllDots, function(d) { return d.conceptId;});

            dot.enter().append("circle")
                   .attr("class", "dot")
                   .attr("id",function(d){return "c"+d.conceptId+"t"+d.topicId;})
                   .attr("cx",function(d){return mapTopicPos[d.topicId];})//{return 200+k*30;})
                   .attr("cy",function(d){return (2+idArray.indexOf(d.conceptId))*sqW;})
                   .attr("r",5)
                   .style("fill", function(d) { return "black"; })
                   .style("fill-opacity", function(d) { return d.totalProgress; }) // set the fill opacity
                   .style("stroke", function(d) { return "black"; })
                   .style("stroke-width", 1)
                   .style("cursor", "pointer")
                   .on("mouseover", function(d){ dotMouseOver(d.conceptId,d.topicId); })                  
                   .on("mouseout", function(d){ dotMouseOut(d.conceptId,d.topicId); })
                   .on("click", function(d){ dotClick(d.conceptId, d.cnt, "map"); });


}

function initConceptList(){
   $(".btn-bipartite").hide();
    $(".btn-conceptMatrix").hide();
   
//following is calculating y pos of the glyf
            for(var i=0;i<groups.length;i++){
              for(var j=0;j<groups[i].values.length;j++){
                conceptYPosMap[groups[i].values[j].id]=j;
              }
            }

            
    svg = d3.select("#chart")
            .append("svg")
            .attr("id","conceptVisSvg")
            .attr("width", barChartRightPos+20)
            .attr("height", 500) 
            .attr("pointer-events", "all")  
            .append('g');

    var sqW = gridSetting.sq.w;
   link = svg.selectAll("line");

    link = link.data(links_dynamic, function(d) { 
    return d.source.id + "-" + d.target.id; });

  link.enter().insert("line", ".node")
    .attr("id", function(d) {return "link"+d.source.id + "-" + d.target.id;})
    .attr("id-source", function(d) { return d.source.id})
    .attr("id-target", function(d) { return d.target.id})
    .attr("class", "link")
    .attr("x1",function(d) { return mapTopicPos[mapConceptColumnTopic[d.s.id]]; })
    .attr("y1",function(d) { return (2+conceptYPosMap[d.s.id])*sqW; })
    .attr("x2",function(d) { return mapTopicPos[mapConceptColumnTopic[d.t.id]]; })
    .attr("y2",function(d) { return (2+conceptYPosMap[d.t.id])*sqW; })
    .style("stroke", function(d) { return d.faveColor = "#444444"; })
    .style("stroke-width", function(d) { return 1;})//d.faveWidth = mapWidthEdgeData(d[sizeProperty]); })
    .style("cursor", "pointer")
    .style("opacity", 1)
    .style("visibility", function(d){
      d3.select(this).classed("elementChanged", true);
      return "hidden"; //it turns all links hidden at the first load
      //return d.class === "fake" ? "hidden" : "visible";
    })
    .on("click", function(d){ mapLinkClick(d, "map"); }) 
    .on("contextmenu", function(d) {
      d3.event.preventDefault();
      // console.log("Link Right Click: link" + d[idProperty]);
    });


  link.exit().remove();
         



            // need dynamic data
            node = svg.selectAll("g.node");
            node = node.data(nodes_dynamic, function(d) { return d.id;});

            
            
            var pi = Math.PI;

           // circle= d3.svg.circle()
                    // .attr("r", function(d){ return d[size] = mapWidthNodeData(d[sizeProperty]); })
                     //.attr("title", function(v) { return mapConceptName[v.id]; })

             arc = d3.svg.arc()
                    .innerRadius(function(d) {return d[size] + 0.5})
                    .outerRadius(function(d) {return d[size] + donutWidth})
                    .startAngle(0)
                    .endAngle(function(d) {
                      var completeness = d.connections/d.maxConnections; //d.maxConnections
                      d.completeness = completeness;
                      return (360 * completeness) * (pi/180);
                    });
              

            mapPropertyToColors(colors, nodes_dynamic, 'nodes');


           
            inner = node.enter().append("circle")
                     .attr("class", "node")
                     .attr("id", function(d) { return "node" + d[idProperty]})
                     .attr("id-value", function(d) { return d[idProperty]})
                     .attr("cx", function(d) { return mapTopicPos[mapConceptColumnTopic[d.id]];})
                     .attr("cy", function(d) { return (2+conceptYPosMap[d.id])*sqW; })
                     .attr("r", function(d){ return 10;})//d[size] = mapWidthNodeData(d[sizeProperty]); })
                     .attr("title", function(v) { return styleTooltip(mapConceptName[v.id]); })
                     .style("fill", function(d) { return d[color]; })
                     .style("stroke", function(d) { return "white"; })
                     .style("stroke-width", 2)
                     .style("cursor", "pointer")
                     .on("mouseover", function(d){ mapMouseOver(d,mapConceptColumnTopic[d.id], "map"); })                  
                     .on("mouseout", function(d){ mapMouseOut(d,mapConceptColumnTopic[d.id], "map"); })
                     .on("click", function(d){ mapClick(d.id, "map"); });

               // donut = node
               //       .enter()
               //       .append("path")
               //       .attr("id", function(d) { return "donut-node" + d[idProperty]})
               //       .attr("id-node", function(d) { return d[idProperty]})
               //       .attr("class", "donut")
               //       .attr('transform', function(d) { return 'translate(' + mapTopicPos[mapConceptColumnTopic[d.id]] + ',' + (2+conceptYPosMap[d.id])*sqW+ ')';})
               //       .attr("d", arc)
               //       .style("fill", function(d){ return d[dcolor]; })
               //       .style("stroke", function(d) { return "white"; })
               //       .style("stroke-width", function(d) { return (d.completeness>0?1:0); }); //just radians  
                        
  d3.selectAll(".node")
    .each(function(d) {
      $(this).tipsy({ gravity: "s", opacity: 1, html: true, trigger: 'manual'});
    });

  // text = svg.selectAll("text")
  //     .data(groups)
  //     .enter().append("text")
  //     .text( function (d) { return d.key; })
  //     .style("font", "16px sans-serif")
  //     .style("pointer-events", "none")
  //     .style("text-shadow", "2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff")
  //     .style("fill", "#000")
  //     .style("visibility", "hidden");

}
function initcircle(){
  $(".btn-bipartite").hide();
    $(".btn-conceptMatrix").hide();
  //Code added by jbarriapineda
  var circleColors = ["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]);
  var step = 1/(circleColors.length-1);
  var domainColors = [];
  var c = 0.0;
  while (c<=1){
    domainColors.push(c);
    c=c+step;
  }
  domainColors[domainColors.length-1]=1;//sometimes when you use steps periodic numbers (e.g. 0.33333) the last number is not 1.0 so we overwrite the last element of the domain range so it will always be 1.0
  var colorScale = 
        d3.scale.linear().
        domain(domainColors).
        range(circleColors);
  //end of code added by jbarriapineda

  var diameter = barChartRightPos-barChartLeftPos-40,
    radius = diameter / 2,
    innerRadius = radius - 200;

  var cluster = d3.layout.cluster()
    .size([360, innerRadius])
    .sort(null)
    .value(function(d) { return d.size; });

  var bundle = d3.layout.bundle();

  var line = d3.svg.line.radial()
    .interpolate("bundle")
    .tension(.50)
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

   svg = d3.select("div#chart")
      .insert("svg","div#kcmap-selection")
      .attr("id","conceptVisSvg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("pointer-events", "all")  
      .append("g")
      .attr("id","g-outer-circle")//id added by jbarriapineda
      .attr("transform", "translate(" + (radius+barChartLeftPos-50) + "," + radius + ")");



  var link = svg.append("g").attr("id","g-circle-links").selectAll(".link"),//id added by jbarriapineda
    node = svg.append("g").attr("id","g-inner-circle").selectAll(".node");//id added by jbarriapineda


  //try put dealing with data here, move to data callback part later
  var nodesHierarchy = getNodesHierarchy(groups);


  var nodes = cluster.nodes(nodesHierarchy);//,//(packageHierarchy(nodesHierarchy)),
      links = links_static;
    //// console.log(nodes);

  link = link
      .data(bundle(links))
    .enter().append("path")
      .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
      .attr("class", "link")
      .attr("d", line)
      .style("stroke", function(d) { return "#444444"; })
      .style("stroke-width", function(d) { return 1; })
      .style("stroke-opacity", function(d) { return .4; })
      .style("fill", function(d) { return "none"; })
      .style("pointer-events", function(d) { return "none"; })


  //Scale for draw the height of the bars for each concept
  var barScale = d3.scale.linear()
                           .domain([0,1])
                           .range([5,20]);

  node = node
      .data(nodes.filter(function(n) { return !n.children; }));


      inner = node.enter().append("rect")//.append("circle")    
      .attr("class", "node-circle")  
      .attr("id", function(d) { return "node" + d[idProperty]})
      .attr("id-value", function(d) { return d[idProperty]})
      .attr("node-circle-topic",function(d){return d.t})
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)";}) //+ (d.x < 180 ? "" : "rotate(180)"); })
      //.attr("r", function(d){ return 5;})//d[size] = mapWidthNodeData(d[sizeProperty]); })
      .attr("width",function(d){return barScale(d.uK);})//added by jbarriapineda
      .attr("height",8)//added by jbarriapineda
      .attr("x",-8)//added by jbarriapineda
      .attr("y",-4)//added by jbarriapineda
      .attr("title", function(v) { return mapConceptName[v.id]; })
      .style("fill", function(d) { return colorScale(d.uK); })//added by jbarriapineda
      .style("stroke", function(d) { return "white"; })
      .style("stroke-width", 2)
      .style("cursor", "pointer")
      .style("opacity", 1)
      .style("shape-rendering", "geometricPrecision")//added by jbarriapineda
      .on("mouseover",function(d){mouseovered(d,node,link);} )
      .on("mouseout", function(d){mouseouted(d,node,link);} )
      .on("click", function(d){mouseclicked(d,node,link);} );

  var names = node.enter().append("text")
      .attr("class", "node-name")
      .attr("topic",function(d){return d.t})
      .attr("dy", ".31em")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 20) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
      .style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .text(function(d) { return d.dn; })
      .on("mouseover",function(d){mouseovered(d,node,link);} )
      .on("mouseout", function(d){mouseouted(d,node,link);} )
      .on("click", function(d){mouseclicked(d,node,link);} )
      .style("fill", function(d) { return "#000"; })
      .style("cursor", "pointer");
      // .style("font-size","10px");

  //Code added by jbarriapineda
  var computedCircleWidth = d3.select("#g-outer-circle").node().getBBox().width;
  var computedCircleHeigth = d3.select("#g-outer-circle").node().getBBox().height;
  var offset = computedCircleHeigth/2 + 20;
  if (computedCircleWidth>computedCircleHeigth){
    offset = computedCircleWidth/2 + 20;
  }
  d3.select("#g-outer-circle").attr("transform","translate("+radius+","+offset+")");
  d3.select("#conceptVisSvg").attr("height",computedCircleHeigth);
  //end of code added by jbarriapineda

  d3.select(self.frameElement).style("height", diameter + "px");
}
  //try put dealing with data here, move to data callback pary later
function getNodesHierarchy(groups){
  var nodesHierarchy = {};
  nodesHierarchy["name"] = "ConceptsCircle";

  var children=[];

  //imports.push({source: map[d.name], target: map[i]});
  for(var i=0;i<groups.length;i++){
    children.push({"name":groups[i].key,"children":groups[i].values});
  }

  nodesHierarchy["children"] = children;

  return nodesHierarchy;
}

function mouseovered(d,node,link) {

  svg.selectAll(".link")
    .transition()
    .style("stroke-opacity", 0);

  node
      .each(function(n) { n.target = n.source = false; });

  link
      .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
    .filter(function(l) { return l.target === d || l.source === d; })
      .each(function() { this.parentNode.appendChild(this); });

  node
      .classed("node--selected", function(n) { if(n===d){return n;} })
      .classed("node--target", function(n) { 
        if(n.target){
          svg.selectAll("#node"+n.id).classed("node--target", true);
        }
        return n.target; })
      .classed("node--source", function(n) {  
        if(n.source){       
          svg.selectAll("#node"+n.id).classed("node--source", true);
        }
        return n.source; });


  svg.selectAll("#node"+d.id).classed("node--selected", true);

  // svg.selectAll(".link--target").classed("link--target--clicked",true);
  // svg.selectAll(".link--target").classed("link--target",false);

  // svg.selectAll(".link--target--clicked")
  //   .transition()
  //   .style("stroke-opacity", 1)
  //   .style("stroke-width", "2px")
  //   .style("stroke", "red");

svg.selectAll(".link")
      .transition()
      .style("stroke", function(d) { return "gray"; })
      .style("stroke-opacity", function(d) { return 0; })
      .style("fill", function(d) { return "none"; })
      .style("pointer-events", function(d) { return "none"; });

  svg.selectAll(".node-name")
      .transition()
      .style("fill", function(d) { return "#bbb"; });


  svg.selectAll(".node-circle")
    .transition()
    .style("stroke", function(d) { return "white"; })
    .style("opacity", 0.4);



  node
      .classed("node--selected", function(n) { if(n===d){return n;} })
      .classed("node--target", function(n) { return n.target; })
      .classed("node--source", function(n) { return n.source; });


    changeStyleOver();
    changeStyleClick();

}

function changeStyleOver(){
  svg.selectAll(".node-name.node--source")
    .transition()
    .style("fill", "black");

  svg.selectAll(".node-name.node--target")
    .transition()
    .style("fill", "black");

  svg.selectAll(".node-name.node--selected")
    .transition()
    .style("fill", "#f00");



  svg.selectAll(".node-circle.node--source")
    .transition()
    .style("stroke", function(d) { return "gray"; })
    .style("opacity", 1);

  svg.selectAll(".node-circle.node--target")
    .transition()      
    .style("stroke", function(d) { return "gray"; })
    .style("opacity", 1);

  svg.selectAll(".node-circle.node--selected")
    .transition()
    .style("stroke", function(d) { return "black"; })
    .style("stroke-width",function(d){return 2;})
    .style("opacity", 1);

  svg.selectAll(".link--source")
    .transition()
    .style("stroke-opacity", 1)
    .style("stroke-width", "1px")
    .style("stroke", "black");

  svg.selectAll(".link--target")
    .transition()
    .style("stroke-opacity", 1)
    .style("stroke-width", "1px")
    .style("stroke", "black");
}

function mouseclicked(d,node,link){
   blockClick = true;
    svg.selectAll(".link")
      .transition()
      .style("stroke", function(d) { return "gray"; })
      .style("stroke-opacity", function(d) { return 0; })
      .style("fill", function(d) { return "none"; })
      .style("pointer-events", function(d) { return "none"; });

  svg.selectAll(".node-name")
      .transition()
      .style("fill", function(d) { return "#bbb"; });


  svg.selectAll(".node-circle")
    .transition()
    .style("stroke", function(d) { return "white"; })
    .style("opacity", 0.4);


  svg.selectAll(".node--source--clicked")
    .classed("node--source--clicked", false);

  svg.selectAll(".node--target--clicked")
    .classed("node--target--clicked", false);

  svg.selectAll(".node--selected--clicked")
    .classed("node--selected--clicked", false);


  svg.selectAll(".link--source--clicked")
      .classed("link--source--clicked", false);

  svg.selectAll(".link--target--clicked")
      .classed("link--target--clicked", false);


  svg.selectAll(".node--source")
    .classed("node--source--clicked", true);

  svg.selectAll(".node--target")
    .classed("node--target--clicked", true);

  svg.selectAll(".node--selected")
    .classed("node--selected--clicked", true);


  svg.selectAll(".link--source")
      .classed("link--source--clicked", true);

  svg.selectAll(".link--target")
      .classed("link--target--clicked", true);
changeStyleClick();
  
}

function mouseouted(d,node,link) {

   if(svg.selectAll(".node--selected--clicked")[0].length!==0){
      svg.selectAll(".link--target")
      .transition()
      .style("stroke", function(d) { return "gray"; })
      .style("stroke-opacity", function(d) { return 0; })
      .style("fill", function(d) { return "none"; })
      .style("pointer-events", function(d) { return "none"; });
    svg.selectAll(".link--source")
      .transition()
      .style("stroke", function(d) { return "gray"; })
      .style("stroke-opacity", function(d) { return 0; })
      .style("fill", function(d) { return "none"; })
      .style("pointer-events", function(d) { return "none"; });

  svg.selectAll(".node-name.node--source")
    .transition()
      .style("fill", function(d) { return "#bbb"; });

  svg.selectAll(".node-name.node--target")
    .transition()
      .style("fill", function(d) { return "#bbb"; });

  svg.selectAll(".node-name.node--selected")
    .transition()
      .style("fill", function(d) { return "#bbb"; });

  svg.selectAll(".node-circle.node--source")
    .transition()
    .style("stroke", function(d) { return "white"; })
    .style("opacity", 0.4);

  svg.selectAll(".node-circle.node--target")
    .transition()      
    .style("stroke", function(d) { return "white"; })
    .style("opacity", 0.4);

  svg.selectAll(".node-circle.node--selected")
    .transition()
    .style("stroke", function(d) { return "white"; })
    .style("stroke-width",function(d){return 2;})
    .style("opacity", 0.4);
  }else{
    svg.selectAll(".link")
      .transition()
      .style("stroke", function(d) { return "gray"; })
      .style("stroke-opacity", function(d) { return .4; })
      .style("fill", function(d) { return "none"; })
      .style("pointer-events", function(d) { return "none"; });

  svg.selectAll(".node-name")
      .transition()
      .style("fill", function(d) { return "#000"; });


  svg.selectAll(".node-circle")
    .transition()
    .style("stroke", function(d) { return "white"; })
    .style("opacity", 1);
  }
  link
      .classed("link--target", false)
      .classed("link--source", false);

  node
      .classed("node--selected", false) 
      .classed("node--target", false)
      .classed("node--source", false);

  svg.selectAll(".node-circle").classed("node--selected", false);
  svg.selectAll(".node-circle").classed("node--target", false);
  svg.selectAll(".node-circle").classed("node--source", false);


changeStyleClick();
  

}
function changeStyleClick(){
  svg.selectAll(".node-name.node--source--clicked")
    .transition()
    .style("fill", "black");

  svg.selectAll(".node-name.node--target--clicked")
    .transition()
    .style("fill", "black");

  svg.selectAll(".node-name.node--selected--clicked")
    .transition()
    .style("fill", "#f00");



  svg.selectAll(".node-circle.node--source--clicked")
    .transition()
    .style("stroke", function(d) { return "gray"; })
    .style("opacity", 1);

  svg.selectAll(".node-circle.node--target--clicked")
    .transition()      
    .style("stroke", function(d) { return "gray"; })
    .style("opacity", 1);

  svg.selectAll(".node-circle.node--selected--clicked")
    .transition()
    .style("stroke", function(d) { return "red"; })
    .style("stroke-width",function(d){return 3;})
    .style("opacity", 1);

  svg.selectAll(".link--source--clicked")
    .transition()
    .style("stroke-opacity", 1)
    .style("stroke-width", "1px")
    .style("stroke", "black");

  svg.selectAll(".link--target--clicked")
    .transition()
    .style("stroke-opacity", 1)
    .style("stroke-width", "1px")
    .style("stroke", "black");
}

function topicmouseovered(tid) {

  svg.selectAll(".link")
    .transition()
    .style("stroke-opacity", 0);

  var node = svg.selectAll(".node")
      .each(function(n) { n.target = n.source = false; });


var she = d3.selectAll("[topic = '"+topicMap[tid]+"']").classed("node--selected--topic", true);

d3.selectAll("[node-circle-topic = '"+topicMap[tid]+"']").classed("node--selected--topic", true);


          //svg.selectAll("#node"+n.id).classed("node--selected", true);


  svg.selectAll(".node-name")
      .transition()
      .style("fill", function(d) { return "#bbb"; });


  svg.selectAll(".node-circle")
    .transition()
    .style("stroke", function(d) { return "white"; })
    .style("opacity", 0.4);


  svg.selectAll(".node-name.node--selected--topic")
    .transition()
    .style("fill", "black");

  svg.selectAll(".node-circle.node--selected--topic")
    .transition()
    .style("stroke", function(d) { return "black"; })
    .style("opacity", 1);

}
function topicmouseouted(tid) {
    var node = svg.selectAll(".node-name");
    var link = svg.selectAll(".link");


  link
      .classed("link--target", false)
      .classed("link--source", false);

  node
      .classed("node--selected", false) 
      .classed("node--target", false)
      .classed("node--source", false)
      .classed("node--selected--topic",false);

  svg.selectAll(".node-circle").classed("node--selected", false);
      
  svg.selectAll(".node-circle").classed("node--selected--topic",false);


  svg.selectAll(".link")
      .transition()
      .style("stroke", function(d) { return "gray"; })
      .style("stroke-opacity", function(d) { return .4; })
      .style("fill", function(d) { return "none"; })
      .style("pointer-events", function(d) { return "none"; });

  svg.selectAll(".node-name")
      .transition()
      .style("fill", function(d) { return "#000"; });


  svg.selectAll(".node-circle")
    .transition()
    .style("stroke", function(d) { return "white"; })
    .style("opacity", 1);

}


// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  classes.forEach(function(d) {
    find(d.name, d);
  });

  return map[""];
}




function initBipartite(){
    $(".btn-conceptMatrix").hide();
    $(".btn-bipartite").show();

    //added by jbarriapineda
    for (var i=0;i<sorted_kcs.length;i++){
      var kc=sorted_kcs[i];
      var kc_id=kc.id;
      var kc_cnt=kc.cnt;
      for (var j=0;j<kc_cnt.length;j++){
          if(actId_kcs[kc_cnt[j]]){
            if(actId_kcs[kc_cnt[j]].indexOf(kc_id)==-1){
              actId_kcs[kc_cnt[j]].push(kc_id);
            }
          }else{
            actId_kcs[kc_cnt[j]]=[];
            actId_kcs[kc_cnt[j]].push(kc_id);
          }
      }
    }
    //end of code added by jbarriapineda

    // if(state.args.uiTBarModeGrpChk){
//       $("div#chart").append('<div id="kcmap-group-selection">Sort by...</br><form id="kcmap-group-selection-form"><input id="checkbox-me" type="radio" name="kcmap-group" value="me">Me</br><input id="checkbox-group" type="radio" name="kcmap-group" value="group">Group</form> </div>');
//       $('#checkbox-me').prop('checked', true);
// 
//       $('input[name=kcmap-group]').click(function(event){
//         event.stopPropagation();
//         var selected = $("input[type='radio'][name='kcmap-group']:checked");
//         if (selected.length > 0) {
//             groupSorting = selected.val();
//         }
//         reorderBipartiteBars();
//       });
//     }
    
     svg = d3.select("div#chart")
            //.insert("svg","div#kcmap-selection")//commented by jbarriapineda
            .append("svg")
            .attr("id","conceptVisSvg")
            .attr("width", "100%")//barChartRightPos+20)//commented by jbarriapineda
            .attr("height", 320) 
            .attr("pointer-events", "all")
            //.style("margin-top","-55px")//commented by @Jordan
            .append('g')
            .attr("width", "100%");//added by jbarriapineda

          /*var  fakeNode = svg.selectAll("g.fakeNode");
          fakeNode = fakeNode.data(groups);

          fakeNode.enter().append("circle")
              .attr("cx",function(d){return mapTopicPos[d.key];})//{return 200+k*30;})
              .attr("cy",10)
              .attr("r",3)
              .style("fill", function(d) { return "black"; })//modified by jbarriapineda
              .style("stroke", function(d) { return "black"; })//modified by jbarriapineda
              .style("stroke-width", 1)
              .style("cursor", "pointer");*/

          /*var  topicNode = svg.selectAll("g.topicNode");
          topicNode = topicNode.data(groups);

          topicNode.enter().append("circle")
              .attr("class","topicNode")
              .attr("id",function(d){return d.key;})
              .attr("cx",function(d){return mapTopicPos[d.key];})//{return 200+k*30;})
              .attr("cy",10)
              .attr("r",15)
              .style("fill", function(d) { return "black"; })//modified by jbarriapineda
              .style("stroke", function(d) { return "black"; })//modified by jbarriapineda
              .style("stroke-width", 1)
              .style("cursor", "pointer")
              .style("opacity", 0.5)
              .on("mouseover", function(d){topicNodeMouseOver(d.key); })                  
              .on("mouseout", function(d){ topicNodeMouseOut(d.outcomeConceptId,d.key); })
              .on("click", function(d){ topicNodeClick(); });*///commented by jbarriapineda




          var barWidth=(barChartRightPos-barChartLeftPos)/sorted_kcs.length;///idArray.length;  //commented by jbarriapineda
              barWidth = Math.floor(barWidth);

          nodename = svg.selectAll("g.nodename");
          //nodename = nodename.data(conceptArray); 
          nodename = nodename.data(sorted_kcs);      
            
          nodename.enter().append("text")
            .text(function(d){return d.dn;})//mapConceptName[idArray[conceptArray.indexOf(d)]];})
            .attr("class","nodename")
            .attr("id",function(d){return "nodename"+d.id;})//,i){return "nodename" + idArray[i]})
            .attr("topicId",function(d){return d.t;})//,i) { return mapConceptColumnTopic[idArray[i]];})
            .attr("transform", function(d,i) {
              return "translate("+((barWidth+barSeparation)*(orderMap[d.id])+barChartLeftPos )+",0) rotate(45)";    
              //return "translate("+(barWidth*(orderMap[idArray[i]])+barChartLeftPos )+", 270) rotate(45)";      
              //return "translate("+(barWidth*(orderMap[idArray[i]])+barChartLeftPos )+", 330) rotate(45)";      
            })
            .style("font-weight", "bold")
            .on("mouseover", function(d){ barMouseOver(d,mapConceptColumnTopic[d.id], "map", "user"); })//added by @Jordan for rec_exp                  
            .on("mouseout", function(d){ barMouseOut(d,mapConceptColumnTopic[d.id], "map"); });//added by @Jordan for rec_exp
            //.style("opacity", 0);//commented by jbarriapineda

            /*svg.append("line")
              .attr("class","trivial")
               .attr({ x1: barChartLeftPos, y1: (yStartBipartite-maxBarHeight-2), //start of the line
                       x2: 1.5*(barWidth+1)*sorted_kcs.length, y2: (yStartBipartite-maxBarHeight-2)  //end of the line
                }).style("stroke", function(d) { return "grey"; });*///commented by jbarriapineda

           svg.append("line")
             .attr("class","trivial")
             .attr({ x1: barChartLeftPos-2, y1: (yStartBipartite+2), //start of the line
                     x2: ((barWidth+barSeparation)*sorted_kcs.length)+barChartLeftPos, y2: (yStartBipartite+2)  //end of the line
              }).style("stroke", function(d) { return "grey"; });

           svg.append("line")
             .attr("class","trivial")
             .attr({ x1: barChartLeftPos-2, y1: (yStartBipartite+2)+bipartiteBarScale(1) , //start of the line
                     x2: barChartLeftPos-2, y2: (yStartBipartite+2)-bipartiteBarScale(1)  //end of the line
              }).style("stroke", function(d) { return "grey"; });

            //added by jbarriapineda
           /* svg.append("line")
               .attr("class","trivial-group")
               .attr({ x1: barChartLeftPos, y1: (yStartBipartite+maxBarHeight+2), //start of the line
                       x2: 1.5*(barWidth+1)*sorted_kcs.length, y2: (yStartBipartite+maxBarHeight+2)  //end of the line
                })
               .style("stroke", function(d) { return "grey"; })
               .style("opacity",0); *///commented by jbarriapineda
            //end of code added by jbarriapineda  

            // svg.append("line")
            //   .attr("class","trivial")
            //    .attr({ x1: barChartLeftPos, y1: (300+20), //start of the line
            //            x2: (barWidth+1)*idArray.length, y2: (300+20)  //end of the line
            //     }).style("stroke", function(d) { return "grey"; }); 

            /*svg.append("text") 
                .attr("class","trivial")
                .text("100%")
                .attr("transform", function(d){
                  return "translate("+(barChartLeftPos-this.getBBox().height-50)+", "+(yStartBipartite-maxBarHeight-2)+")";});*/
           
           //Commented by @Jordan for rec_exp
           // svg.append("text") 
           //     .attr("class","trivial-user")
           //     .text("me")
           //     .attr("dy",yStartBipartite-(maxBarHeight/2))//modified by jbarriapineda
           //     .attr("dx",function(d){
           //       var offsetLeft=0;
           //       if(ui.vis.actLst.cont.style.display !== 'none'){
           //         offsetLeft=13;
           //       }
           //       return barChartLeftPos-this.getComputedTextLength()-offsetLeft;});


           // svg.append("text") 
           //     .attr("class","trivial-user")
           //     .text("me")
           //     .attr("dy",yStartBipartite-(maxBarHeight/2))//modified by jbarriapineda
           //     .attr("dx",function(d){
           //       var offsetLeft=0;
           //       if(ui.vis.actLst.cont.style.display !== 'none'){
           //         offsetLeft=13;
           //       }
           //       return barChartLeftPos-this.getComputedTextLength()-offsetLeft;});

           //Code added by @Jordan for rec_exp
           svg.append("text") 
               .attr("class","y-axis-label")
               .text("Min prob. of mastery (0%)")
               .attr("x",barChartLeftPos-25)
               .attr("y",yStartBipartite+bipartiteBarScale(1)+15);

          svg.append("text") 
               .attr("class","y-axis-label")
               .text("Uncertain prob. of mastery (50%)")
               .attr("x",barChartLeftPos-28)
               .attr("y",yStartBipartite-12);

          svg.append("text") 
               .attr("class","y-axis-label")
               .text("Max prob. of mastery (100%)")
               .attr("x",barChartLeftPos-25)
               .attr("y",yStartBipartite-bipartiteBarScale(1)-20);

          svg.selectAll(".y-axis-label")
            .call(wrap,55);
          //end of code added by @Jordan for rec_exp
               

           //added by jbarriapineda
           if(state.args.uiTBarModeGrpChk){
             svg.append("text") 
               .attr("class","trivial-group")
               .text("group")
               .attr("dy",yStartBipartite+(maxBarHeight/2))
               .attr("dx",function(d){
                 var offsetLeft=0;
                 // console.log(this.getComputedTextLength());
                 if(ui.vis.actLst.cont.style.display !== 'none'){
                   offsetLeft=23;
                 }
                 return barChartLeftPos-this.getComputedTextLength()-offsetLeft;});

             $("#kcmap-group-selection").css("margin-top",maxBarHeight-5);
           }

            /*svg.append("text") 
                .attr("class","trivial-group")
                .text("100%")
                .attr("transform", function(d){
                  return "translate("+(barChartLeftPos-this.getBBox().height-50)+","+(yStartBipartite+maxBarHeight+10)+")";})
                .style("opacity",0);*/
            //end of code added by jbarriapineda

            // svg.append("text") 
            //   .attr("class","trivial")
            //     .text("group knowledge")
            //     .attr("dy",270)
            //     .attr("dx",function(d){return barChartLeftPos-this.getComputedTextLength();});

            // svg.append("text") 
            //   .attr("class","trivial")
            //     .text("100%")
            //     .attr("transform", function(d){
            //       return "translate("+(barChartLeftPos-this.getBBox().height-50)+", 310)";});




          var learner_kcs=data.kcs.slice(0);
          learner_kcs = learner_kcs.filter(String);//Delete the empty values in the previous array - added by @Jordan
          for (var i=0;i<learner_kcs.length;i++){
            //learner_kcs[i].uk=getMe().state.kcs[data.kcs[i].id].k; //commented by @Jordan in order to use the learner estimates from bn_general service
            learner_kcs[i].uk = kcs_estimates[learner_kcs[i].n]
          }
          //// console.log("learner_kcs");
          //// console.log(learner_kcs);

           // need dynamic data
           var bars = svg.selectAll("g.bar");
            //bars = bars.data(nodes_dynamic, function(d) { return d.id;});//commented by jbarriapineda
            bars  = bars.data(learner_kcs, function(d) { return d.id;})         
         
            //this is user bar
            var userbar = bars.enter().append("g")
                .attr("class","bar")
                .attr("id", function(d) { return "g-userbar" + d.id;})// d[idProperty]})//commented by jbarriapineda
                .attr("transform", function(d) {
                  var barSizeUser = 0;
                  if(state.curr.cid==367){
                    d.uk=1;
                  }
                  if(d.uk>.5){
                    barSizeUser = bipartiteBarScale((d.uk-.5)/.5);
                  }else{
                    if(d.uk<.5){
                      barSizeUser = bipartiteBarScale((.5-d.uk)/.5)
                    }
                  }
                  //if(d[barSizeUser]==0||d[barSizeUser]==-1) return "translate("+(barWidth*orderMap[d.id]+barChartLeftPos)+","+ (250-5)+")";
                  if(barSizeUser==0||barSizeUser==-1){
                    //return "translate("+(barWidth*orderMap[d.id]+barChartLeftPos)+","+ (yStartBipartite-5)+")";
                    return "translate("+((barWidth+barSeparation)*orderMap[d.id]+barChartLeftPos)+","+ (yStartBipartite-barSizeUser)+")"; 
                  }else{
                    if(d.uk>.5){
                      return "translate("+((barWidth+barSeparation)*orderMap[d.id]+barChartLeftPos)+","+ (yStartBipartite-barSizeUser)+")"; 
                    }else{
                      return "translate("+((barWidth+barSeparation)*orderMap[d.id]+barChartLeftPos)+","+ (yStartBipartite-barSizeUser)+")"; 
                    }   
                  }
                })
                .attr("topicId",function(d) { return d.t;})//mapConceptColumnTopic[d.id];})//commented by jbarriapineda
                .append("rect")
                .attr("class", "bar")
                .attr("id", function(d) { return "userbar" + d.id;})//[idProperty]})//commented by jbarriapineda
                .attr("topicId",function(d) { return d.t;})//mapConceptColumnTopic[d.id];})//commented by jbarriapineda
                .attr("width",function(d){
                  return barWidth;})
                .attr("height", function(d) {
                  // var barSizeUser = bipartiteBarScale(d.uk);
                  // //if(d[barSizeUser]==0||d[barSizeUser]==-1)return 5;//commented by jbarriapineda
                  // //if(barSizeUser==0||barSizeUser==-1)return 5;
                  // //else return (d[barSizeUser]*maxBarHeight); })//commented by jbarriapineda
                  // else return barSizeUser; 
                  var barSizeUser = .5;
                  if(d.uk>.5){
                    barSizeUser = bipartiteBarScale((d.uk-.5)/.5);
                  }else{
                    if(d.uk<.5){
                      barSizeUser = bipartiteBarScale((.5-d.uk)/.5)
                    }
                  }
                  return barSizeUser;
                })
                .attr("transform",function(d){
                  if(d.uk<.5){
                    barSizeUser = bipartiteBarScale((.5-d.uk)/.5)
                    return "translate(0,"+(barSizeUser+5)+")";
                  }else{
                    return "translate(0,0)"
                  }
                })
                .style("fill", function(d) {
                  var barSizeUser = bipartiteBarScale(d.uk);
                  //if(d[barSizeUser]==0||d[barSizeUser]==-1)return "#EEEEEE";//commented by jbarriapineda
                  if(d.uk==0||d.uk==-1)return "#EEEEEE";
                  //else return colorbrewer[barColorUserProperty][barColorScale][Math.round((barColorScale-1)*d[barColorUser])]; })//commented by jbarriapineda
                  //else return colorbrewer[barColorUserProperty][barColorScale][Math.round((barColorScale-1)*d.uk)]; })//commented by jbarriapineda in 09-16-2018
                  else return barColorScaleProbabilities(d.uk);})
                .style("stroke", function(d) { return "white"; })
                .style("stroke-width", 1)
                .style("cursor", "pointer");
                /*.attr("transform", function(d) {
                  if(d[barSizeUser]==0||d[barSizeUser]==-1) return "translate("+(barWidth*orderMap[d.id]+barChartLeftPos)+","+ (250-5)+")";
                  else return "translate("+(barWidth*orderMap[d.id]+barChartLeftPos)+","+ (250-(d[barSizeUser]*160))+")"; })*///commented by jbarriapineda
                /*.on("mouseover", function(d){ barMouseOver(d,mapConceptColumnTopic[d.id], "map", "user"); })                  
                .on("mouseout", function(d){ barMouseOut(d,mapConceptColumnTopic[d.id], "map"); });*///commented today by jbarriapineda
                //.on("click", function(d){ barClick(d.id, "map"); });

            d3.selectAll("g.bar")//added by jbarriapineda
              .append("rect")
              .attr("class","mouseover-bar")
              .attr("height", function(d) {
                    return 2*maxBarHeight+5;
                  })
              .attr("width",function(d){
                  return barWidth;})
              .style("color","white")
              .style("opacity",0)
              .style("cursor","pointer")
              .attr("transform", function(d) {
                  //var barSizeUser = bipartiteBarScale(d.uk);
                  //if(d[barSizeUser]==0||d[barSizeUser]==-1) return "translate("+(barWidth*orderMap[d.id]+barChartLeftPos)+","+ (250-5)+")";
                  var barSizeUser = 0;
                  if(d.uk>.5){
                    barSizeUser = bipartiteBarScale((d.uk-.5)/.5);
                    return "translate("+0+","+ (barSizeUser-maxBarHeight)+")";
                  }else{
                    if(d.uk<.5){
                      barSizeUser = bipartiteBarScale((.5-d.uk)/.5)
                      return "translate("+0+","+ (barSizeUser-maxBarHeight)+")";
                    }
                  }
                  if(barSizeUser==0||barSizeUser==-1) return "translate("+0+","+ (-maxBarHeight)+")";})
                  //else 
                  //return "translate("+0+","+ (barSizeUser-maxBarHeight)+")"; })
              .on("mouseover", function(d){ barMouseOver(d,mapConceptColumnTopic[d.id], "map", "user"); })                  
              .on("mouseout", function(d){ barMouseOut(d,mapConceptColumnTopic[d.id], "map"); });
            //end of code added by jbarriapineda 
            
            //Add the percentage text label associated with each bar
            svg.selectAll("g.bar")
                .append("text")
                .attr("class","text-userbar")
                .attr("id", function(d) { return "text-userbar" + d.id;})//d[idProperty]})//commented by jbarriapineda
                .attr("topicId",function(d) { return d.t;})
                .text(function(d){return Math.round(100*d.uk*10)/10+"%";})//d.uK*100+"%";})
                .attr("transform",function(d){
                  if(d.uk>=.5){
                    return "rotate(-45)"
                  }else{
                    return "translate(0,"+(2*bipartiteBarScale((.5-d.uk)/.5)+20)+") rotate(-45)";
                  }
                })
                .attr("opacity",0)
                .style("pointer-events","none");

            //added by jbarriapineda
            //this is group bar

            
            var group_kcs = data.kcs.slice(0);
            group_kcs = group_kcs.filter(String);//delete empty elements of the array
            console.log(group_kcs);
            for (var j=0;j<group_kcs.length;j++){
              //var group_kc=data.kcs[i];
              group_kcs[j].gk=getGrp().state.kcs[group_kcs[j].id].k;
            }

            var group_bars = svg.selectAll("g.groupbar");
            group_bars = group_bars.data(group_kcs, function(d) { return d.id;});

            var groupbar = group_bars.enter().append("g")
                .attr("class","groupbar")
                .attr("id", function(d) { return "g-groupbar" + d.id;})// d[idProperty]})//commented by jbarriapineda
                .attr("transform", function(d) {
                    var barSizeGrp = bipartiteBarScale(d.gk);
                    if(barSizeGrp==0||barSizeGrp==-1) return "translate("+(barWidth*orderMap[d.id]+barChartLeftPos)+","+ (yStartBipartite+5)+")";
                    else return "translate("+((barWidth+barSeparation)*orderMap[d.id]+barChartLeftPos)+","+ (yStartBipartite+5) +")"; })
                .attr("topicId",function(d) { return d.t;})//mapConceptColumnTopic[d.id];})//commented by jbarriapineda
                .append("rect")
                 .attr("class", "groupbar")
                 .attr("id", function(d) { return "groupbar" + d.id;})//[idProperty]})//commented by jbarriapineda
                 .attr("topicId",function(d) { return d.t;})//mapConceptColumnTopic[d.id];})//commented by jbarriapineda
                 .attr("width", barWidth)
                 .attr("height", function(d) { 
                     var barSizeGrp = bipartiteBarScale(d.gk);
                     if(barSizeGrp==0||barSizeGrp==-1)return 5;
                     //return d.barSizeGrp*maxBarHeight;//commented by jbarriapineda
                     return barSizeGrp;
                  })//(d[barSizeGrp]*60)+2; }) //commented by jbarriapineda
                 //.attr("y",function(d) { return (Math.random()*60)+2;})//(d[barSizeGrp]*60)+2; }) //commented by jbarriapineda
                 .style("fill", function(d) {  
                     //return colorbrewer[barColorGrpProperty][barColorScale][Math.round((barColorScale-1)*d[barColorGrp])]; })
                     //return colorbrewer[barColorGrpProperty][barColorScale][Math.round((barColorScale-1)*d.barSizeGrp)]; })//commented by jbarriapineda
                     if (d.gk==0 || d.gk==-1) return "#EEEEEE";
                     return colorbrewer[barColorGrpProperty][barColorScale][Math.round((barColorScale-1)*d.gk)]; })
                 .style("stroke", function(d) { return "white"; })
                 .style("stroke-width", 1)
                 .style("cursor", "pointer")
                 .style("opacity",0)
                 .style("pointer-events","none");
                 /*.attr("transform", function(d) { 
                   return "translate("+(barWidth*orderMap[d.id]+barChartLeftPos)+","+ 255+")"; })*/
                 /*.on("mouseover", function(d){ barMouseOver(d,mapConceptColumnTopic[d.id], "map","group"); })                  
                 .on("mouseout", function(d){ barMouseOut(d,mapConceptColumnTopic[d.id], "map"); });*///commented by jbarriapineda today
                 //.on("click", function(d){ barClick(d.id, "map"); });

            d3.selectAll("g.groupbar")//added by jbarriapineda today
              .append("rect")
              .attr("height", function(d) {
                    return maxBarHeight;
                  })
              .attr("width",function(d){
                  return barWidth;})
              .style("color","white")
              .style("opacity",0)
              .attr("transform", function(d) {
                  return "translate("+0+","+5+")";
              })
              .style("cursor","pointer")
              .on("mouseover", function(d){ barMouseOver(d,mapConceptColumnTopic[d.id], "map","group"); })                  
              .on("mouseout", function(d){ barMouseOut(d,mapConceptColumnTopic[d.id], "map"); });

            svg.selectAll("g.groupbar")
                .append("text")
                /*.attr("x",-15)
                .attr("y",function(d){
                  var barSizeGrp = bipartiteBarScale(d.k);
                  if(barSizeGrp==0||barSizeGrp==-1) return 15;
                    //return d.barSizeGrp*maxBarHeight;//commented by jbarriapineda
                  return (barSizeGrp+10);
                })*/
                //.attr("transform","rotate(315)")
                .attr("transform",function(d){
                  var transform = d3.transform(d3.select(this).attr("transform"));
                  var current_x = transform.translate[0];
                  var current_y = transform.translate[1];
                  var barSizeGrp = bipartiteBarScale(d.gk);
                  if(barSizeGrp==0||barSizeGrp==-1) barSizeGrp=5;
                  return "translate("+current_x+","+(barSizeGrp+13)+") rotate(315)";
                })
                .attr("class","text-groupbar")
                .attr("id", function(d) { return "text-groupbar" + d.id;})//d[idProperty]})//commented by jbarriapineda
                .attr("topicId",function(d) { return d.t;})
                .text(function(d){return Math.round(100*d.gk*10)/10+"%";})//d.uK*100+"%";})
                .attr("opacity",0)
                .style("pointer-events","none");

            //if the group view is activated (By default or by the user)
            if(state.args.uiTBarModeGrpChk){
              showSocialComparisonBipartite()
            }

            //end of code added by jbarriapineda
            

           //this part is supposed to show the black dot differently than each other
            var temp;
            var counterAllDots = 0;
            for(var c=0; c<idArray.length; c++){
              //temp = getCnt(idArray[c]);
              //temp = getDotProperties(idArray[c],getMapProgress());//commented by jbarriapineda
              temp = getDotProperties(data.kcs[c].id,getMapProgress())
              for(var k=0; k<temp.length; k++){
                      tempAllDots[counterAllDots] = temp[k];
                      counterAllDots++;
              }             
            }  

            //diagonal are the curved lines
            var diagonal = d3.svg.diagonal()
                  .source(function(d) { return {"x":((barWidth+barSeparation)*orderMap[d.conceptId]+barChartLeftPos), "y":(yStartBipartite-maxBarHeight-2)}; })            
                  .target(function(d) { return {"x":mapTopicPos[d.topicId]-gridSetting.sq.w/2-10, "y":10}; })
                  .projection(function(d) { return [d.x, d.y]; });

           // var diagonal = d3.svg.diagonal.radial()
           //           .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

           var diagonals = svg.selectAll("g.diagonals");
           var topics_concepts = [];
           //diagonals = diagonals.data(tempAllDots);// added by jbarriapineda

           for (var i=0; i<sorted_kcs.length;i++){
              var topic_concept = {};
              if(state.curr.cid!=367){
                var topicId = correctTopicName(sorted_kcs[i].t);
              }else{
                var topicId = correctTopicNameMemphis(sorted_kcs[i].t);
              }
              //var topicId = sorted_kcs[i].t;//Commented by @Jordan for make it work for course id=351
              var conceptId = sorted_kcs[i].id;
              topic_concept["topicId"] = topicId;
              topic_concept["conceptId"] = conceptId;
              topics_concepts[i]=topic_concept;

           }

           diagonals = diagonals.data(topics_concepts);

           diagonals = diagonals.enter().append("path")
                       .attr("class",function(d) { return "diagonals";})
                       .attr("id",function(d,i){return "diagonals"+i})
                       .attr("conceptId",function(d) { return "diagonals"+d['conceptId'];})
                       .attr("concepttopicId",function(d) {d.concepttopicId=d['topicId']+"~"+d["conceptId"]; return d['topicId']+"~"+d["conceptId"];})
                       .attr("d", diagonal)
                       .style("shape-rendering", "geometricPrecision")//added by jbarriapineda
                       //.attr("stroke", function(d){return "#444444";})//function(d){var rgb = 200*(1-d.totalProgress); return d3.rgb(rgb,rgb,rgb);})
                       //.attr("stroke-width" ,function(d) { return (d.cnt.length+1);})
                       .style("opacity", 0);
                       /*.on("mouseover", function(d,i){ 
                         if(d3.select(this).classed("selected"))
                        diagonalsMouseOver(d.conceptId,d.topicId,i); })                  
                       .on("mouseout", function(d){ diagonalsMouseOut(d.conceptId,d.topicId); })
                       .on("click", function(d){ 
                        if(d3.select(this).classed("active") || d3.select(this).classed("selected"))
                            diagonalsClick(d.conceptId, d.cnt, "map"); 
                        });*///commented by jbarriapineda
          // @@@@ JULIO
    if(state.args.uiShowHelp){
      svg.
        append("g").
        attr("class", "helpButton").
        attr("id", "helpButton-vis").
        //attr("style","background-image: url('img/help.gif');").
        attr("cursor","pointer").
        on("click",function() {
            d3.event.stopPropagation();
            var origin = "bipartite-indiv";
            helpDialogShow(origin,d3.mouse(document.body)[0],d3.mouse(document.body)[1]+57);
        }).
        on("mouseover",function () {d3.select(this).style("opacity","1");}).
        on("mouseout",function () {d3.select(this).style("opacity","0.7");}).
        style("opacity", "0.7").
          append("image").
          //  .attr("dy",yStartBipartite-(maxBarHeight/2))//modified by jbarriapineda
          //      .attr("dx",function(d){return barChartLeftPos-this.getComputedTextLength();});
          attr("x", barChartLeftPos + (barWidth*120)).
          attr("y", yStartBipartite-maxBarHeight-20).
          attr("width", 22).
          attr("height", 19).
          attr("xlink:href","img/help.png");

    }
    if(state.args.uiTBarModeGrpChk){
        if(state.args.uiShowHelp){
          svg.
          append("g").
          attr("class", "helpButton").
          //attr("style","background-image: url('img/help.gif');").
          attr("cursor","pointer").
          on("click",function() {
            d3.event.stopPropagation();
            var origin = "bipartite-group";
            helpDialogShow(origin,d3.mouse(document.body)[0],d3.mouse(document.body)[1]+57);
            //helpDialogShow(origin,d3.mouse(this)[0],d3.mouse(this)[1]+57);
      
          }).
          on("mouseover",function () {d3.select(this).style("opacity","1");}).
          on("mouseout",function () {d3.select(this).style("opacity","0.7");}).
          style("opacity", "0.7").
            append("image").
            //  .attr("dy",yStartBipartite-(maxBarHeight/2))//modified by jbarriapineda
            //      .attr("dx",function(d){return barChartLeftPos-this.getComputedTextLength();});
            attr("x", barChartLeftPos-55).
            attr("y", yStartBipartite-(maxBarHeight/2)+50).
            attr("width", 22).
            attr("height", 19).
            attr("xlink:href","img/help.png");

        }
    }
    if(!state.args.uiTBarModeGrpChk){
      hideSocialComparisonBipartite();
    }

}


// ------------------------------------------------------------------------------------
//create fake links between nodes of the same group to keep them together
//the fake links are created based on the biggest node of the group
function createFakeLinks(){

  for(var i = 0; i < groups.length; i++){
    for (var j = 0; j < groups[i].values.length; j++){
      for (var jj = 0; jj < groups[i].values.length; jj++){

        if (j !== jj ){
          var source = groups[i].values[jj];
          var target = groups[i].values[j];
          for (var k = 0; k < links_dynamic.length; k++) {
            if (links_dynamic[k].s.id === source.id && links_dynamic[k].t.id === target.id){
              var aux = source;
              source = target;
              target = aux;
            }
          }
          links_dynamic.push({
            "source": source, 
            "s": source, 
            "target": target, 
            "t": target, 
            "class": "fake"
          });
        }



      }
    }
  }

}




//added by Haoran Zhao
function inituiCMVis(settings,uiCMVisIdOut){
 // // console.log(uiCMVisIdOut);//added by jbarriapineda
  uiCMVisId=uiCMVisIdOut;
  gridSetting = settings;

  //code added by jbarriapineda
  for (var i=0;i<data.learners.length;i++){
    if(data.learners[i].id==data.context.learnerId){
        learner_id=i;
    }
  }

  getOrderMap();

  //calculating course topic  and position mapping
  var resNames  = $map(function (x) { return x.name; }, data.resources.slice(1));

  var resOffsetL = svgGetMaxTextBB(resNames).width + 50;

  var paddingL = gridSetting.padding.l;//(doShowYAxis ? settings.padding.l : 10);

  var sqX = 6;//this number is actually from txtX
  mapTopicPos["AVG"] = resOffsetL + paddingL+sqX;
  var sqW = gridSetting.sq.w;

  //var y = ((sqH + CONST.vis.gridAbsAct.sq.padding) * iSeries) + CONST.vis.gridAbsAct.padding.t + topicOffsetT + paddingT;
  sqX += gridSetting.sepX+sqW; 

  for(var j=0;j<data.topics.length;j++){//todo cambiar los data.topics por sorted_topics (por order)
     //sqX += (j === 0 ? 0 : sqW * visGetTopicSize(data.topics[j].id) + gridSetting.sq.padding);
     //data.topics.filter(function (d) {return d.order==topicIdx;})[0];
     sqX += (j === 0 ? 0 : sqW * visGetTopicSize(data.topics.filter(function (d) {return d.order==j;})[0].id) + gridSetting.sq.padding);
     //sqX += sqW * visGetTopicSize(topic_column_order[i]) + CONST.vis.gridAbsAct.sq.padding;
     var x = resOffsetL/2 + sqX + sqW;
     //mapTopicPos[topic_column_order[j]] = x;
     mapTopicPos[data.topics[j].id] = x ;
     /*mapTopicPos[data.topics.filter(function (d) {
      if (typeof(d.order) == 'undefined'){
        return d.id=="AVG";
      }
      return d.order==j;}
     )[0].id] = x;*/
     maxminTemp[j]=x;
  }

  barChartLeftPos = svgGetMaxTextBB(resNames).width;//d3.min(maxminTemp)-sqW/2;
  barChartRightPos = d3.max(maxminTemp)+sqW*2+50;
  
  initConceptVis(uiCMVisId);
  //loadConceptStructure();
}
function getOrderMap(){
  var kcs=data.kcs;
  var topics=data.topics;
  sorted_topics = topics.sort(function(a, b){
      a_order = 0;
      b_order = 0;
      if(a.hasOwnProperty("order")){
        a_order = a.order;
      }
      if(b.hasOwnProperty("order")){
        b_order = b.order;
      }
      return a_order == b_order ? 0 : +(a_order  > b_order) || -1;
    });
  var concept_topic_mapping = [];

  for(var i=0;i<data.topics.length;i++){
    if(i>0){
      var activities = data.topics[i].activities;
      var resources = Object.keys(activities);
      for (var j=0;j<resources.length;j++){
        var acts = activities[resources[j]];
        console.log(acts);
      }
    } 
  }

  if(orderBy=="topic"){
    //for(var i=0; i<idArray.length;i++){//commented by jbarriapineda
    var topic_order = [];
    for(var i=0;i<topics.length;i++){
      if(!topics[i].order){
        //topic_order[topics[i].id]=-1;
      }else{
        topic_order[topics[i].id]=topics[i].order;//Commented in order to make the MG pr version + vis (Topics come with a space as the id instead of underscore separations)
        //topic_order[topics[i].id.split(' ').join('_')]=topics[i].order; //trial code line wrote by @Jordan
      }
    }
    
    var kcs_copy=kcs.concat([]);

    //Delete elements which we do not have kc estimates from bn_general service - added by @Jordan
    for (var i=0;i<kcs.length;i++){
      if (!(kcs[i].n in kcs_estimates)){
        // console.log("Deleted concept:");
        // console.log(kcs[i]);
        delete kcs[i];
      }
    }

    kcs = kcs.filter(n => n);//Delete the empty values that were deleted in the previous for loop - added by @Jordan
    sorted_kcs = kcs.sort(function(a, b){
      if(state.curr.cid!=367){
        var topic_a = correctTopicName(a.t);
        var topic_b = correctTopicName(b.t);
        if (topic_b == "ArrayList"){
          topic_b = "ArrayLists";
        }
      }else{
        var topic_a = correctTopicNameMemphis(a.t);
        var topic_b = correctTopicNameMemphis(b.t);
        if (topic_b == "ArrayList"){
          topic_b = "ArrayLists";
        }
      }

      var order_a = parseInt(topic_order[topic_a]);
      var order_b = parseInt(topic_order[topic_b]);

      // console.log(topic_a);
      // console.log(order_a);
      // console.log(topic_b);
      // console.log(order_b);
      
      if (parseInt(topic_order[topic_a])  > parseInt(topic_order[topic_b])){
        return 1;
      }else{
        if(parseInt(topic_order[topic_a]) == parseInt(topic_order[topic_b])){
          if(groupSorting=="me"){
            if(parseFloat(kcs_estimates[a.n])==parseFloat(kcs_estimates[b.n])){
            //if(data.learners[learner_id].state.kcs[a.id].k==data.learners[learner_id].state.kcs[b.id].k){
              return 0;
            }else{
              if (parseFloat(kcs_estimates[a.n])>parseFloat(kcs_estimates[b.n])){
                return 1;
              }else{
                return -1;
              }
            }
          }else{
            var group=getGrp();
            if(group.state.kcs[a.id].k==group.state.kcs[b.id].k){
              return 0;
            }else{
              if (group.state.kcs[a.id].k>group.state.kcs[b.id].k){
                return 1;
              }else{
                return -1;
              }
            }
          }
        }else{
          return -1;
       }
      }

      //return topic_order[a.t] == topic_order[b.t] ? 0 : +(topic_order[a.t]  > topic_order[b.t]) || -1;
    });

    for(var j=0; j<sorted_kcs.length; j++){
        orderMap[sorted_kcs[j].id] = j;
    }
    //// console.log(orderMap);
  }else if(orderBy =="alphabet"){
    /*var temp = new Array(conceptArray);
    temp = conceptArray.slice();
    temp.sort();*///commented by jbarriapineda

    sorted_kcs = kcs.sort(function(a, b){
      return a.dn == b.dn ? 0 : +(a.dn > b.dn) || -1;
    });

    /*for(var i=0; i<conceptArray.length;i++){
      orderMap[idArray[i]] = temp.indexOf(conceptArray[i]);
    }*///commented by jbarriapineda
    for(var j=0; j<sorted_kcs.length; j++){
        orderMap[sorted_kcs[j].id] = j;
    }

  }else if(orderBy =="userBarSizeAscend"){
    // this is the way to order i will use

    var orderByBarSizeAscend = d3.nest()
          .key(function(d){ return d[barSizeUser]})
          .sortKeys(d3.ascending)
          .entries(nodes_dynamic);

    //get the order map ascending bar size of user 
    var temp = null;
    var counter = 0;
    for(var i=0; i<orderByBarSizeAscend.length; i++){
      temp = null;
      temp = orderByBarSizeAscend[i]; 
      for(var j=0; j<orderByBarSizeAscend[i].values.length; j++){
        orderMap[orderByBarSizeAscend[i].values[j].id] = counter;
        counter+=1;
      }
    }

  }else if(orderBy =="userBarSizeDescend"){

    var orderByBarSizeDescend = d3.nest()
          .key(function(d){ return d[barSizeUser]})
          .sortKeys(d3.descending)
          .entries(nodes_dynamic);

    //get the order map ascending bar size of user 
    var temp = null;
    var counter = 0;
    for(var i=0; i<orderByBarSizeDescend.length; i++){
      temp = null;
      temp = orderByBarSizeDescend[i]; 
      for(var j=0; j<orderByBarSizeDescend[i].values.length; j++){
        orderMap[orderByBarSizeDescend[i].values[j].id] = counter;
        counter+=1;
      }
    }
  }else if(orderBy =="grpBarSizeAscend"){
    // this is the way to order i will use

    var orderByBarSizeAscend = d3.nest()
          .key(function(d){ return d[barSizeGrp]})
          .sortKeys(d3.ascending)
          .entries(nodes_dynamic);

    //get the order map ascending bar size of user 
    var temp = null;
    var counter = 0;
    for(var i=0; i<orderByBarSizeAscend.length; i++){
      temp = null;
      temp = orderByBarSizeAscend[i]; 
      for(var j=0; j<orderByBarSizeAscend[i].values.length; j++){
        orderMap[orderByBarSizeAscend[i].values[j].id] = counter;
        counter+=1;
      }
    }

  }else if(orderBy =="grpBarSizeDescend"){

    var orderByBarSizeDescend = d3.nest()
          .key(function(d){ return d[barSizeGrp]})
          .sortKeys(d3.descending)
          .entries(nodes_dynamic);

    //get the order map ascending bar size of user 
    var temp = null;
    var counter = 0;
    for(var i=0; i<orderByBarSizeDescend.length; i++){
      temp = null;
      temp = orderByBarSizeDescend[i]; 
      for(var j=0; j<orderByBarSizeDescend[i].values.length; j++){
        orderMap[orderByBarSizeDescend[i].values[j].id] = counter;
        counter+=1;
      }
    }
  }

  return orderMap;

}

function removeAll(){
  //// console.log("remove All #conceptVisSvg");//added by jbarriapineda
  d3.select("#conceptVisSvg").remove();
    // d3.selectAll(".bar").remove();
    // d3.selectAll(".nodename").remove();
    // d3.selectAll(".diagonals").remove();
    // d3.selectAll(".trivial").remove();

}


// @@@@ here the redraww  shit methods

//-----------------------------------------------------------------------------------
//open the window with the selected question
function openQzAction(topicIdx, qzIdx, grpOutter){

  state.vis.grid.cellIdxSel = topicIdx;
  state.vis.grid.cellSel    = grpOutter;
  state.vis.topicIdx        = topicIdx;
  state.vis.grid.name       = "me";

  actLstShow(true,false,false);
  actOpen("qz", qzIdx);
  $("#act-lst, #act-lst-arrow").hide();
}



//-------------------------------------------------------------------------------------
//map the mouse over function on the nodes
var lastNodeMouseOver = null;
function barMouseOver(d, tid,origin,bartype) {



  d3.select("#groupbar"+d.id).classed("baractive", true);
  d3.select("#userbar"+d.id).classed("baractive", true);
  d3.select("#g-userbar"+d.id).classed("baractive", true);//added by jbarriapineda
  d3.select("#g-groupbar"+d.id).classed("baractive", true);//added by jbarriapineda
  d3.select("#text-userbar"+d.id).classed("baractive", true);//added by jbarriapineda
  d3.select("#text-groupbar"+d.id).classed("baractive", true);//added by jbarriapineda
  d3.select("#nodename"+d.id).classed("baractive", true);
  //d3.selectAll("[conceptId = 'diagonals"+d.id+"']").classed("active",true);


  // d3.selectAll("[conceptId = 'diagonals"+d.id+"']").style("fill", function(d) { return "red"; });
  

  svg.selectAll(".bar")
    .transition()
    .style("opacity", function(p){
      return (d3.select(this).classed("baractive") || d3.select(this).classed("active")) ? 1 : 0.4;
    });
    /*.style("stroke", function(p){
      return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
    });*///commented by jbarriapineda


  svg.selectAll(".text-userbar")
    .transition()
    .style("font-size",function(p){
        return (d3.select(this).classed("baractive")) ? "11px" : "8px";
    })
    .style("opacity", function(p){
        return (d3.select(this).classed("baractive") || d3.select(this).classed("active")) ? 1 : 0;
    });

  //added by jbarriapineda
  if(state.args.uiTBarModeGrpChk){
    svg.selectAll(".groupbar")
      .transition()
      .style("opacity", function(p){
        return (d3.select(this).classed("baractive") || d3.select(this).classed("active")) ? 1 : 0.4;
      });
      /*.style("stroke", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
      });*///commented by jbarriapineda
      svg.selectAll(".text-groupbar")
        .transition()
        .style("font-size",function(p){
            return (d3.select(this).classed("baractive")) ? "11px" : "8px";
        })
        .style("opacity", function(p){
            return (d3.select(this).classed("baractive") || d3.select(this).classed("active")) ? 1 : 0;
        });
      }

  svg.selectAll(".nodename")
      .transition()
      .style("font-size",function(p){
          return (d3.select(this).classed("baractive")) ? "11px" : "8px";
      })
      .style("opacity", function(p){
          return (d3.select(this).classed("baractive") || d3.select(this).classed("active")) ? 1 : 0.05;
      });

  //end of code added by jbarriapineda


    /*svg.selectAll(".diagonals")
    .transition()
    .style("cursor", function(p){
      return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "pointer" : "auto";
    })
    .style("opacity", function(p){
      return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0;
    });*/


  if (origin && lastNodeMouseOver !== d.id) {
     var k_learner=d3.select("#g-userbar"+d.id).node().__data__.uk;
     var k_group=d3.select("#g-groupbar"+d.id).node().__data__.gk;
     var actLstShown=false;
     if(ui.vis.actLst.cont.style.display !== 'none'){
       actLstShown=true;
     }
     log(
       "action"                + CONST.log.sep02 + "cm-concept-mouseover"  + CONST.log.sep01 +
       "concept-name"          + CONST.log.sep02 + d.n                    + CONST.log.sep01 +
       "topic-name"            + CONST.log.sep02 + d.t                     + CONST.log.sep01 +
       "k-learner"             + CONST.log.sep02 + k_learner               + CONST.log.sep01 +
       "k-group"               + CONST.log.sep02 + k_group                 + CONST.log.sep01 +
       "bar-type"              + CONST.log.sep02 + bartype                 + CONST.log.sep01 +
       "act-lst-shown"         + CONST.log.sep02 + actLstShown             + CONST.log.sep01 +
       //"concept-radius"        + CONST.log.sep02 + d.faveSize              + CONST.log.sep01 +
       //"min-size"              + CONST.log.sep02 + minWidthNode            + CONST.log.sep01 +
       //"max-size"              + CONST.log.sep02 + maxWidthNode            + CONST.log.sep01 +
       //"concept-color"         + CONST.log.sep02 + d.favesColor             + CONST.log.sep01 +
       //"concept-completeness"  + CONST.log.sep02 + d.completeness          + CONST.log.sep01 +
       "origin"                + CONST.log.sep02 + origin,
       true
     );
  }
  //lastNodeMouseOver = d.id;
}

//---------------------------------------------------------------------------------------
//map the mouse out function on the nodes
function barMouseOut(d,tid, origin){

  /*if (d3.select("#userbar"+d.id).classed("baractive") === false || d3.select("#groupbar"+d.id).classed("baractive") === false){
    if(svg.selectAll(".active").empty()){

      svg.selectAll(".bar")
        .transition()
        .style("opacity", 1);

      //added by jbarriapineda
      if(state.args.uiTBarModeGrpChk){
        svg.selectAll(".groupbar")
          .transition()
          .style("opacity", 1);
        svg.selectAll(".text-groupbar")
          .transition()
          .style("opacity", 0);
      }
      //end of code added by jbarriapineda

      svg.selectAll(".nodename")
        .transition()
        .style("opacity", 1);

      svg.selectAll(".text-userbar")
        .transition()
        .style("opacity", 0);

    } else {
      svg.selectAll(".bar")
        .transition()
        .style("opacity", function(d){
          return d3.select(this).classed("active") ? 1 : 0.4
        });
      //added by jbarriapineda
      if(state.args.uiTBarModeGrpChk){
        svg.selectAll(".groupbar")
          .transition()
          .style("opacity", function(d){
            return d3.select(this).classed("active") ? 1 : 0.4
          });
        svg.selectAll(".text-groupbar")
        .transition()
        .style("opacity", function(d){
          return d3.select(this).classed("active") ? 1 : 0
        });//added by jbarriapineda
      }
      //end of code added by jbarriapineda
      svg.selectAll(".nodename")
        .transition()
        .style("font-size","inherit")
        .style("opacity", function(d){
          return d3.select(this).classed("active") ? 1 : 0
        });
      svg.selectAll(".text-userbar")
        .transition()
        .style("opacity", function(d){
          return d3.select(this).classed("active") ? 1 : 0
        });//added by jbarriapineda

    }
  } else {*/

  if(state.vis.topicIdx!=-1){//added by jbarriapineda
    
    svg.selectAll(".bar")
      .transition()
      .style("opacity", function(d){
        return d3.select(this).classed("active") ? 1 : 0.4
      });

    svg.selectAll(".text-userbar")
      .transition()
      .style("font-size","8px")
      .style("opacity", function(d){
        return d3.select(this).classed("active") ? 1 : 0
      });
    
    if(state.args.uiTBarModeGrpChk){
      svg.selectAll(".groupbar")
        .transition()
        .style("opacity", function(d){
          return d3.select(this).classed("active") ? 1 : 0.4
        });

      svg.selectAll(".text-groupbar")
        .transition()
        .style("font-size","8px")
        .style("opacity", function(d){
          return d3.select(this).classed("active") ? 1 : 0
        });
    }

    svg.selectAll(".nodename")
      .transition()
      .style("font-size","8px")
      .style("opacity", function(d){
        return d3.select(this).classed("active") ? 1 : 0.05
      });
      /*svg.selectAll(".diagonals.active")
      .transition()
      .style("opacity", function(d){
        return d3.select(this).classed("selected") ? 1: 0
      });*///commented by jbarriapineda
  }else{//added by jbarriapineda
      svg.selectAll(".bar")
          .transition()
          .style("opacity", 1);

      if(state.args.uiTBarModeGrpChk){
        svg.selectAll(".groupbar")
          .transition()
          .style("opacity", 1);
        svg.selectAll(".text-groupbar")
          .transition()
          .style("font-size","8px")
          .style("opacity", 0);
      }

      svg.selectAll(".nodename")
        .transition()
        .style("font-size","8px")
        .style("opacity", 1);

      svg.selectAll(".text-userbar")
        .transition()
        .style("font-size","8px")
        .style("opacity", 0);
  }
  /*}*/

  svg.selectAll(".baractive").classed("baractive", false);

}
//not quite right with this function, not added to the diagonals
function diagonalsMouseOver(id,tid,i){
  
    d3.select("#diagonals"+i).classed("diagonalsSelected", true);
    d3.select("#nodename"+id).classed("diagonalsSelected", true);

    

    svg.selectAll(".diagonals")
    .transition()
    .style("opacity", function(p){
      if(d3.select(this).classed("selected")&&(!d3.select(this).classed("diagonalsSelected")))
         return 0.4;
       else if(d3.select(this).classed("selected")&& d3.select(this).classed("diagonalsSelected"))
         return 1;
       else return 0;
    });

    svg.selectAll(".nodename")
    .transition()
    .style("opacity", function(p){
      if(d3.select(this).classed("selected")&& d3.select(this).classed("diagonalsSelected"))
         return 1;
       else return 0.05;
    });
}

function diagonalsMouseOut(id,tid){


     svg.selectAll(".diagonals")
    .transition()
    .style("opacity", function(p){
      if(d3.select(this).classed("selected"))
         return 1;
       else return 0;
    });

    svg.selectAll(".nodename")
    .transition()
    .style("opacity", function(p){
      if(d3.select(this).classed("selected"))
         return 1;
       else return 0.05;
    });

     svg.selectAll(".diagonalsSelected").classed("diagonalsSelected", false);   
  
}
//-------------------------------------------------------------------------------------
//map the mouse click function on the nodes
function diagonalsClick(id, cnt, origin){

  blockClick = true;

  var cntTemp = getCnt(id);
  var dotCntTemp = [];
  var counter = 0; 
  for(var i=0; i<cntTemp.length; i++){
    for(var j=0; j<cnt.length; j++){
      if(cntTemp[i].id === cnt[j]){
        dotCntTemp[counter] = cntTemp[i];
        counter++;
      }
    }
  }

  $("#qz-title").html("Link Selected: " + conceptArray[id]+"->"+mapConceptColumnTopic[id]);
  //add both node and donut to the .old svg
  //$("#qz-title .concept-selected-clone").append(el_node, el_donut);

  $("#qz-content").html("");
  for (var i = 0; i < cnt.length; i++){
    var el = null;
    d3.selectAll(".grid-cell-outter").each(function(e){
      if (e.topicIdx === dotCntTemp[i].topicIdx && !e.isInt && el === null){
        //// console.log(e, d3.select(this));
        el = d3.select(this);
      }
    });

    if (!el) { //if there is node element with a question
      continue;
    }

    var pos = "" + i;

    $("#qz-content").append("<a href='#' id='qz-" + i + "' class='list-group-item'><div class='qzProgress'></div>" + dotCntTemp[i].name + "</a>");
    
    var mapProgress = getMapProgress();

    var progress = mapProgress[cnt[i]];

    var qzColor = d3.scale.linear().
      domain(CONST.vis.gridAbs.scales.y).
      range(["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]));
    qzColor = qzColor(progress);
    $("#qz-content #qz-" + i + " .qzProgress")
      .attr("title", "Progress: " + (progress * 100) + "%")
      .attr("color-value", qzColor)
      .css( "background-color", qzColor);


    $("#qz-"+i).click(function(e) {
      var pos = $(this).attr("id");
      pos = pos.substring(3, pos.length);
      pos = parseInt(pos);
      openQzAction(dotCntTemp[pos].topicIdx, dotCntTemp[pos].qzIdx, el);
      
      // log(
      //   "action"         + CONST.log.sep02 + "cm-activity-click"   + CONST.log.sep01 +
      //   "activity-name"  + CONST.log.sep02 + qz[pos].id            + CONST.log.sep01 +
      //   "topic-name"     + CONST.log.sep02 + qz[pos].topicId       + CONST.log.sep01 +
      //   "color"          + CONST.log.sep02 + $(this).children(".qzProgress").attr("color-value"),
      //   true
      // );
    });

  }
  if ($("#qz-content").is(':visible')) {
    var el = $("#qz-content"),
        curHeight = el.height(),
        autoHeight = el.css('height', 'auto').height();
    el.height(curHeight).animate({height: autoHeight}, 1000);
  } else {
    $("#qz-content").css('height', 'auto');
    $("#qz-content").show();

    $("#none-concept-selected").hide();

    $("#collapse-concept-selected").collapse('show');

    $("#collapse-last-action").collapse('hide');

  }
  

  log(
    "action"                + CONST.log.sep02 + "cm-concept-select"   + CONST.log.sep01 +
    "concept-name"          + CONST.log.sep02 + d.name                + CONST.log.sep01 +
    "topic-name"            + CONST.log.sep02 + d.topic               + CONST.log.sep01 +
    "concept-radius"        + CONST.log.sep02 + d.faveSize            + CONST.log.sep01 +
    "min-size"              + CONST.log.sep02 + minWidthNode          + CONST.log.sep01 +
    "max-size"              + CONST.log.sep02 + maxWidthNode          + CONST.log.sep01 +
    "concept-color"         + CONST.log.sep02 + d.faveColor           + CONST.log.sep01 +
    "concept-completeness"  + CONST.log.sep02 + d.completeness        + CONST.log.sep01 +
    "origin"                + CONST.log.sep02 + origin,
    true
  );
}
//-------------------------------------------------------------------------------------
//map the mouse click function on the nodes
function barClick(id, origin){
  blockClick = true;


  svg.selectAll(".bar.selected")
    .transition()
    .style("opacity", 0.4)
    .style("stroke", "#fff");
  svg.selectAll(".nodename.selected")
    .transition()
    .style("opacity", 0);
  svg.selectAll(".diagonals.selected")
    .transition()
    .style("opacity", 0);

  d3.selectAll(".selected").classed("selected", false);
  

  svg.selectAll(".active")
    .classed("selected", true);



  svg.selectAll(".bar.active")
    .transition()
    .style("opacity", 1)
    .style("stroke", "#000")
    ;
  svg.selectAll(".nodename.active")
    .transition()
    .style("opacity", 1)
    ;


  svg.selectAll(".diagonals.selected")
    .each(function(p) {
      this.parentElement.appendChild(this);    });

  svg.selectAll(".diagonals.selected")
    .transition()
   // .style("fill", function(d) { return (d3.select(this).classed("selected")) ? "green" : "red"; })
    .style("cursor", "pointer")
    .style("opacity", 1);

  svg.selectAll(".active")
    .classed("active", false);

  if ($(".tipsyClick").length > 0) {
   //  // console.log("Node Clicked in 1");
    if (!d3.select("#node"+id).classed("tipsyClick")) {
      //$(".tipsyClick").tipsy("hide");//something is wrong in my code about using tipsy, so the code here will block the part done
      d3.selectAll(".tipsyClick").classed("tipsyClick", false);
    }
  }

  if ($(".tipsyClick2").length > 0) {
    $(".tipsyClick2").tipsy('hide');
    d3.selectAll(".tipsyClick2").classed("tipsyClick2", false);
  }
  
  
  d3.select("#node"+id).classed("tipsyOver", false);
  d3.select("#node"+id).classed("tipsyClick", true);


  

  var qz = getCnt(id);


  $("#qz-title").html("Concept Selected: " + conceptArray[id] + ": " + mapConceptColumnTopic[id]);
  //add both node and donut to the .old svg
  //$("#qz-title .concept-selected-clone").append(el_node, el_donut);

  $("#qz-content").html("");
  for (var i = 0; i < qz.length; i++){
    var el = null;
    d3.selectAll(".grid-cell-outter").each(function(e){
      if (e.topicIdx === qz[i].topicIdx && !e.isInt && el === null){
        //// console.log(e, d3.select(this));
        el = d3.select(this);
      }
    });

    if (!el) { //if there is node element with a question
      continue;
    }

    var pos = "" + i;

    $("#qz-content").append("<a href='#' id='qz-" + i + "' class='list-group-item'><div class='qzProgress'></div>" + qz[i].name + "</a>");
    
    var progress = getMe().state.activities[qz[i].topicId].qz[qz[i].id].values.p;

    var qzColor = d3.scale.linear().
      domain(CONST.vis.gridAbs.scales.y).
      range(["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]));
    qzColor = qzColor(progress);
    $("#qz-content #qz-" + i + " .qzProgress")
      .attr("title", "Progress: " + (progress * 100) + "%")
      .attr("color-value", qzColor)
      .css( "background-color", qzColor);


    $("#qz-"+i).click(function(e) {
      var pos = $(this).attr("id");
      pos = pos.substring(3, pos.length);
      pos = parseInt(pos);
      openQzAction(qz[pos].topicIdx, qz[pos].qzIdx, el);
      
      log(
        "action"         + CONST.log.sep02 + "cm-activity-click"   + CONST.log.sep01 +
        "activity-name"  + CONST.log.sep02 + qz[pos].id            + CONST.log.sep01 +
        "topic-name"     + CONST.log.sep02 + qz[pos].topicId       + CONST.log.sep01 +
        "color"          + CONST.log.sep02 + $(this).children(".qzProgress").attr("color-value"),
        true
      );
    });

  }
  if ($("#qz-content").is(':visible')) {
    var el = $("#qz-content"),
        curHeight = el.height(),
        autoHeight = el.css('height', 'auto').height();
    el.height(curHeight).animate({height: autoHeight}, 1000);
  } else {
    $("#qz-content").css('height', 'auto');
    $("#qz-content").show();

    $("#none-concept-selected").hide();

    $("#collapse-concept-selected").collapse('show');

    $("#collapse-last-action").collapse('hide');

  }
  
 // // console.log("Node Click: " + mapConceptName[id], id);

  log(
    "action"                + CONST.log.sep02 + "cm-concept-select"   + CONST.log.sep01 +
    "concept-name"          + CONST.log.sep02 + d.name                + CONST.log.sep01 +
    "topic-name"            + CONST.log.sep02 + d.topic               + CONST.log.sep01 +
    "concept-radius"        + CONST.log.sep02 + d.faveSize            + CONST.log.sep01 +
    "min-size"              + CONST.log.sep02 + minWidthNode          + CONST.log.sep01 +
    "max-size"              + CONST.log.sep02 + maxWidthNode          + CONST.log.sep01 +
    "concept-color"         + CONST.log.sep02 + d.faveColor           + CONST.log.sep01 +
    "concept-completeness"  + CONST.log.sep02 + d.completeness        + CONST.log.sep01 +
    "origin"                + CONST.log.sep02 + origin,
    true
  );
}


//-------------------------------------------------------------------------------------
//map the mouse over function on the nodes
var lastNodeMouseOver = null;
function topicNodeMouseOver(tid,origin) {
  if(uiCMVisId=="bipartite"){

  //redrawSpread(tid); //commented by jbarriapineda in order to dont redraw the graph when hovering one topic square in MG
  //var she = d3.selectAll("[topicId = "+tid+"]").classed("active", true);
  
  d3.selectAll(".bar").filter(function(d){
    if(state.curr.cid!=367){
      return correctTopicName(d.t)==tid;
    }else{
      return correctTopicNameMemphis(d.t)==tid;
    }}).classed("active", true);
  //d3.selectAll(".bar").filter(function(d){return d.t==tid}).classed("active", true);//Commented by @Jordan
  d3.selectAll(".groupbar").filter(function(d){return d.t==tid}).classed("active", true);
  //d3.selectAll(".nodename").filter(function(d){return correctTopicName(d.t)==tid}).classed("active", true);//Commented by @Jordan for Memphis
  d3.selectAll(".nodename").filter(function(d){
    if(state.curr.cid!=367){
      return correctTopicName(d.t)==tid;
    }else{
      return correctTopicNameMemphis(d.t)==tid;
    }}).classed("active", true);
  //d3.selectAll(".nodename").filter(function(d){return d.t==tid}).classed("active", true);//Commented by @Jordan
  //d3.selectAll(".text-userbar").filter(function(d){return correctTopicName(d.t)==tid}).classed("active", true);//Commented by @Jordan for Memphis
  d3.selectAll(".text-userbar").filter(function(d){
    if(state.curr.cid!=367){
      return correctTopicName(d.t)==tid;
    }else{
      return correctTopicNameMemphis(d.t)==tid;
    }}).classed("active", true);
  //d3.selectAll(".text-userbar").filter(function(d){return d.t==tid}).classed("active", true);//Commented by @Jordan
  d3.selectAll(".text-groupbar").filter(function(d){return d.t==tid}).classed("active", true);


  var conceptId = getConceptFromTopic(tid);//get the outcome concepts of the topic

  for(var i=0; i<conceptId.length; i++){
    var kcId = conceptId[i];
    //var concepts = d3.selectAll("[concepttopicId = '"+tid+"~"+kcId+"']").classed("active", true);//d['conceptTopicId']+d["conceptId"]
    var concepts = d3.selectAll(".diagonals").filter(function(d){var ctid=tid+"~"+kcId; return d.concepttopicId==ctid;}).classed("active", true);//d['conceptTopicId']+d["conceptId"]
  }
  

  svg.selectAll(".bar")
    .transition()
    .style("opacity", function(p){
      return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0.4;
    });
    /*.style("stroke", function(p){
      return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
    });*/

  svg.selectAll(".text-userbar")
      .transition()
      .style("opacity", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0;
      });//added by jbarriapineda
      /*.style("stroke", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
      });*/
  
  //code added by jbarriapineda
  if (state.args.uiTBarModeGrpChk){
    svg.selectAll(".groupbar")
      .transition()
      .style("opacity", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0.4;
      });
      /*.style("stroke", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
      });*/

    svg.selectAll(".text-groupbar")
      .transition()
      .style("opacity", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0;
      });//added by jbarriapineda
      /*.style("stroke", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
      });*/
  }
  //end of code added by jbarriapineda

    svg.selectAll(".nodename")
    .transition()
    .style("opacity", function(p){
      return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0.05;
    });

    if(state.vis.topicIdx==-1){
          svg.selectAll(".diagonals")
            .transition()
            .style("opacity", function(p){
              return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0;
            });
    }
  lastNodeMouseOver = tid;
  }
}

//---------------------------------------------------------------------------------------
//map the mouse out function on the nodes
//function topicNodeMouseOut(id,tid, origin){//commented by jbarriapineda
function topicNodeMouseOut(tid, origin){//commented by jbarriapineda

  if(uiCMVisId=="bipartite"){

  //if (d3.select("#userbar"+id).classed("selected") === false || d3.select("#groupbar"+id).classed("selected") === false){
  /*

    if(svg.selectAll(".selected").empty()){

      svg.selectAll(".bar")
        .transition()
        .style("opacity", 1)
        .style("stroke", function(d) { return "white"; });
 
      //added by jbarriapineda
      svg.selectAll(".groupbar")
        .transition()
        .style("opacity", 1)
        .style("stroke", function(d) { return "white"; });
      //end of code added by jbarriapineda

      svg.selectAll(".nodename")
        .transition()
        .style("opacity", 0);

      svg.selectAll(".diagonals")
        .transition()
        .style("opacity", 0);
    } else {
      svg.selectAll(".bar")
        .transition()
        .style("opacity", function(d){
          return d3.select(this).classed("selected") ? 1 : 0.4
        })
        .style("stroke", function(d) { 
          return d3.select(this).classed("selected") ? "black" : "white";
        });

        //added by jbarriapineda
        svg.selectAll(".groupbar")
          .transition()
          .style("opacity", function(d){
            return d3.select(this).classed("selected") ? 1 : 0.4
          })
          .style("stroke", function(d) { 
            return d3.select(this).classed("selected") ? "black" : "white";
          });
        //code added by jbarripineda

        svg.selectAll(".nodename")
        .transition()
        .style("opacity", function(d){
          return d3.select(this).classed("selected") ? 1 : 0
        });
       
        svg.selectAll(".diagonals")
        .transition()
        .style("opacity", function(d){
        return d3.select(this).classed("selected") ? 1 : 0
        });
            

    }

    svg.selectAll(".active").classed("active", false);
    redrawNormal();

  } else {
 */
    svg.selectAll(".bar")
      .transition()
      .style("opacity", 1 );/*function(d){
        return d3.select(this).classed("selected") ? 1 : 0.4
      })
      .style("stroke", function(d) { 
        return d3.select(this).classed("selected") ? "#000" : "#fff";
      });*///commented by jbarriapineda

    //added by jbarriapineda
    if(state.args.uiTBarModeGrpChk){
       svg.selectAll(".groupbar")
        .transition()
        .style("opacity", 1);/*function(d){
          return d3.select(this).classed("selected") ? 1 : 0.4
        })
        .style("stroke", function(d) { 
          return d3.select(this).classed("selected") ? "#000" : "#fff";
        });*///commented by jbarriapineda
    }
    //end of code added by jbarriapineda

    svg.selectAll(".nodename")
      .transition()
      .style("opacity", 1);/*function(d){
        return d3.select(this).classed("selected") ? 1 : 0.4
      });*///commented by jbarriapineda
    svg.selectAll(".diagonals")
      .transition()
      .style("opacity", 0);/*function(d){
        return d3.select(this).classed("selected") ? 1: 0
      });*///commented by jbarriapineda
    //redrawNormal();//commented by jbarriapineda in order to dont redraw the graph when hovering one topic square in MG
    svg.selectAll(".active").classed("active", false);
      

    //}
  }



}

//-------------------------------------------------------------------------------------
//map the mouse click function on the topic nodes
function topicNodeClick(){
    if(uiCMVisId=="bipartite"){

  blockClick = true;


  svg.selectAll(".bar.selected")
    .transition()
    .style("opacity", 0.4)
    .style("stroke", "#fff");
  svg.selectAll(".nodename.selected")
    .transition()
    .style("opacity", 0.4);

  d3.selectAll(".selected").classed("selected", false);
  

  svg.selectAll(".active")
    .classed("selected", true);


  svg.selectAll(".bar.active")
    .transition()
    .style("opacity", 1)
    .style("stroke", "#000")
    ;
  svg.selectAll(".nodename.active")
    .transition()
    .style("opacity", 1)
    ;

  svg.selectAll(".diagonals.selected")
    .each(function(p) {
      this.parentElement.appendChild(this);    });

  svg.selectAll(".diagonals.selected")
    .transition()
   // .style("fill", function(d) { return (d3.select(this).classed("selected")) ? "green" : "red"; })
    .style("cursor", "pointer")
    .style("opacity", 1);

  svg.selectAll(".active")
    .classed("active", false);
  } 

}

function highlightKcsOnActivityMouseOver(actId,resIdx){
  if(uiCMVisId=="bipartite"){

    //redrawSpread(tid); //commented by jbarriapineda in order to dont redraw the graph when hovering one topic square in MG
    //var she = d3.selectAll("[topicId = '"+tid+"']").classed("active", true);

    //var she = d3.selectAll("[id = '"+tid+"']").classed("active", true);


    //var conceptId = getConceptFromTopic(tid);//get the outcome concepts of the topic

    /*for(var i=0; i<conceptId.length; i++){
      var kcId = conceptId[i];
      var concepts = d3.selectAll("[concepttopicId = '"+tid+"~"+kcId+"']").classed("active", true);//d['conceptTopicId']+d["conceptId"]
    }*/

    var kcsNotKnown = 0;
    var kcsLearning = 0;
    var kcsKnown = 0;

    var percent = 0;

    for(var i=0; i < actId_kcs[actId].length; i++){
      var kc_info= map_kcs_id_info[actId_kcs[actId][i]];
      var kc_level = kcs_estimates[kc_info.n];
      if (kc_level>=0.666){
        kcsKnown = kcsKnown + 1;
      }else{
        if(kc_level>=0.333){
          kcsLearning = kcsLearning + 1;
          percent = percent + 0.5;
        }else{
          kcsNotKnown = kcsNotKnown + 1;
          percent = percent + 1;
        }
      }
    }

    percent = percent/actId_kcs[actId].length;//percentage is the weighted avg of the number of kcs according to their category (see UMAP'18 paper for equation)- added by @Jordan
    percent = kcs_estimates[actId];
    
    //Estimates probability of understanding the example correctly given the avg of the knowledge in underlying concepts
    if(percent == undefined){
      var estimate = 0;
      for(var i=0; i < actId_kcs[actId].length; i++){
        var kc_info= map_kcs_id_info[actId_kcs[actId][i]];
        var kc_level = kcs_estimates[kc_info.n];
        estimate = estimate + kc_level;
      }
      estimate = estimate/actId_kcs[actId].length;
      percent = estimate;
    }  

    var tid=lastNodeMouseOver;

    kc_state_act=data.learners[learner_id].state.activities[tid][data.resources[resIdx].id][actId].values;

    //Commented by @Jordan for the use of MG pr version + concept vis
    // d3.select("#kcsNotKnown").text(kc_state_act.kcsNotKnown);
    // d3.select("#kcsLearning").text(kc_state_act.kcsLearning);
    // d3.select("#kcsKnown").text(kc_state_act.kcsKnown);

    d3.select("#kcsNotKnown").text(kcsNotKnown);
    d3.select("#kcsLearning").text(kcsLearning);
    d3.select("#kcsKnown").text(kcsKnown);

    //percent = kc_state_act.difficulty; //Commented by @Jordan for the use of MG pr version + concept vis

    if(needle && (state.args.impactMsg || state.args.difficultyMsg)){
      needle.moveTo(percent);
    }

    //setTimeout(displayValue, 1350);
    // console.log(kc_state_act);
    if(actId_kcs[actId]){

    d3.selectAll(".bar").filter(function(d){
      if(actId_kcs[actId].indexOf(d.id)!=-1){
        return true;
      }/*else{
        return false;
      }*/
    }).classed("kcactive", true);
    d3.selectAll(".groupbar").filter(function(d){
      if(actId_kcs[actId].indexOf(d.id)!=-1){
        return true;
      }/*else{
        return false;
      }*/
    }).classed("kcactive", true);
    d3.selectAll(".nodename").filter(function(d){
      if(actId_kcs[actId].indexOf(d.id)!=-1){
        return true;
      }/*else{
        return false;
      }*/
    }).classed("kcactive", true);
    d3.selectAll(".text-userbar").filter(function(d){
      if(actId_kcs[actId].indexOf(d.id)!=-1){
        return true;
      }/*else{
        return false;
      }*/
    }).classed("kcactive", true);
    d3.selectAll(".text-groupbar").filter(function(d){
      if(actId_kcs[actId].indexOf(d.id)!=-1){
        return true;
      }/*else{
        return false;
      }*/
    }).classed("kcactive", true);
    

    svg.selectAll(".bar")
      .transition()
      .style("opacity", function(p){
        //return (d3.select(this).classed("kcactive") || d3.select(this).classed("selected")) ? 1 : 0.4;
        if(d3.select(this).classed("kcactive")){
          return 1;
        }
        /*if(d3.select(this).classed("active") || d3.select(this).classed("selected")){
          return 1;
        }*/
        return 0.4;
      });
      /*.style("stroke", function(p){
        //return (d3.select(this).classed("kcactive") || d3.select(this).classed("selected")) ? "black" : "white";
        if(d3.select(this).classed("kcactive")){
          return "orange";
        }
        if(d3.select(this).classed("active") || d3.select(this).classed("selected")){
          return "black";
        }
        return "white";
      });*/

    svg.selectAll(".text-userbar")
      .transition()
      .style("opacity", function(p){
        return (d3.select(this).classed("kcactive")) ? 1 : 0;
      });//added by jbarriapineda
      /*.style("stroke", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
      });*/
    
    //code added by jbarriapineda
    if (state.args.uiTBarModeGrpChk){
      svg.selectAll(".groupbar")
        .transition()
        .style("opacity", function(p){
          //return (d3.select(this).classed("kcactive") || d3.select(this).classed("selected")) ? 1 : 0.4;
          if(d3.select(this).classed("kcactive")){
            return 1;
          }
          /*if(d3.select(this).classed("active") || d3.select(this).classed("selected")){
            return 1;
          }*/
          return 0.4;
        });
        /*.style("stroke", function(p){
          //return (d3.select(this).classed("kcactive") || d3.select(this).classed("selected")) ? "orange" : "white";
          if(d3.select(this).classed("kcactive")){
            return "orange";
          }
          if(d3.select(this).classed("active") || d3.select(this).classed("selected")){
            return "black";
          }
          return "white";
        });*/

        svg.selectAll(".text-groupbar")
          .transition()
          .style("opacity", function(p){
            return (d3.select(this).classed("kcactive")) ? 1 : 0;
          });//added by jbarriapineda
          /*.style("stroke", function(p){
            return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
          });*/
    }
    //end of code added by jbarriapineda

    svg.selectAll(".nodename")
      .transition()
      .style("opacity", function(p){
        //return (d3.select(this).classed("kcactive") || d3.select(this).classed("selected")) ? 1 : 0.05;
        if(d3.select(this).classed("kcactive")){
          return 1;
        }
        /*if(d3.select(this).classed("active") || d3.select(this).classed("selected")){
          return 1;
        }*/
        return 0.05;
      });

      /*if(state.vis.topicIdx==-1){
           // console.log(state.vis.topicIdx);
            svg.selectAll(".diagonals")
              .transition()
              .style("opacity", function(p){
                return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0;
              });
      }*/
    //lastNodeMouseOver = tid;
      }
    
  }
}

function highlightKcsOnActivityMouseOut(actId){
  if(uiCMVisId=="bipartite"){
    //d3.select("#gauge").remove();//added by jbarriapineda
    if(needle && (state.args.impactMsg || state.args.difficultyMsg)){
      needle.moveTo(0.50);
      d3.select("#kcsNotKnown").text("-");
      d3.select("#kcsLearning").text("-");
      d3.select("#kcsKnown").text("-");
    }

    d3.selectAll(".bar").classed("kcactive", false);
    d3.selectAll(".groupbar").classed("kcactive", false);
    d3.selectAll(".nodename").classed("kcactive", false);
    d3.selectAll(".text-userbar").classed("kcactive", false);
    d3.selectAll(".text-groupbar").classed("kcactive", false);

    var tid=lastNodeMouseOver;
    //redrawSpread(tid); //commented by jbarriapineda in order to dont redraw the graph when hovering one topic square in MG
    var she = d3.selectAll("[topicId = '"+tid+"']").classed("active", true);


    var conceptId = getConceptFromTopic(tid);//get the outcome concepts of the topic

    for(var i=0; i<conceptId.length; i++){
      var kcId = conceptId[i];
      var concepts = d3.selectAll("[concepttopicId = '"+tid+"~"+kcId+"']").classed("active", true);//d['conceptTopicId']+d["conceptId"]
    }
    

    svg.selectAll(".bar")
      .transition()
      .style("opacity", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0.4;
      });
      /*.style("stroke", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
      });*/
    
    //code added by jbarriapineda
    svg.selectAll(".text-userbar")
      .transition()
      .style("opacity", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0;
    });

    if (state.args.uiTBarModeGrpChk){
      svg.selectAll(".groupbar")
        .transition()
        .style("opacity", function(p){
          return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0.4;
        });
        /*.style("stroke", function(p){
          return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
        });*/
        svg.selectAll(".text-groupbar")
          .transition()
          .style("opacity", function(p){
            return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0;
        });
    }
    //end of code added by jbarriapineda

      svg.selectAll(".nodename")
      .transition()
      .style("opacity", function(p){
        return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0.05;
      });

      if(state.vis.topicIdx==-1){
           //// console.log(state.vis.topicIdx);
            svg.selectAll(".diagonals")
              .transition()
              .style("opacity", function(p){
                return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0;
              });
      }
    //lastNodeMouseOver = tid;
    
  }
}

// ------------------------------------------------------------------------------------
//map the mouse click function on the links
function mapLinkClick(d, origin) {
  blockClick = true;

  var qz = getCnt(d.source.id, d.target.id);
  $("#qz-title").html(d.source.name + " ➤ " + d.target.name);
  $("#qz-content").html("");
  for (var i = 0; i < qz.length; i++){
    var el = null;
    d3.selectAll(".grid-cell-outter").each(function(e){
      if (e.topicIdx === qz[i].topicIdx && !e.isInt && el === null){
        el = d3.select(this);
      }
    });
    var pos = "" + i;
    $("#qz-content").append("<a href='#' id='qz-" + i + "' class='list-group-item'><div class='qzProgress'></div>" + qz[i].name + "</a>");
    
    var progress = getMe().state.activities[qz[i].topicId].qz[qz[i].id].values.p;

    var qzColor = d3.scale.linear().
      domain(CONST.vis.gridAbs.scales.y).
      range(["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]));
    qzColor = qzColor(progress);
    $("#qz-content #qz-" + i + " .qzProgress")
      .attr("title", "Progress: " + (progress * 100) + "%")
      .css( "background-color", qzColor);


    $("#qz-"+i).click(function(e) {
      var pos = $(this).attr("id");
      pos = pos.substring(3, pos.length);
      pos = parseInt(pos);
      openQzAction(qz[pos].topicIdx, qz[pos].qzIdx, el);
    });

  }
  if ($("#qz-content").is(':visible')) {
    var el = $("#qz-content"),
        curHeight = el.height(),
        autoHeight = el.css('height', 'auto').height();
    el.height(curHeight).animate({height: autoHeight}, 1000);
  } else {
    $("#qz-content").css('height', 'auto');
    $("#qz-content").show("clip");
  }

  $("#none-concept-selected").hide();
  $("#collapse-concept-selected").collapse('show');

  //// console.log("Link Click: link" + d[idProperty], d.id);
  //// console.log("source: ", d.source.n, " target: ", d.target.n);

  log(
    "action"      + CONST.log.sep02 + "cm-link-select"  + CONST.log.sep01 +
    "link-id"     + CONST.log.sep02 + d.id              + CONST.log.sep01 +
    "link-color"  + CONST.log.sep02 + d.faveColor       + CONST.log.sep01 +
    "link-width"  + CONST.log.sep02 + d.faveWidth       + CONST.log.sep01 + 
    "min-width"   + CONST.log.sep02 + minWidthEdge      + CONST.log.sep01 +
    "max-width"   + CONST.log.sep02 + maxWidthEdge      + CONST.log.sep01 +
    "concept-1"   + CONST.log.sep02 + d.source.name     + CONST.log.sep01 +
    "concept-2"   + CONST.log.sep02 + d.target.name     + CONST.log.sep01 +
    "origin"      + CONST.log.sep02 + origin,
    true
  );
}

//following are the methods for concept matrix
//-------------------------------------------------------------------------------------
//map the mouse over function on the nodes
var lastNodeMouseOver = null;
function mapMouseOver(d, tid,origin) {

  if (modLinks) {
  
  // @@@@ julio
    svg.selectAll(".link").classed("active", function(p) { 
      return (p.source === d || p.target === d) && p.class !== "fake"; 
    });

   
    svg.selectAll(".node, .donut").classed("active", function(p) {
        var ret = false;
        svg.selectAll(".link.active").each(function(a) { 
          if (a.source === p || a.target === p) {
            ret = true;
          }
        });
        return ret;
    });
  }

  // @@@@ julio
   d3.select("#highlight"+d.id)
    .style("fill-opacity", function(d) { return 0.3; });

    if(matrix_mod === "align_ctopic_indi"|matrix_mod ==="align_ctopic_comp")
      d3.select("#Vhighlight"+tid)
    .style("fill-opacity", function(d) { return 0.3; });



  d3.select("#node"+d.id).classed("active", true);
  d3.select("#donut-node"+d.id).classed("active", true);


  svg.selectAll(".link.active")
    .transition()
    .style("opacity", 1)
    .style("visibility", function(d){ 
      if (d.class === "fake"){
        return "hidden";
      } else {
        if (d3.select(this).classed("animate")){
          d3.selectAll(".link.animate")
            .style("stroke", "#C00"); //#c00 - dark red

          for (var i = 0; i < 10; i++) {
            setTimeout(function(){
              d3.selectAll(".link.animate.active")
                .classed("animated", true)
                .transition()
                .style("opacity", function(d){
                  return  d3.select(this).style("opacity") === "1" ? 0.3 : 1;
                });
            }, i*500);
          }
          setTimeout(function(){
            d3.selectAll(".link.animated")
              .classed("animate", false)
              .transition()
              .style("opacity", 1)
              .style("visibility", function(d){ 
                return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "visible" : "hidden"; 
              });
          }, 6000);
        }
        return "visible";
      }
    })
    ;

  svg.selectAll(".node, .donut")
    .transition()
    .style("opacity", function(p){
      //return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 0.4;
      return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? 1 : 1;
    })
    .style("stroke", function(p){
      return (d3.select(this).classed("active") || d3.select(this).classed("selected")) ? "black" : "white";
    });


    d3.select("#node"+d.id)
      .attr("title", function(v) { return styleColorTooltip(mapConceptName[v.id]);});


    // @@@@ julio
    //$(".node.active").each(function(){
    //   $(this).tipsy('show');});
    //$(".node.active").tipsy('show');
  $("#node"+d.id).tipsy('show');

  svg.selectAll(".node, .active").classed("tipsyOver",function(){ 
    return d3.select(this).classed("tipsyClick") ? false : true;
  });



  // d3.select("#node"+d.id).classed("tipsyOver", function(){ 
  //   return d3.select(this).classed("tipsyClick") ? false : true;
  // });

  if (origin && lastNodeMouseOver !== d.id) {
    log(
      "action"                + CONST.log.sep02 + "cm-concept-mouseover"  + CONST.log.sep01 +
      "concept-name"          + CONST.log.sep02 + d.name                  + CONST.log.sep01 +
      "topic-name"            + CONST.log.sep02 + d.topic                 + CONST.log.sep01 +
      "concept-radius"        + CONST.log.sep02 + d.faveSize              + CONST.log.sep01 +
      "min-size"              + CONST.log.sep02 + minWidthNode            + CONST.log.sep01 +
      "max-size"              + CONST.log.sep02 + maxWidthNode            + CONST.log.sep01 +
      "concept-color"         + CONST.log.sep02 + d.faveColor             + CONST.log.sep01 +
      "concept-completeness"  + CONST.log.sep02 + d.completeness          + CONST.log.sep01 +
      "origin"                + CONST.log.sep02 + origin,
      true
    );
  }
  lastNodeMouseOver = d.id;
}

//---------------------------------------------------------------------------------------
//map the mouse out function on the nodes
function mapMouseOut(d,tid, origin){

  d3.select("#highlight"+d.id)
    .style("fill-opacity", function(d) { return 0; });
  if(matrix_mod === "align_ctopic_indi"|matrix_mod ==="align_ctopic_comp")
      d3.select("#Vhighlight"+tid)
    .style("fill-opacity", function(d) { return 0; });

  if (d3.select("#node"+d.id).classed("selected") === false){
    svg.selectAll(".link.active")
      .transition()
      .style("opacity", 0)
      .style("visibility", "hidden");

    if(svg.selectAll(".selected").empty()){

      svg.selectAll(".node, .donut")
        .transition()
        .style("opacity", 1)
        .style("stroke", function(d) { return "white"; });
    } else {
      svg.selectAll(".node, .donut")
        .transition()
        .style("opacity", function(d){
          return d3.select(this).classed("selected") ? 1 : 0.4
        })
        .style("stroke", function(d) { 
          return d3.select(this).classed("selected") ? "black" : "white";
        });
    }

    svg.selectAll(".active").classed("active", false);

  } else {
    svg.selectAll(".link.active")
      .style("visibility", function(d){
        return d3.select(this).classed("selected") ? "visible" : "hidden";
      });

    svg.selectAll(".node.active, .donut.active")
      .transition()
      .style("opacity", function(d){
        return d3.select(this).classed("selected") ? 1 : 0.4
      })
      .style("stroke", function(d) { 
        return d3.select(this).classed("selected") ? "#000" : "#fff";
      });
  }


d3.select("#node"+d.id)
      .attr("title", function(v) { return styleTooltip(mapConceptName[v.id]);});
  if (d3.select("#node"+d.id).classed("tipsyOver")) {
        // // console.log("Node over in 1");
    $(".node").each(function(){
       $(this).tipsy('hide');});
    //$("#node"+d.id).tipsy('hide');
        d3.select(".node").classed("tipsyOver", false);

    //d3.select("#node"+d.id).classed("tipsyOver", false);
  }
}
function dotMouseOver(id,tid){
  d3.select("#highlight"+id)
    .style("fill-opacity", function(d) { return 0.3; });
    d3.select("#Vhighlight"+tid)
    .style("fill-opacity", function(d) { return 0.3; });
}

function dotMouseOut(id,tid){
  d3.select("#highlight"+id)
    .style("fill-opacity", function(d) { return 0; });
    d3.select("#Vhighlight"+tid)
    .style("fill-opacity", function(d) { return 0; });
}
//-------------------------------------------------------------------------------------
//map the mouse click function on the nodes
function dotClick(id, cnt, origin){

  blockClick = true;

  svg.selectAll(".link.selected")
    .style("visibility", "hidden");

  svg.selectAll(".node.selected, .donut.selected")
    .transition()
    .style("opacity", 0.4)
    .style("stroke", "#fff");

  d3.selectAll(".selected").classed("selected", false);
  

  svg.selectAll(".active")
    .classed("selected", true);

  svg.selectAll(".link.active")
    .style("visibility", "visible")
    .transition()
    .style("opacity", 1);

  svg.selectAll(".node.active, .donut.active")
    .transition()
    .style("opacity", 1)
    .style("stroke", "#000")
    ;

  svg.selectAll(".active")
    .classed("active", false);

 // // console.log("dot Click: " + id);
 // // console.log("dot Click: " + cnt);

  var cntTemp = getCnt(id);
  var dotCntTemp = [];
  var counter = 0; 
  for(var i=0; i<cntTemp.length; i++){
    for(var j=0; j<cnt.length; j++){
      if(cntTemp[i].id === cnt[j]){
        dotCntTemp[counter] = cntTemp[i];
        counter++;
      }
    }
  }



  $("#qz-title").html("Concept Selected: " + conceptArray[idArray.indexOf(id)]);
  //add both node and donut to the .old svg
  //$("#qz-title .concept-selected-clone").append(el_node, el_donut);

  $("#qz-content").html("");
  for (var i = 0; i < cnt.length; i++){
    var el = null;
    d3.selectAll(".grid-cell-outter").each(function(e){
      if (e.topicIdx === dotCntTemp[i].topicIdx && !e.isInt && el === null){
        //// console.log(e, d3.select(this));
        el = d3.select(this);
      }
    });

    if (!el) { //if there is node element with a question
      continue;
    }

    var pos = "" + i;

    $("#qz-content").append("<a href='#' id='qz-" + i + "' class='list-group-item'><div class='qzProgress'></div>" + dotCntTemp[i].name + "</a>");
    
    mapP = getMapProgress();
    var progress = mapP[cnt[i]];

    var qzColor = d3.scale.linear().
      domain(CONST.vis.gridAbs.scales.y).
      range(["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]));
    qzColor = qzColor(progress);
    $("#qz-content #qz-" + i + " .qzProgress")
      .attr("title", "Progress: " + (progress * 100) + "%")
      .attr("color-value", qzColor)
      .css( "background-color", qzColor);


    $("#qz-"+i).click(function(e) {
      var pos = $(this).attr("id");
      pos = pos.substring(3, pos.length);
      pos = parseInt(pos);
      openQzAction(dotCntTemp[pos].topicIdx, dotCntTemp[pos].qzIdx, el);
      
      // log(
      //   "action"         + CONST.log.sep02 + "cm-activity-click"   + CONST.log.sep01 +
      //   "activity-name"  + CONST.log.sep02 + qz[pos].id            + CONST.log.sep01 +
      //   "topic-name"     + CONST.log.sep02 + qz[pos].topicId       + CONST.log.sep01 +
      //   "color"          + CONST.log.sep02 + $(this).children(".qzProgress").attr("color-value"),
      //   true
      // );
    });

  }
  if ($("#qz-content").is(':visible')) {
    var el = $("#qz-content"),
        curHeight = el.height(),
        autoHeight = el.css('height', 'auto').height();
    el.height(curHeight).animate({height: autoHeight}, 1000);
  } else {
    $("#qz-content").css('height', 'auto');
    $("#qz-content").show();

    $("#none-concept-selected").hide();

    $("#collapse-concept-selected").collapse('show');

    $("#collapse-last-action").collapse('hide');

  }
  

  log(
    "action"                + CONST.log.sep02 + "cm-concept-select"   + CONST.log.sep01 +
    "concept-name"          + CONST.log.sep02 + d.name                + CONST.log.sep01 +
    "topic-name"            + CONST.log.sep02 + d.topic               + CONST.log.sep01 +
    "concept-radius"        + CONST.log.sep02 + d.faveSize            + CONST.log.sep01 +
    "min-size"              + CONST.log.sep02 + minWidthNode          + CONST.log.sep01 +
    "max-size"              + CONST.log.sep02 + maxWidthNode          + CONST.log.sep01 +
    "concept-color"         + CONST.log.sep02 + d.faveColor           + CONST.log.sep01 +
    "concept-completeness"  + CONST.log.sep02 + d.completeness        + CONST.log.sep01 +
    "origin"                + CONST.log.sep02 + origin,
    true
  );
}
//-------------------------------------------------------------------------------------
//map the mouse click function on the nodes
function mapClick(id, origin){
       // // console.log("mapClick");

  blockClick = true;

  svg.selectAll(".link.selected")
    .style("visibility", "hidden");

  svg.selectAll(".node.selected, .donut.selected")
    .transition()
    .style("opacity", 0.4)
    .style("stroke", "#fff");

  d3.selectAll(".selected").classed("selected", false);
  

  svg.selectAll(".active")
    .classed("selected", true);

  svg.selectAll(".link.active")
    .style("visibility", "visible")
    .transition()
    .style("opacity", 1);

  svg.selectAll(".node.active, .donut.active")
    .transition()
    .style("opacity", 1)
    .style("stroke", "#000")
    ;

  svg.selectAll(".active")
    .classed("active", false);

  if ($(".tipsyClick").length > 0) {
     //// console.log("Node Clicked in 1");
    if (!d3.select("#node"+id).classed("tipsyClick")) {
      //$(".tipsyClick").tipsy("hide");//something is wrong in my code about using tipsy, so the code here will block the part done
      d3.selectAll(".tipsyClick").classed("tipsyClick", false);
    }
  }

  if ($(".tipsyClick2").length > 0) {
    $(".tipsyClick2").tipsy('hide');
    d3.selectAll(".tipsyClick2").classed("tipsyClick2", false);
  }
  
  
  d3.select("#node"+id).classed("tipsyOver", false);
  d3.select("#node"+id).classed("tipsyClick", true);


  

  var qz = getCnt(id);

  var el_node = $("#node" + id).clone()[0];
  var r = +$(el_node).attr("r");
  var size = ((r*2)+(donutWidth*2));
  var html = "<svg class='concept-selected-clone' height='" + size   + "' width='"+ size +"'></svg>";
   
  //set the node id, cx, cy, and the class
  $(el_node).attr({
    id: "clone-node"+id,
    cx: size/2,
    cy: size/2,
    class: ""
  });
  //update the cloned node to stroke white and opcity 1
  $(el_node).css("stroke", "white");
  $(el_node).css("opacity", 1);

  //everything the same for the donut of the node
  var el_donut = $("#donut-node"+id).clone()[0];

  $(el_donut).attr({
    id: "clone-donut-node"+id,
    transform: "translate("+size/2+","+size/2+")",
    class: ""
  });
  $(el_donut).css("stroke", "white");
  $(el_donut).css("opacity", 1);


  $("#qz-title").html("Concept Selected: "+ html + conceptArray[idArray.indexOf(id)]);
  //add both node and donut to the .old svg
  $("#qz-title .concept-selected-clone").append(el_node, el_donut);

  $("#qz-content").html("");
  for (var i = 0; i < qz.length; i++){
    var el = null;
    d3.selectAll(".grid-cell-outter").each(function(e){
      if (e.topicIdx === qz[i].topicIdx && !e.isInt && el === null){
        //// console.log(e, d3.select(this));
        el = d3.select(this);
      }
    });

    if (!el) { //if there is node element with a question
      continue;
    }

    var pos = "" + i;

    $("#qz-content").append("<a href='#' id='qz-" + i + "' class='list-group-item'><div class='qzProgress'></div>" + qz[i].name + "</a>");
    
    var progress = getMe().state.activities[qz[i].topicId].qz[qz[i].id].values.p;

    var qzColor = d3.scale.linear().
      domain(CONST.vis.gridAbs.scales.y).
      range(["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]));
    qzColor = qzColor(progress);
    $("#qz-content #qz-" + i + " .qzProgress")
      .attr("title", "Progress: " + (progress * 100) + "%")
      .attr("color-value", qzColor)
      .css( "background-color", qzColor);


    $("#qz-"+i).click(function(e) {
      var pos = $(this).attr("id");
      pos = pos.substring(3, pos.length);
      pos = parseInt(pos);
      openQzAction(qz[pos].topicIdx, qz[pos].qzIdx, el);
      
      log(
        "action"         + CONST.log.sep02 + "cm-activity-click"   + CONST.log.sep01 +
        "activity-name"  + CONST.log.sep02 + qz[pos].id            + CONST.log.sep01 +
        "topic-name"     + CONST.log.sep02 + qz[pos].topicId       + CONST.log.sep01 +
        "color"          + CONST.log.sep02 + $(this).children(".qzProgress").attr("color-value"),
        true
      );
    });



  }



  if ($("#qz-content").is(':visible')) {
    var el = $("#qz-content"),
        curHeight = el.height(),
        autoHeight = el.css('height', 'auto').height();
    el.height(curHeight).animate({height: autoHeight}, 1000);
  } else {
    $("#qz-content").css('height', 'auto');
    $("#qz-content").show();

    $("#none-concept-selected").hide();

    $("#collapse-concept-selected").collapse('show');

    $("#collapse-last-action").collapse('hide');

  }


  //popup window for concept list

    // var cont  = $("#collapse-menu")[0];
    // // console.log(cont);
    // var sqW = CONST.vis.gridAbs.sq.w;

    // cont.style.position = "absolute";
    // var gridMeCont = $("#grid-me");

    // var nodeSelected = $("#node"+id);

    // var cumulativeOffset = nodeSelected.offset();
    // var nodeSelectedRadius = parseFloat(nodeSelected.attr("r"));

    // // console.log(nodeSelectedRadius);


    // cont.style.left = (cumulativeOffset.left+nodeSelectedRadius)+ "px";
    //     // console.log(mapTopicPos[mapConceptColumnTopic[id]] + "px");

    

    // cont.style.top  = (cumulativeOffset.top+nodeSelectedRadius)+ "px";
    //     // console.log(((2+conceptYPosMap[id])*sqW +gridMeCont.height()+nodeSelectedRadius)+ "px");

    // // console.log(cont);

    // $("#collapse-menu").css("display", "block");

    //$setPosCenter(ui.vis.actLst.arrow, false, mapTopicPos[mapConceptColumnTopic[id]], (2+conceptYPosMap[d.id])*sqW, false);

  
 // // console.log("Node Click: " + mapConceptName[id], id);

  log(
    "action"                + CONST.log.sep02 + "cm-concept-select"   + CONST.log.sep01 +
    "concept-name"          + CONST.log.sep02 + d.name                + CONST.log.sep01 +
    "topic-name"            + CONST.log.sep02 + d.topic               + CONST.log.sep01 +
    "concept-radius"        + CONST.log.sep02 + d.faveSize            + CONST.log.sep01 +
    "min-size"              + CONST.log.sep02 + minWidthNode          + CONST.log.sep01 +
    "max-size"              + CONST.log.sep02 + maxWidthNode          + CONST.log.sep01 +
    "concept-color"         + CONST.log.sep02 + d.faveColor           + CONST.log.sep01 +
    "concept-completeness"  + CONST.log.sep02 + d.completeness        + CONST.log.sep01 +
    "origin"                + CONST.log.sep02 + origin,
    true
  );
}

//added by jiaruixue
function drawConceptGlyf(topic, cont){


    var conceptArraySelect = getConceptFromTopic(topic);
    var nodes_of_topic = nodes_dynamic.filter(function(d, i) { 
      return conceptArraySelect.indexOf(d.id)!=-1;});
   

    var containerWidth = $(cont).width();

    svg = d3.select(cont)
            .append("svg")
            .attr("id","glyfPopup")
            .attr("width", containerWidth)
            .attr("height", 100)
            .attr("pointer-events", "all")  
            .append('g');

    var sqW = gridSetting.sq.w;

            // need dynamic data
            node = svg.selectAll("g.node");
            node = node.data(nodes_of_topic, function(d) { return d.id;});

            var conceptXPosMap={};
            //following is calculating x pos of the glyf
            for(var i=0;i<groups.length;i++){
              for(var j=0;j<groups[i].values.length;j++){
                conceptXPosMap[groups[i].values[j].id]=j;
              }
            }

            
            var pi = Math.PI;

           // circle= d3.svg.circle()
                    // .attr("r", function(d){ return d[size] = mapWidthNodeData(d[sizeProperty]); })
                     //.attr("title", function(v) { return mapConceptName[v.id]; })

             arc = d3.svg.arc()
                    .innerRadius(function(d) {return d[size] + 0.5})
                    .outerRadius(function(d) {return d[size] + donutWidth})
                    .startAngle(0)
                    .endAngle(function(d) {
                      var completeness = d.connections/d.maxConnections; //d.maxConnections
                      d.completeness = completeness;
                      return (360 * completeness) * (pi/180);
                    });
              

            mapPropertyToColors(colors, nodes_of_topic, 'nodes');


           
            inner = node.enter().append("circle")
                     .attr("class", "node")
                     .attr("id", function(d) { return "node" + d[idProperty]})
                     .attr("id-value", function(d) { return d[idProperty]})
                     .attr("cx", function(d) { return (2+conceptArraySelect.indexOf(d.id))*(maxWidthNode*2);})
                     .attr("cy", function(d) { return sqW; })
                     .attr("r", function(d){ return d[size] = mapWidthNodeData(d[sizeProperty]); })
                     .attr("title", function(v) { return mapConceptName[v.id]; })
                     .style("fill", function(d) { return d[color]; })
                     .style("stroke", function(d) { return "white"; })
                     .style("stroke-width", 2)
                     .style("cursor", "pointer")
                     .on("mouseover", function(d){ mapMouseOver(d,mapConceptColumnTopic[d.id], "map"); })                  
                     .on("mouseout", function(d){ mapMouseOut(d,mapConceptColumnTopic[d.id], "map"); })
                     .on("click", function(d){ mapClick(d.id, "map"); });

               donut = node
                     .enter()
                     .append("path")
                     .attr("id", function(d) { return "donut-node" + d[idProperty]})
                     .attr("id-node", function(d) { return d[idProperty]})
                     .attr("class", "donut")
                     .attr('transform', function(d) { return 'translate(' + ((2+conceptArraySelect.indexOf(d.id))*(maxWidthNode*2)) + ',' + sqW+ ')';})
                     .attr("d", arc)
                     .style("fill", function(d){ return d[dcolor]; })
                     .style("stroke", function(d) { return "white"; })
                     .style("stroke-width", function(d) { return (d.completeness>0?1:0); }); //just radians  
                        

}

//added by jbarriapineda
function showSocialComparisonBipartite(){
  d3.selectAll(".groupbar")
     .style("display","initial")
     .style("opacity",1)
     .style("pointer-events","visible");

  d3.selectAll(".nodename")
    //.transition()
    //.duration(1000)
    //.attr("transform",function(d){return "translate("+d.x+","+(d.y+255)+")";});
    .attr("transform",function(){
      var transform = d3.transform(d3.select(this).attr("transform"));
      var current_x = transform.translate[0];
      var current_y = transform.translate[1];
      //return "translate("+current_x+","+(current_y+165)+") rotate(45)";});
      return "translate("+current_x+","+(yStartBipartite+maxBarHeight+10)+") rotate(45)";});

  d3.selectAll(".trivial-group")
     .style("opacity",1);
}

function hideSocialComparisonBipartite(){
  d3.selectAll("g.groupbar")
     .style("opacity",0)
     .style("display","none")
     .style("pointer-events","none");
  d3.selectAll(".text-groupbar")
     .style("opacity",0)
     .style("pointer-events","none");
  d3.selectAll(".trivial-group")
     .style("opacity",0);
  d3.selectAll(".nodename")
    //.transition()
    //.duration(1000)
    //.attr("transform",function(d){return "translate("+d.x+","+(d.y+255)+")";});
    .attr("transform",function(){
      var transform = d3.transform(d3.select(this).attr("transform"));
      var current_x = transform.translate[0];
      var current_y = transform.translate[1];
      //return "translate("+current_x+","+(current_y+165)+") rotate(45)";});
      return "translate("+current_x+","+(yStartBipartite+maxBarHeight+10)+") rotate(45)";});
}


//(function(){
  
  //Utility methods 
  
  percToDeg = function(perc) {
    return perc * 360;
  };

  percToRad = function(perc) {
    return degToRad(percToDeg(perc));
  };

  degToRad = function(deg) {
    return deg * Math.PI / 180;
  };


repaintGauge = function () 
  {
    perc = 0.50;
    var next_start = totalPercent;
    arcStartRad = percToRad(next_start);
    arcEndRad = arcStartRad + percToRad(perc / 3);
    next_start += perc / 3;


    arc1.startAngle(arcStartRad).endAngle(arcEndRad);

    arcStartRad = percToRad(next_start);
    arcEndRad = arcStartRad + percToRad(perc / 3);
    next_start += perc / 3;

    arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

    arcStartRad = percToRad(next_start);
    arcEndRad = arcStartRad + percToRad(perc / 3);
      
    arc3.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

    if(state.args.difficultyMsg){
      chart.select(".chart-first").attr('d', arc1);
      chart.select(".chart-second").attr('d', arc2);
      chart.select(".chart-third").attr('d', arc3);
    }
    if(state.args.impactMsg){
      chart.select(".chart-first").attr('d', arc3);
      chart.select(".chart-second").attr('d', arc2);
      chart.select(".chart-third").attr('d', arc1);
    }
    

  }
/////////
/*
    var dataset = [{metric:name, value: value}]

    var texts = svg.selectAll("text")
                .data(dataset)
                .enter();
     
    texts.append("text")
         .text(function(){
              return dataset[0].metric;
         })
         .attr('id', "Name")
         .attr('transform', "translate(" + ((width + margin.left) / 6) + ", " + ((height + margin.top) / 1.5) + ")")
         .attr("font-size",25)
         .style("fill", "#000000");
      

    texts.append("text")
        .text(function(){
            return 0;
        })
        .attr('id', 'scale0')
        .attr('transform', "translate(" + ((width + margin.left) / 100 ) + ", " + ((height + margin.top) / 2) + ")")
        .attr("font-size", 15)
        .style("fill", "#000000");
                    
    texts.append("text")
        .text(function(){
            return gaugeMaxValue/2;
        })
        .attr('id', 'scale10')
        .attr('transform', "translate(" + ((width + margin.left) / 2.15 ) + ", " + ((height + margin.top) / 30) + ")")
        .attr("font-size", 15)
        .style("fill", "#000000");
                    
                    
    texts.append("text")
        .text(function(){
            return gaugeMaxValue;
        })
        .attr('id', 'scale20')
        .attr('transform', "translate(" + ((width + margin.left) / 1.03 ) + ", " + ((height + margin.top) / 2) + ")")
        .attr("font-size", 15)
        .style("fill", "#000000");*/
    
  var Needle = (function() {

    //Helper function that returns the `d` value for moving the needle
    var recalcPointerPos = function(perc) {
      var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
      thetaRad = percToRad(perc/2);
      centerX = 0;
      centerY = 0;
      topX = centerX - this.len * Math.cos(thetaRad);
      topY = centerY - this.len * Math.sin(thetaRad);
      leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
      leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
      rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
      rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
        
        return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
        
        
        
        
    };

function Needle(el) {
      this.el = el;
      this.len = 45;//width / 4;
      this.radius = 5;//this.len / 8;
    }

    Needle.prototype.render = function() {
      this.el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
        
        
        
        
      return this.el.append('path').attr('class', 'needle').attr('id', 'client-needle').attr('d', recalcPointerPos.call(this, 0.5));
        
       
    };

    Needle.prototype.moveTo = function(perc) {
      //// console.log(perc);
      var self,
          oldValue = this.perc || 0.5;
      this.perc = perc;
      self = this;
      
      // Reset pointer position
      /*this.el.transition().delay(100).ease('quad').duration(500).select('.needle').tween('reset-progress', function() {
        return function(percentOfPercent) {
          if(oldValue<0.5){
            var progress = (1 - percentOfPercent) * oldValue - 0.5;
          }else{
            var progress = (1 - percentOfPercent) * oldValue + 0.5;
          }
          repaintGauge(progress);
          return d3.select(this).attr('d', recalcPointerPos.call(self, progress));
        };
      });*/

      this.el.transition().delay(100).ease('bounce').duration(800).select('.needle').tween('progress', function() {
        return function(percentOfPercent) {
          //// console.log(percentOfPercent);
          var progress = (percentOfPercent) * (perc-0.5) + 0.5;
          
          
          repaintGauge(progress);
          
          var thetaRad = percToRad(progress / 2);

          return d3.select(this).attr('d', recalcPointerPos.call(self, progress));
        };
      });

    };
    
      
    return Needle;

})();

function createKcsInfo(){
  var chartInset, degToRad, numSections, percent, sectionIndx, valueText, formatValue, k;

    numSections = 1;
    sectionPerc = 1 / numSections / 2;
    
    chartInset = 0;
      
    // Orientation of gauge:
    totalPercent = .75;

    var margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    //width = el[0][0].offsetWidth - margin.left - margin.right;
    var gwidth=$("div#kcs_act_info").width();
    
    //var gheight=$("div#kcs_act_info").heigth();
    var gheight=90;
    var gradius = Math.min(gwidth, gheight) / 2;
    var gbarWidth = 12;

    // Create SVG element
    var gsvg = d3.select("#kcs_act_info").select("svg");//.attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
   // // console.log(gsvg);
    // Add layer for the panel
    chart = gsvg.append('g')
              .attr("id","gauge")
              .attr('transform', "translate(" + ((gwidth) / 2 + margin.left) + ", " + ((gheight + margin.top) / 2 +10) + ")");


    chart.append('path').attr('class', function(d){
      if(state.args.difficultyMsg){
        return "arc chart-first";
      }
      if(state.args.impactMsg){
        return "arc chart-third";
      }
    });
    chart.append('path').attr('class', "arc chart-second");
    chart.append('path').attr('class', function(d){
      if(state.args.difficultyMsg){
        return "arc chart-third";
      }
      if(state.args.impactMsg){
        return "arc chart-first";
      }
    });
      
    /*valueText = chart.append("text")
                      .attr('id', "Value")
                      .attr("font-size",16)
                      .attr("text-anchor","middle")
                      .attr("dy",".5em")
                      .style("fill", '#000000');
    formatValue = d3.format('1%');*/

    gsvg.append("text")
      //.attr("id","label-prob-act")
      .attr("id","label-prob-act")
      .text("Probability of ...")
      .attr("x",(2.5*gwidth) / 5 + margin.left)
      .attr("y",(gheight + margin.top) / 2 + 30)
      //.attr('transform', "translate(" + ((1.5*gwidth) / 5 + margin.left) + ", " + ((gheight + margin.top) / 2 +60) + ")")
      .call(wrap,120);

    gsvg.append("text")
      .attr("id","kcsNotKnown")
      .attr("class","text-kc")
      .text("-")
      .attr('transform', "translate(" + ((3.5*gwidth) / 5 + margin.left) + ", " + ((gheight + margin.top) / 2 +30) + ")");

    gsvg.append("text")
      .attr("id","label-kcsNotKnown")
      .attr("class","label-kc")
      .text("New concepts")
      .attr("x",(3.5*gwidth) / 5 + margin.left)
      .attr("y",(gheight + margin.top) / 2 +40)
      //.attr('transform', "translate(" + ((1.5*gwidth) / 5 + margin.left) + ", " + ((gheight + margin.top) / 2 +60) + ")")
      .call(wrap,50);

    gsvg.append("text")
      .attr("id","kcsLearning")
      .attr("class","text-kc")
      .text("-")
      .attr('transform', "translate(" + ((2.45*gwidth) / 5 + margin.left) + ", " + ((gheight + margin.top) / 2 +30) + ")");

    gsvg.append("text")
      .attr("id","label-kcsNotLearning")
      .attr("class","label-kc")
      .text("Familiar concepts")
      .attr("x",(2.5*gwidth) / 5 + margin.left)
      .attr("y",(gheight + margin.top) / 2 +40)
      //.attr('transform', "translate(" + ((1.5*gwidth) / 5 + margin.left) + ", " + ((gheight + margin.top) / 2 +60) + ")")
      .call(wrap,50);

     gsvg.append("text")
      .attr("id","kcsKnown")
      .attr("class","text-kc")
      .text("-")
      .attr('transform', "translate(" + ((1.5*gwidth) / 5 + margin.left) + ", " + ((gheight + margin.top) / 2 +30) + ")");

     gsvg.append("text")
      .attr("id","label-kcsKnown")
      .attr("class","label-kc")
      .text("Known concepts")
      .attr("x",(1.4*gwidth) / 5 + margin.left)
      .attr("y",(gheight + margin.top) / 2 +40)
      //.attr('transform', "translate(" + ((1.5*gwidth) / 5 + margin.left) + ", " + ((gheight + margin.top) / 2 +60) + ")")
      .call(wrap,50);

    

      // @@@@ JULIO
  if((state.args.impactMsg || state.args.difficultyMsg) && state.args.uiShowHelp){
      
    arc3 = d3.svg.arc().outerRadius(gradius - chartInset).innerRadius(gradius - chartInset - gbarWidth);
    arc2 = d3.svg.arc().outerRadius(gradius - chartInset).innerRadius(gradius - chartInset - gbarWidth);
    arc1 = d3.svg.arc().outerRadius(gradius - chartInset).innerRadius(gradius - chartInset - gbarWidth);

    needle = new Needle(chart);
    needle.render();
    repaintGauge(0.5);

    var gaugeWidth=d3.select("#gauge").node().getBoundingClientRect().width;

    gsvg.append("text")
      .attr("id","easy")
      .attr("class","exp-label-kc")
      .attr("x",gwidth/2-gaugeWidth/2-15)
      .attr("y",(gheight + margin.top) / 2 -50)
      .text(function(d){
        // if(state.args.difficultyMsg){
        //   return "easy";
        // }
        // if(state.args.impactMsg){
        //   return "learn less";
        // }
        return "Low";
      })
      .attr('transform', function(d){
        // if(state.args.difficultyMsg){
        //   return "translate(" + ((1.65*gwidth) / 5 + margin.left) + ", " + 40 + ") rotate(305)"
        // }
        // if(state.args.impactMsg){
        //   return "translate(" + ((1.10*gwidth) / 5 + margin.left) + ", " + 55 + ")";
        // }
        return "translate(0, " + 55 + ")";
      })
      .call(wrap,30);

    // if(state.args.difficultyMsg){
    //   gsvg.append("text")
    //   .attr("id","medium")
    //   .attr("class","exp-label-kc")
    //   .text("medium")
    //   .attr('transform', "translate(" + ((2.2*gwidth) / 5 + margin.left) + ", " + 6 + ")");
    // }
    

    gsvg.append("text")
      .attr("id","hard")
      .attr("class","exp-label-kc")
      .attr("x",gwidth/2+gaugeWidth/2+15)
      .attr("y",(gheight + margin.top) / 2 -50)
      .text(function(d){
        // if(state.args.difficultyMsg){
        //   return "hard";
        // }
        // if(state.args.impactMsg){
        //   return "learn more";
        // }
        return "High";
      })
      .attr('transform', function(d){
        // if(state.args.difficultyMsg){
        //   return "translate(" + ((3.15*gwidth) / 5 + margin.left) + ", " + 25 + ") rotate(55)";
        // }
        // if(state.args.impactMsg){
        //   return "translate(" + ((3.25*gwidth) / 5 + margin.left) + ", " + 55 + ")";
        // }
        return "translate(0," + 55 + ")";
      })
      .call(wrap,30);
    //needle.moveTo(0.5);

    gsvg.
        append("g").
        attr("class", "helpButton").
        attr("id","helpButton-gauge").
        attr("helpId","activity-gauge").
        attr("serieId","").
        attr("cursor","pointer"). 
        style("opacity", "0.7").
        on("click",function() {
            d3.event.stopPropagation();
            var origin = "activity-gauge";
            helpDialogShow(origin,d3.mouse(document.body)[0],d3.mouse(document.body)[1]+57);
            
        }).
        on("mouseover",function () {d3.select(this).style("opacity","1");}).
        on("mouseout",function () {d3.select(this).style("opacity","0.7");}).
        append("image").
        attr("x",gwidth/2+gaugeWidth/2 + 30).
        attr("y",(gheight + margin.top) / 2 -40).
        attr("width", 22).
        attr("height", 19).
        attr("xlink:href","img/help.png");

    }

}

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em")
                        .style("text-anchor","middle");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .style("text-anchor","middle")
                            .text(word);
            }
        }
    });
}

//added by jbarriapineda
function reorderBipartiteBars(){
  getOrderMap();

  var barWidth=(barChartRightPos-barChartLeftPos)/sorted_kcs.length;///idArray.length;  //commented by jbarriapineda
              barWidth = Math.floor(barWidth);

  var nodename = d3.selectAll(".nodename")
            .transition()
            .duration(300)
            .attr("transform", function(d,i) {
                var transform = d3.transform(d3.select(this).attr("transform"));
                var current_x = transform.translate[0];
                var current_y = transform.translate[1];
                return "translate("+((barWidth+barSeparation)*(orderMap[d.id])+barChartLeftPos )+", "+current_y+") rotate(45)";         
            });

  var userbar = d3.selectAll("g.bar")
                .transition()
                .duration(300)
                .attr("transform", function(d) {
                  var transform = d3.transform(d3.select(this).attr("transform"));
                  var current_x = transform.translate[0];
                  var current_y = transform.translate[1];

                  return "translate("+((barWidth+barSeparation)*orderMap[d.id]+barChartLeftPos)+","+current_y+")";
              });

  var groupbar = d3.selectAll("g.groupbar")
                .transition()
                .duration(300)
                .attr("transform", function(d) {
                    var transform = d3.transform(d3.select(this).attr("transform"));
                    var current_x = transform.translate[0];
                    var current_y = transform.translate[1];

                    return "translate("+((barWidth+barSeparation)*orderMap[d.id]+barChartLeftPos)+","+ current_y +")"; });
                
                
}

//added by jbarriapineda
function redrawBipartite(){
  $("svg#conceptVisSvg").remove();
  $("#kcmap-group-selection").remove();
  if(uiCMVisId=="bipartite"){
    $.get( "http://pawscomp2.sis.pitt.edu/bn_general/StudentModelCache?usr="+state.curr.usr+"&grp="+state.curr.grp, function(kcs_data) {
      var item_kc_estimates = kcs_data["item-kc-estimates"]
      for (var i=0;i<item_kc_estimates.length;i++){
        var kc_name = item_kc_estimates[i]["name"];
        kcs_estimates[kc_name] = item_kc_estimates[i]["p"];
        var kc_obj = data.kcs.find(kc => {
          return kc.n === kc_name
        });
        if(kc_obj){
          map_kcs_id_info[kc_obj.id] = kc_obj;
        }
      }
      initBipartite();
      // if(state.args.kcMap && state.args.kcMap.indexOf("bipartite") >= 0){
      //   var kcMap = "bipartite";
      //   uiCMVisId = kcMap;
      //   //uiCMVisId = "interactivecm";
      //   //$('#checkbox-'+kcMap).prop('checked', true);
      //   inituiCMVis(CONST.vis.gridAbs,uiCMVisId);
      // }
    }, "json" );
  }
}

//added by @Jordan, convert topic names to the one present in course id=351
function correctTopicName(topic){
  switch (topic) {
    case "ArrayList":
        topic = "ArrayLists";
        break;
    case "Variables":
        topic = "Variables and Operations";
        break;
    case "Arithmetic_Operations":
        topic = "Variables and Operations";
        break;
    case "Primitive_Data_Types":
        topic = "Variables and Operations";
        break;
    case "Constants":
        topic = "Variables and Operations";
        break;
    case "Objects":
        topic = "Objects and Classes";
        break;
    case "Classes":
        topic = "Objects and Classes";
        break;
    case "Boolean_Expressions":
        topic = "Boolean Expressions";
        break;
    case "Logical operations":
        topic = "Boolean Expressions";
        break;
    case "Loops_while":
        topic = "While Loops";
        break;
    case "Loops_do_while":
        topic = "While Loops";
        break;
    case "Loops_for":
        topic = "For Loops";
        break;
    case "Nested_Loops":
        topic = "Nested Loops";
        break;
    case "Decisions":
        topic = "If-Else";
        break;
    case "Two-dimensional_Arrays":
        topic = "Two-Dimensional Arrays";
        break;
  }
  return topic;
}

//added by @Jordan, convert topic names to the one present in course id=351
function correctTopicNameMemphis(topic){
  switch (topic) {
    case "ArrayList":
        topic = "ArrayLists";
        break;
    case "Variables":
        topic = "Variables";
        break;
    case "Arithmetic_Operations":
        topic = "Expressions";
        break;
    case "Primitive_Data_Types":
        topic = "Primitive Data Types";
        break;
    case "Constants":
        topic = "Constants";
        break;
    case "Objects":
        topic = "Objects and Classes";
        break;
    case "Classes":
        topic = "Objects and Classes";
        break;
    case "Boolean_Expressions":
        topic = "Logical operations";
        break;
    case "Loops_while":
        topic = "While Loops";
        break;
    case "Loops_do_while":
        topic = "While Loops";
        break;
    case "Loops_for":
        topic = "For Loops";
        break;
    case "Nested_Loops":
        topic = "Nested Loops";
        break;
    case "Decisions":
        topic = "If-Else";
        break;
    case "Two-dimensional_Arrays":
        topic = "Two-Dimensional Arrays";
        break;
  }
  return topic;
}