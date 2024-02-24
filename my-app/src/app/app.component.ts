import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

// import ส่วนนี้เมื่อเราต้องการสร้าง table
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'my-app';

  // โค้ดส่วนนี้ก้อปมาจาก table | angular material
  displayedColumns: string[] = [
    'productName',
    'category',
    'date',
    'freshness',
    'price',
    'comment',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {}

  ngOnInit(): void {
    // เรียกใช้ function ที่เราเขียนขึ้นมา
    this.getAllProducts();
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        // ใส่ .afterClosed() หลังจากที่เราเขียน updateProduct() เสร็จแล้ว
        // เขียนเพื่อให้มัน update การแสดงผลหลังจากการปรับเปลี่ยนค่า
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllProducts();
        }
      });
  }

  // ทำขั้นตอนหลังจากนี้หลังจาก create product ได้แล้ว
  // หลังจากนี้จะเป็นการ get product
  getAllProducts() {
    this.api.getProduct().subscribe({
      next: (res) => {
        // console.log(res)
        // นำ table ที่เรา import มามาใช้ร่วมด้วยในการแสดง table
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (res) => {
        alert('Error while fetching products');
      },
    });
  }

  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row,
      // ใส่ .afterClosed() หลังจากที่เราเขียน updateProduct() เสร็จแล้ว
      // เขียนเพื่อให้มัน update การแสดงผลหลังจากการปรับเปลี่ยนค่า
    }).afterClosed().subscribe((val) => {
      if(val==='update'){
        this.getAllProducts()
      }
    })
  }

  // โลจิคลบ product
  deleteProduct(id : number){
    this.api.deleteProduct(id).subscribe({
      next:(res)=> {
        alert("Delete Successfully");
        // ทำให้มันแสดงผลล่าสุด
        this.getAllProducts()
      },
      error:()=>{
        alert("Error while deleting Product")
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
