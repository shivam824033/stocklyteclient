import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login';
import { ProductDetails } from '../models/product-details';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {



 // baseUrl =  "http://stocklyte.ap-south-1.elasticbeanstalk.com";
  baseUrl = "http://localhost:5000";

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest) {
    return this.http.post(
      `${this.baseUrl}/api/auth/login`, loginRequest, { withCredentials: true }
    );
  }

  logoutSession() {
    console.log("home")
    const token = localStorage.getItem('token');
    const userDetails = localStorage.getItem('UserDetails');
    if (token !== null && token !== undefined && userDetails !== null && userDetails !== undefined) {
      localStorage.removeItem('token');
      localStorage.removeItem('UserDetails');
      return this.http.get(`${this.baseUrl}/api/auth/logout`);
    }
    return;
  }

  signUp(signupRequest: any) {
    return this.http.post(`${this.baseUrl}/api/auth/signUp`, signupRequest, { withCredentials: true });
  }

  generateKey() {
    return this.http.get(`${this.baseUrl}/api/owner/generatekey`);
  }

  addProduct(product: ProductDetails) {
    return this.http.post(`${this.baseUrl}/api/seller/addProduct`, product);
  }

  searchSellerProduct(term: string) {
    if (term === '') {
      return of([]);
    }
    term = term.trim();
    const PARAMS = new HttpParams({});
    return this.http.get(`${this.baseUrl}/api/public/getMasterProduct`, {
      params: PARAMS.set('keyword', term)
    }).pipe(
      map((response: any) => response['response']))
  }

  getSellerProduct(term: string, storeId: number) {
    if (term === '') {
      return of([]);
    }
    term = term.trim();
    const PARAMS = new HttpParams({});
    return this.http.get(`${this.baseUrl}/api/public/getSellerProduct`, {
      params: PARAMS.set('keyword', term).set('storeId', storeId)
    }).pipe(
      map((response: any) => response['response']))
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    let endpoint = '';

    // Detect file type by extension
    if (file.name.endsWith('.csv')) {
      endpoint = `${this.baseUrl}/api/seller/csv`;
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      endpoint = `${this.baseUrl}/api/seller/excel`;
    } else {
      throw new Error('Unsupported file type');
    }

    const req = new HttpRequest('POST', endpoint, formData, {
      reportProgress: true,
      responseType: 'blob'
    });

    return this.http.request(req);
  }

  // ...existing code...
  finalizeBill(billItems: any[]) {
    return this.http.post(`${this.baseUrl}/api/invoice/createInvoice`, billItems);
  }
  // ...existing code...

  // ...existing code...
getExpiredProducts(date: string) {
  return this.http.post(`${this.baseUrl}/api/seller/expiredProducts`, { date });
}
// ...existing code...
  sendOtp(email: string) {
    return this.http.get(`${this.baseUrl}/api/otp/send?email=${email}`);
  }

  verifyOtp(email: string, otp: string){
    return this.http.get(`${this.baseUrl}/api/otp/verify?email=${email}&otp=${otp}`);
  }

  // ...existing code...
getAllUsers(role: string) {
  let url = `${this.baseUrl}/api/owner/users`;
  if (role) url += `?role=${role}`;
  return this.http.get(url);
}

accountAction(userId: number, accountStatus: string) {
  return this.http.post(`${this.baseUrl}/api/owner/accountAction`, { userId, accountStatus });
}
// ...existing code...
  downloadbatchPDF(batchIds: string) {
    const PARAMS = new HttpParams({});
    return this.http.get(`${this.baseUrl}/api/seller/batches/pdf` ,{
      params: PARAMS.set('batchIds', batchIds)});
  }

    downloadBatchPDF(batchIds: string, cols = 3, rows = 4) {
    const url = `${this.baseUrl}/api/seller/batches/pdf?batchIds=${batchIds}&cols=${cols}&rows=${rows}`;

    return this.http.get(url, {  responseType: 'blob' });
  }

}
