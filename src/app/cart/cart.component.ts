import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { LocalStorageService } from '../localStorageService';

interface IBike {
  id?: number;
  image: string;
  description: string;
  price: number;
  quantity: number;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  bikes: Array<IBike> = [];
  localStorageService: LocalStorageService<IBike>;
  nameInput = '';

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.bikes = await this.loadBikes();
  }

  async loadBikes() {
    let bikes = JSON.parse(localStorage.getItem('bikes'));
    if (bikes && bikes.length > 0) {

    } else {
      bikes = await this.loadBikesFromJson();
    }
    this.bikes = bikes;
    return bikes;
  }

  async loadBikesFromJson() {
    const bikes = await this.http.get('assets/inventory.json').toPromise();
    return bikes.json();
  }

  addBike(item: string) {
    switch (item) {
      case 'bike1':
        this.bikes.push({
          id: 1,
          image: '../../assets/bike1.jpeg',
          description: null,
          price: null,
          quantity: 1
        });
        break;
      case 'bike2':
        this.bikes.push({
          id: 2,
          image: '../../assets/bike2.jpeg',
          description: null,
          price: null,
          quantity: 1
        });
        break;
      case 'bike3':
        this.bikes.push({
          id: 3,
          image: '../../assets/bike3.jpeg',
          description: null,
          price: null,
          quantity: 1
        });
        break;
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }

  saveBike() {
    this.saveToLocalStorage();
    this.toastService.showToast('success', 4000, 'Success: Items saved!')
  }

  delete() {
    this.bikes.splice(-1, 1);
    this.saveToLocalStorage();
  }

  checkout() {
    if (this.nameInput === '') {
      this.toastService.showToast('warning', 5000, 'name must not be null');
    } else if (this.nameInput.indexOf(', ') === -1) {
      this.toastService.showToast('warning', 5000, 'name must contain a comma and a space');
    } else {
      const data = this.calculate();
      this.router.navigate(['invoice', data]);
    }
  }

  calculate() {
    let subTotal, total, taxAmt;
    total = this.bikes.reduce((acc, it, i, arr) => {
      acc += it.price * it.quantity;
      return acc;
    }, 0);
    taxAmt = total * .10;
    subTotal = total - taxAmt;
    return {
      name: this.nameInput,
      tax: taxAmt,
      subTotal: subTotal,
      total: total,
    };
  }



}
