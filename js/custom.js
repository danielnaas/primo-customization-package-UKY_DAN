(function(){
"use strict";
"use strict";

var app = angular.module("viewCustom", ["angularLoad", "allNewBooks", "virtualCard", "requestTweaks", "gobiDda"]);

var addBarcodeFont = document.createElement("link");
addBarcodeFont.href = "https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap";
addBarcodeFont.rel = "stylesheet";
document.head.appendChild(addBarcodeFont);

  // New Books Link in Collection Discovery
  angular.module('allNewBooks', [])
  .component('prmGalleryItemsListAfter', {
      bindings: { parentCtrl: '<' },
      controller: 'prmGalleryItemsListAfterController',
      template: '<div layout="row" layout-align="center center" ng-hide="$ctrl.searchInProgress" (click)="$ctrl.browseAll()" class="padding-top-large layout-align-center-center layout-row" aria-hidden="false"><button class="button-confirm button-large md-button md-primoExplore-theme md-ink-ripple" type="button">Browse All New Books<div class="md-ripple-container" style=""></div></button></div>'
  }).controller('prmGalleryItemsListAfterController', ['$scope', function ($scope) {
    var self = this;
    self.$onInit = function () {
      let collectionId = self.parentCtrl.collectionId;
      console.log("current collection: " + collectionId);
      if (collectionId == '81447157360002636') {
          self.hyperlink = 'https://saalck-uky.primo.exlibrisgroup.com/discovery/search?query=any,contains,%3F&tab=LibraryCatalog&search_scope=MyInstitution&sortby=date_d&vid=01SAA_UKY:UKY&facet=rtype,include,books&facet=searchcreationdate,include,2023%7C,%7C2023&lang=en&offset=0&came_from=sort';
      }

      self.browseAll = browseAll;

      function browseAll() {
        window.location = self.hyperlink;
      }
    }
}])


// This works
function expandHoldings(app) {
  app.component("prmLocationHoldingsAfter", {
    bindings: {
      parentCtrl: "<"
    },
    controller: [function () {
      var ctrl = this;

      this.$onInit = function () {
        {
          ctrl.parentCtrl.summaryLinesVisible = true;
        }
      };
    }]
  });
}

expandHoldings(app);

function expandFilter(app) {
  app.component("prmLocationsAfter", {
    bindings: {
      parentCtrl: "<"
    },
    controller: [function () {
      var ctrl = this;

      this.$onInit = function () {
        {
          ctrl.parentCtrl.isLocationsFilterVisible = true;
        }
      };
    }]
  });
}

expandFilter(app);

function expandFilterItems(app) {
  app.component("prmResourceRecommenderAfter", {
    bindings: {
      parentCtrl: "<"
    },
    controller: [function () {
      var ctrl = this;

      this.$onInit = function () {
        {
          console.log("filter function triggered");
          //ctrl.isLocationsFilterVisible = true;
          //ctrl.parentCtrl.isLocationsFilterVisible = true;
          //ctrl.parentCtrl.isExpandAll = true;
          //ctrl.parentCtrl.unfilteredLoc.isExpandAll = true;
          ctrl.parentCtrl.previewResources = ctrl.parentCtrl.RecommendedResources;
          console.log(this);
        }
      };
    }]
  });
}

expandFilterItems(app);

angular.module('virtualCard', []).component('prmPersonalInfoAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'prmPersonalInfoAfterController',
  template: "<div>\n                  <md-card class=\"default-card card-with-header-actions _md md-primoExplore-theme flex-xs-100 flex-sm-100 flex\">\n                    <md-card-content class=\"layout-wrap layout-row\">\n                    <p><img src=\"https://mezzo.uky.edu/ukamapi/Image/Get/{{$ctrl.userId}}\" width=\"100\"><br/></p>\n                    <p style=\"margin-left: 25px\">Name: {{$ctrl.displayName}}<br>\n                    <span style=\"font-size: 3em; font-family: 'Libre Barcode 39', cursive;\"><br>*{{$ctrl.userId}}*</span></p>\n                    </md-card>\n                  </md-card>\n                 </div>"
}).controller('prmPersonalInfoAfterController', ['$scope', function ($scope) {
  this.$onInit = function () {
    var ctrl = this;
    console.log("card triggered");
    console.log($scope);
    var rootScope = $scope.$root;
    var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
    var jwtData = uSMS.jwtUtilService.getDecodedToken();
    console.log(jwtData['displayName']);
    ctrl.displayName = jwtData['displayName'];
    ctrl.userId = jwtData['userName'];
    console.log(ctrl.userId);
  };
}]);
///////////////////////////////
// Adjusting Book Express request form to only show
// the generic checkbox when the pickup location
// is set to Young (for the smart lockers)
angular.module('requestTweaks', []).component('prmRequestAfter', {
  bindings: {
    parentCtrl: '<'
    },
    controller: function controller($document, $scope) {
      this.$onInit = function () {
        this.$doCheck = () => {
          let pickupLocation = '';
          let genericCheckbox = '';

          // adjusting the generic checkbox so it only shows up for pickup location Young
          if (document.querySelector("#mandatory_pickupLocation span[role='button']")) {
            pickupLocation = document.querySelector("#mandatory_pickupLocation span[role='button']");
            genericCheckbox = document.querySelector('#form_field_checkbox_genericCheckBox')

            if (pickupLocation.textContent == "Young Library") {
              console.log('presented checkbox');
              console.log(pickupLocation.textContent);
              //console.log($scope);
              genericCheckbox.style.display = "";
              } else {
                genericCheckbox.style.display = "none";
              };
          };

          // 
        };
      };
}});
///////////////////////////////
// GOBI DDA: Present the hand waving link mentioning the request option
  app.component('prmSearchResultAvailabilityLineAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchResultAvailabilityLineAfterController',
    template: '<gobi-message></gobi-message>'
});

