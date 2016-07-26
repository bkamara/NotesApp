angular.module('NotesApp', ['ngMaterial', 'ngStorage'])
	.config(function($mdThemingProvider) {
  		$mdThemingProvider.theme('default')
    	.primaryPalette('pink')
	    .accentPalette('light-blue')
	    .dark();
	})
	.controller('NoteListController', ['$localStorage', '$scope', '$mdDialog', function($localStorage, $scope, $mdDialog){
		var intIndex;
		var init;

		//Note (list) object
		function list(title, note, date) {
			var today = new Date();
			this.title = title;
			this.note = note;
			this.date = today.toLocaleDateString();
		}
		
		//introduction note
		init = new list("Introduction", "Here's the first note. Feel free to create, edit, and delete notes. \nTip: On the main menu, swipe from right to left, on the note you want to delete.\nEnjoy!", "");

		//initalizing the local storage with with introduction note
		$localStorage.$default({
			fullList: $scope.notes
		});
		if (($scope.notes == null) || ($scope.notes == undefined))
			{
				if (($localStorage.fullList != undefined)||($localStorage.fullList != null))
				 {
				 	$scope.notes = $localStorage.fullList;
				 }
				 else
				 {
					$localStorage.fullList = [];
					$scope.notes = $localStorage.fullList;
					$scope.notes.push(init);
				 } 	
			} 
		
		//Alert for forgetting to include a title to the note
		function showAlert(){
		    var alert = $mdDialog.alert({
		    	title: 'Wait a minute!', 
		    	textContent: 'You must have a title in order to save the note.',
		    	ok: 'Got it!'
		    });
		    $mdDialog
		    	.show(alert)
		}

		//Alert for note deletion
		$scope.showDeleteAlert = function(ev){    
		    var confirm = $mdDialog.confirm()
		          .title('Delete?')
		          .textContent('Do you want to delete this note?')
		          .ariaLabel('delete note')
		          .ok('Yes')
		          .cancel('Nope');
			    $mdDialog.show(confirm).then(function() {
			      deleteNote(ev);
			    });
			  };

		//Creating a new note
		$scope.addNewNote = function(){
			$scope.title = "";
			$scope.note = "";
			document.getElementById("title").value = $scope.title;
			document.getElementById("note").value = $scope.note;
			$("#update").css("display", "none");
			$("#noteList").css("display", "none");
			$("#add").css("display", "none");
			$("#addNote").css("display", "inline");
			$("#submit").css("display","inline");
		};

		//Saving the note
		$scope.saveNote = function(title, note, date){
			var newNote = new list(title, note, date);
			if (newNote.note == undefined)
			{
				newNote.note = "";
			}

			if ((newNote.title == "") || (newNote.title == undefined))
			{
				showAlert();
			}
			else 
			{
				$scope.notes.push(newNote);
				document.getElementById("submitNote").reset();
				$scope.title = "";
				$scope.note = "";

				$("#update").css("display", "none");
				$("#delete").css("display", "none");
				$("#addNote").css("display", "none");
				$("#noteList").css("display", "inline");
				$("#add").css("display", "inline");
			}
		};

		//Cancelling note addition page to go back to main screen
		$scope.clear = function(){
			$("#delete").css("display", "none");
			$("#addNote").css("display", "none");
			$("#update").css("display", "none");	
			$("#noteList").css("display", "inline");
			$("#add").css("display", "inline");

			document.getElementById("submitNote").reset();
			$scope.title = "";
			$scope.note = "";
		};

		//Saving note updates
		$scope.updateNote = function(){
			$localStorage.fullList[intIndex].title = $scope.title;
			$localStorage.fullList[intIndex].note = $scope.note;
			$("#addNote").css("display", "none");
			$("#delete").css("display", "none");
			$("#noteList").css("display", "inline");
			$("#add").css("display", "inline");
			$("#update").css("display", "none");
		};

		//Editing notes
		$scope.editNote = function(x){
			
			$("#submit").css("display","none");
			$("#noteList").css("display", "none");
			$("#update").css("display", "inline");
			$("#add").css("display", "none");	
			$("#delete").css("display", "inline");	

			$scope.title = x.title;
			$scope.note = x.note;

			var filterParam = {title: x.title, note: x.note};

			for  (var i=0;  i<$localStorage.fullList.length; i++)
			{
				var eachobj = $localStorage.fullList[i];
				var found = true;
				for(var k in filterParam)
				{
					if(eachobj.hasOwnProperty(k))
					{
						if(eachobj[k].toString() != filterParam[k].toString())
						{
							found = false;
						}
					}
				}
				if(found)
				{
					intIndex = i;
			        break;
				}
			}

			$("#addNote").css("display", "inline");
		};

		//Deleting the note
		function deleteNote(x){
			 $localStorage.fullList.splice(x,1);
			 $("#addNote").css("display", "none");
 			 $("#delete").css("display", "none");
			 $("#noteList").css("display", "inline");
			 $("#add").css("display", "inline");
			 $("#update").css("display", "none");
		}
	}]);