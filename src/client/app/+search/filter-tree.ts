export class FilterTree {
    public expanded = false;
    public checked = false;
    public parent:FilterTree = null;
    constructor(
                public filterId:string,
                public name:string,
                public subFilters:Array<FilterTree>,
                public type:string,
                public count:Number) {
    }
   public contains (list:Array<any>, item:any): boolean {
        if(!list || list === null || list.length <=0) {
            return false;
        }
        for(var f of list) {
            if(f.toString() === item.toString()) {
                return true;
            }
        }
        return false;
    }
    public load(obj:any, tree:FilterTree, selectedIds:Array<string>):FilterTree {
        if(tree === null) {
            tree = new FilterTree(obj.filterId,obj.name,[],obj.type,obj.count);
            if(this.contains(selectedIds,obj.filterId) === true) {
                tree.checked = true;
                tree.expanded = true;
            }
        }
        if(obj.subFilters && obj.subFilters.length > 0) {
            for(var f of obj.subFilters) {
                var t = new FilterTree(f.filterId,f.name,[],f.type,f.count);
                if(this.contains(selectedIds,f.filterId) === true) {
                    t.checked = true;
                    tree.expandAll();
                }
                t.parent = tree;
                tree.subFilters.push(t);
                this.load(f,t,selectedIds);
            }
        }
        return tree;
    }
    expandAll() : void {
        this.expanded = true;
        if(this.parent !== null) {
            this.parent.expandAll();
        }
    }
    getDisplay() :string {
        let s:string = this.name;
        if(this.type === 'Text' || this.type === 'DateRange' || this.type === 'List') {
            s += ' ... ';
        }
        return s;
    }
    hasCount(): boolean {
        return this.count > 0;
    }
    getCount() :string {
        let s:string = '';
         if(this.count >= 0) {
            s += '    ('+this.count+')';
        }
        return s;
    }
    toggle() {
        this.expanded = !this.expanded;
    }
    getIcon() {
        if(this.subFilters.length === 0) return '';
        if(this.expanded) {
            return ' - ';
        }

        return ' + ';
    }
    check() {
        this.checked = !this.checked;
    }
    public selectedFilters() :Array<FilterTree> {
        var v:Array<FilterTree> = new Array();
        this.getSelectedFilters(v);
        return v;
    }
    private getSelectedFilters(v:Array<FilterTree>) :void {
        if(this.checked) {
            v.push(this);
        }
        for(var f of this.subFilters) {
            f.getSelectedFilters(v);
        }
    }
}
