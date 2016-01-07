System.register(['angular2/core'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var Login;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            Login = (function () {
                function Login() {
                    this.login = 'Login';
                }
                Login = __decorate([
                    core_1.Component({
                        selector: 'login',
                        template: "\n    <h3>{{login}}</h3><form action=\"#\"><div class=\"mdl-grid\"><div class=\"mdl-cell mdl-cell--6-col\"><div class=\"mdl-textfield mdl-js-textfield\"><input id=\"sample1\" type=\"text\" class=\"mdl-textfield__input\"/><label for=\"email\" class=\"mdl-textfield__label\"></label></div></div><div class=\"mdl-cell mdl-cell--6-col\"><div class=\"mdl-textfield mdl-js-textfield\"><input id=\"sample1\" type=\"password\" class=\"mdl-textfield__input\"/><label for=\"password\" class=\"mdl-textfield__label\"></label></div></div><div class=\"mdl-cell mdl-cell--6-col\"><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--accent\">Button</button></div></div></form>\n  "
                    }), 
                    __metadata('design:paramtypes', [])
                ], Login);
                return Login;
            })();
            exports_1("Login", Login);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdXNlci1tYW5hZ2VtZW50L2xvZ2luLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6WyJMb2dpbiIsIkxvZ2luLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFHQTtnQkFVRUE7b0JBQ0VDLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLE9BQU9BLENBQUFBO2dCQUN0QkEsQ0FBQ0E7Z0JBWkhEO29CQUFDQSxnQkFBU0EsQ0FBQ0E7d0JBQ1RBLFFBQVFBLEVBQUVBLE9BQU9BO3dCQUNqQkEsUUFBUUEsRUFBRUEsK3FCQUVUQTtxQkFDRkEsQ0FBQ0E7OzBCQVFEQTtnQkFBREEsWUFBQ0E7WUFBREEsQ0FiQSxBQWFDQSxJQUFBO1lBYkQseUJBYUMsQ0FBQSIsImZpbGUiOiJjb21wb25lbnRzL3VzZXItbWFuYWdlbWVudC9sb2dpbi5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge01BVEVSSUFMX0RJUkVDVElWRVMsIE1BVEVSSUFMX1BST1ZJREVSU30gZnJvbSAnbmcyLW1hdGVyaWFsL2FsbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xvZ2luJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8aDM+e3tsb2dpbn19PC9oMz48Zm9ybSBhY3Rpb249XCIjXCI+PGRpdiBjbGFzcz1cIm1kbC1ncmlkXCI+PGRpdiBjbGFzcz1cIm1kbC1jZWxsIG1kbC1jZWxsLS02LWNvbFwiPjxkaXYgY2xhc3M9XCJtZGwtdGV4dGZpZWxkIG1kbC1qcy10ZXh0ZmllbGRcIj48aW5wdXQgaWQ9XCJzYW1wbGUxXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cIm1kbC10ZXh0ZmllbGRfX2lucHV0XCIvPjxsYWJlbCBmb3I9XCJlbWFpbFwiIGNsYXNzPVwibWRsLXRleHRmaWVsZF9fbGFiZWxcIj48L2xhYmVsPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJtZGwtY2VsbCBtZGwtY2VsbC0tNi1jb2xcIj48ZGl2IGNsYXNzPVwibWRsLXRleHRmaWVsZCBtZGwtanMtdGV4dGZpZWxkXCI+PGlucHV0IGlkPVwic2FtcGxlMVwiIHR5cGU9XCJwYXNzd29yZFwiIGNsYXNzPVwibWRsLXRleHRmaWVsZF9faW5wdXRcIi8+PGxhYmVsIGZvcj1cInBhc3N3b3JkXCIgY2xhc3M9XCJtZGwtdGV4dGZpZWxkX19sYWJlbFwiPjwvbGFiZWw+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIm1kbC1jZWxsIG1kbC1jZWxsLS02LWNvbFwiPjxidXR0b24gY2xhc3M9XCJtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbi0tcmFpc2VkIG1kbC1idXR0b24tLWFjY2VudFwiPkJ1dHRvbjwvYnV0dG9uPjwvZGl2PjwvZGl2PjwvZm9ybT5cbiAgYFxufSlcblxuXG5leHBvcnQgY2xhc3MgTG9naW4geyAgICBcbiAgbG9naW46IHN0cmluZztcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5sb2dpbiA9ICdMb2dpbidcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
