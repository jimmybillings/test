var CurrentUser = (function () {
    function CurrentUser() {
        this._currentUser = this._user();
    }
    CurrentUser.prototype.set = function (user) {
        if (user === void 0) { user = false; }
        if (user)
            localStorage.setItem('currentUser', JSON.stringify(user));
        this._currentUser = this._user();
    };
    CurrentUser.prototype.loggedIn = function () {
        return (localStorage.getItem('token') !== null);
    };
    CurrentUser.prototype.email = function () {
        return this._currentUser.emailAddress;
    };
    CurrentUser.prototype.firstName = function () {
        return this._currentUser.firstName;
    };
    CurrentUser.prototype.lastName = function () {
        return this._currentUser.lastName;
    };
    CurrentUser.prototype.fullName = function () {
        return this._currentUser.firstName + " " + this._currentUser.lastName;
    };
    CurrentUser.prototype.createdOn = function () {
        return this._currentUser.createdOn;
    };
    CurrentUser.prototype.lastUpdated = function () {
        return this._currentUser.lastUpdated;
    };
    CurrentUser.prototype.siteName = function () {
        return this._currentUser.siteName;
    };
    CurrentUser.prototype.id = function () {
        return this._currentUser.id;
    };
    CurrentUser.prototype.accounts = function () {
        return this._currentUser.accountIds;
    };
    CurrentUser.prototype._user = function () {
        return JSON.parse(localStorage.getItem('currentUser')) || {
            emailAddress: null,
            firstName: null,
            lastName: null,
            id: null,
            accountIds: null
        };
    };
    return CurrentUser;
})();
exports.CurrentUser = CurrentUser;
