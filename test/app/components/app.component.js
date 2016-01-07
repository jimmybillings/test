System.register(['angular2/core', '../services/sampleService', './user-management/login.component'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, sampleService_1, login_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (sampleService_1_1) {
                sampleService_1 = sampleService_1_1;
            },
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(myService) {
                    this.serviceStatus = myService.getMessage();
                    this.appStatus = 'Application is working Jeff';
                }
                AppComponent.prototype.make = function () {
                    this.makey = 'hello';
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        bindings: [sampleService_1.MyService],
                        template: "\n    <!-- Always shows a header, even in smaller screens.--><div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\"><header class=\"mdl-layout__header\"><div class=\"mdl-layout__header-row\"><!-- Title--><span class=\"mdl-layout-title\">Wazee Digital</span><!-- Add spacer, to align navigation to the right--><div class=\"mdl-layout-spacer\"></div><!-- Navigation. We hide it in small screens.--><nav class=\"mdl-navigation mdl-layout--large-screen-only\"><a href=\"\" class=\"mdl-navigation__link\">Login</a><a href=\"\" class=\"mdl-navigation__link\">Register</a></nav></div></header><main class=\"mdl-layout__content\"><div class=\"page-content\"><main><div class=\"mdl-grid\"><div class=\"mdl-cell mdl-cell--12-col\"><ul><li> <p>{{ appStatus }}</p></li><li> <p>{{ serviceStatus }}</p></li></ul><login></login></div></div></main></div></main></div>\n  ",
                        styles: ["p {color:red}"],
                        directives: [login_component_1.Login],
                        providers: [sampleService_1.MyService]
                    }), 
                    __metadata('design:paramtypes', [sampleService_1.MyService])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6WyJBcHBDb21wb25lbnQiLCJBcHBDb21wb25lbnQuY29uc3RydWN0b3IiLCJBcHBDb21wb25lbnQubWFrZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBSUE7Z0JBaUJFQSxzQkFBWUEsU0FBb0JBO29CQUU5QkMsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsU0FBU0EsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7b0JBQzVDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSw2QkFBNkJBLENBQUNBO2dCQUNqREEsQ0FBQ0E7Z0JBRURELDJCQUFJQSxHQUFKQTtvQkFDRUUsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsT0FBT0EsQ0FBQUE7Z0JBQ3RCQSxDQUFDQTtnQkF6QkhGO29CQUFDQSxnQkFBU0EsQ0FBQ0E7d0JBQ1RBLFFBQVFBLEVBQUVBLEtBQUtBO3dCQUNmQSxRQUFRQSxFQUFFQSxDQUFDQSx5QkFBU0EsQ0FBQ0E7d0JBQ3JCQSxRQUFRQSxFQUFFQSxtMkJBRVRBO3dCQUNEQSxNQUFNQSxFQUFFQSxDQUFDQSxlQUFlQSxDQUFDQTt3QkFDekJBLFVBQVVBLEVBQUVBLENBQUNBLHVCQUFLQSxDQUFDQTt3QkFDbkJBLFNBQVNBLEVBQUVBLENBQUNBLHlCQUFTQSxDQUFDQTtxQkFDdkJBLENBQUNBOztpQ0FpQkRBO2dCQUFEQSxtQkFBQ0E7WUFBREEsQ0ExQkEsQUEwQkNBLElBQUE7WUExQkQsdUNBMEJDLENBQUEiLCJmaWxlIjoiY29tcG9uZW50cy9hcHAuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHsgTXlTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvc2FtcGxlU2VydmljZSc7XG5pbXBvcnQge0xvZ2lufSBmcm9tICcuL3VzZXItbWFuYWdlbWVudC9sb2dpbi5jb21wb25lbnQnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcCcsXG4gIGJpbmRpbmdzOiBbTXlTZXJ2aWNlXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8IS0tIEFsd2F5cyBzaG93cyBhIGhlYWRlciwgZXZlbiBpbiBzbWFsbGVyIHNjcmVlbnMuLS0+PGRpdiBjbGFzcz1cIm1kbC1sYXlvdXQgbWRsLWpzLWxheW91dCBtZGwtbGF5b3V0LS1maXhlZC1oZWFkZXJcIj48aGVhZGVyIGNsYXNzPVwibWRsLWxheW91dF9faGVhZGVyXCI+PGRpdiBjbGFzcz1cIm1kbC1sYXlvdXRfX2hlYWRlci1yb3dcIj48IS0tIFRpdGxlLS0+PHNwYW4gY2xhc3M9XCJtZGwtbGF5b3V0LXRpdGxlXCI+V2F6ZWUgRGlnaXRhbDwvc3Bhbj48IS0tIEFkZCBzcGFjZXIsIHRvIGFsaWduIG5hdmlnYXRpb24gdG8gdGhlIHJpZ2h0LS0+PGRpdiBjbGFzcz1cIm1kbC1sYXlvdXQtc3BhY2VyXCI+PC9kaXY+PCEtLSBOYXZpZ2F0aW9uLiBXZSBoaWRlIGl0IGluIHNtYWxsIHNjcmVlbnMuLS0+PG5hdiBjbGFzcz1cIm1kbC1uYXZpZ2F0aW9uIG1kbC1sYXlvdXQtLWxhcmdlLXNjcmVlbi1vbmx5XCI+PGEgaHJlZj1cIlwiIGNsYXNzPVwibWRsLW5hdmlnYXRpb25fX2xpbmtcIj5Mb2dpbjwvYT48YSBocmVmPVwiXCIgY2xhc3M9XCJtZGwtbmF2aWdhdGlvbl9fbGlua1wiPlJlZ2lzdGVyPC9hPjwvbmF2PjwvZGl2PjwvaGVhZGVyPjxtYWluIGNsYXNzPVwibWRsLWxheW91dF9fY29udGVudFwiPjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRlbnRcIj48bWFpbj48ZGl2IGNsYXNzPVwibWRsLWdyaWRcIj48ZGl2IGNsYXNzPVwibWRsLWNlbGwgbWRsLWNlbGwtLTEyLWNvbFwiPjx1bD48bGk+IDxwPnt7IGFwcFN0YXR1cyB9fTwvcD48L2xpPjxsaT4gPHA+e3sgc2VydmljZVN0YXR1cyB9fTwvcD48L2xpPjwvdWw+PGxvZ2luPjwvbG9naW4+PC9kaXY+PC9kaXY+PC9tYWluPjwvZGl2PjwvbWFpbj48L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbYHAge2NvbG9yOnJlZH1gXSxcbiAgZGlyZWN0aXZlczogW0xvZ2luXSxcbiAgcHJvdmlkZXJzOiBbTXlTZXJ2aWNlXVxufSlcblxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gIGxvY2F0aW9uOiBMb2NhdGlvbjtcbiAgYXBwU3RhdHVzOiBzdHJpbmc7XG4gIHNlcnZpY2VTdGF0dXM6IHN0cmluZztcbiAgbWFrZXk6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihteVNlcnZpY2U6IE15U2VydmljZSkge1xuXG4gICAgdGhpcy5zZXJ2aWNlU3RhdHVzID0gbXlTZXJ2aWNlLmdldE1lc3NhZ2UoKTtcbiAgICB0aGlzLmFwcFN0YXR1cyA9ICdBcHBsaWNhdGlvbiBpcyB3b3JraW5nIEplZmYnO1xuICB9XG5cbiAgbWFrZSgpIHtcbiAgICB0aGlzLm1ha2V5ID0gJ2hlbGxvJ1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
