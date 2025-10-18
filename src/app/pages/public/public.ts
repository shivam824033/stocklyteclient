import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeDevice, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { delay } from 'rxjs';

@Component({
  selector: 'app-public',
  imports: [NgxScannerQrcodeComponent, CommonModule],
  templateUrl: './public.html',
  styleUrl: './public.css'
})
export class Public {
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

  constructor(private qrcode: NgxScannerQrcodeService) { }

  ngAfterViewInit(): void {
    this.action.isReady.pipe(delay(1000)).subscribe(() => {
      this.handle(this.action, 'start');
    });
  }
  count : number = 0;
  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    e?.length && action; // Detect once and pause scan!
    action.pause(); // stop scanner
        this.playBeep(); // 🔊 Play beep

    let binArrayToString = function(binArray:any) {
      let str = "";
      for (let i = 0; i < binArray.length; i++) {
          str += String.fromCharCode(parseInt(binArray[i]));
      }
      return str;
  }
  this.count++;
    console.log('utf8ArrayToString ' + this.count + " : " + binArrayToString(e[0].data));
    setTimeout(() => action.play(), 1000);
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
}
