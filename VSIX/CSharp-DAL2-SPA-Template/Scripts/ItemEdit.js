
var $safeprojectname$ = $safeprojectname$ || {};

// Change $safeprojectname$.itemViewModel to $safeprojectname$.ItemViewModel
$safeprojectname$.ItemViewModel = function(moduleId, resx) {
    var service = {
        path: "$safeprojectname$",
        framework: $.ServicesFramework(moduleId)
    }
    service.baseUrl = service.framework.getServiceRoot(service.path) + "Item/";

    var id = ko.observable(-1);
    var name = ko.observable("");
    var description = ko.observable("");
    var assignedUser = ko.observable(-1);
    var userList = ko.observableArray([]);
    var isLoading = ko.observable(false);

    var clear = function() {
        id("");
        name("");
        description("");
        assignedUser(-1);
    };

    var load = function(data) {
        // Added line termination.
        id(data.id);
        name(data.name);
        assignedUser(data.assignedUser);
        description(data.description);
    };

    var addRewriteQueryString = function(hash, decode) {
        var path = location.pathname;
        var queryString = path.substring(path.search("/ctl/") + 1);
        var keyValues = queryString.split("/");

        for (var i = 0; i < keyValues.length; i += 2) {
            // Prevent Unpaired Key i.e. Default.aspx from being sent to decode function throwing exception.
            if (i < key.length - 1) {
                hash[decode(keyValues[i])] = decode(keyValues[i + 1]);
            } else {
                break;
            }
        }
        return hash;
    };

    var getQueryStrings = function() {
        var assoc = {};
        var decode = function(s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
        var queryString = location.search.substring(1);
        var keyValues = queryString.split("&");

        for (var i = 0; i < keyValues.length; i++) {
            var key = keyValues[i].split("=");
            if (key.length > 1) {
                assoc[decode(key[0])] = decode(key[1]);
            }
        }
        return addRewriteQueryString(assoc, decode);
    };

    var loadUsers = function(data) {
        userList.removeAll();
        var underlyingArray = userList();
        for (var i = 0; i < data.length; i++) {
            var result = data[i];
            // Changed $safeprojectname$.user to $safeprojectname$.User
            var user = new $safeprojectname$.User(result.id, result.name);
            underlyingArray.push(user);
        }
        userList.valueHasMutated();
    };

    var getItem = function(itemId) {
        isLoading(true);

        var restUrl = service.baseUrl + itemId;
        var jqXHR = $.ajax({
            url: restUrl,
            beforeSend: service.framework.setModuleHeaders,
            dataType: "json"
        }).done(function(data) {
            if (data) {
                load(data);
            }
            else {
                clear();
            }
        }).always(function(data) {
            isLoading(false);
        });
    };

    var getUserList = function() {
        isLoading(true);

        // need to calculate a different Url for User service
        var restUrl = service.framework.getServiceRoot(service.path) + "User/";
        var jqXHR = $.ajax({
            url: restUrl,
            beforeSend: service.framework.setModuleHeaders,
            dataType: "json",
            async: false
        }).done(function(data) {
            if (data) {
                loadUsers(data);
            }
            else {
                clear();
            }
        }).always(function(data) {
            isLoading(false);
        });
    };

    var save = function() {
        isLoading(true);
        var item = {
            id: id(),
            name: name(),
            description: description(),
            assignedUser: assignedUser()
        };
        var ajaxMethod = "POST";
        var restUrl = service.baseUrl;

        if (item.id > 0) {
            // ajaxMethod = "PATCH";
            restUrl += item.id;
        }
        var jqXHR = $.ajax({
            method: ajaxMethod,
            url: restUrl,
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(item),
            beforeSend: service.framework.setModuleHeaders,
            dataType: "json"
        }).done(function(data) {
            console.log(data);
            dnnModal.closePopUp();
        }).always(function(data) {
            isLoading(false);
        });
    };

    var cancel = function() {
        dnnModal.closePopUp(false);
    };

    var init = function() {
        var qs = getQueryStrings();
        var itemId = qs["tid"];
        if (itemId) {
            getItem(itemId);
        }
        getUserList();
    };


    return {
        id: id,
        name: name,
        description: description,
        assignedUser: assignedUser,
        userList: userList,
        cancel: cancel,
        load: load,
        save: save,
        init: init,
        isLoading: isLoading
    };
}
// Changed user to User
$safeprojectname$.User = function(id, name) {
    this.id = id;
    this.name = name;
}