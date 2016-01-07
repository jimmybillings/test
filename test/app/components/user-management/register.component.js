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
    var Register;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            Register = (function () {
                function Register() {
                    this.register = 'Register';
                }
                Register = __decorate([
                    core_1.Component({
                        selector: 'register',
                        template: "\n    <div class=\"row\">\n      <h3>{{register}}</h3>\n      <form class=\"login\" method=\"post\">\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"First Name\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"Last Name\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"Street\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"State\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"City\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"text\" name=\"name\" value=\"\" placeholder=\"Zip code\">\n      </div>\n      <div class=\"input-field col s6\">\n        <input type=\"password\" name=\"name\" value=\"\" placeholder=\"Password\">\n      </div>\n      <div class=\"input-field col s12\">\n        <a class=\"waves-effect waves-light btn\">Register</a>\n      </div>\n    </form>\n  "
                    }), 
                    __metadata('design:paramtypes', [])
                ], Register);
                return Register;
            })();
            exports_1("Register", Register);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdXNlci1tYW5hZ2VtZW50L3JlZ2lzdGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6WyJSZWdpc3RlciIsIlJlZ2lzdGVyLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFQTtnQkFvQ0VBO29CQUNFQyxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxVQUFVQSxDQUFBQTtnQkFDNUJBLENBQUNBO2dCQXRDSEQ7b0JBQUNBLGdCQUFTQSxDQUFDQTt3QkFDVEEsUUFBUUEsRUFBRUEsVUFBVUE7d0JBQ3BCQSxRQUFRQSxFQUFFQSw2cUNBNkJUQTtxQkFDRkEsQ0FBQ0E7OzZCQU9EQTtnQkFBREEsZUFBQ0E7WUFBREEsQ0F2Q0EsQUF1Q0NBLElBQUE7WUF2Q0QsK0JBdUNDLENBQUEiLCJmaWxlIjoiY29tcG9uZW50cy91c2VyLW1hbmFnZW1lbnQvcmVnaXN0ZXIuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdyZWdpc3RlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGgzPnt7cmVnaXN0ZXJ9fTwvaDM+XG4gICAgICA8Zm9ybSBjbGFzcz1cImxvZ2luXCIgbWV0aG9kPVwicG9zdFwiPlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPVwiXCIgcGxhY2Vob2xkZXI9XCJGaXJzdCBOYW1lXCI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiB2YWx1ZT1cIlwiIHBsYWNlaG9sZGVyPVwiTGFzdCBOYW1lXCI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiB2YWx1ZT1cIlwiIHBsYWNlaG9sZGVyPVwiU3RyZWV0XCI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiB2YWx1ZT1cIlwiIHBsYWNlaG9sZGVyPVwiU3RhdGVcIj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPVwiXCIgcGxhY2Vob2xkZXI9XCJDaXR5XCI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiB2YWx1ZT1cIlwiIHBsYWNlaG9sZGVyPVwiWmlwIGNvZGVcIj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgbmFtZT1cIm5hbWVcIiB2YWx1ZT1cIlwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMTJcIj5cbiAgICAgICAgPGEgY2xhc3M9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCI+UmVnaXN0ZXI8L2E+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Zvcm0+XG4gIGBcbn0pXG5cbmV4cG9ydCBjbGFzcyBSZWdpc3RlciB7XG4gIHJlZ2lzdGVyOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVnaXN0ZXIgPSAnUmVnaXN0ZXInXG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
