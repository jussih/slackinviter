// slack helpers

var slack = (function() {
  var userCache = null;
  var groupCache = null;

  var getUsers = function(token) {
    if (userCache === null) {
      userCache = Promise.resolve($.getJSON('https://slack.com/api/users.list?token=' + token));
    }
    return userCache;
  };

  var getUserByEmail = function(email, token) {
    return getUsers(token).then(function(users) {
      console.log('users', users);
      if (users.ok === true) {
        user = _.find(users.members, function(user) {return user.profile.email == email});
        if (user !== undefined) {
          return {id: user.id, email: user.profile.email};
        }
      }
    });
  };

  var getGroups = function(token) {
    if (groupCache === null) {
      groupCache = Promise.resolve($.getJSON('https://slack.com/api/groups.list?token=' + token));
    }
    return groupCache;
  };
  
  var getGroupByName = function(name, token) {
    return getGroups(token).then(function(groups) {
      if (groups.ok === true) {
        group = _.find(groups.groups, function(group) {return group.name == name});
        if (group !== undefined) {
          return {id: group.id, name: group.name};
        }
      }
    });
  };

  var addUserToGroup = function(userID, groupID, token) {
    return Promise.resolve($.getJSON("https://slack.com/api/groups.invite?token=" + token + "&channel=" + groupID + "&user=" + userID)).then(function(resp) {
      return resp.ok;
    });
  };

  var clearCache = function() {
    userCache = null;
    groupCache = null;
  }; 

  return {
    getUserByEmail: getUserByEmail,
    getGroupByName: getGroupByName,
    addUserToGroup: addUserToGroup,
    clearCache: clearCache
  }
})();
