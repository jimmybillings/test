import {Component, Input, Output, EventEmitter,Inject, forwardRef} from '@angular/core';
import {FilterTree} from './filter-tree';
import {SearchComponent} from './search.component';

@Component({
    moduleId: module.id,
    selector: 'filter-tree',
    templateUrl: 'filter-tree.html',
    directives:[FilterTreeComponent]
})

export class FilterTreeComponent {
    @Input() rootFilter: FilterTree;
    @Output() onFilterChange: EventEmitter<any> = new EventEmitter();
    public searchComp:SearchComponent;
    constructor(@Inject(forwardRef(() => SearchComponent)) searchComp:SearchComponent) {
        this.searchComp = searchComp;
    }
    filterCheck (filter:FilterTree) {
        filter.check();
        this.onFilterChange.emit(filter);
        this.searchComp.applyFilter(filter);
    }
}
