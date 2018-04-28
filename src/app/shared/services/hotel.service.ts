import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Hotel } from '../interfaces/hotel.interface';
import * as moment from 'moment';
import { DATE_FORMAT } from '../../config/defines';
@Injectable()
export class HotelService {
  /** holds all hotels from server */
  public hotels = new BehaviorSubject([]);

  public hotelName = new BehaviorSubject('');

  public hotelPrice = new BehaviorSubject('');

  constructor(private _http: HttpClient) { }

  /** Get All hotels from server */
  public getHotels(from?: Date, to?: Date) {
    return this._http.get(environment.baseUrl).map((data: any) => {
      let result: Array<Hotel> = data.hotels;
      if (from || to) {
        const filterdDays = result
          .filter(hotel => hotel.availability
            .filter(day => {
              return (moment(from).isSameOrBefore(moment(day.to, DATE_FORMAT)) && moment(to).isSameOrAfter(moment(day.from, DATE_FORMAT))) ||
              (moment(to).isSameOrAfter(moment(day.from, DATE_FORMAT)) && moment(from).isSameOrBefore(moment(day.from, DATE_FORMAT)));
            }).length > 0);
        this.hotels.next(filterdDays);
        console.log('filterdDays: ',filterdDays)
        return filterdDays;
      }

      this.hotels.next(result);
      return result;
    });
  }

  /** Sorting the loaded hotels by name or price */
  public sortHotels(prop: 'name' | 'price') {
    let hotels = [...this.hotels.getValue() as Array<Hotel>];
    hotels = hotels.sort((hotelOne: Hotel, hotelTwo: Hotel) => hotelOne[prop] > hotelTwo[prop] ? 1 : -1);
    console.log(hotels)
    this.hotels.next(hotels);
  }

  /** search hotels by name */
  searchHotelByName(name) {
    this.hotelName.next(name);
  }

  /** search hotels by name */
  searchHotelByPrice(price) {
    this.hotelPrice.next(price);
  }

}
