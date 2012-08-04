// Generated by CoffeeScript 1.3.3
(function() {

  this.tageswoche = this.tageswoche || {};

  tageswoche.data = (function() {
    var specialConditions;
    specialConditions = {
      fd: "Freistoss direkt",
      fi: "Freistoss indirekt",
      e: "Ecke",
      p: "Penalty",
      ps: "Penaltyschiessen",
      ew: "Einwurf",
      f: "Foul"
    };
    return {
      scenes: void 0,
      current: -1,
      nextScene: function() {
        if (this.current < (this.scenes.length - 1)) {
          this.current += 1;
        }
        return this.scenes[this.current];
      },
      previousScene: function() {
        if (this.current > 0) {
          this.current -= 1;
        }
        return this.scenes[this.current];
      },
      loadScenes: function(callback) {
        var data;
        data = [
          {
            score: "1:0",
            minute: 85,
            date: "01.06.2012",
            oponent: "GC",
            home: true,
            tournament: "l",
            actions: [
              {
                name: "Stocker",
                number: 5,
                start: "H1"
              }, {
                name: "Park",
                number: 8,
                start: "E1",
                end: "C10"
              }, {
                name: "Streller",
                number: 10,
                start: "E9",
                end: "A8"
              }, {
                name: "D. Degen",
                number: 7,
                start: "C7"
              }
            ]
          }, {
            score: "2:0",
            minute: 86,
            date: "01.06.2012",
            oponent: "GC",
            home: true,
            tournament: "l",
            actions: [
              {
                name: "Frei",
                number: 11,
                start: "H4",
                end: "F4"
              }, {
                name: "Park",
                number: 8,
                start: "E6"
              }, {
                name: "Frei",
                number: 11,
                start: "C5"
              }
            ]
          }
        ];
        this.scenes = data;
        console.log(this.scenes);
        return callback(void 0, data);
      }
    };
  })();

}).call(this);
