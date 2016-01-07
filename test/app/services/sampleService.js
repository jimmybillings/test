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
    var MyService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            MyService = (function () {
                function MyService() {
                    this.message = "Servics are working great";
                }
                MyService.prototype.getMessage = function () {
                    return this.message;
                };
                MyService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], MyService);
                return MyService;
            })();
            exports_1("MyService", MyService);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL3NhbXBsZVNlcnZpY2UudHMiXSwibmFtZXMiOlsiTXlTZXJ2aWNlIiwiTXlTZXJ2aWNlLmNvbnN0cnVjdG9yIiwiTXlTZXJ2aWNlLmdldE1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQUVBO2dCQUlFQTtvQkFDRUMsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsMkJBQTJCQSxDQUFDQTtnQkFDN0NBLENBQUNBO2dCQUVNRCw4QkFBVUEsR0FBakJBO29CQUNFRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtnQkFDdEJBLENBQUNBO2dCQVZIRjtvQkFBQ0EsaUJBQVVBLEVBQUVBOzs4QkFZWkE7Z0JBQURBLGdCQUFDQTtZQUFEQSxDQVpBLEFBWUNBLElBQUE7WUFaRCxpQ0FZQyxDQUFBIiwiZmlsZSI6InNlcnZpY2VzL3NhbXBsZVNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNeVNlcnZpY2Uge1xuICBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gXCJTZXJ2aWNzIGFyZSB3b3JraW5nIGdyZWF0XCI7XG4gIH1cblxuICBwdWJsaWMgZ2V0TWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdlO1xuICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
