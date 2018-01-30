(function ()
{
	'use strict';

	angular
		.module('app.dashboard')
		.controller('DashboardController', ['$scope','$http','$cookies','$filter','$timeout','$charge', DashboardController]);

	/** @ngInject */
	function DashboardController($scope,$http,$cookies,$filter,$timeout,$charge)
	{
		var vm = this;
		vm.interactionOn = true;

		$scope.chartsList = {};
		var cook = $cookies.get('securityToken');
		// if(cook == undefined)cook = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InQ4elBBYm9Ga0NKOWItbkZKenp5SWlrSmdTSkFrQTJwMDh5a3dSWV8xQW8ifQ.eyJleHAiOjE0OTEwMjY0NzAsIm5iZiI6MTQ5MDk0MzY3MCwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tL2MxZjlmOGU2LTM0NjktNGQ1Zi1hMzI2LTgzZTk5MGE5OTI2YS92Mi4wLyIsInN1YiI6IjY1MzZlODZmLWFmNjUtNGQxNC04MTU1LTcxNmNkYjczOGIwMiIsImF1ZCI6ImQwODRhMjI3LWJiNTItNDk5Mi04ODlkLTZlNDgzNTYxMGU3NiIsIm5vbmNlIjoiZGVmYXVsdE5vbmNlIiwiaWF0IjoxNDkwOTQzNjcwLCJhdXRoX3RpbWUiOjE0OTA5NDM2NzAsImdpdmVuX25hbWUiOiJDaGludGhha2EiLCJmYW1pbHlfbmFtZSI6ImZyZWVfdHJpYWwiLCJuYW1lIjoiVGhpeWFtYmFyYXdhdHRlIiwiaWRwIjoiZ29vZ2xlLmNvbSIsIm9pZCI6IjY1MzZlODZmLWFmNjUtNGQxNC04MTU1LTcxNmNkYjczOGIwMiIsImNvdW50cnkiOiJTcmkgTGFua2EiLCJleHRlbnNpb25fRG9tYWluIjoiY2hpbnRoYWthLmFwcC5jbG91ZGNoYXJnZS5jb20iLCJqb2JUaXRsZSI6ImFkbWluIiwiZW1haWxzIjpbImNoaW50aGFrYS50QGR1b3NvZnR3YXJlLmNvbSJdLCJ0ZnAiOiJCMkNfMV9EZWZhdWx0UG9saWN5In0.mYsDQxaZKXEhETDySbiftOPJmQ0rWWtyMVya44eJndnX-JI_DoA7-ygLJJtIq4Ocuneerx_Kh-doVAFSBleBMRBpEyMT_7PtfN-T9xd500srdZ4O9MBNLro0MIGBbcLiPA8BE7KcbTQMrCkFZdyMWEZJhUbDxcla1FjWi-w1XZWZH2xEilH-6ZGeyus0S496S54kkgMIFXPdFKD6DpKTz1WvRd6N06w-Z3wYEhTMTYn3u0PdE5F3bPxi1IA7C-bdM1-BRnwYlEO_8Dsbkwc6-D8UoVj53mc2-aqZ_rXIlp52242BLtoEF4ibmIcEc8pRMDRe1RhsTVPRkzgSkWh70Q"
		//
		// $http({
		//     method: 'GET',
		//     url: 'http://azure.cloudcharge.com/services/duosoftware.powerBI.service/powerbi/getReports',
		// headers:{
		// 	idToken: cook
		// }
		// }).then(function (response) {
		// // $timeout(function () {
		// // 	$scope.chartsList = response.data.response[0];
		// // },0);
		//
		// /** Load selected report method */
		// 	// $scope.loadSelectedReport = function (id, accessToken) {
		// 	//Read embed application token from textbox
		// var txtAccessToken = response.data.response[0].accessToken;
		//
		// // Read embed URL from textbox
		// var txtEmbedUrl = 'https://embedded.powerbi.com/appTokenReportEmbed?reportId='+response.data.response[0].id;
		//
		// // Read report Id from textbox
		// var txtEmbedReportId = response.data.response[0].id;
		//
		// // Get models. models contains enums that can be used.
		// var models = window['powerbi-client'].models;
		//
		// // We give All permissions to demonstrate switching between View and Edit mode and saving report.
		// var permissions = models.Permissions.All;
		//
		// // Embed configuration used to describe the what and how to embed.
		// // This object is used when calling powerbi.embed.
		// // This also includes settings and options such as filters.
		// // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
		// var config= {
		// 	type: 'report',
		// 	accessToken: txtAccessToken,
		// 	embedUrl: txtEmbedUrl,
		// 	id: txtEmbedReportId,
		// 	permissions: permissions,
		// 	settings: {
		// 		filterPaneEnabled: true,
		// 		navContentPaneEnabled: true
		// 	}
		// };
		// // Get a reference to the embedded report HTML element
		// var reportContainer = document.getElementById('reportContainer');
		//
		// // Embed the report and display it within the div container.
		// var report = powerbi.embed(reportContainer, config);
		// // report.fullscreen();
		// report.getPages()
		// 	.then(function (pages) {
		// 		pages.forEach(function(page) {
		// 			var log = page.name + " - " + page.displayName;
		// 			console.log(log);
		// 		});
		// 	})
		// 	.catch(function (error) {
		// 		console.log(error);
		// 	});
		//
		// //var report = powerbi.createReport(reportContainer, embedCreateConfiguration);
		//
		// // Report.off removes a given event handler if it exists.
		// report.off("loaded");
		//
		// // Report.on will add an event handler which prints to Log window.
		// report.on("loaded", function() {
		// 	console.log("Loaded");
		// });
		//
		// report.on("error", function(event) {
		// 	console.log(event.detail);
		//
		// 	report.off("error");
		// });
		//
		// report.off("saved");
		// report.on("saved", function(event) {
		// 	console.log(event.detail);
		// 	if(event.detail.saveAs) {
		// 		console.log('In order to interact with the new report, create a new token and load the new report');
		// 	}
		// });
		// },function (errorResponse) {
		//    console.log(errorResponse);
		// });
		//var height = window.innerHeight - 55;
		//document.getElementById('reportContainer').setAttribute('style','height:'+height+'px');
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

		function parseJwt (token) {
			var base64Url = token.split('.')[1];
			var base64 = base64Url.replace('-', '+').replace('_', '/');
			return JSON.parse(window.atob(base64));
		}

		function getIdTokenForServices(callback) {
			var _st = gst("securityToken");
			callback((_st != null) ? _st : "") ; //"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImdmSUtJSC15WjNwaFJIUnlqbnNISXFaTWFlUExHQUVMelBhdDBDTlk0c0EifQ";
		}

		$charge.settingsapp().getDuobaseValuesByTableName("CTS_GeneralAttributes").success(function(data) {
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

		$scope.baseUrl="";
		$scope.superURL="";

		var revenurByProductURL = null;
		var revenurByCustomersURL = null;
		var ReceiptsRevenueURL = null;
		var invoiceRevenueURL = null;
		var ReceiptsRevenueYearURL = null;
		var invoiceRevenueYearURL = null;

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
			},0);
		};
		$scope.setFilterTo = function (date) {
			$timeout(function () {
				$scope.filterTo = date;
			},0);
		};
		// Kasun_Wijeratne_6_SEP_2017 - END

		//Kasun_Wijeratne_14_NOV_2017
		/** Draw graph
		/** This method will take graph url and inject set the src of the corresponding graph in the view **/
		function injectGraphs(URL, element) {
			document.getElementById(element).setAttribute('src',URL);
		}
		/** Draw graph - END **/
		//Kasun_Wijeratne_14_NOV_2017 - END

		// $scope.categoryDashboards = [
		// 	{
		// 		title: 'Total invoiced',
		// 		value: 10000,
		// 		icon:'total_invoiced',
		// 		row:"1"
		// 	},
		// 	{
		// 		title: 'Total received',
		// 		value: 10000,
		// 		icon:'total_due',
		// 		row:"1"
		// 	},
		// 	{
		// 		title: 'Total invoices',
		// 		value: 10000,
		// 		icon:'total_invoiced',
		// 		row:"1"
		// 	},
		// 	{
		// 		title: 'Total receipts',
		// 		value: 10000,
		// 		icon:'total_invoiced',
		// 		row:"1"
		// 	},
		// 	{
		// 		title: 'Total subscriptions',
		// 		value: 10000,
		// 		icon:'total_sub',
		// 		row:"1"
		// 	},
		// 	{
		// 		title: 'Payment fails',
		// 		value: 10000,
		// 		icon:'total_invoiced',
		// 		row:"1"
		// 	},
		// 	{
		// 		title: 'Total plans',
		// 		value: 10000,
		// 		icon:'total_invoiced',
		// 		row:"1"
		// 	},
		// 	{
		// 		title: 'Total profiles',
		// 		value: 10000,
		// 		icon:'total_invoiced',
		// 		row:"1"
		// 	}
		// ];

		$scope.categoryDashboards = [
			{
				title: 'Total subscriptions',
				value: 0,
				icon:'total_sub',
				row:"1"
			},
			{
				title: 'Total invoiced',
				value: 0,
				icon:'total_invoiced',
				row:"1"
			},
			{
				title: 'Total received',
				value: 0,
				icon:'total_due',
				row:"1"
			},
			{
				title: 'Total customers',
				value: 0,
				icon:'total_failed',
				row:"1"
			}
		];
		var dashboardDataServices = {};
		$scope.profileByCountry = [];
		$scope.options = {
			chart: {
				type: 'pieChart',
				height: 380,
				donut:true,
				x: function(d){return d.key;},
				y: function(d){return d.y;},
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
			if($scope.isSuperAdmin == 'true'){
				$http.get('app/core/cloudcharge/js/config.json').then(function(data) {
					$scope.baseUrl = data.data.report.domain;
					var reportURL1=$scope.baseUrl+"/reports/JS/viewer.php?";
					getIdTokenForServices(function (token) {
						var filters = "&startDate="+$filter('date')($scope.filterFrom, 'yyyy-MM-dd')+"&endDate="+$filter('date')($scope.filterTo, 'yyyy-MM-dd');
						var reportURL3="report=superAdminDashboardReport&idToken="+token+"&domain="+domain;
						$scope.dashboardURL=reportURL1+reportURL3+filters;
						document.getElementById('reportFram').setAttribute('src',$scope.dashboardURL)
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
			}
			else{
				$scope.profileByCountry = [];
				$http.get('app/core/cloudcharge/js/config.json').then(function(data){
					$scope.baseUrl=data.data.report.domain;
					dashboardDataServices = data.data.dashboard;

					var reportURL1=$scope.baseUrl+"/reports/JS/viewer.php?";
					//var reportURL2="&stimulsoft_report_key="+category;

					//Kasun_Wijeratne_14_NOV_2017
					/** Load top row data **/
					$http({
						method: "POST",
						url: dashboardDataServices.getDashboardData,
						headers: {
							'Content-Type': 'application/json',
							'idToken':idToken,
							'domain': domain
						},
						data: {
							"category":"tenant",
							"daterange":primaryDate,
							"guAccountId": oid,
							"filter":primaryDateText
						}
					}).then(function (res) {
						angular.forEach(res.data.result, function (value) {
							// $scope.categoryDashboards[i].value = res.data.result[i].data;
							if(value.type == 'subscriptioncnt'){
								if(gst('category')=='invoice'){
									$scope.categoryDashboards[0].title = "Total orders";
									$scope.categoryDashboards[0].value = value.data.value;
								}else if(gst('category')=='subscription'){
									$scope.categoryDashboards[0].value = value.data.value;
								}
							}else if(value.type == 'invoiceamt'){
								$scope.categoryDashboards[1].value = value.data.value;
							}else if(value.type == 'receiptamt'){
								$scope.categoryDashboards[2].value = value.data.value;
							}else if(value.type == 'profilecnt'){
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
							'idToken':idToken,
							'domain': domain
						},
						data: {
							"category":"country",
							"daterange":primaryDate,
							"guAccountId": oid,
							"filter":primaryDateText
						}
					}).then(function (res) {
						angular.forEach(res.data.result, function (data) {
							$scope.profileByCountry.push(
								{
									key: data.type + '('+data.data.value+')',
									y: data.data.value
								}
							);
						});
					}, function (res) {
						notifications.toast("Error loading Profiles by Country", "error");
					});
					/** Load profile data **/
					//Kasun_Wijeratne_14_NOV_2017

					getIdTokenForServices(function (token) {
						var filters = "&startDate="+startDate+"&endDate="+endDate;

						// var reportURL3;
						// if(category == 'subscription'){
						// 	reportURL3="report=DashboardReport&idToken="+token+"&domain="+domain;
						// }else if(category == 'invoice'){
						// 	reportURL3="report=DashboardReport_invoiceModule&idToken="+token+"&domain="+domain;
						// }

						// revenurByProductURL = reportURL1 + "report=invoiceDashBoard_RevenueByInvoiceReceipt&idToken="+token+"&domain="+domain + filters;
						// injectGraphs(revenurByProductURL, 'RevenueByInvoice');

						if(primaryDateText == 'year'){

							revenurByProductURL = reportURL1 + "report=invoiceDashBoard_RevenueByInvoiceReceipt_year&idToken="+token+"&domain="+domain + filters;
							injectGraphs(revenurByProductURL, 'RevenueByInvoice');

							revenurByCustomersURL = reportURL1 + "report=invoiceDashBoard_ActivationSummary_year&idToken="+token+"&domain="+domain + filters;
							injectGraphs(revenurByCustomersURL, 'ActivationSummary');

							ReceiptsRevenueURL = reportURL1 + "report=invoiceDashboard_revenurByCustomers&idToken="+token+"&domain="+domain + filters;
							injectGraphs(ReceiptsRevenueURL, 'revenurByCustomers');

							invoiceRevenueURL = reportURL1 + "report=invoiceDashboard_invoiceRevenue_year&idToken="+token+"&domain="+domain + filters;
							injectGraphs(invoiceRevenueURL, 'invoiceRevenue');

							vm.interactionOn = false;
						}else{

							revenurByProductURL = reportURL1 + "report=invoiceDashBoard_RevenueByInvoiceReceipt&idToken="+token+"&domain="+domain + filters;
							injectGraphs(revenurByProductURL, 'RevenueByInvoice');

							revenurByCustomersURL = reportURL1 + "report=invoiceDashBoard_ActivationSummary&idToken="+token+"&domain="+domain + filters;
							injectGraphs(revenurByCustomersURL, 'ActivationSummary');

							ReceiptsRevenueURL = reportURL1 + "report=invoiceDashboard_revenurByCustomers&idToken="+token+"&domain="+domain + filters;
							injectGraphs(ReceiptsRevenueURL, 'revenurByCustomers');

							invoiceRevenueURL = reportURL1 + "report=invoiceDashboard_invoiceRevenue&idToken="+token+"&domain="+domain + filters;
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

				}, function(errorResponse){
					$scope.baseUrl="";
				});
			}
		};

		// $scope.loadInvertedData = function (invertedDateText, invertedDate, thisDay) {
		// 	$http.get('app/core/cloudcharge/js/config.json').then(function(data) {
		// 		var tempDataServices = data.data.dashboard;
		//
		// 		if (invertedDateText == 'all' || invertedDateText == 'today') {
		// 			var tempToday;
		// 			var tempTodayFilter;
		// 			invertedDateText == 'all' ? tempToday = $filter('date')(thisDay, 'dd/MM/yyyy') : tempToday = invertedDate;
		// 			invertedDateText == 'all' ? tempTodayFilter = 'today' : tempMonth = invertedDateText;
		// 			$http({
		// 				method: "POST",
		// 				url: tempDataServices.getDashboardData,
		// 				headers: {
		// 					'Content-Type': 'application/json',
		// 					'idToken': idToken,
		// 					'domain': domain
		// 				},
		// 				data: {
		// 					"category": "tenant",
		// 					"daterange": tempToday,
		// 					"guAccountId": oid,
		// 					"filter": tempTodayFilter
		// 				}
		// 			}).then(function (res) {
		// 				$scope.dailyInverted = {
		// 					text: "",
		// 					amount: 0
		// 				};
		// 				invertedDateText == 'all' ? $scope.dailyInverted.text = 'Today' : $scope.dailyInverted.text = 'Yesterday';
		// 				angular.forEach(res.data.result, function (value) {
		// 					if (value.type == 'invoiceamt') {
		// 						$scope.dailyInverted.amount = value.data.value;
		// 					}
		// 				});
		// 			}, function (res) {
		// 				notifications.toast("Error loading amounts", "error");
		// 			});
		// 		}
		//
		// 		if (invertedDateText == 'all' || invertedDateText == 'month') {
		// 			var tempMonth;
		// 			var tempMonthFilter;
		// 			invertedDateText == 'all' ? tempMonth = $filter('date')(thisDay, 'MM/yyyy') : tempMonth = invertedDate;
		// 			invertedDateText == 'all' ? tempMonthFilter = 'month' : tempMonth = invertedDateText;
		// 			$http({
		// 				method: "POST",
		// 				url: tempDataServices.getDashboardData,
		// 				headers: {
		// 					'Content-Type': 'application/json',
		// 					'idToken': idToken,
		// 					'domain': domain
		// 				},
		// 				data: {
		// 					"category": "tenant",
		// 					"daterange": tempMonth,
		// 					"guAccountId": oid,
		// 					"filter": tempMonthFilter
		// 				}
		// 			}).then(function (res) {
		// 				$scope.monthlyInverted = {
		// 					text: "",
		// 					amount: 0
		// 				};
		// 				invertedDateText == 'all' ? $scope.monthlyInverted.text = 'This month' : $scope.monthlyInverted.text = 'Last month';
		// 				angular.forEach(res.data.result, function (value) {
		// 					if (value.type == 'invoiceamt') {
		// 						$scope.monthlyInverted.amount = value.data.value;
		// 					}
		// 				});
		// 			}, function (res) {
		// 				notifications.toast("Error loading amounts", "error");
		// 			});
		// 		}
		//
		// 		if (invertedDateText == 'all') {
		// 			var tempYear = $filter('date')(thisDay, 'yyyy');
		// 			$http({
		// 				method: "POST",
		// 				url: tempDataServices.getDashboardData,
		// 				headers: {
		// 					'Content-Type': 'application/json',
		// 					'idToken': idToken,
		// 					'domain': domain
		// 				},
		// 				data: {
		// 					"category": "tenant",
		// 					"daterange": tempYear,
		// 					"guAccountId": oid,
		// 					"filter": 'year'
		// 				}
		// 			}).then(function (res) {
		// 				angular.forEach(res.data.result, function (value) {
		// 					if (value.type == 'invoiceamt') {
		// 						$scope.yearlySalesExtra = value.data.value;
		// 					}
		// 				});
		// 			}, function (res) {
		// 				notifications.toast("Error loading amounts", "error");
		// 			});
		// 		}
		// 	}, function () {});
		// };

		$scope.loadInvertedData = function (todayRange, monthRange) {
			$http.get('app/core/cloudcharge/js/config.json').then(function(data) {
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
							$timeout(function(){
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
							$timeout(function() {
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
							$timeout(function() {
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

			if(filterTo == 'Today'){
				primaryDate = $filter('date')(tempNewDate, 'dd/MM/yyyy');
				startDate = $filter('date')(yesterday.setDate(tempNewDate.getDate() - 1), 'yyyy-MM-dd') + ' 12:00:01 AM';
				endDate = $filter('date')(yesterday.setDate(tempNewDate.getDate() - 1), 'yyyy-MM-dd') + ' 11:59:59 PM';
				$scope.loadDashboard('today', primaryDate, startDate, endDate);

				yesterday = $filter('date')(yesterday.setDate(tempNewDate.getDate() - 1), 'dd/MM/yyyy');
				// $scope.loadInvertedData('today', yesterday, tempNewDate);
				todayRange.text = 'Yesterday sales';
				todayRange.date = yesterday;
				$scope.loadInvertedData(todayRange, monthsRange);

			}else if(filterTo == 'This month'){
				primaryDate = $filter('date')(tempNewDate, 'MM/yyyy');
				var tempSetDate = new Date(tempNewDate.getFullYear(), month+1, 0);
				startDate = $filter('date')(tempSetDate, 'yyyy-MM-dd');
				endDate = $filter('date')(tempNewDate, 'yyyy-MM-dd');
				$scope.loadDashboard('month', primaryDate, startDate, endDate);

				lastMonth = $filter('date')(lastMonth.setMonth(tempNewDate.getMonth() - 1), 'MM/yyyy');
				// $scope.loadInvertedData('month', lastMonth, tempNewDate);
				monthsRange.text = 'Last month sales';
				monthsRange.date = lastMonth;
				$scope.loadInvertedData(todayRange, monthsRange);
			}else if(filterTo == 'This year'){
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
		setInterval(function () {
			if(!vm.interactionOn){
				$scope.updateSimpleFilter('This month');
			}
		}, 30000);
		// Auto refresh - END


		// };



		/* var config= {
		 type: 'report',
		 accessToken: txtAccessToken,
		 embedUrl: txtEmbedUrl,
		 id: txtEmbedReportId,
		 permissions: models.Permissions.All ,
		 viewMode: models.ViewMode.Edit,
		 settings: {
		 filterPaneEnabled: true,
		 navContentPaneEnabled: true,
		 useCustomSaveAsDialog: true
		 }
		 };
		 */
		/* var config = {
		 accessToken: txtAccessToken,
		 embedUrl: txtEmbedUrl,
		 datasetId: txtEmbedDatasetId,
		 }; */
		//   console.log("Dashboard Controller Called.");
		//
		//   //debugger;
		//   //$timeout(function() {
		//   //  if($rootScope.firstLogin==null)
		//   //    $state.go('app.settings', {}, {location: 'settings'});
		//   //}, 3000);
		//     var vm = this;
		//
		//
		//   $scope.$watch(function () {
		//     $scope.currentPath = $state.current.url;
		//   });
		//
		//   vm.cardselect = ['Today', 'Yesterday', 'Last Week','Last Month'];
		//   vm.graphselect = ['Last Week','Last Month','Last 12 Months'];
		//
		//   vm.cardData = vm.cardData;
		//   vm.salesList = false;
		//   vm.recievedList = false;
		//   vm.dueList = false;
		//   vm.overDueList = false;
		//   vm.closeList = false;
		//   vm.dashList = dashList;
		//   vm.toggleListPane = toggleListPane;
		//
		//   vm.loadMoreItems=loadMreItems;
		//   vm.hideMoreBtn=false;
		//   vm.dummyList = {
		//
		//   };
		//   vm.isLoaded = false;
		//   var prefixInvoice,lenPrefix;
		//   var paymentPrefix;
		// //vm.isSalesList=false;
		//   vm.graphPieData=[];
		//   $scope.selectdOvd = "";
		//
		//   $scope.setOvd = function (selected) {
		//     $scope.selectdOvd = selected;
		//   }
		//   $charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_InvoiceAttributes","InvoicePrefix").success(function(data) {
		//     prefixInvoice=data[0].RecordFieldData!=""?data[0].RecordFieldData:"";
		//     //debugger;
		//   }).error(function(data) {
		//     prefixInvoice="";
		//     console.log(data);
		//   })
		//
		//   $charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_PaymentAttributes","PaymentPrefix").success(function(data) {
		//     paymentPrefix=data[0].RecordFieldData!=""?data[0].RecordFieldData:"";
		//     //debugger;
		//   }).error(function(data) {
		//     console.log(data);
		//     paymentPrefix="";
		//   })
		//
		//   $charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_InvoiceAttributes","PrefixLength").success(function(data) {
		//     lenPrefix=parseInt(data[0].RecordFieldData)!=0?parseInt(data[0].RecordFieldData):0;
		//   }).error(function(data) {
		//     console.log(data);
		//     lenPrefix=0;
		//   })
		//
		//   function dashList(){
		//     vm.closeList = true;
		//     vm.isLoaded = false;
		//   }
		//
		//
		//   var skipSales,takeSales,skipReceived,takeReceived,skipDue,takeDue,skipExp,takeExp;
		//     function toggleListPane(key){
		//         vm.dashList();
		//         vm.toggleKeyVal=key;
		//         if(key=="salesList"){
		//           vm.salesList = true;
		//           vm.recievedList = false;
		//           vm.dueList = false;
		//           vm.overDueList = false;
		//
		//           skipSales=0;takeSales=10;
		//           //debugger;
		//           $charge.dashboard().getInvoiceInfoByRange(fromDate,toDate,skipSales,takeSales,'des').success(function (data) {
		//             //vm.cardData.recieved=data.sum;
		//             vm.dummyList.title="Sales";
		//             if(data.length<takeSales)
		//               vm.hideMoreBtn=true;
		//             else
		//               vm.hideMoreBtn=false;
		//             for (var i = 0, len = data.length; i < len; i++) {
		//               data[i]['code'] = data[i].invoiceNo;
		//               data[i]['code'] = $filter('numberFixedLen')(data[i]['code'], lenPrefix);
		//               data[i]['invoiceNo'] = prefixInvoice + data[i]['code'];
		//               data[i]['invoiceDate'] = moment(data[i]['invoiceDate']).format('YYYY-MM-DD');
		//             }
		//             vm.dummyList.data = data;
		//             vm.isLoaded = true;
		//             skipSales+=takeSales;
		//             //debugger;
		//           }).error(function (data) {
		//             vm.isLoaded = true;
		//             vm.dummyList.title="Sales";
		//           });
		//
		//         }
		//         if(key=="recievedList"){
		//           vm.recievedList = true;
		//           vm.salesList = false;
		//           vm.dueList = false;
		//           vm.overDueList= false;
		//
		//           vm.dummyList.data=[];
		//           skipReceived=0;takeReceived=10;
		//           $charge.dashboard().getPaymentInfoByRange(fromDate,toDate,skipReceived,takeReceived,'des').success(function (data) {
		//             vm.dummyList.title = "Recieved";
		//             //debugger;
		//             if(data.length<takeReceived)
		//               vm.hideMoreBtn=true;
		//             else
		//               vm.hideMoreBtn=false;
		//             for (var i = 0, len = data.length; i < len; i++) {
		//               data[i]['paymentNo'] = paymentPrefix + data[i]['paymentNo'];
		//               data[i]['amount'] = data[i]['amount'];
		//               data[i]['paymentDate']=moment(data[i]['paymentDate']).format('YYYY-MM-DD');
		//             }
		//             vm.dummyList.data = data;
		//             vm.isLoaded = true;
		//             skipReceived+=takeReceived;
		//             //debugger;
		//           }).error(function (data) {
		//             vm.dummyList.title = "Recieved";
		//             vm.isLoaded = true;
		//           });
		//
		//
		//         }
		//         if(key=="dueList"){
		//           vm.dueList = true;
		//           vm.recievedList = false;
		//           vm.salesList = false;
		//           vm.overDueList = false;
		//
		//           vm.dummyList.data=[];
		//           skipDue=0;takeDue=10;
		//           $charge.dashboard().getDueInvoiceInfoByRange(fromDate,toDate,skipDue,takeDue,'des').success(function (data) {
		//             vm.dummyList.title = "Due"
		//             //debugger;
		//             if(data.length<takeDue)
		//               vm.hideMoreBtn=true;
		//             else if(data.length<takeDue)
		//               vm.hideMoreBtn=false;
		//             for (var i = 0, len = data.length; i < len; i++) {
		//               data[i]['code'] = data[i].invoiceNo;
		//               data[i]['code'] = $filter('numberFixedLen')(data[i]['code'], lenPrefix);
		//               data[i]['invoiceNo'] = prefixInvoice + data[i]['code'];
		//               data[i]['invoiceDate'] = moment(data[i]['invoiceDate']).format('YYYY-MM-DD');
		//             }
		//             vm.dummyList.data = data;
		//             vm.isLoaded = true;
		//             skipDue+=takeDue;
		//             //debugger;
		//           }).error(function (data) {
		//             vm.isLoaded = true;
		//             vm.dummyList.title = "Due";
		//           });
		//
		//         }
		//       if(key=="overDueList"){
		//         vm.overDueList = true;
		//         vm.dueList = false;
		//         vm.recievedList = false;
		//         vm.salesList = false;
		//         vm.dummyList.data=[];
		//         skipExp=0;takeExp=10;
		//         $charge.dashboard().getOverDueInvoiceInfoByRange(fromDate,toDate,skipExp,takeExp,'des').success(function (data) {
		//           vm.dummyList.title = "Overdue";
		//           if(data.length<takeExp)
		//             vm.hideMoreBtn=true;
		//           else
		//             vm.hideMoreBtn=false;
		//           for (var i = 0, len = data.length; i < len; i++) {
		//             data[i]['dueDate']= moment(data[i]['dueDate']).format('YYYY-MM-DD');
		//           }
		//           //debugger;
		//           vm.dummyList.data = data;
		//           vm.isLoaded = true;
		//           skipExp+=takeExp;
		//           //debugger;
		//         }).error(function (data) {
		//           vm.isLoaded = true;
		//           vm.dummyList.title = "Overdue";
		//         });
		//       }
		//
		//     }
		//
		//
		//   function loadMreItems(take)
		//   {
		//     vm.dashList();
		//     var key=vm.toggleKeyVal;
		//     vm.hideMoreBtn=false;
		//     if(key=="salesList"){
		//       $charge.dashboard().getInvoiceInfoByRange(fromDate,toDate,skipSales,take,'des').success(function (data) {
		//         //debugger;
		//         if(data.length<take)
		//           vm.hideMoreBtn=true;
		//         for (var i = 0, len = data.length; i < len; i++) {
		//           data[i]['code'] = data[i].invoiceNo;
		//           data[i]['code'] = $filter('numberFixedLen')(data[i]['code'], lenPrefix);
		//           data[i]['invoiceNo'] = prefixInvoice + '-' + data[i]['code'];
		//           data[i]['invoiceDate'] = moment(data[i]['invoiceDate']).format('YYYY-MM-DD');
		//           vm.dummyList.data.push(data[i]);
		//         }
		//         vm.isLoaded = true;
		//         skipSales+=take;
		//       }).error(function (data) {
		//         vm.isLoaded = true;
		//       });
		//
		//     }
		//     if(key=="recievedList"){
		//       $charge.dashboard().getPaymentInfoByRange(fromDate,toDate,skipReceived,take,'des').success(function (data) {
		//         if(data.length<take)
		//           vm.hideMoreBtn=true;
		//         for (var i = 0, len = data.length; i < len; i++) {
		//           data[i]['paymentNo'] = paymentPrefix + '-' + data[i]['paymentNo'];
		//           data[i]['amount'] = data[i]['amount'];
		//           data[i]['paymentDate']=moment(data[i]['paymentDate']).format('YYYY-MM-DD');
		//           vm.dummyList.data.push(data[i]);
		//         }
		//         vm.isLoaded = true;
		//         skipReceived+=take;
		//       }).error(function (data) {
		//         vm.isLoaded = true;
		//       });
		//
		//
		//     }
		//     if(key=="dueList"){
		//       $charge.dashboard().getDueInvoiceInfoByRange(fromDate,toDate,skipDue,take,'des').success(function (data) {
		//         if(data.length<take)
		//           vm.hideMoreBtn=true;
		//         for (var i = 0, len = data.length; i < len; i++) {
		//           data[i]['code'] = data[i].invoiceNo;
		//           data[i]['code'] = $filter('numberFixedLen')(data[i]['code'], lenPrefix);
		//           data[i]['invoiceNo'] = prefixInvoice + '-' + data[i]['code'];
		//           data[i]['invoiceDate'] = moment(data[i]['invoiceDate']).format('YYYY-MM-DD');
		//           vm.dummyList.data.push(data[i]);
		//         }
		//         vm.isLoaded = true;
		//         skipDue+=take;
		//       }).error(function (data) {
		//         vm.isLoaded = true;
		//       });
		//
		//     }
		//     if(key=="expenseList"){
		//       $charge.dashboard().getExpenseInfoByRange(fromDate,toDate,skipExp,take,'des').success(function (data) {
		//         if(data.length<take)
		//           vm.hideMoreBtn=true;
		//         vm.dummyList.title = "Expense";
		//         for (var i = 0, len = data.length; i < len; i++) {
		//           data[i]['createddate']= moment(data[i]['createddate']).format('YYYY-MM-DD');
		//           vm.dummyList.data.push(data[i]);
		//         }
		//         vm.isLoaded = true;
		//         skipExp+=take;
		//       }).error(function (data) {
		//         vm.isLoaded = true;
		//       });
		//     }
		//   }
		//
		//   vm.salesCat="Today";
		//   vm.cardData={};
		//   vm.cardData.sales = 0;
		//   vm.cardData.recieved = 0;
		//   vm.cardData.balance = 0;
		//   vm.cardData.expense = 0;
		//
		//   vm.graphCat="Last Week";
		//   //vm.typeDate="Last 12 Days";
		//   $charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_GeneralAttributes","DecimalPointLength").success(function(data) {
		//     vm.decimalPoint=parseInt(data[0].RecordFieldData);
		//     //vm.step=($rootScope.decimalPoint/$rootScope.decimalPoint)/Math.pow(10,$rootScope.decimalPoint);
		//     //debugger;
		//     //debugger;
		//   }).error(function(data) {
		//     console.log(data);
		//   })
		//
		//   $charge.commondata().getDuobaseFieldDetailsByTableNameAndFieldName("CTS_GeneralAttributes","BaseCurrency").success(function(data) {
		//     vm.baseCurrency=data[0].RecordFieldData;
		//   }).error(function(data) {
		//   })
		//
		//
		//   var toDate='',fromDate='';
		//   vm.dailySales = getDailySales;
		//   function getDailySales(salesCat) {
		//     vm.dummyList={};
		//     //vm.dashList = false;
		//     vm.closeList=false;
		//     vm.hideMoreBtn=false;
		//     if(salesCat=='Today') {
		//       toDate=moment(new Date()).add(1, 'day')._d;
		//       toDate = moment(toDate).format('YYYY-MM-DD')+' 00:00:00';
		//       fromDate=moment(new Date()).format('YYYY-MM-DD')+' 00:00:00';
		//     }
		//     else if(salesCat=='Yesterday')
		//     {
		//       //toDate=moment(new Date()).subtract(1, 'day')._d;
		//       toDate=moment(new Date()).format('YYYY-MM-DD')+ ' 00:00:00';
		//       fromDate=moment(new Date()).subtract(1, 'day')._d;
		//       fromDate=moment(fromDate).format('YYYY-MM-DD')+ ' 00:00:00';
		//     }
		//     else if(salesCat=='Last Week')
		//     {
		//       fromDate=moment(new Date()).subtract(7, 'day')._d;
		//       fromDate=moment(fromDate).format('YYYY-MM-DD')+ ' 00:00:00';
		//       toDate=moment(new Date()).add(1, 'day')._d;
		//       toDate=moment(toDate).format('YYYY-MM-DD')+' 00:00:00';
		//       //fromDate = moment().subtract(1, 'week').startOf('isoweek');
		//       //fromDate=moment(fromDate).format('YYYY-MM-DD')+' 00:00:00';
		//       //toDate = moment().subtract(1, 'week').endOf('isoweek');
		//       //toDate=moment(toDate).add(1, 'day')._d;
		//       //toDate=moment(toDate).format('YYYY-MM-DD')+' 00:00:00';
		//     }
		//     else if(salesCat=='Last Month')
		//     {
		//       //fromDate = new moment().subtract(1, 'months').date(1);
		//       //fromDate=moment(fromDate).format('YYYY-MM-DD')+' 00:00:00';
		//       //toDate = new moment().subtract(0, 'months').date(0);
		//       //toDate=moment(toDate).add(1, 'day')._d;
		//       //toDate=moment(toDate).format('YYYY-MM-DD')+' 00:00:00';
		//       fromDate=moment(new Date()).subtract(30, 'day')._d;
		//       fromDate=moment(fromDate).format('YYYY-MM-DD')+ ' 00:00:00';
		//       toDate=moment(new Date()).add(1, 'day')._d;
		//       toDate=moment(toDate).format('YYYY-MM-DD')+' 00:00:00';
		//     }
		//     vm.fromDateRange=fromDate.substring(0,10);
		//     var dateParts = toDate.substring(0,10).split("-");
		//     var tempdate = new Date(dateParts[0], (dateParts[1]-1), dateParts[2]-1);
		//     tempdate=moment(tempdate).format('YYYY-MM-DD')+' 00:00:00';
		//     vm.toDateRange=tempdate.substring(0,10);
		//     //debugger;
		//     fromDate="'"+fromDate+"'";
		//     toDate="'"+toDate+"'";
		//     $charge.dashboard().getSumOfInvoiceByRange(fromDate,toDate).success(function (data) {
		//       vm.cardData.sales=data.sum;
		//       $charge.dashboard().getSumOfPaymentsByRange(fromDate,toDate).success(function (data) {
		//         vm.cardData.recieved=data.sum;
		//         //debugger;
		//         vm.cardData.balance=vm.cardData.sales-vm.cardData.recieved;
		//         $charge.dashboard().getSumOfOverDueByRange(fromDate,toDate).success(function (data) {
		//           vm.cardData.expense=data.overDueAmount;
		//         }).error(function (data) {
		//
		//         });
		//       }).error(function (data) {
		//
		//       });
		//     }).error(function (data) {
		//
		//     });
		//
		//
		//   }
		//   getDailySales(vm.salesCat);
		//
		//   /*
		//    Pie Chart Start
		//    */
		//   //vm.productPie={};
		//   vm.productPie = {
		//     title    : 'Products',
		//     chart: {
		//       options: {
		//         chart: {
		//           type     : 'pieChart',
		//           color    : ['#ADCEFF','#85B6FF','#5C9DFF', '#3385FF','#0A6CFF','#005AE0','#0049B8','#00398F','#002966','#00183D'],
		//           height   : 400,
		//           margin   : {
		//             top   : 0,
		//             right : 0,
		//             bottom: 0,
		//             left  : 0
		//           },
		//           labelType: 'percent',
		//           x        : function (d)
		//           {
		//             return d.label;
		//           },
		//           y        : function (d)
		//           {
		//             return d.value;
		//           },
		//           tooltip  : {
		//             gravity: 's',
		//             classes: 'gravity-s'
		//           }
		//         }
		//       },
		//       data   : []
		//     }
		//   };
		//
		//   /*
		//    Pie Chart End
		//    */
		//
		//   vm.salesMultibar = {
		//     options : {
		//       chart: {
		//         type: 'multiBarChart',
		//         color: ['#85B6FF','#0A6CFF'],
		//         height: 420,
		//         x: function(d){return d.label;},
		//         y: function(d){return d.value;},
		//         reduceXTicks : false,
		//   //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
		//         showControls: false,
		//         showValues: true,
		//         duration: 500,
		//         xAxis: {
		//           showMaxMin: false,
		//           axisLabel: 'Last 12 Days',
		//         },
		//         yAxis: {
		//           axisLabel: 'Values',
		//           tickFormat: function(d){
		//             return d3.format(',')(d);
		//           }
		//         }
		//       }
		//     },
		//
		//     data: []
		//   };
		//
		//   vm.tempSalesMultibar={}
		//   vm.tempSalesMultibar.data=[];
		//   vm.tempSalesMultibar.data[0]={"key": "Sales", "values":[]};
		//   vm.tempSalesMultibar.data[1]={"key": "Receipt", "values":[]}
		//
		//   vm.customerSalesbar = {
		//     options : {
		//       chart: {
		//         type: 'multiBarHorizontalChart',
		//         x: function(d){return d.label;},
		//         y: function(d){return d.value;},
		//         //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
		//         showControls: false,
		//         showValues: true,
		//         duration: 500,
		//         margin: {
		//           left : 100
		//         },
		//         xAxis: {
		//           axisLabel: 'Customers',
		//           showMaxMin: false,
		//           axisLabelDistance: 30
		//         },
		//         yAxis: {
		//           axisLabel: 'Values',
		//           tickFormat: function(d){
		//             return d3.format(',')(d);
		//           }
		//         },
		//         tooltip: {
		//           contentGenerator: function (key, x, y, e, graph) {
		//             //debugger;
		//             for(var i=0;i<vm.tempProfiles.length;i++)
		//             {
		//               if(vm.tempProfiles[i].toLowerCase().startsWith(key.data.label.toLowerCase()))
		//               {
		//                 vm.name=vm.tempProfiles[i];
		//                 break;
		//               }
		//             }
		//             return '<div layout="column" style="background-color: rgba(0, 0, 0, 0.87);text-align: left;border-radius: 3px">'+
		//                       '<div flex>'+
		//                         '<p style="text-align: left">'+vm.name+'</p>' +
		//                       '</div>'+
		//                       '<div flex>'+
		//                         '<p style="text-align: left"> Sales '+key.data.value.toFixed(2)+'</p>' +
		//                       '</div>'+
		//                    '</div>';
		//           }
		//         }
		//       }
		//     },
		//
		//     data: [{"key": "Sales",
		//       "color": "#1f77b4",
		//       "values":[]}]
		//   };
		//
		//   vm.dailyGraphs=getGraphSales;
		//   vm.getOverDues=getOverDues;
		//   var toGrDate,fromGrDate;
		//   var grphType;
		//   function getGraphSales(graphCat)
		//   {
		//     //debugger;
		//     vm.salesMultibar.options.chart.xAxis.axisLabel=graphCat;
		//     if(graphCat=='Last Week') {
		//       //fromGrDate = moment().subtract(1, 'week').startOf('isoweek');
		//       //fromGrDate=moment(fromGrDate).format('YYYY-MM-DD')+' 00:00:00';
		//       //toGrDate = moment().subtract(1, 'week').endOf('isoweek');
		//       //toGrDate=moment(toGrDate).add(1, 'day')._d;
		//       //toGrDate=moment(toGrDate).format('YYYY-MM-DD')+' 00:00:00';
		//       fromGrDate=moment(new Date()).subtract(7, 'day')._d;
		//       fromGrDate=moment(fromGrDate).format('YYYY-MM-DD')+ ' 00:00:00';
		//       toGrDate=moment(new Date()).add(1, 'day')._d;
		//       toGrDate=moment(toGrDate).format('YYYY-MM-DD')+' 00:00:00';
		//       grphType='Day';
		//       //vm.salesMultibar.options.chart.reduceXTicks=false;
		//     }
		//     else if(graphCat=='Last Month')
		//     {
		//       //fromGrDate = new moment().subtract(1, 'months').date(1);
		//       //fromGrDate=moment(fromGrDate).format('YYYY-MM-DD')+' 00:00:00';
		//       //toGrDate = new moment().subtract(0, 'months').date(0);
		//       //toGrDate=moment(toGrDate).add(1, 'day')._d;
		//       //toGrDate=moment(toGrDate).format('YYYY-MM-DD')+' 00:00:00';
		//       fromGrDate=moment(new Date()).subtract(30, 'day')._d;
		//       fromGrDate=moment(fromGrDate).format('YYYY-MM-DD')+ ' 00:00:00';
		//       toGrDate=moment(new Date()).add(1, 'day')._d;
		//       toGrDate=moment(toGrDate).format('YYYY-MM-DD')+' 00:00:00';
		//       grphType='Day';
		//       //vm.salesMultibar.options.chart.reduceXTicks=true;
		//     }
		//     else if(graphCat=='Last 12 Months')
		//     {
		//       toGrDate=moment(new Date()).add(1, 'day')._d;
		//       toGrDate = moment(toGrDate).format('YYYY-MM-DD')+' 00:00:00';
		//       fromGrDate=moment(new Date()).subtract(12, 'month')._d;
		//       fromGrDate=moment(fromGrDate).format('YYYY-MM-DD')+ ' 00:00:00';
		//       grphType='Month';
		//       //vm.salesMultibar.options.chart.reduceXTicks=false;
		//     }
		//     //debugger;
		//     vm.fromDateGrpRange=fromGrDate.substring(0,10);
		//     var dateParts = toGrDate.substring(0,10).split("-");
		//     var tempGrpdate = new Date(dateParts[0], (dateParts[1]-1), dateParts[2]-1);
		//     tempGrpdate=moment(tempGrpdate).format('YYYY-MM-DD')+' 23:59:59';
		//     vm.toDateGrpRange=tempGrpdate.substring(0,10);
		//     fromGrDate="'"+fromGrDate+"'";
		//     toGrDate="'"+tempGrpdate+"'";
		//
		//     $charge.dashboard().getProductWiseSales(fromGrDate,toGrDate,0,10,'des').success(function (data) {
		//       //debugger;
		//       vm.productPie.chart.data=[];
		//       for(var i=0;i<data.length;i++)
		//       {
		//         vm.productPie.chart.data.push({
		//           "label":data[i]['product_name'],
		//           "value":data[i]['sales']
		//         })
		//
		//       }
		//       //debugger;
		//       $charge.dashboard().getProfileWiseSales(fromGrDate,toGrDate,0,10,'des').success(function (data) {
		//         vm.customerSalesbar.data[0].values=[];
		//         vm.tempProfiles=[];
		//         for(var i=0;i<data.length;i++)
		//         {
		//           vm.tempProfiles[i]=data[i]['first_name'];
		//           vm.customerSalesbar.data[0].values.push({
		//             "label":data[i]['first_name'],
		//             "value":data[i]['sales']
		//           })
		//         }
		//
		//         $charge.dashboard().getSumOfInvoiceByDate(fromGrDate,toGrDate,0,-1,grphType).success(function (data) {
		//           //vm.salesMultibar.data[0].values=[];
		//           vm.tempSalesMultibar.data[0].values=[];
		//           for(var i=0;i<data.length;i++)
		//           {
		//             if(grphType=='Month') {
		//               //var month=$filter('filter')(vm.month, {MonthId: data[i]['Month']})[0];
		//               data[i]['Label'] = data[i]['MONTH'];
		//             }
		//             else
		//               data[i]['Label']=data[i]['Date'].substring(5);
		//             //vm.salesMultibar.data[0].values.push({
		//             //  "label":data[i]['Label'],
		//             //  "value":data[i]['Sum']
		//             //})
		//
		//             vm.tempSalesMultibar.data[0].values.push({
		//               "label":data[i]['Label'],
		//               "value":data[i]['Sum']
		//             })
		//           }
		//           //debugger;
		//           $charge.dashboard().getSumOfPaymentsByDate(fromGrDate,toGrDate,0,-1,grphType).success(function (data) {
		//             //vm.salesMultibar.data[1].values=[];
		//             vm.tempSalesMultibar.data[1].values=[];
		//             for(var i=0;i<data.length;i++)
		//             {
		//               if(grphType=='Month')
		//               {
		//                 //var month=$filter('filter')(vm.month, {MonthId: data[i]['Month']})[0];
		//                 data[i]['Label'] = data[i]['MONTH'];
		//                 vm.salesMultibar.options.chart.reduceXTicks=false;
		//               }
		//               else {
		//                 data[i]['Label'] = data[i]['Date'].substring(5);
		//                 vm.salesMultibar.options.chart.reduceXTicks=true;
		//               }
		//               //vm.salesMultibar.data[1].values.push({
		//               //  "label":data[i]['Label'],
		//               //  "value":data[i]['Sum']
		//               //})
		//
		//               vm.tempSalesMultibar.data[1].values.push({
		//                 "label":data[i]['Label'],
		//                 "value":data[i]['Sum']
		//               })
		//             }
		//             vm.salesMultibar.data=vm.tempSalesMultibar.data;
		//           }).error(function (data) {
		//
		//           });
		//         }).error(function (data) {
		//
		//         });
		//
		//         //debugger;
		//       }).error(function (data) {
		//
		//       });
		//     }).error(function (data) {
		//
		//     });
		//
		//   }
		//   function getOverDues()
		//   {
		//     vm.overDues=[];
		//     $charge.dashboard().getSumOfOverDue().success(function (data) {
		//       //vm.overDueMultibar.data[0].values=[];
		//       //debugger;
		//       //for(var key in data) {
		//       //  vm.overDueMultibar.data[0].values.push({
		//       //    "label":key,
		//       //    "value":data[key]
		//       //  })
		//       //}
		//
		//       for(var key in data) {
		//         vm.overDues.push({
		//           "label":key,
		//           "value":data[key]
		//         })
		//       }
		//     }).error(function (data) {
		//
		//     });
		//   }
		//   getGraphSales(vm.graphCat);
		//   getOverDues();
		//
		//
		//   /*
		//    Overdue graph start
		//    */
		//   vm.overDueMultibar = {
		//     options : {
		//       chart: {
		//         type: 'multiBarChart',
		//         height: 450,
		//         x: function(d){return d.label;},
		//         y: function(d){return d.value;},
		//         reduceXTicks : false,
		//         //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
		//         showControls: false,
		//         showValues: true,
		//         duration: 500,
		//         xAxis: {
		//           showMaxMin: false,
		//           axisLabel: 'No Of Days',
		//           width:50
		//         },
		//         yAxis: {
		//           axisLabel: 'Amount',
		//           tickFormat: function(d){
		//             return d3.format(',')(d);
		//           }
		//         }
		//       }
		//     },
		//
		//     data: [{"key": "Overdue",
		//       "color": "#1f77b4",
		//       "values":[]}]
		//   };
		//
		//   $scope.refreshDashboard = function () {
		//     vm.graphCat = "Last Week";
		//     vm.salesCat = "Today";
		//     getGraphSales(vm.graphCat);
		//     getOverDues();
		//     getDailySales(vm.salesCat);
		//   }
		//
		//
		//   /*
		//    Overdue graph end
		//    */
		//
		//   /**
		//    * Toggle sidenav
		//    *
		//    * @param sidenavId
		//    */
		//   function toggleSidenav(sidenavId)
		//   {
		//       $mdSidenav(sidenavId).toggle();
		//   }
		//
		//   /**
		//    * Select project
		//    */
		//   function selectProject(project)
		//   {
		//       vm.selectedProject = project;
		//   }
	}

})();
