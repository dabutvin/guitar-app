var guitarApp = angular.module('guitar', []);

guitarApp.controller('mainController', ['$scope', '$http', function($scope, $http) {
    $scope.save = function() {
        $http({
            url: '/save',
            method: "POST",
            data: {
                    song: $scope.song
                  },
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).success(function (data, status, headers, config) {
                alert('success')
            }).error(function (data, status, headers, config) {
                $scope.status = status;
            });
    };
    $scope.startScroll = function() {
      $scope.isScrolling = true;
      $("body").animate(
        { scrollTop: $(document).height() - $(window).height()}, $scope.scrollDuration,
                    function () {
                      // Scoll done
                      $scope.isScrolling = false;
                      // have to apply since this is JQ callback and angarlar has no clue we are doing this
                      $scope.$apply();
                    });
    };
    $scope.stopScroll = function() {
      $("body").stop();
      $scope.isScrolling = false;
    };
    $scope.$watch('song.capo', function(newValue, oldValue) {
      $(".note").each(function() {
        var text = $(this).text();
        if(text) {
          $(this).text(updateNote(text, newValue - oldValue));
        }
      });
    });

    $scope.scrollDuration = 10000;
    $scope.isScrolling = false;
}]);

function updateNote(note, difference) {
  if(difference === 1) {
    if(note === "A") {
      note = "Bb";
    } else if (note === "Bb") {
      note = "B";
    } else if (note === "B") {
      note = "C";
    } else if (note === "C") {
      note = "C#";
    } else if (note === "C#") {
      note = "D";
    } else if (note === "D") {
      note = "Eb";
    } else if (note === "Eb") {
      note = "E";
    } else if (note === "E") {
      note = "F";
    } else if (note === "F") {
      note = "F#";
    } else if (note === "F#") {
      note = "G";
    } else if (note === "G") {
      note = "G#";
    } else if (note === "G#") {
      note = "A";
    }
  } else if(difference === -1) {
    if(note === "Bb") {
      note = "A";
    } else if (note === "B") {
      note = "Bb";
    } else if (note === "C") {
      note = "B";
    } else if (note === "C#") {
      note = "C";
    } else if (note === "D") {
      note = "C#";
    } else if (note === "Eb") {
      note = "D";
    } else if (note === "E") {
      note = "Eb";
    } else if (note === "F") {
      note = "E";
    } else if (note === "F#") {
      note = "F";
    } else if (note === "G") {
      note = "F#";
    } else if (note === "G#") {
      note = "G";
    } else if (note === "A") {
      note = "G#";
    }
  }

  return note;
}

guitarApp.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });

      element.bind("focus", function() {
        // want to highlight
      });
    }
  };
});