import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Country, Region, SmallCountry } from '../../interfaces/countries.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];

  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['',Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  constructor( private fb: FormBuilder,
    private countriesservice: CountriesService,
  ){}

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesservice.regions;
  }

  onRegionChange():void {
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('country')!.setValue('')),
      tap( () => this.borders = []),
      switchMap(region => this.countriesservice.getCountriesByRegion(region) ),
    )
    .subscribe(countries => {
      this.countriesByRegion = countries;
    });
  }

  onCountryChanged(): void{
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('border')!.setValue('')),
      filter( (value:string) => value.length > 0),
      switchMap(alphacode => this.countriesservice.getCountryByAlphaCode(alphacode)),
      switchMap( country => this.countriesservice.getCountryBordersByCodes(country.borders)),
    )
    .subscribe(countries => {
      this.borders = countries;
    });
  }

}
