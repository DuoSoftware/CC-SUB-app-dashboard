(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', ['$scope', '$http', '$cookies', '$filter', '$timeout', '$charge', '$interval', DashboardController]);

  /** @ngInject */
  function DashboardController($scope, $http, $cookies, $filter, $timeout, $charge, $interval) {
    var vm = this;
    vm.interactionOn = true;

    $scope.chartsList = {};
    var cook = $cookies.get('securityToken');

    function gst(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      //debugger;
      return null;
    }

    function parseJwt(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }

    function getIdTokenForServices(callback) {
      var _st = gst("securityToken");
      callback((_st != null) ? _st : ""); //"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImdmSUtJSC15WjNwaFJIUnlqbnNISXFaTWFlUExHQUVMelBhdDBDTlk0c0EifQ";
    }

    $charge.settingsapp().getDuobaseValuesByTableName("CTS_GeneralAttributes").success(function (data) {
      $scope.currency = data[0].RecordFieldData;
    }).error(function (res) {
      $scope.currency = 'USD';
    });

    /** Cookie extraction */
    $scope.isSuperAdmin = gst('isSuperAdmin');
    var category = gst('category');
    var domain = gst('currentDomain');
    var idToken = gst('securityToken');
    var oid = parseJwt(idToken).oid;
    domain == null ? domain = gst('domain') : null;
    /** Cookie extraction - END */

    $scope.contentHeight = window.innerHeight - 55;

    $scope.baseUrl = "";
    $scope.superURL = "";

    var revenurByProductURL = null;
    var revenurByCustomersURL = null;
    var ReceiptsRevenueURL = null;
    var invoiceRevenueURL = null;
    var ReceiptsRevenueYearURL = null;
    var invoiceRevenueYearURL = null;

    var countries = [{
      "code": "AF",
      "value": 0,
      "name": "Afghanistan"
    }, {
      "code": "AL",
      "value": 0,
      "name": "Albania"
    }, {
      "code": "DZ",
      "value": 0,
      "name": "Algeria"
    }, {
      "code": "AS",
      "value": 0,
      "name": "American Samoa"
    }, {
      "code": "AD",
      "value": 0,
      "name": "Andorra"
    }, {
      "code": "AO",
      "value": 0,
      "name": "Angola"
    }, {
      "code": "AI",
      "value": 0,
      "name": "Antigua and Barbuda"
    }, {
      "code": "AR",
      "value": 0,
      "name": "Argentina"
    }, {
      "code": "AM",
      "value": 0,
      "name": "Armenia"
    }, {
      "code": "AW",
      "value": 0,
      "name": "Aruba"
    }, {
      "code": "AU",
      "value": 0,
      "name": "Australia"
    }, {
      "code": "AT",
      "value": 0,
      "name": "Austria"
    }, {
      "code": "AZ",
      "value": 0,
      "name": "Azerbaijan"
    }, {
      "code": "BS",
      "value": 0,
      "name": "Bahamas, The"
    }, {
      "code": "BH",
      "value": 0,
      "name": "Bahrain"
    }, {
      "code": "BD",
      "value": 0,
      "name": "Bangladesh"
    }, {
      "code": "BB",
      "value": 0,
      "name": "Barbados"
    }, {
      "code": "BY",
      "value": 0,
      "name": "Belarus"
    }, {
      "code": "BE",
      "value": 0,
      "name": "Belgium"
    }, {
      "code": "BZ",
      "value": 0,
      "name": "Belize"
    }, {
      "code": "BJ",
      "value": 0,
      "name": "Benin"
    }, {
      "code": "BM",
      "value": 0,
      "name": "Bermuda"
    }, {
      "code": "BT",
      "value": 0,
      "name": "Bhutan"
    }, {
      "code": "BO",
      "value": 0,
      "name": "Bolivia"
    }, {
      "code": "BA",
      "value": 0,
      "name": "Bosnia and Herzegovina"
    }, {
      "code": "BW",
      "value": 0,
      "name": "Botswana"
    }, {
      "code": "BR",
      "value": 0,
      "name": "Brazil"
    }, {
      "code": "BN",
      "value": 0,
      "name": "Brunei Darussalam"
    }, {
      "code": "BG",
      "value": 0,
      "name": "Bulgaria"
    }, {
      "code": "BF",
      "value": 0,
      "name": "Burkina Faso"
    }, {
      "code": "BI",
      "value": 0,
      "name": "Burundi"
    }, {
      "code": "KH",
      "value": 0,
      "name": "Cambodia"
    }, {
      "code": "CM",
      "value": 0,
      "name": "Cameroon"
    }, {
      "code": "CA",
      "value": 0,
      "name": "Canada"
    }, {
      "code": "CV",
      "value": 0,
      "name": "Cape Verde"
    }, {
      "code": "KY",
      "value": 0,
      "name": "Cayman Islands"
    }, {
      "code": "CF",
      "value": 0,
      "name": "Central African Republic"
    }, {
      "code": "TD",
      "value": 0,
      "name": "Chad"
    }, {
      "code": "CL",
      "value": 0,
      "name": "Chile"
    }, {
      "code": "CN",
      "value": 0,
      "name": "China"
    }, {
      "code": "CO",
      "value": 0,
      "name": "Colombia"
    }, {
      "code": "KM",
      "value": 0,
      "name": "Comoros"
    }, {
      "code": "CD",
      "value": 0,
      "name": "Congo, Dem.Rep."
    }, {
      "code": "CG",
      "value": 0,
      "name": "Congo, Rep."
    }, {
      "code": "CR",
      "value": 0,
      "name": "Costa Rica"
    }, {
      "code": "CI",
      "value": 0,
      "name": "Cote d'Ivoire"
    }, {
      "code": "HR",
      "value": 0,
      "name": "Croatia"
    }, {
      "code": "CU",
      "value": 0,
      "name": "Cuba"
    }, {
      "code": "CW",
      "value": 0,
      "name": "Curacao"
    }, {
      "code": "CY",
      "value": 0,
      "name": "Cyprus"
    }, {
      "code": "CZ",
      "value": 0,
      "name": "Czech Republic"
    }, {
      "code": "DK",
      "value": 0,
      "name": "Denmark"
    }, {
      "code": "DJ",
      "value": 0,
      "name": "Djibouti"
    }, {
      "code": "DM",
      "value": 0,
      "name": "Dominica"
    }, {
      "code": "DO",
      "value": 0,
      "name": "Dominican Republic"
    }, {
      "code": "EC",
      "value": 0,
      "name": "Ecuador"
    }, {
      "code": "EG",
      "value": 0,
      "name": "Egypt, Arab Rep."
    }, {
      "code": "SV",
      "value": 0,
      "name": "El Salvador"
    }, {
      "code": "GQ",
      "value": 0,
      "name": "Equatorial Guinea"
    }, {
      "code": "ER",
      "value": 0,
      "name": "Eritrea"
    }, {
      "code": "EE",
      "value": 0,
      "name": "Estonia"
    }, {
      "code": "ET",
      "value": 0,
      "name": "Ethiopia"
    }, {
      "code": "FO",
      "value": 0,
      "name": "Faeroe Islands"
    }, {
      "code": "FJ",
      "value": 0,
      "name": "Fiji"
    }, {
      "code": "FI",
      "value": 0,
      "name": "Finland"
    }, {
      "code": "FR",
      "value": 0,
      "name": "France"
    }, {
      "code": "PF",
      "value": 0,
      "name": "French Polynesia"
    }, {
      "code": "GA",
      "value": 0,
      "name": "Gabon"
    }, {
      "code": "GM",
      "value": 0,
      "name": "Gambia, The"
    }, {
      "code": "GE",
      "value": 0,
      "name": "Georgia"
    }, {
      "code": "DE",
      "value": 0,
      "name": "Germany"
    }, {
      "code": "GH",
      "value": 0,
      "name": "Ghana"
    }, {
      "code": "GR",
      "value": 0,
      "name": "Greece"
    }, {
      "code": "GL",
      "value": 0,
      "name": "Greenland"
    }, {
      "code": "GD",
      "value": 0,
      "name": "Grenada"
    }, {
      "code": "GU",
      "value": 0,
      "name": "Guam"
    }, {
      "code": "GT",
      "value": 0,
      "name": "Guatemala"
    }, {
      "code": "GN",
      "value": 0,
      "name": "Guinea"
    }, {
      "code": "GW",
      "value": 0,
      "name": "Guinea-Bissau"
    }, {
      "code": "GY",
      "value": 0,
      "name": "Guyana"
    }, {
      "code": "HT",
      "value": 0,
      "name": "Haiti"
    }, {
      "code": "HN",
      "value": 0,
      "name": "Honduras"
    }, {
      "code": "HK",
      "value": 0,
      "name": "Hong Kong SAR, China"
    }, {
      "code": "HU",
      "value": 0,
      "name": "Hungary"
    }, {
      "code": "IS",
      "value": 0,
      "name": "Iceland"
    }, {
      "code": "IN",
      "value": 0,
      "name": "India"
    }, {
      "code": "ID",
      "value": 0,
      "name": "Indonesia"
    }, {
      "code": "IR",
      "value": 0,
      "name": "Iran, Islamic Rep."
    }, {
      "code": "IQ",
      "value": 0,
      "name": "Iraq"
    }, {
      "code": "IE",
      "value": 0,
      "name": "Ireland"
    }, {
      "code": "IM",
      "value": 0,
      "name": "Isle of Man"
    }, {
      "code": "IL",
      "value": 0,
      "name": "Israel"
    }, {
      "code": "IT",
      "value": 0,
      "name": "Italy"
    }, {
      "code": "JM",
      "value": 0,
      "name": "Jamaica"
    }, {
      "code": "JP",
      "value": 0,
      "name": "Japan"
    }, {
      "code": "JO",
      "value": 0,
      "name": "Jordan"
    }, {
      "code": "KZ",
      "value": 0,
      "name": "Kazakhstan"
    }, {
      "code": "KE",
      "value": 0,
      "name": "Kenya"
    }, {
      "code": "KI",
      "value": 0,
      "name": "Kiribati"
    }, {
      "code": "KP",
      "value": 0,
      "name": "Korea, Dem. Rep."
    }, {
      "code": "KR",
      "value": 0,
      "name": "Korea, Rep."
    }, {
      "code": "XK",
      "value": 0,
      "name": "Kosovo"
    }, {
      "code": "KW",
      "value": 0,
      "name": "Kuwait"
    }, {
      "code": "KG",
      "value": 0,
      "name": "Kyrgyz Republic"
    }, {
      "code": "LA",
      "value": 0,
      "name": "Lao PDR"
    }, {
      "code": "LV",
      "value": 0,
      "name": "Latvia"
    }, {
      "code": "LB",
      "value": 0,
      "name": "Lebanon"
    }, {
      "code": "LS",
      "value": 0,
      "name": "Lesotho"
    }, {
      "code": "LR",
      "value": 0,
      "name": "Liberia"
    }, {
      "code": "LY",
      "value": 0,
      "name": "Libya"
    }, {
      "code": "LI",
      "value": 0,
      "name": "Liechtenstein"
    }, {
      "code": "LT",
      "value": 0,
      "name": "Lithuania"
    }, {
      "code": "LU",
      "value": 0,
      "name": "Luxembourg"
    }, {
      "code": "MO",
      "value": 0,
      "name": "Macao SAR, China"
    }, {
      "code": "MK",
      "value": 0,
      "name": "Macedonia, FYR"
    }, {
      "code": "MG",
      "value": 0,
      "name": "Madagascar"
    }, {
      "code": "MW",
      "value": 0,
      "name": "Malawi"
    }, {
      "code": "MY",
      "value": 0,
      "name": "Malaysia"
    }, {
      "code": "MV",
      "value": 0,
      "name": "Maldives"
    }, {
      "code": "ML",
      "value": 0,
      "name": "Mali"
    }, {
      "code": "MT",
      "value": 0,
      "name": "Malta"
    }, {
      "code": "MH",
      "value": 0,
      "name": "Marshall Islands"
    }, {
      "code": "MR",
      "value": 0,
      "name": "Mauritania"
    }, {
      "code": "MU",
      "value": 0,
      "name": "Mauritius"
    }, {
      "code": "YT",
      "value": 0,
      "name": "Mayotte"
    }, {
      "code": "MX",
      "value": 0,
      "name": "Mexico"
    }, {
      "code": "FM",
      "value": 0,
      "name": "Micronesia, Fed. Sts."
    }, {
      "code": "MD",
      "value": 0,
      "name": "Moldova"
    }, {
      "code": "MC",
      "value": 0,
      "name": "Monaco"
    }, {
      "code": "MN",
      "value": 0,
      "name": "Mongolia"
    }, {
      "code": "ME",
      "value": 0,
      "name": "Montenegro"
    }, {
      "code": "MA",
      "value": 0,
      "name": "Morocco"
    }, {
      "code": "MZ",
      "value": 0,
      "name": "Mozambique"
    }, {
      "code": "MM",
      "value": 0,
      "name": "Myanmar"
    }, {
      "code": "NA",
      "value": 0,
      "name": "Namibia"
    }, {
      "code": "NP",
      "value": 0,
      "name": "Nepal"
    }, {
      "code": "NL",
      "value": 0,
      "name": "Netherlands"
    }, {
      "code": "NC",
      "value": 0,
      "name": "New Caledonia"
    }, {
      "code": "NZ",
      "value": 0,
      "name": "New Zealand"
    }, {
      "code": "NI",
      "value": 0,
      "name": "Nicaragua"
    }, {
      "code": "NE",
      "value": 0,
      "name": "Niger"
    }, {
      "code": "NG",
      "value": 0,
      "name": "Nigeria"
    }, {
      "code": "MP",
      "value": 0,
      "name": "Northern Mariana Islands"
    }, {
      "code": "NO",
      "value": 0,
      "name": "Norway"
    }, {
      "code": "OM",
      "value": 0,
      "name": "Oman"
    }, {
      "code": "PK",
      "value": 0,
      "name": "Pakistan"
    }, {
      "code": "PW",
      "value": 0,
      "name": "Palau"
    }, {
      "code": "PA",
      "value": 0,
      "name": "Panama"
    }, {
      "code": "PG",
      "value": 0,
      "name": "Papua New Guinea"
    }, {
      "code": "PY",
      "value": 0,
      "name": "Paraguay"
    }, {
      "code": "PE",
      "value": 0,
      "name": "Peru"
    }, {
      "code": "PH",
      "value": 0,
      "name": "Philippines"
    }, {
      "code": "PL",
      "value": 0,
      "name": "Poland"
    }, {
      "code": "PT",
      "value": 0,
      "name": "Portugal"
    }, {
      "code": "PR",
      "value": 0,
      "name": "Puerto Rico"
    }, {
      "code": "WA",
      "value": 0,
      "name": "Qatar"
    }, {
      "code": "RO",
      "value": 0,
      "name": "Romania"
    }, {
      "code": "RU",
      "value": 0,
      "name": "Russian Federation"
    }, {
      "code": "RW",
      "value": 0,
      "name": "Rwanda"
    }, {
      "code": "WS",
      "value": 0,
      "name": "Samoa"
    }, {
      "code": "SM",
      "value": 0,
      "name": "San Marino"
    }, {
      "code": "ST",
      "value": 0,
      "name": "Sao Tome and Principe"
    }, {
      "code": "SA",
      "value": 0,
      "name": "Saudi Arabia"
    }, {
      "code": "SN",
      "value": 0,
      "name": "Senegal"
    }, {
      "code": "RS",
      "value": 0,
      "name": "Serbia"
    }, {
      "code": "SC",
      "value": 0,
      "name": "Seychelles"
    }, {
      "code": "SL",
      "value": 0,
      "name": "Sierra Leone"
    }, {
      "code": "SG",
      "value": 0,
      "name": "Singapore"
    }, {
      "code": "SK",
      "value": 0,
      "name": "Slovak Republic"
    }, {
      "code": "SI",
      "value": 0,
      "name": "Slovenia"
    }, {
      "code": "SB",
      "value": 0,
      "name": "Solomon Islands"
    }, {
      "code": "SO",
      "value": 0,
      "name": "Somalia"
    }, {
      "code": "ZA",
      "value": 0,
      "name": "South Africa"
    }, {
      "code": "SS",
      "value": 0,
      "name": "South Sudan"
    }, {
      "code": "ES",
      "value": 0,
      "name": "Spain"
    }, {
      "code": "LK",
      "value": 0,
      "name": "Sri Lanka"
    }, {
      "code": "KN",
      "value": 0,
      "name": "St. Kitts and Nevis"
    }, {
      "code": "LC",
      "value": 0,
      "name": "St. Lucia"
    }, {
      "code": "MF",
      "value": 0,
      "name": "St. Martin (French part)"
    }, {
      "code": "VC",
      "value": 0,
      "name": "St. Vincent and the Grenadines"
    }, {
      "code": "SD",
      "value": 0,
      "name": "Sudan"
    }, {
      "code": "SR",
      "value": 0,
      "name": "Suriname"
    }, {
      "code": "SZ",
      "value": 0,
      "name": "Swaziland"
    }, {
      "code": "SE",
      "value": 0,
      "name": "Sweden"
    }, {
      "code": "CH",
      "value": 0,
      "name": "Switzerland"
    }, {
      "code": "SY",
      "value": 0,
      "name": "Syrian Arab Republic"
    }, {
      "code": "TJ",
      "value": 0,
      "name": "Tajikistan"
    }, {
      "code": "TZ",
      "value": 0,
      "name": "Tanzania"
    }, {
      "code": "TH",
      "value": 0,
      "name": "Thailand"
    }, {
      "code": "TP",
      "value": 0,
      "name": "Timor-Leste"
    }, {
      "code": "TG",
      "value": 0,
      "name": "Togo"
    }, {
      "code": "TO",
      "value": 0,
      "name": "Tonga"
    }, {
      "code": "TT",
      "value": 0,
      "name": "Trinidad and Tobago"
    }, {
      "code": "TN",
      "value": 0,
      "name": "Tunisia"
    }, {
      "code": "TR",
      "value": 0,
      "name": "Turkey"
    }, {
      "code": "TM",
      "value": 0,
      "name": "Turkmenistan"
    }, {
      "code": "TC",
      "value": 0,
      "name": "Turks and Caicos Islands"
    }, {
      "code": "TV",
      "value": 0,
      "name": "Tuvalu"
    }, {
      "code": "UG",
      "value": 0,
      "name": "Uganda"
    }, {
      "code": "UA",
      "value": 0,
      "name": "Ukraine"
    }, {
      "code": "AE",
      "value": 0,
      "name": "United Arab Emirates"
    }, {
      "code": "GB",
      "value": 0,
      "name": "United Kingdom"
    }, {
      "code": "US",
      "value": 0,
      "name": "United States"
    }, {
      "code": "UY",
      "value": 0,
      "name": "Uruguay"
    }, {
      "code": "UZ",
      "value": 0,
      "name": "Uzbekistan"
    }, {
      "code": "VU",
      "value": 0,
      "name": "Vanuatu"
    }, {
      "code": "VE",
      "value": 0,
      "name": "Venezuela, RB"
    }, {
      "code": "VN",
      "value": 0,
      "name": "Vietnam"
    }, {
      "code": "VI",
      "value": 0,
      "name": "Virgin Islands (U.S.)"
    }, {
      "code": "PS",
      "value": 0,
      "name": "West Bank and Gaza"
    }, {
      "code": "EH",
      "value": 0,
      "name": "Western Sahara"
    }, {
      "code": "YE",
      "value": 0,
      "name": "Yemen, Rep."
    }, {
      "code": "ZM",
      "value": 0,
      "name": "Zambia"
    }, {
      "code": "ZW",
      "value": 0,
      "name": "Zimbabwe"
    }];

    // Kasun_Wijeratne_6_SEP_2017
    $scope.dashboardFiltersOpen = false;
    $scope.filterTo = new Date();
    $scope.filterFrom = new Date($scope.filterTo.getFullYear(), $scope.filterTo.getMonth(), 1);
    $scope.openDashboardFilters = function () {
      $scope.dashboardFiltersOpen = !$scope.dashboardFiltersOpen;
    }
    $scope.setFilterFrom = function (date) {
      $timeout(function () {
        $scope.filterFrom = date;
      }, 0);
    };
    $scope.setFilterTo = function (date) {
      $timeout(function () {
        $scope.filterTo = date;
      }, 0);
    };
    // Kasun_Wijeratne_6_SEP_2017 - END

    //Kasun_Wijeratne_14_NOV_2017
    /** Draw graph
    /** This method will take graph url and inject set the src of the corresponding graph in the view **/
    function injectGraphs(URL, element) {
      document.getElementById(element).setAttribute('src', URL);
    }
    /** Draw graph - END **/
    //Kasun_Wijeratne_14_NOV_2017 - END

    $scope.categoryDashboards = [{
        title: 'Total subscriptions',
        value: 0,
        icon: 'total_sub',
        row: "1"
      },
      {
        title: 'Total invoiced',
        value: 0,
        icon: 'total_invoiced',
        row: "1"
      },
      {
        title: 'Total received',
        value: 0,
        icon: 'total_due',
        row: "1"
      },
      {
        title: 'Total customers',
        value: 0,
        icon: 'total_failed',
        row: "1"
      }
    ];
    var dashboardDataServices = {};
    $scope.profileByCountry = [];
    $scope.options = {
      chart: {
        type: 'pieChart',
        height: 380,
        donut: true,
        x: function (d) {
          return d.key;
        },
        y: function (d) {
          return d.y;
        },
        showLabels: true,
        duration: 500,
        labelThreshold: 0.01,
        // labelSunbeamLayout: true,
        legend: {
          margin: {
            top: 5,
            right: 35,
            bottom: 5,
            left: 0
          }
        }
      }
    };
    $scope.monthlyInverted = {
      text: 'This month sales',
      amount: 0
    };
    $scope.dailyInverted = {
      text: 'Today sales',
      amount: 0
    };
    $scope.yearlySalesExtra = 0;

    $scope.loadDashboard = function (primaryDateText, primaryDate, startDate, endDate) {
      if ($scope.isSuperAdmin == 'true') {
        $http.get('app/core/cloudcharge/js/config.json').then(function (data) {
          $scope.baseUrl = data.data.report.domain;
          var reportURL1 = $scope.baseUrl + "/reports/JS/viewer.php?";
          getIdTokenForServices(function (token) {
            var filters = "&startDate=" + $filter('date')($scope.filterFrom, 'yyyy-MM-dd') + "&endDate=" + $filter('date')($scope.filterTo, 'yyyy-MM-dd');
            var reportURL3 = "report=superAdminDashboardReport&idToken=" + token + "&domain=" + domain;
            $scope.dashboardURL = reportURL1 + reportURL3 + filters;
            document.getElementById('reportFram').setAttribute('src', $scope.dashboardURL)
            vm.interactionOn = false;
          });
        }, function (error) {
          console.log(error);
        });
        // $http.get('app/core/cloudcharge/js/reportList.json').then(function(data){
        // 	var reportURL1=$scope.baseUrl+"/reports/JS/viewer.php?";
        // 	angular.forEach(data.data.SuperAdmin.data, function (report) {
        // 		if(report.category == 'Dashboard'){
        // 			$scope.superURL = report.report.split('.')[0];
        // 			return -1;
        // 		}
        // 	});
        // 	//var reportURL2="&stimulsoft_report_key="+category;
        // 	getIdTokenForServices(function (token) {
        // 		var reportURL3="report="+$scope.superURL+"&idToken="+token;
        // 		$scope.dashboardURL=reportURL1+reportURL3;
        // 	});
        // }, function(errorResponse){
        // 	$scope.baseUrl="";
        // });
      } else {
        $scope.profileByCountry = [];
        $http.get('app/core/cloudcharge/js/config.json').then(function (data) {
          $scope.baseUrl = data.data.report.domain;
          dashboardDataServices = data.data.dashboard;

          var reportURL1 = $scope.baseUrl + "/reports/JS/viewer.php?";
          //var reportURL2="&stimulsoft_report_key="+category;

          //Kasun_Wijeratne_14_NOV_2017
          /** Load top row data **/
          $http({
            method: "POST",
            url: dashboardDataServices.getDashboardData,
            headers: {
              'Content-Type': 'application/json',
              'idToken': idToken,
              'domain': domain
            },
            data: {
              "category": "tenant",
              "daterange": primaryDate,
              "guAccountId": oid,
              "filter": primaryDateText
            }
          }).then(function (res) {
            angular.forEach(res.data.result, function (value) {
              // $scope.categoryDashboards[i].value = res.data.result[i].data;
              if (value.type == 'subscriptioncnt') {
                if (gst('category') == 'invoice') {
                  $scope.categoryDashboards[0].title = "Total orders";
                  $scope.categoryDashboards[0].value = value.data.value;
                } else if (gst('category') == 'subscription') {
                  $scope.categoryDashboards[0].value = value.data.value;
                }
              } else if (value.type == 'invoiceamt') {
                $scope.categoryDashboards[1].value = value.data.value;
              } else if (value.type == 'receiptamt') {
                $scope.categoryDashboards[2].value = value.data.value;
              } else if (value.type == 'profilecnt') {
                $scope.categoryDashboards[3].value = value.data.value;
              }
            });

            // if(gst('category') == 'invoice'){
            // 	angular.forEach($scope.categoryDashboards, function (value, index) {
            // 		if(value.title == 'Total subscriptions'){
            // 			value.splice(index, 1);
            // 		}
            // 	});
            // }else if(gst('category') == 'subscription'){
            // 	angular.forEach($scope.categoryDashboards, function (value, index) {
            // 		if(value.title == 'Total subscriptions'){
            // 			value.splice(index, 1);
            // 		}
            // 	});
            // }

          }, function (res) {
            notifications.toast("Error loading amounts", "error");
          });
          /** Load top row data - END **/

          /** Load profile data **/
          $http({
            method: "POST",
            url: dashboardDataServices.getDashboardData,
            headers: {
              'Content-Type': 'application/json',
              'idToken': idToken,
              'domain': domain
            },
            data: {
              "category": "country",
              "daterange": primaryDate,
              "guAccountId": oid,
              "filter": primaryDateText
            }
          }).then(function (res) {
            angular.forEach(res.data.result, function (data) {
              // $scope.profileByCountry.push({
              //   key: data.type + '(' + data.data.value + ')',
              //   y: data.data.value
              // });
              if (data.type == "") $scope.alienUses = data.data.value;
              angular.forEach(countries, function (c) {
                if(c.name == data.type){
                  c.value = data.data.value
                }
              });
            });
            Highcharts.mapChart('HCContainer', {

              chart: {
                map: 'custom/world',
                width: 500,
                height: 360
              },
              exporting: {
                enabled: false
              },
              title: {
                text: null
              },

              mapNavigation: {
                enabled: false
              },

              colorAxis: {
                min: 0,
                minColor: '#fff',
                maxColor: '#6a3390'
              },

              series: [{
                data: countries,
                name: 'Profiles',
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a2', 'code'],
                borderColor: 'black',
                borderWidth: 0.2,
                dataLabels: '{pointer.value}',
                nullColor: '#fff',
                states: {
                  hover: {
                    borderWidth: 1,
                    borderColor: '#6a3390',
                    color: '#e3baff'
                  }
                }
              }]
            });
          }, function (res) {
            notifications.toast("Error loading Profiles by Country", "error");
          });
          /** Load profile data **/
          //Kasun_Wijeratne_14_NOV_2017

          getIdTokenForServices(function (token) {
            var filters = "&startDate=" + startDate + "&endDate=" + endDate;

            // var reportURL3;
            // if(category == 'subscription'){
            // 	reportURL3="report=DashboardReport&idToken="+token+"&domain="+domain;
            // }else if(category == 'invoice'){
            // 	reportURL3="report=DashboardReport_invoiceModule&idToken="+token+"&domain="+domain;
            // }

            // revenurByProductURL = reportURL1 + "report=invoiceDashBoard_RevenueByInvoiceReceipt&idToken="+token+"&domain="+domain + filters;
            // injectGraphs(revenurByProductURL, 'RevenueByInvoice');

            if (primaryDateText == 'year') {

              revenurByProductURL = reportURL1 + "report=invoiceDashBoard_RevenueByInvoiceReceipt_year&idToken=" + token + "&domain=" + domain + filters;
              injectGraphs(revenurByProductURL, 'RevenueByInvoice');

              revenurByCustomersURL = reportURL1 + "report=invoiceDashBoard_ActivationSummary_year&idToken=" + token + "&domain=" + domain + filters;
              injectGraphs(revenurByCustomersURL, 'ActivationSummary');

              ReceiptsRevenueURL = reportURL1 + "report=invoiceDashboard_revenurByCustomers&idToken=" + token + "&domain=" + domain + filters;
              injectGraphs(ReceiptsRevenueURL, 'revenurByCustomers');

              invoiceRevenueURL = reportURL1 + "report=invoiceDashboard_invoiceRevenue_year&idToken=" + token + "&domain=" + domain + filters;
              injectGraphs(invoiceRevenueURL, 'invoiceRevenue');

              vm.interactionOn = false;
            } else {

              revenurByProductURL = reportURL1 + "report=invoiceDashBoard_RevenueByInvoiceReceipt&idToken=" + token + "&domain=" + domain + filters;
              injectGraphs(revenurByProductURL, 'RevenueByInvoice');

              revenurByCustomersURL = reportURL1 + "report=invoiceDashBoard_ActivationSummary&idToken=" + token + "&domain=" + domain + filters;
              injectGraphs(revenurByCustomersURL, 'ActivationSummary');

              ReceiptsRevenueURL = reportURL1 + "report=invoiceDashboard_revenurByCustomers&idToken=" + token + "&domain=" + domain + filters;
              injectGraphs(ReceiptsRevenueURL, 'revenurByCustomers');

              invoiceRevenueURL = reportURL1 + "report=invoiceDashboard_invoiceRevenue&idToken=" + token + "&domain=" + domain + filters;
              injectGraphs(invoiceRevenueURL, 'invoiceRevenue');
              vm.interactionOn = false;
            }

            // ReceiptsRevenueYearURL = reportURL1 + "report=invoiceDashboard_ReceiptsRevenue_year&idToken="+token+"&domain="+domain + filters;
            // injectGraphs(ReceiptsRevenueYearURL, 'ReceiptsRevenueYear');
            //
            // invoiceRevenueYearURL = reportURL1 + "report=invoiceDashboard_invoiceRevenue_year&idToken="+token+"&domain="+domain + filters;
            // injectGraphs(invoiceRevenueYearURL, 'invoiceRevenueYear');


            // $scope.dashboardURL=reportURL1+reportURL3+filters;
            // document.getElementById('reportFram').setAttribute('src',$scope.dashboardURL);
          });

        }, function (errorResponse) {
          $scope.baseUrl = "";
        });
      }
    };

    $scope.loadInvertedData = function (todayRange, monthRange) {
      $http.get('app/core/cloudcharge/js/config.json').then(function (data) {
        var tempDataServices = data.data.dashboard;
        $http({
          method: "POST",
          url: tempDataServices.getDashboardData,
          headers: {
            'Content-Type': 'application/json',
            'idToken': idToken,
            'domain': domain
          },
          data: {
            "category": "tenant",
            "daterange": todayRange.date,
            "guAccountId": oid,
            "filter": 'today'
          }
        }).then(function (res) {
          $scope.dailyInverted = {
            text: todayRange.text,
            amount: 0
          };
          angular.forEach(res.data.result, function (value) {
            if (value.type == 'invoiceamt') {
              $timeout(function () {
                $scope.dailyInverted.amount = value.data.value;
              });
            }
          });
        }, function (res) {
          notifications.toast("Error loading amounts", "error");
        });



        $http({
          method: "POST",
          url: tempDataServices.getDashboardData,
          headers: {
            'Content-Type': 'application/json',
            'idToken': idToken,
            'domain': domain
          },
          data: {
            "category": "tenant",
            "daterange": monthRange.date,
            "guAccountId": oid,
            "filter": 'month'
          }
        }).then(function (res) {
          $scope.monthlyInverted = {
            text: monthRange.text,
            amount: 0
          };
          angular.forEach(res.data.result, function (value) {
            if (value.type == 'invoiceamt') {
              $timeout(function () {
                $scope.monthlyInverted.amount = value.data.value;
              });
            }
          });
        }, function (res) {
          notifications.toast("Error loading amounts", "error");
        });


        var tempYear = $filter('date')(new Date(), 'yyyy');
        $http({
          method: "POST",
          url: tempDataServices.getDashboardData,
          headers: {
            'Content-Type': 'application/json',
            'idToken': idToken,
            'domain': domain
          },
          data: {
            "category": "tenant",
            "daterange": tempYear,
            "guAccountId": oid,
            "filter": 'year'
          }
        }).then(function (res) {
          angular.forEach(res.data.result, function (value) {
            if (value.type == 'invoiceamt') {
              $timeout(function () {
                $scope.yearlySalesExtra = value.data.value;
              });
            }
          });
        }, function (res) {
          notifications.toast("Error loading amounts", "error");
        });

      }, function () {});
    };

    // $scope.loadInvertedData('all', null, new Date());

    // Kasun_Wijeratne_11_OCT_2017
    $scope.filterSimple = 'today';
    var primaryDate = new Date();
    var startDate = new Date();
    var endDate = new Date();
    var yesterday = new Date();
    var lastMonth = new Date();
    var todayRange = {
      text: 'Today',
      date: $filter('date')(primaryDate, 'dd/MM/yyyy')
    };
    var monthsRange = {
      text: 'This month',
      date: $filter('date')(primaryDate, 'MM/yyyy')
    };
    $scope.updateSimpleFilter = function (filterTo) {
      $timeout(function () {
        $scope.filterSimple = filterTo;
      });
      var tempNewDate = new Date();
      var year = tempNewDate.getFullYear() - 1;
      var month = tempNewDate.getMonth() - 1;
      yesterday = new Date();
      lastMonth = new Date();

      todayRange = {
        text: 'Today sales',
        date: $filter('date')(primaryDate, 'dd/MM/yyyy')
      };
      monthsRange = {
        text: 'This month sales',
        date: $filter('date')(primaryDate, 'MM/yyyy')
      };

      if (filterTo == 'Today') {
        primaryDate = $filter('date')(tempNewDate, 'dd/MM/yyyy');
        startDate = $filter('date')(yesterday.setDate(tempNewDate.getDate() - 1), 'yyyy-MM-dd') + ' 12:00:01 AM';
        endDate = $filter('date')(yesterday.setDate(tempNewDate.getDate() - 1), 'yyyy-MM-dd') + ' 11:59:59 PM';
        $scope.loadDashboard('today', primaryDate, startDate, endDate);

        yesterday = $filter('date')(yesterday.setDate(tempNewDate.getDate() - 1), 'dd/MM/yyyy');
        // $scope.loadInvertedData('today', yesterday, tempNewDate);
        todayRange.text = 'Yesterday sales';
        todayRange.date = yesterday;
        $scope.loadInvertedData(todayRange, monthsRange);

      } else if (filterTo == 'This month') {
        primaryDate = $filter('date')(tempNewDate, 'MM/yyyy');
        var tempSetDate = new Date(tempNewDate.getFullYear(), month + 1, 0);
        startDate = $filter('date')(tempSetDate, 'yyyy-MM-dd');
        endDate = $filter('date')(tempNewDate, 'yyyy-MM-dd');
        $scope.loadDashboard('month', primaryDate, startDate, endDate);

        lastMonth = $filter('date')(lastMonth.setMonth(tempNewDate.getMonth() - 1), 'MM/yyyy');
        // $scope.loadInvertedData('month', lastMonth, tempNewDate);
        monthsRange.text = 'Last month sales';
        monthsRange.date = lastMonth;
        $scope.loadInvertedData(todayRange, monthsRange);
      } else if (filterTo == 'This year') {
        primaryDate = $filter('date')(tempNewDate, 'yyyy');
        startDate = $filter('date')(new Date(year, 11, 31), 'yyyy-MM-dd');
        endDate = $filter('date')(tempNewDate, 'yyyy-MM-dd');
        $scope.loadDashboard('year', primaryDate, startDate, endDate);
        $scope.loadInvertedData(todayRange, monthsRange);
      }

    };
    // Kasun_Wijeratne_11_OCT_2017 - END

    // Dashboard initialization
    // $scope.loadDashboard();
    $scope.updateSimpleFilter('This month');
    // Dashboard initialization - END


    // Auto refresh
    $interval(function () {
      if (!vm.interactionOn) {
        $scope.updateSimpleFilter('This month');
      }
    }, 30000);
    // Auto refresh - END


  }

})();
