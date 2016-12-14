import { WzAutocompleteSearchComponent } from './wz-autocomplete-search.component';
import { FormBuilder } from '@angular/forms';

export function main() {
  describe('Wz Input Suggestions Component', () => {
    var HTMLElements: any = {};
    document.querySelector = jasmine.createSpy('HTML Element').and.callFake(function (ID: any) {
      if (!HTMLElements[ID]) {
        var newElement = document.createElement('button');
        HTMLElements[ID] = newElement;
      }
      return HTMLElements[ID];
    });
    let componentUnderTest: WzAutocompleteSearchComponent;
    let fb: FormBuilder = new FormBuilder();
    beforeEach(() => {
      componentUnderTest = new WzAutocompleteSearchComponent(fb);
    });

    describe('Creates form', () => {
      it('Creates the correct form control', () => {
        expect(Object.keys(componentUnderTest.searchForm.controls)).toEqual(['query']);
      });

      it('Makes input a required field', () => {
        expect(componentUnderTest.searchForm.controls['query'].errors).toEqual({ 'required': true });
      });

    });

    describe('Filter Tree controls', () => {
      it('toggle filters show and hide', () => {
        spyOn(componentUnderTest.toggleFilterTree, 'emit');
        componentUnderTest.toggleFilters();
        expect(componentUnderTest.toggleFilterTree.emit).toHaveBeenCalled();
        expect(document.querySelector).toHaveBeenCalledWith('button.filter');
      });
    });

    describe('Submits a new search', () => {
      it('Emits a new search context without quotes', () => {
        spyOn(componentUnderTest.searchContext, 'emit');
        componentUnderTest.onSubmit('dog');
        expect(componentUnderTest.searchContext.emit).toHaveBeenCalledWith('dog');
      });

      it('Emits a new search context with quotes', () => {
        spyOn(componentUnderTest.searchContext, 'emit');
        componentUnderTest.onSubmit('dog', true);
        expect(componentUnderTest.searchContext.emit).toHaveBeenCalledWith('\"dog\"');
      });
    });

  });
};

