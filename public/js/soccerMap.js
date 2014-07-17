// Generated by CoffeeScript 1.7.1

/* SOCCERMAP CLASS */

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.SoccerMap = (function(_super) {
    var curve, data, field;

    __extends(SoccerMap, _super);

    curve = tageswoche.curve;

    field = tageswoche.field;

    data = tageswoche.data;

    function SoccerMap(container, settings) {
      var height, self, width;
      this.container = container;
      this.settings = settings != null ? settings : {};
      self = this;
      width = $("#scenes").width();
      field.scale = width / field.originalWidth;
      height = width / field.widthHeightRelation;
      SoccerMap.__super__.constructor.call(this, this.container, width, height);
      this.scene = void 0;
      this.actions = [];
      this.black = "#555555";
      this.red = "#EE402F";
      this.blue = "#0051A3";
      this.white = "#FFFFFF";
      this.darkGrey = "#333333";
      this.fcbAttributes = {
        fill: this.red,
        stroke: "",
        "stroke-width": 1.0,
        "stroke-linejoin": "round"
      };
      this.opponentAttributes = {
        fill: this.black,
        stroke: "",
        "stroke-width": 1.0,
        "stroke-linejoin": "round"
      };
      this.numberTextAttributes = {
        fill: "#FFFFFF",
        stroke: "none",
        font: '200 13px "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif'
      };
      this.circleRadius = 11;
      this.playerColor = this.red;
      this.playerAttributes = this.fcbAttributes;
      this.shadowOpacity = 0.5;
      this.initEvents();
      this.firstScene();
      $(window).resize((function(_this) {
        return function(event) {
          return _this.redrawField();
        };
      })(this));
    }

    SoccerMap.prototype.redrawField = function() {
      var height, width;
      width = $("#scenes").width();
      field.scale = width / field.originalWidth;
      height = width / field.widthHeightRelation;
      this.map.setSize(width, height);
      return this.draw();
    };

    SoccerMap.prototype.firstScene = function() {
      return data.loadScenes((function(_this) {
        return function(error, scenes) {
          var startDate;
          if (startDate = data.getStartDate()) {
            _this.scene = data.findScene(startDate);
          }
          _this.scene || (_this.scene = data.firstScene());
          return _this.draw();
        };
      })(this));
    };

    SoccerMap.prototype.nextScene = function() {
      this.scene = data.nextScene();
      return this.draw();
    };

    SoccerMap.prototype.previousScene = function() {
      this.scene = data.previousScene();
      return this.draw();
    };

    SoccerMap.prototype.nextGame = function() {
      var next;
      if (next = data.nextGameScene()) {
        this.scene = data.gotoScene(next.index);
        return this.draw();
      }
    };

    SoccerMap.prototype.previousGame = function() {
      var prev;
      if (prev = data.previousGameScene()) {
        this.scene = data.gotoScene(prev.index);
        return this.draw();
      }
    };

    SoccerMap.prototype.initEvents = function() {
      $("#next-scene").click((function(_this) {
        return function(event) {
          event.preventDefault();
          return _this.nextScene();
        };
      })(this));
      $("#prev-scene").click((function(_this) {
        return function(event) {
          event.preventDefault();
          return _this.previousScene();
        };
      })(this));
      $("#prev-game").click((function(_this) {
        return function(event) {
          event.preventDefault();
          return _this.previousGame();
        };
      })(this));
      $("#next-game").click((function(_this) {
        return function(event) {
          event.preventDefault();
          return _this.nextGame();
        };
      })(this));
      return $("#scene-list").on("click", "a", (function(_this) {
        return function(event) {
          var $this, scene, sceneIndex;
          event.preventDefault();
          $this = $(event.target);
          sceneIndex = $this.parent().data("sceneIndex");
          scene = data.scenes[sceneIndex];
          _this.scene = data.gotoScene(sceneIndex);
          return _this.draw();
        };
      })(this));
    };

    SoccerMap.prototype.fcbScene = function() {
      return this.scene.team.toLowerCase() === "fcb";
    };

    SoccerMap.prototype.draw = function() {
      var action, first, last, _i, _len, _ref;
      if (this.fcbScene()) {
        field.playDirection = "left";
        this.playerColor = this.red;
        this.playerAttributes = this.fcbAttributes;
      } else {
        field.playDirection = "right";
        this.playerColor = this.black;
        this.playerAttributes = this.opponentAttributes;
      }
      this.actions = this.scene.actions;
      _ref = this.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        first = action.positions[0];
        last = action.positions[action.positions.length - 1];
        if (action.positions.length > 1) {
          action.running = true;
        }
        action.start = field.calcPosition(first);
        action.end = action.running ? field.calcPosition(last) : action.start;
        if (action.penalty) {
          action.end = field.calcPenaltyPosition();
        }
      }
      this.map.clear();
      this.drawPasses();
      this.drawPositions();
      this.updateInfo();
      return this.sceneInfo();
    };

    SoccerMap.prototype.updateInfo = function() {
      var $gameLink, game, scene, sceneIndex, ul, _i, _len, _results;
      $("#scene-result .score").html(this.scene.score.replace("-", ":"));  
      var year,month,day;
      year = this.scene.date.substring(0,4);
      month = this.scene.date.substring(5,7);
      day = this.scene.date.substring(8,10);     
      $("#gamedate").text(day + "." + month + "." + year);
      $("#scene-result .left span").html("FCB");
      if (this.scene.opponent) {
        $("#scene-result .right span").html(this.scene.opponent.toUpperCase());
      }
      $("#prev-scene, #next-scene, #prev-game, #next-game").css("visibility", "visible");
      if (data.isLastScene()) {
        $("#next-scene").css("visibility", "hidden");
      }
      if (data.isFirstScene()) {
        $("#prev-scene").css("visibility", "hidden");
      }
      if (!data.nextGameScene()) {
        $("#next-game").css("visibility", "hidden");
      }
      if (!data.previousGameScene()) {
        $("#prev-game").css("visibility", "hidden");
      }
      game = data.games[this.scene.date];
      ul = $("#scene-list").html("");
      _results = [];
      for (_i = 0, _len = game.length; _i < _len; _i++) {
        sceneIndex = game[_i];
        scene = data.scenes[sceneIndex];
        $gameLink = $("<li><a href='' class='" + (scene === this.scene ? "active" : void 0) + "'>" + scene.minute + ".</a></li>");
        $gameLink.data("sceneIndex", sceneIndex);
        _results.push(ul.append($gameLink));
      }
      return _results;
    };

    SoccerMap.prototype.extractSceneInfo = function() {
      var assistAction, goalAction, length;
      length = this.actions.length;
      if (length) {
        goalAction = this.actions[length - 1];
        if (!goalAction.foul) {
          this.scene.goal = goalAction.name;
          if (goalAction.penalty) {
            this.scene.goal = "" + this.scene.goal + " (Penalty)";
          } else if (goalAction.directFreeKick) {
            this.scene.goal = "" + this.scene.goal + " (Freistoss direkt)";
          } else if (goalAction.indirectFreeKick) {
            this.scene.goal = "" + this.scene.goal + " (Freistoss indirekt)";
          }
          if (length > 1) {
            assistAction = this.actions[length - 2];
            if (!assistAction.foul && !this.otherTeamAction(assistAction)) {
              this.scene.assist = assistAction.name;
              if (assistAction.directFreeKick) {
                return this.scene.assist = "" + this.scene.assist + " (Freistoss direkt)";
              } else if (assistAction.indirectFreeKick) {
                return this.scene.assist = "" + this.scene.assist + " (Freistoss indirekt)";
              }
            }
          }
        }
      }
    };

    SoccerMap.prototype.otherTeamAction = function(action) {
      if (this.fcbScene()) {
        return !action.number;
      } else {
        return !!action.number;
      }
    };

    SoccerMap.prototype.sceneInfo = function() {
      var desc;
      this.extractSceneInfo();
      if (this.scene.team == "FCB") {
      desc = $("#scene-desc").html("").append("Tor " + this.scene.team + ":").append("<strong> " + this.scene.actions[this.scene.actions.length -1].fullname + "</strong>");
      }
      else {
	      desc = $("#scene-desc").html("").append("Tor " + this.scene.team + ":").append("<strong> " + this.scene.goal + "</strong>");
      }
      if (this.scene.assist) {
        return desc.append(" (Assist: <strong>" + this.scene.assist + ")</strong>");
      }
      console.log(this.scene);
    };

    SoccerMap.prototype.drawPasses = function() {
      var action, index, lastPosition, nextAction, _i, _len, _ref;
      lastPosition = void 0;
      _ref = this.actions;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        action = _ref[index];
        if (action.running) {
          this.drawSprint(action.start, action.end);
        }
        if (lastPosition) {
          this.addPass(lastPosition, action.start);
        }
        if (action.foul) {
          lastPosition = void 0;
        } else if (action.shot) {
          if (index + 1 < this.actions.length) {
            nextAction = this.actions[index + 1];
          }
          lastPosition = void 0;
          this.drawShot(action.end, action.shotTarget, nextAction != null ? nextAction.start : void 0);
        } else {
          lastPosition = action.end;
        }
      }
      if (lastPosition) {
        return this.drawGoal(lastPosition);
      }
    };

    SoccerMap.prototype.drawPositions = function() {
      var $circle, action, circle, currentAttributes, player, start, _i, _len, _ref, _results;
      _ref = this.actions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        currentAttributes = action.number ? this.fcbAttributes : this.playerAttributes;
        start = action.start;
        player = action.end;
        if (action.running) {
          this.map.circle(start.x, start.y, this.circleRadius * 0.5).attr(currentAttributes);
        }
        if (action.penalty || action.directFreeKick || action.indirectFreeKick) {
          currentAttributes = $.extend({}, currentAttributes, {
            stroke: this.white
          });
        }
        if (action.opponent) {
          currentAttributes = this.opponentAttributes;
        }
        circle = this.map.circle(player.x, player.y, this.circleRadius).attr(currentAttributes);
        $circle = jQuery(circle.node);
        $circle.attr("data-toggle", "tooltip");
        $circle.attr("title", action.fullname || action.name);
        $circle.tooltip({
          container: $('body'),
          trigger: 'hover'
        });
        _results.push(this.label({
          player: player,
          action: action
        }));
      }
      return _results;
    };

    SoccerMap.prototype.drawSprint = function(start, end) {
      var path;
      path = curve.wavy(start, end, "10%");
      return this.map.path(path).attr({
        fill: "",
        stroke: this.playerColor,
        "stroke-width": 2
      });
    };

    SoccerMap.prototype.addPass = function(start, end) {
      var endGap, length, path, startGap, subCurve;
      path = curve.curve(start, end, "10%", 0.6, "right");
      startGap = 0;
      endGap = 16;
      length = Raphael.getTotalLength(path);
      subCurve = Raphael.getSubpath(path, startGap, length - endGap);
      this.drawArrow(path, {
        length: length - endGap
      });
      return this.map.path(subCurve).attr({
        fill: "",
        stroke: this.white,
        "stroke-width": 2
      });
    };

    SoccerMap.prototype.drawGoal = function(start) {
      var end, scorePosition, yCorrection;
      scorePosition = this.scene.scorePosition.toLowerCase();
      end = field.goalPosition(scorePosition, 4);
      yCorrection = this.scene.highKick ? 14 : 3;
      return this.curveWithShadow({
        start: start,
        end: end,
        yCorrection: yCorrection,
        curvedness: '8%',
        arrow: true
      });
    };

    SoccerMap.prototype.drawShot = function(start, scorePosition, next) {
      var end, foot, yCorrection;
      end = field.goalPosition(scorePosition, 10, -8);
      foot = this.getFoot(start, end);
      yCorrection = this.scene.highKick ? 14 : 3;
      this.curveWithShadow({
        start: start,
        end: end,
        yCorrection: yCorrection,
        curvedness: '8%',
        strokeWidth: 2
      });
      if (next != null) {
        yCorrection = this.scene.highKick ? 14 : 3;
        return this.curveWithShadow({
          start: next,
          end: end,
          yCorrection: yCorrection,
          curvedness: '1%',
          strokeWidth: 2
        });
      }
    };

    SoccerMap.prototype.curveWithShadow = function(_arg) {
      var arrow, curvedness, end, endShadowX, endShadowY, foot, path, start, strokeWidth, xCorrection, yCorrection;
      start = _arg.start, end = _arg.end, yCorrection = _arg.yCorrection, foot = _arg.foot, curvedness = _arg.curvedness, arrow = _arg.arrow, strokeWidth = _arg.strokeWidth;
      foot = this.getFoot(start, end);
      if (curvedness == null) {
        curvedness = 0;
      }
      if (strokeWidth == null) {
        strokeWidth = 3;
      }
      xCorrection = field.playDirection === "right" ? -5 : 5;
      if (yCorrection == null) {
        yCorrection = this.scene.highKick ? 14 : 3;
      }
      endShadowX = end.x + (xCorrection * field.scale);
      endShadowY = end.y + (yCorrection * field.scale);
      path = curve.curve(start, {
        x: endShadowX,
        y: endShadowY
      }, curvedness, 0.6, foot);
      if (arrow) {
        this.drawArrow(path, {
          size: 10,
          pointyness: 0.3,
          strokeWidth: strokeWidth,
          color: this.darkGrey,
          opacity: this.shadowOpacity
        });
      }
      this.map.path(path).attr({
        fill: "",
        stroke: this.darkGrey,
        "stroke-width": strokeWidth,
        opacity: this.shadowOpacity
      });
      path = curve.curve(start, end, curvedness, 0.6, foot);
      if (arrow) {
        this.drawArrow(path, {
          size: 10,
          pointyness: 0.3,
          strokeWidth: strokeWidth
        });
      }
      return this.map.path(path).attr({
        fill: "",
        stroke: this.white,
        "stroke-width": strokeWidth
      });
    };

    SoccerMap.prototype.getFoot = function(start, end) {
      var foot;
      foot = start.y < end.y ? "left" : "right";
      if (field.playDirection === "right") {
        foot = foot === "left" ? "right" : "left";
      }
      return foot;
    };

    SoccerMap.prototype.drawArrow = function(path, _arg) {
      var arrowhead, base, color, length, opacity, pointyness, size, strokeWidth, tip;
      length = _arg.length, size = _arg.size, pointyness = _arg.pointyness, strokeWidth = _arg.strokeWidth, color = _arg.color, opacity = _arg.opacity;
      if (length == null) {
        length = Raphael.getTotalLength(path);
      }
      if (size == null) {
        size = 10;
      }
      if (pointyness == null) {
        pointyness = 0.3;
      }
      if (strokeWidth == null) {
        strokeWidth = 2;
      }
      if (color == null) {
        color = this.white;
      }
      if (opacity == null) {
        opacity = 1;
      }
      if ((length - size) > 5) {
        base = Raphael.getPointAtLength(path, length - size);
        tip = Raphael.getPointAtLength(path, length);
        arrowhead = curve.arrow(base, tip, pointyness);
        return this.map.path(arrowhead).attr({
          fill: "",
          stroke: color,
          "stroke-width": strokeWidth,
          opacity: opacity
        });
      }
    };

    SoccerMap.prototype.label = function(_arg) {
      var $text, action, player, text, x;
      player = _arg.player, action = _arg.action;
      x = player.x;
      if (action.number != null) {
        if (+action.number > 9 && +action.number < 20) {
          x -= 1;
        }
        text = this.map.text(x, player.y, action.number).attr(this.numberTextAttributes);
        $text = jQuery(text.node);
        $text.attr("data-toggle", "tooltip").attr("title", "test");
        $text.attr("title", action.fullname);
        return $text.tooltip({
          container: $('body'),
          trigger: 'hover'
        });
      }
    };

    return SoccerMap;

  })(RaphaelMap);

}).call(this);
