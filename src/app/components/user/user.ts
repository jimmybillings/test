import {bootstrap, Component, View, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';

@Component({
    selector:'user'
})

@View({
    templateUrl: "/app/components/user/user.html"
})

export class User {   
    public text = 'Super Simple Jeff Component'
}