// Generated by CoffeeScript 1.7.1
(function() {
  this.tageswoche = this.tageswoche || {};

  tageswoche.tableData = (function() {
    var templates;
    templates = tageswoche.templates;
    return {
      statistics: {},
      filter: {},
      data: {},
      limit: 14,
      current: "top",
      init: function() {
        this.prepareTablesorter();
        this.initEvents();
        this.loadStatistics(this.filter, $.proxy(this.redrawTable, this));
        $("#location-filter").on("change", (function(_this) {
          return function(event) {
            var $this;
            $this = $(event.currentTarget);
            if (_this.filter == null) {
              _this.filter = {};
            }
            _this.filter.location = $this.val();
            return _this.loadStatistics(_this.filter, $.proxy(_this.redrawTable, _this));
          };
        })(this));
        $("#competition-filter").on("change", (function(_this) {
          return function(event) {
            var $this;
            $this = $(event.currentTarget);
            if (_this.filter == null) {
              _this.filter = {};
            }
            _this.filter.competition = $this.val();
            return _this.loadStatistics(_this.filter, $.proxy(_this.redrawTable, _this));
          };
        })(this));
        return $("#saison-filter").on("change", (function(_this) {
          return function(event) {
            var $this;
            $this = $(event.currentTarget);
            if (_this.filter == null) {
              _this.filter = {};
            }
            _this.filter.saison = $this.val();
            return _this.loadStatistics(_this.filter, $.proxy(_this.redrawTable, _this));
          };
        })(this));
      },
      redrawTable: function(data) {
        this.data = data;
        return this.drawTable(this.current);
      },
      getStatisticsForPopup: function() {
        return this.statistics["all"];
      },
      loadStatistics: function(filter, callback) {
        var filterString;
        filterString = "";
        if (filter.location) {
          filterString += "location=" + filter.location + "&";
        }
        if (filter.competition) {
          filterString += "competition=" + filter.competition + "&";
        }
        if (filter.saison) {
          filterString += "saison=" + filter.saison;
        }
        if (filterString === "") {
          filterString = "all";
        }
        if (this.statistics[filterString]) {
          callback(this.statistics[filterString]);
        } else {
          $.ajax({
            url: "http://tageswoche.herokuapp.com/fcb/statistics?" + filterString,
            dataType: "jsonp"
          }).done((function(_this) {
            return function(data) {
              _this.statistics[filterString] = data;
              return callback(data);
            };
          })(this));
        }
      },
      drawTable: function(tableName) {
        this.current = tableName;
        $("#table-nav li a.active").removeClass("active");
        $("#table-nav li a." + tableName + "-table").addClass("active");
        switch (tableName) {
          case "top":
            return this.showTopTable();
          case "games":
            return this.showGamesTable();
          case "scenes":
            return this.showScenesTable();
        }
      },
      showTopTable: function() {
        $("#stats").html(templates.table({
          players: this.data.list,
          lastUpdate: moment(this.data.lastUpdate),
          season: this.data.season
        }));
        return this.tablesorter();
      },
      showScenesTable: function() {
        $("#stats").html(templates.tableScenes({
          players: this.data.list
        }));
        return this.tablesorter();
      },
      showGamesTable: function() {
        var gameNames, totalValues;
        $("#stats").html(templates.tableGames({
          players: this.data.list,
          lastUpdate: moment(this.data.lastUpdate),
          season: this.data.season
        }));
        totalValues = _.chain(this.data.list[0].grades).map(function(gradeEntry) {
          return tageswoche.tableData.round(gradeEntry.gameAverageGrade);
        }).last(this.limit).value();
        gameNames = _.chain(this.data.list[0].grades).map(function(gradeEntry) {
          return gradeEntry.opponent;
        }).last(this.limit).value();
        $("#totalGrades").sparkline(totalValues, {
          type: 'bar',
          tooltipFormatter: function(sparklines, options, fields) {
            return "Gegner " + gameNames[fields[0].offset] + ": " + totalValues[fields[0].offset];
          },
          height: 15,
          barWidth: 12,
          barSpacing: 2,
          colorMap: {
            "": '#F6F6F6',
            "0": '#F6F6F6',
            "0.01:1": '#E92431',
            "1.01:2": '#EB4828',
            "2.01:3": '#F9892E',
            "3.01:4": '#EAE600',
            "4.01:5": '#7FC249',
            "5.01:6": '#1BA755'
          }
        });
        _.each($(".gradesList"), (function(_this) {
          return function(playerEntry, idx) {
            var $playerEntry, playerValues;
            $playerEntry = $(playerEntry);
            playerValues = _.chain(_this.data.list[idx].grades).map(function(gradeEntry) {
              return tageswoche.tableData.round(gradeEntry.grade);
            }).last(_this.limit).value();
            return $playerEntry.sparkline(playerValues, {
              type: 'bar',
              tooltipFormatter: function(sparklines, options, fields) {
                if (fields[0].value !== 0) {
                  return "<div style=\"padding-right: 10px\">\n  Gegner " + gameNames[fields[0].offset] + ". Note: " + fields[0].value + ". <br/>Mannschafts-Durchschnitt: " + totalValues[fields[0].offset] + "\n</div>";
                } else {
                  return "";
                }
              },
              tooltipContainer: $('#stats'),
              height: 15,
              barWidth: 12,
              barSpacing: 2,
              colorMap: {
                "": '#F6F6F6',
                "0": '#F6F6F6',
                "0.01:1": '#E92431',
                "1.01:2": '#EB4828',
                "2.01:3": '#F9892E',
                "3.01:4": '#EAE600',
                "4.01:5": '#7FC249',
                "5.01:6": '#1BA755'
              }
            });
          };
        })(this));
        return this.tablesorter();
      },
      prepareTablesorter: function() {
        $.tablesorter.addParser({
          id: 'position',
          is: function(s) {
            return false;
          },
          format: function(value) {
            return value = value.toLowerCase().replace(/tw/i, 4).replace(/ve/i, 3).replace(/mf/i, 2).replace(/st/i, 1);
          },
          type: 'numeric'
        });
        return $.tablesorter.addParser({
          id: 'reverse',
          is: function(s) {
            return false;
          },
          format: function(value) {
            if (value) {
              return -value;
            } else {
              return -10000000;
            }
          },
          type: 'numeric'
        });
      },
      sortBySurname: function(node) {
        var $node, buf;
        $node = $(node);
        if ($node.data('col') === 'player') {
          buf = $node.text().split(' ');
          return buf[buf.length - 1];
        } else {
          return $node.text();
        }
      },
      tablesorter: function() {
        var headers;
        headers = (function() {
          switch (this.current) {
            case "top":
              return {
                1: {
                  sorter: "position"
                }
              };
            case "games":
              return {
                1: {
                  sorter: "position"
                }
              };
            case "scenes":
              return {
                5: {
                  sorter: "reverse"
                }
              };
          }
        }).call(this);
        return $("#player-table").tablesorter({
          sortInitialOrder: "desc",
          rememberSorting: true,
          headers: headers,
          textExtraction: this.sortBySurname
        });
      },
      initEvents: function() {
        $("#stats").on("click", "td", (function(_this) {
          return function(event) {
            var $this;
            $this = $(event.currentTarget);
            if ($this.hasClass("top-table")) {
              return _this.drawTable("top");
            } else if ($this.hasClass("games-table")) {
              return _this.drawTable("games");
            } else if ($this.hasClass("scenes-table")) {
              return _this.drawTable("scenes");
            }
          };
        })(this));
        $("#stats").on("click", "th", (function(_this) {
          return function(event) {
            var $this;
            $this = $(event.currentTarget);
            $("#stats th").removeClass("active");
            return $this.addClass("active");
          };
        })(this));
        return $("#table-nav li a").on("click", (function(_this) {
          return function(event) {
            var $this;
            event.preventDefault();
            $this = $(event.currentTarget);
            if ($this.hasClass("top-table")) {
              return _this.drawTable("top");
            } else if ($this.hasClass("games-table")) {
              return _this.drawTable("games");
            } else if ($this.hasClass("scenes-table")) {
              return _this.drawTable("scenes");
            }
          };
        })(this));
      },
      totals: function(players) {
        var gameGrade, gameGrades, gradeSum, index, player, sum, _i, _len, _ref;
        sum = {
          played: 0,
          minutes: 0,
          grades: [],
          goals: 0,
          assists: 0,
          yellowCards: 0,
          yellowRedCards: 0,
          redCards: 0,
          gameAverageGrades: []
        };
        gameGrades = [];
        for (_i = 0, _len = players.length; _i < _len; _i++) {
          player = players[_i];
          sum.played += +player.played;
          sum.minutes += +player.minutes;
          if (player.averageGrade > 0) {
            sum.grades.push(player.averageGrade);
          }
          sum.goals += +player.goals;
          sum.assists += +player.assists;
          sum.yellowCards += +player.yellowCards;
          sum.yellowRedCards += +player.yellowRedCards;
          sum.redCards += +player.redCards;
          _ref = player.grades;
          for (index in _ref) {
            gameGrade = _ref[index];
            if (gameGrades[index] === void 0) {
              gameGrades[index] = [];
            }
            gameGrades[index].push(gameGrade);
          }
        }
        gradeSum = _.reduce(sum.grades, function(sum, grade) {
          return sum += grade;
        }, 0);
        sum.averageGrade = tageswoche.tableData.round(gradeSum / sum.grades.length);
        return sum;
      },
      aboveNull: function(value) {
        var number;
        number = +value;
        if (number && number > 0 && _.isFinite(number)) {
          return number;
        } else {
          return "";
        }
      },
      round: function(value) {
        return Math.round(value * 10) / 10;
      },
      aboveNullRounded: function(value) {
        return this.aboveNull(this.round(value));
      }
    };
  })();

}).call(this);