app.controller('prmSearchResultAvailabilityLineAfterController', function ($scope) {
    this.$onInit = function () {
      {
        this.gobiMessageCheck = false;
        // working on this undefined business
        const display = $scope.$ctrl.parentCtrl.result.pnx.display;
        //console.log(display);
        let lds36 = "";
        if(display.lds36) {  
          //console.log("UNDEFINED TEST: VALUE EXISTS");
          lds36 = display.lds36[0];
        } else {
          //console.log("UNDEFINED TEST: VALUE DOES NOT EXIST");
        }
        //console.log("checking lds36");
        //console.log(lds36);
        if(lds36 == "GOBI on-demand") {
          this.gobiMessageCheck = true;
        }
        console.log("brief line triggered");
      }
    };
  });

///////////////////////////////////////////////////////////
// Here is all the GOBI DDA stuff  
angular.module('gobiDda', []).component('gobiMessage', {
  bindings: { parentCtrl: '<' },
  template: '<div ng-if="$ctrl.gobiMessageCheck"><a href="">👋 Let us buy this for you.  Please sign in and submit a purchase request.</a></div>',
  controller: function controller($scope) {
  // this part checks for a specific lds that I mapped MARC 909 to (36 in production, 21 in sandbox)
    this.$onInit = function () {
      {
        console.log("CONTROLLER: gobiMessage controller triggered");
        this.gobiMessageCheck = false;
        //console.log("SCOPE: ");
        //console.log($scope);
        const display = $scope.$parent.$ctrl.parentCtrl.result.pnx.display;
        //console.log(display);
        let gobiLds = "";
        if(display.lds36) {  
          //console.log("UNDEFINED TEST: VALUE EXISTS");
          gobiLds = display.lds36[0];
        } else {
          //console.log("UNDEFINED TEST: VALUE DOES NOT EXIST");
        }
        //console.log("checking lds21");
        //console.log(lds21);
        if(gobiLds == "GOBI on-demand") {
          this.gobiMessageCheck = true;
          console.log("RESULT: GOBI DDA item found");
        }
        //console.log("CHECKING gobiMessageCheck: " + this.gobiMessageCheck);
      }
    };
  }}).component('almaHowovpAfter', {
    bindings: {
      parentCtrl: '<',
    },
    controller: function controller($document, $scope) {
      this.$onInit = function () {
        console.log("CONTROLLER: almaHowovpAfter controller triggered");
        //console.log($scope);
        let gobiLds = "";
        try {
          // lds21 in sandbox, lds 36 in production
          gobiLds = $scope.$ctrl.parentCtrl.item.pnx.display.lds36;
        } catch(e) {
        }
        let gobiCheck = false;
        if (gobiLds == "GOBI on-demand") {
          gobiCheck = true;
          console.log("RESULT: GOBI DDA item found, removing ILL");
        }
        if (gobiCheck) {
          this.$doCheck = function () {
              let almaOvp = $document[0].querySelectorAll('alma-howovp > div');
              //console.log(almaOvp);
              if(almaOvp[1]) {
                almaOvp[1].style.display = "none";
              } 
            }
          };
        };
      }
    }
  );
 
///////////////// End of GOBI Ddda  
})();