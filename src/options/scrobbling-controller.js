const getProfileUrl = username => `https://www.last.fm/user/${username}`;

export default function ScrobblingController($scope, chrome, preferences){
  $scope.scrobblingEnabled = preferences.get("lastfm.scrobbling");
  $scope.lastfmUsername = preferences.get("lastfm.username");
  $scope.lastfmUserProfile = getProfileUrl($scope.lastfmUsername);

  $scope.$watch("scrobblingEnabled", function(value){
    preferences.set('lastfm.scrobbling', value);
  });

  chrome.on('lastfm.auth.success', () => {
    $scope.scrobblingEnabled = preferences.get("lastfm.scrobbling");
    $scope.lastfmUsername = preferences.get("lastfm.username");
    $scope.lastfmUserProfile = getProfileUrl($scope.lastfmUsername);
    $scope.$apply("");
  });

  $scope.disconnect = ($event) => {
    $event.preventDefault();
    preferences.del("lastfm.scrobbling");
    preferences.del("lastfm.username");
    preferences.del("lastfm.token");
    $scope.lastfmUsername = null;
  };

  $scope.toggle = ($event) => {
    $event.preventDefault();
    $scope.scrobblingEnabled = !$scope.scrobblingEnabled;
  };

  $scope.startAuthentication = function($event){
    $event.preventDefault();
    const cb = chrome.getRedirectURL('auth.html');
    const authUrl = `https://www.last.fm/api/auth?cb=${cb}`;

    chrome.notify('lastfm.auth.request', authUrl);
  };
}

ScrobblingController.$inject = ['$scope', 'chrome', 'preferences'];
