import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
// import MatDialogRef มาใช้ตอนที่เมื่อเราแอดข้อมูลในฟอมแล้วต้องการให้มันปิด
// import MAT_DIALOG_DATA มาใช้ตอนที่เราต้องการดึงข้อมูลมา edit
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent implements OnInit {
  freshnessList = ['Brand New', 'Second Hand', 'Refurbished'];

  actionBtn: string = 'save';

  productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    // private api สร้างหลังต่อ api เสร็จ
    private api: ApiService,
    // ใช้ในตอนที่จะดึงข้อมูลมา edit
    @Inject(MAT_DIALOG_DATA) public editData: any,
    // ใช้ในตอนที่เราต้องการให้มันปิด form อัตโนมัติ
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });

    // เช็คว่ากด edit แล้วข้อมูลออกมาหรือไม่
    console.log(this.editData);

    // เขียนโลจิคให้ข้อมูลที่ได้อยู่ใน form
    if (this.editData) {
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      );
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addProduct() {
    // เอาโลจิคทั้งหมดเพื่อเงื่อนไขว่า ถ้ามี this.editData ทำหลังจากสร้าง edit function เสร็จแล้ว
    if (!this.editData) {
      // เช็คค่าที่ได้จาก Form
      console.log(this.productForm.value);

      // ทำตรงนี้หลังจากต่อ api เสร็จแล้ว
      if (this.productForm.valid) {
        this.api
          .postProduct(this.productForm.value)
          // observer
          .subscribe({
            next: (res) => {
              alert('Product added successfully');
              // reset the form when added successfully
              this.productForm.reset();
              // close the form when reset successfully
              // ข้างใน close('') สำคัญมากเพราะเราจะนำไปใช้ในการ update แสดงผล
              this.dialogRef.close('save');
            },
            error: () => {
              alert('Error adding product');
            },
          });
      }
    } else {
      this.updateProduct()
    }
  }

  // ทำหลังจากเพิ่อโลจิค edit ใน add product แล้ว
  // โลจิค update หลังจากดึงค่ามาแสดงใน form ได้แล้ว
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert('Product Updated Successfully')
        this.productForm.reset();
        // ข้างใน close('') สำคัญมากเพราะเราจะนำไปใช้ในการ update แสดงผล
        this.dialogRef.close('update')
      },
      error:(err)=>{
        alert("Error while Updating Product")
      }
    })
  }
}
