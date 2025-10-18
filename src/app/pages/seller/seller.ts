import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, tap, switchMap, catchError, of, map, delay } from 'rxjs';
import { ProductDetails, Category, MasterProductDetails } from '../../models/product-details';
import { GlobalService } from '../../service/global-service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeDevice, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-seller',
  imports: [FormsModule, CommonModule, DatePipe, DecimalPipe, NgbTypeahead, NgxScannerQrcodeComponent],
  templateUrl: './seller.html',
  styleUrl: './seller.css'
})
export class Seller {

  isLoading: boolean = false;
  successMessage = "";
  errorMessage = "";
  searchShow = false;
  addAnotherbtn = false;
  categories2 = [
    {
      "id": "1",
      "name": "Tablet"
    },
    {
      "id": "2",
      "name": "Capsule"
    },
    {
      "id": "3",
      "name": "Cream"
    }
  ];

  customerName: string = '';
  customerMobile: string = '';
  customerAddress: string = '';

  sum: ((previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any) | undefined;
  selectedFile: any;
  progress: number = 0;
  message: string | undefined;
  discount: number = 0;
  invoicePreview: any;
  invoiceViewFlag: boolean = false;
  addProductType: string = '1';
isBarCodeEnable: string = 'N';
  ;

  onClick(data: any) {
    console.log("on click", this.categories2)
  }
  product = new ProductDetails();
  productSearchResult = new ProductDetails();
  // productList= new Array<ProductDetails>;
  productList: ProductDetails[] = [];
  categories: Category[] = [];

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      }
    },
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

  @ViewChild('action')
  action!: NgxScannerQrcodeComponent;

  constructor(private sellerService: GlobalService, private qrcode: NgxScannerQrcodeService) {
    this.searchShow = false;
    //     var cat = new Category();
    //     cat.name = "Tablet";
    //     cat.value = 1;
    // this.categories.push(cat)
    console.log(this.categories2)
  }

  ngAfterViewInit(): void {
    this.action.isReady.pipe(delay(1000)).subscribe(() => {
      this.handle(this.action, 'start');
    });
  }

  sessionUserDetails: any;
  ngOnInit(): void {
    const userDetails = localStorage.getItem('UserDetails');
    if (undefined != userDetails && null != userDetails) {
      this.sessionUserDetails = JSON.parse(userDetails);
      if (this.sessionUserDetails.roles !== 'SELLER') {
        window.location.href = '/home';
      }
    }
  }


  onDiscountChange(discount: any) {
    this.billErrorMessage ='';
    // if (this.billItems && this.billItems.length > 0) {
    //   this.billItems.forEach(item => {
    //     item.discount = discount;
    //     this.getTotalBillPerPRoduct(item);
    //   });
    // }
  }



  addProduct(form: any) {
    this.errorMessage = "";
    this.successMessage = "";
    if (this.product !== null) {
      // const newProduct = form.value;
      // Object.assign(this.product, newProduct);
      console.log('Product added successfully:', this.product);
      this.productList.push(this.product);

      if (this.product.batchNumber !== null) {
        this.isLoading = true;
        this.sellerService.addProduct(this.product).subscribe((data: any) => {
          this.isLoading = false;

          if (data.errorMessage != null) {
            this.errorMessage = data.errorMessage;
          } else {
            this.successMessage = 'Product added successfully'; //data.response;
            this.addAnotherbtn = true;
          }

        })
      }

      // Add logic to send the product to the backend or store it
      // alert('Product added successfully!');
      //form.reset();
    }
  }

  addAnotherProduct() {
    this.product = new ProductDetails();
    this.errorMessage = "";
    this.successMessage = "";
    this.addAnotherbtn = false;
  }

  searching = false;
  searchFailed = false;
  model: any;
  masterProduct!: MasterProductDetails;

  //  formatter = (x: { BproductName: string, AexpiryDate: string }) => (x.BproductName, x.AexpiryDate);
  formatter = (x: { productName: string, batchNumber: string }) => `${x.productName} (${x.batchNumber})`;

  searchProduct: OperatorFunction<string, any> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.expiryShow = false;
        this.isLoading = true;

      }),
      switchMap((term) =>
        this.sellerService.getSellerProduct(term, this.sessionUserDetails.storeId).pipe(
          tap((res) => {
            this.searchFailed = false;
            this.isLoading = false;

          }),
          catchError(() => {
            this.searchFailed = true;
            this.isLoading = false;

            return of([]);
          })),
      ),
      map((response) => {
        // this.productSearchList = response;
        // var list: any[] = [];
        // response.forEach((res:any) => {
        //   list.push({"AexpiryDate" : res.productExpiryDate, "BproductName": res.productName});
        // });

        // console.log("search list",list)
        // return list;
        return response;
      })
    );

  searchProduct2: OperatorFunction<string, any> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.expiryShow = false;
        this.invoiceViewFlag = false;
        this.isLoading = true;
      }),
      switchMap((term) =>
        this.sellerService.getSellerProduct(term, this.sessionUserDetails.storeId).pipe(
          tap((res) => {
            this.searchFailed = false;
            this.isLoading = false;
          }),
          catchError(() => {
            this.searchFailed = true;
            this.isLoading = false;
            return of([]);
          })),
      ),
      map((response) => {
        // this.productSearchList = response;
        // var list: any[] = [];
        // response.forEach((res:any) => {
        //   list.push({"AexpiryDate" : res.productExpiryDate, "BproductName": res.productName});
        // });

        // console.log("search list",list)
        // return list;
        return response;
      })
    );

  productSearchList: any;
  onProductselect(data: any) {
    console.log("selelr product details: ", data)
    //  this.masterProduct = data.item;
    this.productSearchResult = data.item;
    this.searchShow = true;
    // var onSelectproduct = data.item;

    // this.productSearchList.forEach((productObj:any) => {
    //   if(productObj.productName === onSelectproduct.BproductName){
    //     this.productSearchResult = productObj;
    //     this.searchShow = true;
    //   }
    // });
  }

  searchProductTemp: any;
  selectedProduct: any = null;
  selectedProductName: string = '';
  sellQuantity: number = 1;
  billItems: any[] = [];
  billSuccessMessage: string = '';
  billErrorMessage: string = '';

  onProductSelectForBilling(event: any) {
    this.selectedProduct = event.item;
    this.selectedProductName = this.selectedProduct.productName;
  }

  addToBill() {

    this.billErrorMessage = '';
    if (!this.selectedProduct || !this.sellQuantity) return;
    if (this.sellQuantity > this.selectedProduct.productStripCount) {
      this.billErrorMessage = 'Not enough stock!';
      return;
    }

    this.billItems.forEach(item => {
      if (item.batchNumber === this.selectedProduct.batchNumber) {
        this.billErrorMessage = 'Product Already exits in the bill!';
        this.searchProductTemp = null;
        item.warning = 'Product Already exits in the bill!';
        return;
      } else {
        item.warning = '';
      }
    });

    if (this.billErrorMessage) {
      return;
    }


    this.billItems.push({
      ...this.selectedProduct,
      quantity: this.sellQuantity,
      discount: this.discount,// Initialize discount,
      error: '',
      warning: '',
      tempValue: 0
    });
    this.selectedProduct = null;
    this.selectedProductName = '';
    this.sellQuantity = 1;
    this.billErrorMessage = '';
    this.searchProductTemp = null;
  }

  removeBillItem(index: number) {
    this.billItems.splice(index, 1);
  }

  tempTotalAmount: number = 0;
  getBillTotal() {
    if (!this.billErrorMessage) {
      this.tempTotalAmount = this.billItems.reduce((sum, item) =>
        sum +
        ((item.quantity * item.productPerPrice) -
          ((item.quantity * item.productPerPrice * (item.discount || 0)) / 100)), 0);
    }

    return this.tempTotalAmount
  }
  tempTotalAmountPerProduct: number = 0;
  getTotalBillPerPRoduct(item: any) {
    if (!item.error) {
      item.tempValue = ((item.quantity * item.productPerPrice) -
        ((item.quantity * item.productPerPrice * (item.discount || 0)) / 100));
    }
    return item.tempValue;
  }


  // ...existing code...
  finalizeBill() {
    this.billErrorMessage = '';
    if (this.billItems.length === 0) {
      this.billErrorMessage = 'No items in the bill to finalize!';
      return;
    }

    if (!this.customerName) {
      this.billErrorMessage = 'Customer name are required!';
      return;
    }
    // Optionally, collect customer info from a form and add to billItems[0]
    this.billItems[0].customerName = this.customerName;
    this.billItems[0].customerMobile = this.customerMobile;

    this.isLoading = true;

    this.sellerService.finalizeBill(this.billItems).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.errorMessage) {
          this.billErrorMessage = res.errorMessage;
        } else {
          // Show invoice preview
          this.invoicePreview = res.response;
          this.billSuccessMessage = 'Bill finalized successfully!';
          this.billItems = [];
          this.invoiceViewFlag = true;
          setTimeout(() => this.billSuccessMessage = '', 3000);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.billErrorMessage = 'Failed to finalize bill!';
      }
    });
  }
  // ...existing code...

  onQuantityChange(index: number) {
    // Optionally, add validation or update logic here if needed
    // For example, prevent negative or zero quantity, or check stock
    this.billErrorMessage = '';
    this.billItems[index].error = '';
    if (this.billItems[index].quantity > this.billItems[index].productStripCount) {
      this.billItems[index].error = 'Not enough stock!';
      this.billErrorMessage = 'Not enough stock!';
      return;
    }
    if (this.billItems[index].quantity < 1) {
      this.billItems[index].quantity = 1;
    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.progress = 0;
    this.message = '';
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.message = 'Please select a file first!';
      return;
    }

    this.sellerService.upload(this.selectedFile).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {

          // const fileURL = window.URL.createObjectURL(event.body);
          // const printWindow = window.open(fileURL, '_blank');
          // printWindow?.addEventListener('load', () => {
          //   printWindow.print();
          // });

            // Create file URL from blob
        const fileURL = window.URL.createObjectURL(event.body);

        // ✅ Trigger automatic download
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `BatchLabels_${new Date().toISOString().slice(0, 19)}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // ✅ Open for print preview
        const printWindow = window.open(fileURL, '_blank');
        if (printWindow) {
          printWindow.addEventListener('load', () => {
            printWindow.print();
          });
        }

        // Optional: revoke URL after short delay to release memory
        setTimeout(() => URL.revokeObjectURL(fileURL), 5000);


          // this.message = event.body;
        }
      },
      error: (err: any) => {
        this.message = 'Could not upload the file! ' + err.message;
      }
    });
  }

  expiredProducts: any[] = [];
  expiredProductDate: string = '';
  expiredProductError: string = '';
  expiryShow: boolean = false;
  fetchExpiredProducts() {
    this.expiredProductError = '';
    if (!this.expiredProductDate) {
      this.expiredProductError = 'Please select a date.';
      return;
    }
    this.searchShow = false;
    this.isLoading = true;

    this.sellerService.getExpiredProducts(this.expiredProductDate).subscribe(
      (res: any) => {

        this.isLoading = false;
        this.expiredProducts = res;
        this.expiryShow = true;
        if (this.expiredProducts.length === 0) {
          this.expiredProductError = 'No expired products found before the selected date.';
          this.expiryShow = false;
        }

      }), {
      error: () => {
        this.expiredProductError = 'Failed to fetch expired products.';
        this.isLoading = false;
      }
    };
  }
  // ...existing code...
  printInvoice() {
    const printContents = document.getElementById('invoiceContent')?.innerHTML;
    if (!printContents) return;
    const popupWin = window.open('', '_blank', 'width=800,height=900');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        </head>
        <body onload="window.print();window.close()">
          ${printContents}
        </body>
      </html>
    `);
      popupWin.document.close();
    }
  }
  // ...existing code...

  backToBilling() {
    this.invoiceViewFlag = false;
    this.invoicePreview = null;
    this.billErrorMessage = '';
    this.billSuccessMessage = '';
    this.searchShow = false;
    this.expiryShow = false;
    this.selectedProduct = null;
    this.selectedProductName = '';
    this.sellQuantity = 1;
    this.billItems = [];
    this.discount = 0;
    this.tempTotalAmount = 0;
    this.tempTotalAmountPerProduct = 0;
    this.customerName = '';
    this.customerMobile = '';
    this.customerAddress = '';
    this.searchProductTemp = null;
    this.successMessage = "";
    this.errorMessage = "";
    this.addAnotherbtn = false;
    this.result='';
    this.count=0;
  }

  result: string = "";
  count: number = 0;
  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    e?.length && action; // Detect once and pause scan!
    action.pause(); // stop scanner
    this.playBeep(); // 🔊 Play beep

    let binArrayToString = function (binArray: any) {
      let str = "";
      for (let i = 0; i < binArray.length; i++) {
        str += String.fromCharCode(parseInt(binArray[i]));
      }
      return str;
    }
    this.count++;
    console.log('utf8ArrayToString ' + this.count + " : " + binArrayToString(e[0].data));
    this.result = binArrayToString(e[0].data);

    this.processScannedData(this.result);


    setTimeout(() => action.play(), 1000);
  }

  processScannedData(data: string) {
    this.billErrorMessage = '';
    this.sellerService.getSellerProduct(data, this.sessionUserDetails.storeId).subscribe(
      (res: any) => {

        this.selectedProduct = res[0];

        if (this.selectedProduct) {
          this.selectedProductName = this.selectedProduct.productName;

          this.addToBill();
        } else {
          this.billErrorMessage = "Product not found!";
        }
      },
      (error: any) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: ScannerQRCodeDevice[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  public onSelects(files: any): void {
    this.qrcode.loadFiles(files).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
    });
  }

  public onSelects2(files: any): void {
    this.qrcode.loadFilesToScan(files, this.config).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      console.log(res);
      this.qrCodeResult2 = res;
    });
  }

  private playBeep(): void {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 800; // frequency in Hz
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 200); // beep duration (200ms)
  }

  batchIds: string = '';
  downloadPDF(): void {

    this.sellerService.downloadBatchPDF(this.batchIds).subscribe({
      next: (blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        const printWindow = window.open(fileURL, '_blank');
        // printWindow?.addEventListener('load', () => {
        //   printWindow.print();
        // });


      }
    });
  }

}
